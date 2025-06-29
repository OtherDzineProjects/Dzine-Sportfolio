import { Button } from "common";
import { usePagination, DOTS } from "./usePagination";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount = 0,
    siblingCount = 1,
    currentPage = 1,
    pageSize = 12,
    numberOfElements
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) return null;

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex items-center justify-end mt-4 gap-x-3">
      <span className="text-sm text-[#454545] leading-[14px] font-medium">
        {`${(currentPage - 1) * pageSize + 1} to ${
          (currentPage - 1) * pageSize + Number(numberOfElements)
        } items`}
      </span>

      <div className="flex justify-between gap-x-2">
        <Button
          isDisabled={currentPage === 1}
          onClick={onPrevious}
          className={`w-7 h-7 flex justify-center items-center !p-0 m-0 !bg-transparent border text-xs ${
            currentPage === 1 ? "border-[#454545]" : "border-[#09327B]"
          } text-sm`}
        >
          <svg
            opacity={currentPage === 1 ? 0.5 : 1}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 6 8"
            fill="none"
          >
            <path
              d="M5.15151 1.02838L0.984375 4.01419L5.15151 7"
              stroke="#454545"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <Button
                key={`${pageNumber}-${index}`}
                className={`w-7 h-7 flex justify-center items-center !p-0 m-0 !bg-transparent border text-xs ${
                  currentPage === 1 ? "border-[#454545]" : "border-[#09327B]"
                } text-sm`}
              >
                &#8230;
              </Button>
            );
          }

          return (
            <Button
              className={`w-7 h-7 flex justify-center items-center !p-0 m-0 border border-[#09327B] text-xs ${
                pageNumber === currentPage
                  ? "!bg-[#09327B] !text-white"
                  : "!bg-transparent text-[#454545]"
              } text-sm`}
              key={`${pageNumber}-${index}`}
              variant={pageNumber === currentPage ? "solid" : "outlined"}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          isDisabled={currentPage === lastPage}
          onClick={onNext}
          className={`w-7 h-7 flex justify-center items-center !p-0 m-0 !bg-transparent border text-xs ${
            currentPage === 1 ? "border-[#454545]" : "border-[#09327B]"
          } text-sm`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 6 8"
            opacity={currentPage === 1 ? 0.5 : 1}
            fill="none"
          >
            <path
              d="M0.984233 6.97162L5.15137 3.98581L0.984233 1"
              stroke="#454545"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
      <span className="text-sm text-[#454545] leading-[14px] font-medium">
        Total: {totalCount} items
      </span>
    </div>
  );
};

export default Pagination;
