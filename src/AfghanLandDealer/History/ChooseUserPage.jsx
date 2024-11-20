import React, { useEffect, useState } from "react";
import "./ChooseUserPage.scss";
import NoPageFound from "../../NoPageFound/NoPageFound";
import History from "./History";
import { historyApi } from "../../Apis";
import { Button, CardActionArea } from "@material-ui/core";
import { useLocation } from "react-router-dom";
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

  const location = useLocation();
  const path = location.pathname;

  const filterPaths = (data, value) =>
    data.filter((elm) =>
      path.includes("afghanAndDealer")
        ? elm.path === "afghanAndDealer" && elm.pageName === value
        : path.includes("stockMarket")
        ? elm.path === "stockMarket" && elm.pageName === value
        : []
    );

  const filterUsers = (data, value) => {
    const getData = filterPaths(data, value);
    const filterUsers = [...new Set(getData.map((elm) => elm.username))];

    let users = [];
    for (let i = 0; i < filterUsers.length; i++) {
      users = [...users, filterUsers[i]];
    }

    setUsers(users);
  };

  useEffect(() => {
    Login[1]();
    if (HistoryData[0].length === 0)
      GetOneData(
        historyApi,
        (hisData) => {
          HistoryData[1](hisData);
          filterUsers(hisData, choosePage);
        },
        false
      );
    else filterUsers(HistoryData[0], choosePage);

    // eslint-disable-next-line
  }, []);

  const UserClick = (user) => {
    const getData = filterPaths(HistoryData[0], choosePage);
    const filterHistory = getData.filter((elm) => elm.username === user);

    const newHistory = [...filterHistory.map((elm) => elm.history[0])];
    const newData = {
      id: filterHistory[0].id,
      pageName: filterHistory[0].pageName,
      path: filterHistory[0].path,
      userType: filterHistory[0].userType,
      username: filterHistory[0].username,
      history: newHistory,
    };

    setUserData({
      user: user,
      path: path.includes("afghanAndDealer")
        ? "afghanAndDealer"
        : path.includes("stockMarket")
        ? "stockMarket"
        : "",
    });
    DeleteObj[1](newHistory);
    setNewHistoryData(newData);
    setShowHistory(true);
  };

  const buttons = ["Purchase List", "Sell List", "Expense List"];

  return Login[0].userCode === Login[0].prevCode && Login[0].path === "all" ? (
    <>
      <div className="container-fluid chooseUserContainer">
        <h1 className="text-center mt-4">
          History of{" "}
          {location.pathname.includes("afghanAndDealer")
            ? "Afghan Land & Dealer"
            : location.pathname.includes("stockMarket")
            ? "Stock Market Shop"
            : null}
        </h1>

        <div className="d-flex justify-content-evenly mt-5 pt-2 headerBtnCon">
          {buttons.map((elm, ind) => {
            return (
              <Button
                key={ind}
                className={`headerBtn ${choosePage === elm ? "linearBtn" : ""}`}
                onClick={() => {
                  setChoosePage(elm);
                  filterUsers(HistoryData[0], elm);
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
            users.map((user, ind) => {
              return (
                <ShowUsers
                  key={ind}
                  {...{ ind, user }}
                  userClick={() => UserClick(user)}
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
            filterUsers,
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
