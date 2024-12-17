import React, { useEffect, useState } from "react";
import "./ChooseUserPage.scss";
import NoPageFound from "../../NoPageFound/NoPageFound";
import History from "./History";
import { historyApi } from "../../Apis";
import { Button, CardActionArea } from "@mui/material";
import SimpleLoad from "../../UI/SimpleLoad";

const ShowUsers = ({ disbeld, ind, user, userClick }) => {
  return (
    <div className="col-11 col-sm-5 col-md-4 col-lg-3 me-2 col-xl-2 p-0">
      <CardActionArea className="userCon shadow" onClick={userClick}>
        {disbeld === "load" ? (
          <>
            <span className="float-start mt-2">
              <SimpleLoad />
            </span>
            <h2 className="title text-capitalize text-center">Loading Users</h2>
          </>
        ) : disbeld === "noData" ? (
          <h2 className="title text-capitalize p-0 text-center">
            No Users Found
          </h2>
        ) : (
          <>
            <span className="id float-start">{ind + 1}</span>
            <h2 className="title text-capitalize float-start">{user}</h2>
          </>
        )}
      </CardActionArea>
    </div>
  );
};

const ChooseUserPage = ({
  Login,
  load,
  DeleteObj,
  pagesData,
  HistoryData,
  setInputData,
  setIndexNum,
  GetItemData,
  GetDealers,
  GetTypes,
  GetOneData,
}) => {
  const [chooseType, setChooseType] = useState("updated");
  const [choosePage, setChoosePage] = useState("Purchase List");
  const [showHistory, setShowHistory] = useState(false);

  const [userData, setUserData] = useState({});
  const [newHistoryData, setNewHistoryData] = useState({ history: [] });
  const [users, setUsers] = useState([]);

  const filterUserPaths = (data, value) => {
    const newData = data.filter((elm) => elm.pageName === value);
    setUsers(newData);
  };

  useEffect(() => {
    Login[1]();

    if (
      pagesData[0].length === 0 &&
      pagesData[1].length === 0 &&
      pagesData[2].length === 0
    ) {
      GetOneData(
        `${historyApi}/getData`,
        (hisData) => {
          HistoryData[1](hisData);
          filterUserPaths(hisData, choosePage);
        },
        false
      );
    } else filterUserPaths(HistoryData[0], choosePage);

    // eslint-disable-next-line
  }, []);

  const UserClick = (user) => {
    setUserData({
      id: user._id,
      user: user.username,
      path: user.path,
      type: user.userType,
    });
    DeleteObj[1](user.history);
    setNewHistoryData(user);
    setShowHistory(true);
  };

  const buttons = ["Purchase List", "Sell List", "Expense List"];

  return Login[0].path === "all" ? (
    <>
      <div className="container-fluid chooseUserContainer">
        <h1 className="text-center mt-4">History</h1>

        <div className="d-flex justify-content-evenly mt-5 pt-2 headerBtnCon">
          {buttons.map((elm, ind) => {
            return (
              <Button
                key={ind}
                className={`headerBtn ${choosePage === elm ? "linearBtn" : ""}`}
                onClick={() => {
                  setChoosePage(elm);
                  filterUserPaths(HistoryData[0], elm);
                }}
              >
                {elm}
              </Button>
            );
          })}
        </div>

        {users.length > 0 && (
          <h2 className="text-center mt-5 pt-4">Choose User</h2>
        )}

        <div className="chooseUserCon gy-4 row justify-content-evenly">
          {load ? (
            <ShowUsers index={1} disbeld="load" />
          ) : users.length === 0 ? (
            <ShowUsers index={1} disbeld="noData" />
          ) : (
            users.map((elm, ind) => {
              return (
                <ShowUsers
                  key={ind}
                  {...{ ind, user: elm.username }}
                  userClick={() => UserClick(elm)}
                />
              );
            })
          )}
        </div>

        <History
          {...{
            load,
            userData,
            choosePage,
            DeleteObj,
            showHistory,
            setInputData,
            GetTypes,
            GetItemData,
            GetDealers,
            setIndexNum,
            setShowHistory,
            HistoryData: [newHistoryData, setNewHistoryData],
            updateData: HistoryData,
            filterUsers: filterUserPaths,
            ChooseType: [chooseType, setChooseType],
          }}
        />
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default ChooseUserPage;
