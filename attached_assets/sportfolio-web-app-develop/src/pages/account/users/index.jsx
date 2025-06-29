import NewUser from "./components/NewUser";
import { useDispatch, useSelector } from "react-redux";
import { getUserByID, searchUser } from "./api";
import { setNewUserDialog } from "./slice";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NoData from "common/components/NoData/NoData";
import Pagination from "common/components/Table/Pagination";
import UserCard from "common/components/Cards/UserCard";
import { getRandomColor } from "utils/common";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { Fragment } from "react";
import { PATH_USER_PROFILE } from "common/constants";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);

  const { searchUserRes, searchUserLoading } = useSelector(
      (state) => state.users
    ),
    { searchKeyword } = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(
      searchUser({
        data: {
          keywordSearchText: searchKeyword
        },
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`
      })
    );
  }, [searchParams]);

  const onPageClick = (data) => {
    navigate(
      `?page=${data || 1}&pageSize=${searchParams.get("pageSize") || 12}`
    );
  };

  useEffect(() => {
    if (searchUserRes?.data?.userDetails.length > 0) {
      setTableData(searchUserRes?.data?.userDetails);
      setTotalItems(searchUserRes?.data?.totalCount);
      setNumberOfElements(searchUserRes?.data?.count);
    } else {
      setTableData([]);
    }
  }, [searchUserRes]);

  const handleEdit = (id) => {
    setSelectedId(id);
    dispatch(getUserByID(id));
    dispatch(setNewUserDialog(true));
  };

  const handleView = (id) => navigate(PATH_USER_PROFILE.replace(":id", id));

  return (
    <div className="p-5 overflow-y-auto h-[calc(100svh-5.625rem)]">
      {searchUserLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {tableData?.length === 0 ? (
            <NoData />
          ) : (
            <Fragment>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,_0.25fr))]  gap-4">
                {tableData.map((item) => (
                  <div key={item?.id}>
                    <UserCard
                      data={item}
                      id={item?.id}
                      color={getRandomColor()}
                      handleEdit={handleEdit}
                      handleView={handleView}
                    />
                  </div>
                ))}
              </div>
              <Pagination
                className="pagination-bar"
                currentPage={Number(searchParams.get("page")) || 1}
                totalCount={Number(totalItems)}
                pageSize={Number(searchParams.get("pageSize")) || 12}
                onPageChange={onPageClick}
                numberOfElements={Number(numberOfElements)}
              />
            </Fragment>
          )}
        </Fragment>
      )}
      <NewUser userId={selectedId} setUserId={setSelectedId} />
    </div>
  );
};

export default Users;
