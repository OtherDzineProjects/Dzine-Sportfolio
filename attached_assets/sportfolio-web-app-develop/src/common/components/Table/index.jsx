import _ from "lodash";
import Pagination from "./Pagination";
import "./style.css";
import NoData from "../NoData/NoData";

const Table = ({
  tableData = [],
  columns = [],
  onRowClick = () => {},
  itemsPerPage,
  currentPage = 1,
  onPageClick = () => {},
  totalItems,
  variant = "normal",
  tableLoader = false,
  onRowClickFlag = false,
  numberOfElements
}) => {
  const currentItems = tableData || [];

  return (
    <div className={variant === "normal table" ? "" : "stripp table"}>
      <table className="striped-table">
        <thead>
          <tr>
            {columns?.map((col) => {
              const currentDate = Date.parse(new Date());
              return (
                <th
                  key={`header-${currentDate + columns.indexOf(col)}`}
                  className={`th-${col.alignment}`}
                >
                  {col?.header}
                </th>
              );
            })}
          </tr>
        </thead>
        {tableLoader ? (
          <tbody>
            <tr>
              <td aria-labelledby="js_1" colSpan={columns?.length}>
                <div
                  className="text-center"
                  style={{ height: "300px", paddingTop: "130px" }}
                >
                  loading
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            {currentItems.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={columns?.length}>
                    <NoData />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {currentItems?.length > 0 &&
                  currentItems?.map((row, index) => {
                    const newIndex = `tbodyRow-${index}`;
                    return (
                      <tr
                        key={newIndex}
                        onClick={() => onRowClick({ row, index })}
                        className={onRowClickFlag ? "cursor-pointer" : ""}
                      >
                        {columns?.map((col, columnIndex) => {
                          const { cell = ({ field }) => field } = col;
                          const columnKey = `${index - columnIndex}`;

                          return (
                            <td
                              key={`normal-${columnKey}`}
                              className={`th-${col.alignment}`}
                            >
                              {cell({
                                field: _.get(
                                  row,
                                  _.get(col, "field", ""),
                                  null
                                ),
                                row,
                                rowIndex: index,
                                columnIndex
                              })}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </>
        )}
      </table>
      {totalItems > itemsPerPage && (
        <Pagination
          className="pagination-bar"
          currentPage={Number(currentPage) || 1}
          totalCount={Number(totalItems)}
          pageSize={Number(itemsPerPage) || 12}
          onPageChange={onPageClick}
          numberOfElements={Number(numberOfElements)}
        />
      )}
    </div>
  );
};

export default Table;
