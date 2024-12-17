import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "odometer/themes/odometer-theme-minimal.css";

import LoginForm from "./LoginForm/LoginForm";
import axios from "axios";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  SumNumberArray,
  filterPageType,
  getCurrentDate,
  loadCurrentDate,
} from "./Functions/Functions";

import NoPageFound from "./NoPageFound/NoPageFound";
import LockDatabase from "./LockDatabase";
import Navbar from "./Navbar/Navbar";

import Purchase from "./AfghanLandDealer/Purchase";
import Sell from "./AfghanLandDealer/Sell";
import Stock from "./AfghanLandDealer/Stock";
import AfghanLandExpense from "./AfghanLandDealer/Expenses/AfghanLandExpense";
import Report from "./AfghanLandDealer/Report/Report";
import {
  historyApi,
  accountLoginApi,
  lockDatabaseApi,
  purchaseApi,
  sellApi,
  expenseApi,
} from "./Apis";
import SimpleLoad from "./UI/SimpleLoad";
import ChooseUserPage from "./AfghanLandDealer/History/ChooseUserPage";
import ShowDialog from "./UI/BsModalDialog/BsModalDialog";
import CircularBackdropLoading from "./UI/CircularBackdropLoading/CircularBackdropLoading";

const App = () => {
  const navigate = useNavigate();
  const ModalDialog = useContext(ShowDialog);
  const location = useLocation();

  const [showDatabase, setShowDatabase] = useState(true);
  const databaseCode = "*#$finishdatabase$#*";
  const [login, setLogin] = useState({
    user: "",
    adminPath: "",
    badgeColor: "",
    path: "",
    type: "",
  });

  const pagePath = location.pathname.includes("afghanAndDealer")
    ? true
    : location.pathname.includes("stockMarket")
    ? false
    : null;
  const [loading, setLoading] = useState(false);

  const [purchaseData, setPurchaseData] = useState([]);
  const [sellData, setSellData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  const [deleteData, setDeleteData] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterGridType, setFilterGridType] = useState("All");

  // Purchase and Sell start --------------------------------------
  const randomID = `${Math.random() + Math.random()}${new Date()
    .getTime()
    .toString()}`;

  const [prevInput, setPrevInput] = useState({});
  const [inputData, setInputData] = useState({
    _id: randomID,
    date: "",
    code: "",
    item: "",
    billNum: "",
    qty: "",
    retailPrice: "",
    sellPrice: "",
    sellType: "",
    commission: "",
    type: "",
    total: 0,
    delaer: "",
  });

  const [total, setTotal] = useState({
    items: 0,
    qtys: 0,
    retailPrices: 0,
    sellPrices: 0,
    grandTotal: 0,
    commission: 0,
    balances: 0,
    dealerBalances: 0,
    profit: 0,
    delaers: 0,
  });
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [indexNum, setIndexNum] = useState(null);

  const [filterRows, setFilterRows] = useState({
    itemVal: "",
    searchVal: "",
    prevItem: "",
    prevSearch: "",
  });
  const [options, setOptions] = useState({
    items: [],
    dealers: [],
    types: [],
    gridQtys: 0,
    qtys: 0,
    sellQtys: 0,
  });

  const [currentDate, setCurrentDate] = useState({});

  const GetOneData = async (url, method, load) => {
    try {
      setLoading(true);

      const response = await axios.get(url);
      method(response.data);

      setLoading(load);
    } catch (err) {
      setLoading(false);
      if (err.stack.includes("Network Error"))
        ModalDialog.error("Network Error", "Can't Connect to Server!");
      console.log(err);
    }
  };

  const totalShortCut = (data) => {
    const getTotal = {
      qty: data.map((elm) => elm.qty),
      retailPrice: data.map((elm) => elm.retailPrice),
      sellPrice: data.map((elm) => elm.sellPrice),
      commission: data.map((elm) => elm.commission),
      total: data.map((elm) => elm.total),
      profit: data.map((elm) => elm.profit),
      balance: data.map((elm) => elm.balance),
      dealerBalance: data.map((elm) => elm.dealerBalance),
      delaers: data.map((elm) => elm.delaer),
    };

    setTotal({
      qtys: SumNumberArray(getTotal.qty).toLocaleString(),
      retailPrices: SumNumberArray(
        getTotal.retailPrice,
        false
      ).toLocaleString(),
      commissions: SumNumberArray(getTotal.commission).toLocaleString(),
      grandTotal: SumNumberArray(getTotal.total).toLocaleString(),
      profits: SumNumberArray(getTotal.profit).toLocaleString(),
      balances: SumNumberArray(getTotal.balance).toLocaleString(),
      dealerBalances: SumNumberArray(
        getTotal.dealerBalance,
        false
      ).toLocaleString(),
      delaers: getTotal.delaers.filter((elm) => elm !== "").length,
    });
  };

  const GetItemCode = (item) => {
    const getItem = purchaseData.filter((elm) => elm.item === item);
    const getCode = getItem.map((elm) => elm.code);

    setInputData((prev) => ({
      ...prev,
      code: indexNum
        ? getItem.length > 0
          ? getCode[0]
          : inputData.code
        : getCode.length === 0
        ? ""
        : getCode[0],
    }));
  };

  const GetItemData = (filterName, filterType, type) => {
    const getItemData = purchaseData.filter(
      (elm) => elm.item === filterName && elm[filterType] === type
    );

    //Purchase Filter
    const code = getItemData.map((elm) => elm.code);
    const retailPrice = getItemData.map((elm) => elm.retailPrice);
    const sellPirce = getItemData.map((elm) => elm.sellPrice);
    const getQtys = getItemData.map((elm) => elm.qty);

    //Sell Filter
    const getItemData2 = sellData.filter(
      (elm) => elm.item === filterName && elm[filterType] === type
    );
    const getQtys2 = getItemData2.map((elm) => elm.qty);

    setOptions((prev) => {
      return {
        ...prev,
        qtys: SumNumberArray(getQtys, false) - SumNumberArray(getQtys2, false),
        sellQtys: SumNumberArray(getQtys2, false),
      };
    });

    setInputData((prev) => {
      return {
        ...prev,
        code: code[0],
        retailPrice:
          type === "Dealer" && inputData.delaer === "" ? 0 : retailPrice[0],
        sellPrice: Math.max(...sellPirce),
      };
    });
  };

  const GetTypes = (item) => {
    const getType = purchaseData.filter((elm) => elm.item === item);
    const showType = [...new Set(getType.map((elm) => elm.type))];

    setOptions((prev) => ({
      ...prev,
      types: showType,
    }));
  };

  const ResetData = () => {
    setInputData((prev) => {
      return {
        ...prev,
        _id: randomID,
        code: "",
        item: "",
        billNum: "",
        retailPrice: "",
        sellPrice: "",
        sellType: "",
        commission: "",
        qty: "",
        type: "",
        total: 0,
        delaer: "",
      };
    });
    setIndexNum(null);

    setOptions((prev) => {
      return {
        ...prev,
        qtys: 0,
        sellQtys: 0,
      };
    });

    loadCurrentDate(axios, setCurrentDate);
  };

  const GetOptions = (state) => {
    const getItems = [...new Set(state.map((elm) => elm.item))];
    const getDealers = state.map((elm) => elm.delaer);
    const getMainDealer = getDealers.filter((elm) => elm !== "");

    setOptions((prev) => ({
      ...prev,
      items: getItems,
      purDealers: getMainDealer,
    }));
  };

  const GetDealers = (item) => {
    const getMainDealers = purchaseData.filter((elm) => elm.item === item);
    const getdealers = [...new Set(getMainDealers.map((elm) => elm.delaer))];
    const getDealer = getdealers.filter((elm) => elm !== "");

    setOptions((prev) => ({
      ...prev,
      dealers: getDealer,
    }));
  };

  // Purchase and Sell end --------------------------------------

  const onlyDataAndFilter = (value) => {
    setData(value);
    setFilterData(value);
    totalShortCut(value);
  };
  const setDataAndFilter = (value) => {
    setData(value);
    setFilterData(value);
    totalShortCut(value);
    setDeleteData(value);
  };

  const loadPurData = () => {
    GetOneData(
      `${purchaseApi}/getData`,
      (purchaseData) => {
        const filterData = filterPageType(purchaseData, login);

        GetOptions(filterData);
        setPurchaseData(filterData);
        if (location.pathname.includes("purchaseList"))
          setDataAndFilter(filterData);
      },
      false
    );
  };

  const loadSellData = () => {
    GetOneData(
      `${sellApi}/getData`,
      (sellData) => {
        const filterData = filterPageType(sellData, login);

        setSellData(filterData);
        if (location.pathname.includes("sellList"))
          setDataAndFilter(filterData);
      },
      false
    );
  };

  const loadExpenseData = () => {
    GetOneData(
      `${expenseApi}/getData`,
      (expensedata) => {
        const filterData = filterPageType(expensedata, login);
        setExpenseData(filterData);
      },
      false
    );
  };

  const GetLogin = async () => {
    try {
      const getToken = localStorage.getItem("authToken");
      if (login.user === "") setLoading(true);

      if (getToken) {
        const response = await axios.get(`${accountLoginApi}/verifyToken`, {
          headers: { "auth-token": getToken },
        });
        const {
          _id: id,
          fullName,
          username,
          nvigateTo,
          nvigateType,
          badgeColor,
        } = response.data.userData;

        setLogin({
          id: id,
          fullName: fullName,
          user: username,
          adminPath: location.pathname.includes("afghanAndDealer")
            ? "afghanAndDealer"
            : location.pathname.includes("stockMarket")
            ? "stockMarket"
            : "",
          badgeColor: badgeColor,
          path: nvigateTo,
          type: nvigateType,
        });

        setLoading(response.data.load);
      } else {
        setLogin((prev) => ({ ...prev, user: "" }));
        setLoading(false);
        navigate("/");
      }
    } catch (err) {
      navigate("/");
      setLoading(false);
    }
  };

  const SaveData = (state, getData) => {
    const newData = [...data, getData];
    state((prev) => [...prev, getData]);
    setDataAndFilter(newData);
    GetOptions([...purchaseData, getData]);
    ResetData();
  };

  const updateStateShort = (state, getData) =>
    state.map((elm) => {
      if (elm._id === getData._id) {
        return getData;
      }
      return elm;
    });
  const UpdateData = (state, setState, getData) => {
    const filterData = updateStateShort(state, getData);
    const getOpts = updateStateShort(purchaseData, getData);

    setState(filterData);
    GetOptions(getOpts);
    setDataAndFilter(filterData);
    ResetData();
  };

  // ---------------------------------------------------
  const loadData = async (load) => {
    try {
      setLoading(true);
      const response = await axios.get(`${lockDatabaseApi}/getLock`);
      setShowDatabase(response.data.value);
      setLoading(load);
    } catch (err) {
      setLoading(false);
      setShowDatabase(false);
      console.log(err);
    }
  };

  const loadAllDatabaseData = () => {
    loadCurrentDate(axios, setCurrentDate);
    loadPurData();
    loadSellData();
    loadExpenseData();
  };

  const loadallHistoryData = () => {
    GetOneData(
      `${historyApi}/getData`,
      (hisData) => {
        setHistoryData(hisData);

        const getUnViewHistory = hisData.map((elm) =>
          elm.history.filter((elm) => elm.view === false)
        );
        const clearEmptyArrays = getUnViewHistory.filter(
          (elm) => elm.length !== 0
        );

        if (
          clearEmptyArrays.length > 0 &&
          login.path === "all" &&
          location.pathname.includes("purchaseList")
        )
          ModalDialog.info(
            "Information of History",
            `New Updates Available in History. Please Check it`
          );
      },
      false
    );
  };

  useEffect(() => {
    loadData(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadAllDatabaseData();
    // eslint-disable-next-line
  }, [login.adminPath]);

  useEffect(() => {
    loadallHistoryData();
    // eslint-disable-next-line
  }, [login.user]);

  useEffect(() => {
    try {
      if (!indexNum) getCurrentDate(currentDate.datetime, setInputData);
    } catch (err) {
      return null;
    }
  }, [inputData._id, currentDate]);

  const essentialProp = {
    load: loading,
    setLoading,
    Login: [login, GetLogin],
    GetOneData,
    pagePath,
  };

  const PageProp = {
    currentDate,
    purchaseData,
    sellData,
    expenseData,
    setPurchaseData,
    setSellData,
    HistoryData: historyData,
    SaveData,
    UpdateData,
    loadPurData,
    FilterRows: [filterRows, setFilterRows],
    onlyDataAndFilter,
    setDataAndFilter,
    DeleteObj: [deleteData, setDeleteData],
    GetOptions,
    Data: [data, setData],
    FilterData: [filterData, setFilterData],
    IndexNum: [indexNum, setIndexNum],
    InputData: [inputData, setInputData],
    PrevInput: [prevInput, setPrevInput],
    total,
    ResetData,
    totalShortCut,
    GetItemCode,
    Options: [options, setOptions],
    GetItemData,
    GetDealers,
    FilterType: [filterType, setFilterType],
    FilterGridType: [filterGridType, setFilterGridType],
    ...essentialProp,
  };

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/selectPage" && (
        <Navbar
          adminPath={login.adminPath}
          path={login.path}
          type={login.type}
          user={login.fullName ? login.fullName : ""}
          badgeColor={login.badgeColor}
          pagePath={pagePath}
          loadData={() => {
            loadAllDatabaseData();
            if (login.path === "all") loadallHistoryData();
          }}
          navName={
            location.pathname.includes("/afghanAndDealer/")
              ? ["Afghan Land &", "Dealer"]
              : location.pathname.includes("/stockMarket/")
              ? ["Stock Market", "Shop"]
              : {}
          }
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            showDatabase ? (
              <LoginForm
                AdminLoginAPI={accountLoginApi}
                lockDatabaseApi={lockDatabaseApi}
                Loading={CircularBackdropLoading}
                {...{ setLogin, SimpleLoad, databaseCode }}
              />
            ) : (
              <LockDatabase {...{ setLoading, databaseCode }} />
            )
          }
        />
        <Route
          path="/:path/purchaseList"
          element={<Purchase PageProp={PageProp} />}
        />
        <Route
          path="/:path/sellList"
          element={<Sell PageProp={PageProp} GetTypes={GetTypes} />}
        />
        <Route
          path="/:path/stockListReport"
          element={
            <Stock
              {...{
                PurAndSell: [purchaseData, sellData],
                FilterRows: [filterRows, setFilterRows],
              }}
              {...essentialProp}
            />
          }
        />
        <Route
          path="/:path/expenseList"
          element={
            <AfghanLandExpense
              {...{
                setLoading,
                setExpenseData,
                DeleteObj: [deleteData, setDeleteData],
                PrevInput: [prevInput, setPrevInput],
                FilterRows: [filterRows, setFilterRows],
                expenseData,
                purchaseData,
                sellData,
              }}
              {...essentialProp}
            />
          }
        />
        <Route
          path="/:path/more/report"
          element={
            <Report
              {...{ purchaseData, sellData, expenseData }}
              {...essentialProp}
            />
          }
        />
        <Route
          path="/:path/more/history"
          element={
            <ChooseUserPage
              {...{
                DeleteObj: [deleteData, setDeleteData],
                pagesData: [purchaseData, sellData, expenseData],
                HistoryData: [historyData, setHistoryData],
                setInputData,
                setIndexNum,
                GetItemData,
                GetDealers,
                GetTypes,
                ...essentialProp,
              }}
            />
          }
        />

        <Route path="*" element={<NoPageFound loading={false} />} />
      </Routes>

      <ToastContainer
        position="top-center"
        style={{ fontSize: "1.5rem" }}
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};

export default App;
