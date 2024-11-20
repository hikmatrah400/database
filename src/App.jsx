import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "odometer/themes/odometer-theme-minimal.css";

import LoginForm from "./LoginForm/LoginForm";
import axios from "axios";
import { Route, Routes, useLocation } from "react-router-dom";
import { SumNumberArray } from "./Functions/Functions";

import NoPageFound from "./NoPageFound/NoPageFound";
import LockDatabase from "./LockDatabase";
import Navbar from "./Navbar/Navbar";

import Purchase from "./AfghanLandDealer/Purchase";
import Sell from "./AfghanLandDealer/Sell";
import Stock from "./AfghanLandDealer/Stock";
import AfghanLandExpense from "./AfghanLandDealer/Expenses/AfghanLandExpense";
import Report from "./AfghanLandDealer/Report/Report";
import {
  adminLoginApi,
  purchaseListApi,
  sellListApi,
  expensesApi,
  notLoginApi,
  historyApi,
  stockPruchaseApi,
  stockSellApi,
  stockExpenseApi,
  emptyApi,
} from "./Apis";
import SimpleLoad from "./UI/SimpleLoad";
import ChooseUserPage from "./AfghanLandDealer/History/ChooseUserPage";
import ShowDialog from "./UI/BsModalDialog/BsModalDialog";

const App = () => {
  const ModalDialog = useContext(ShowDialog);
  const location = useLocation();

  const [showDatabase, setShowDatabase] = useState(true);
  const databaseCode = "*#$lockdatabase$#*";
  const [login, setLogin] = useState({
    user: "",
    prevCode: "",
    userCode: "",
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
  const month = new Date().toLocaleString("en-Us", { month: "2-digit" });
  const year = new Date().getFullYear();
  const day = new Date().toLocaleString("en-Us", { day: "2-digit" });

  const randomID = `${Math.random() + Math.random()}${new Date()
    .getTime()
    .toString()}`;

  const [prevInput, setPrevInput] = useState({});
  const [inputData, setInputData] = useState({
    id: randomID,
    date: `${year}-${month}-${day}`,
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

  const [itemValue, setItemValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState({
    items: [],
    dealers: [],
    types: [],
    gridQtys: 0,
    qtys: 0,
    sellQtys: 0,
  });

  const GetOneData = async (url, method, load) => {
    try {
      setLoading(true);

      const response = await axios.get(url);
      method(response.data);

      setLoading(load);
    } catch (err) {
      setLoading(false);
      ModalDialog.error("Network Error", "Can't Connect to Server!", "OK");
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

    setOptions((prev) => {
      return {
        ...prev,
        types: showType,
      };
    });
  };

  const ResetData = () => {
    const randomID = `${Math.random() + Math.random()}${new Date()
      .getTime()
      .toString()}`;

    setInputData((prev) => {
      return {
        ...prev,
        id: randomID,
        date: `${year}-${month}-${day}`,
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

  const fechPurData =
    pagePath !== null
      ? pagePath
        ? purchaseListApi
        : stockPruchaseApi
      : emptyApi;

  const fechSellData =
    pagePath !== null ? (pagePath ? sellListApi : stockSellApi) : emptyApi;

  const loadPurData = () => {
    GetOneData(
      fechPurData,
      (purchaseData) => {
        GetOptions(purchaseData);
        setPurchaseData(purchaseData);
        if (location.pathname.includes("purchaseList"))
          setDataAndFilter(purchaseData);
      },
      false
    );
  };

  const loadSellData = () => {
    GetOneData(
      fechSellData,
      (sellData) => {
        setSellData(sellData);
        if (location.pathname.includes("sellList")) setDataAndFilter(sellData);
      },
      false
    );
  };

  const loadExpenseData = (load, pagePath) => {
    GetOneData(
      pagePath ? expensesApi : stockExpenseApi,
      (expensedata) => setExpenseData(expensedata),
      load
    );
  };

  const GetLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(notLoginApi);

      const getUser = sessionStorage.getItem("partOne");
      const getCode = sessionStorage.getItem("partTwo");
      const filterUser = response.data.find((elm) => elm.partOne === getUser);

      setLogin({
        user: filterUser.partOne,
        prevCode: getCode,
        userCode: filterUser.userCode,
        adminPath: location.pathname.includes("afghanAndDealer")
          ? "afghanAndDealer"
          : location.pathname.includes("stockMarket")
          ? "stockMarket"
          : "",
        badgeColor: filterUser.badgeColor,
        path: filterUser.path,
        type: filterUser.nvigateType,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      if (elm.id === getData.id) {
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
      const respnose = await axios.get(notLoginApi);
      setShowDatabase(respnose.data[0].database);
      setLoading(load);
    } catch (err) {
      setLoading(false);
    }
  };

  const loadAllDatabaseData = () => {
    loadPurData();
    loadSellData();
    loadExpenseData(false, pagePath);
    GetOneData(
      historyApi,
      (hisData) => {
        setHistoryData(hisData);

        const pagePath = location.pathname.includes("afghanAndDealer")
          ? "afghanAndDealer"
          : location.pathname.includes("stockMarket")
          ? "stockMarket"
          : null;
        const filterHis = hisData.filter((elm) => elm.path === pagePath);
        const getHistory = filterHis.filter(
          (elm) => elm.history[0].view === false
        );

        if (getHistory.length > 0 && login.path === "all")
          ModalDialog.info(
            "Information",
            `There ${
              getHistory.length > 0 ? "are" : "is"
            } new Updates Available in History. Please Check it`
          );
      },
      false
    );
  };

  useEffect(() => {
    loadData(true);
    loadAllDatabaseData();

    // eslint-disable-next-line
  }, [login.userCode]);

  const essentialProp = {
    load: loading,
    setLoading,
    Login: [login, GetLogin],
    GetOneData,
    pagePath,
  };

  const PageProp = {
    purchaseData,
    sellData,
    expenseData,
    setPurchaseData,
    setSellData,
    historyData,

    SaveData,
    UpdateData,

    ItemValue: [itemValue, setItemValue],
    SearchValue: [searchValue, setSearchValue],
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
          user={login.user ? login.user[0] : ""}
          badgeColor={login.badgeColor}
          pagePath={pagePath}
          loadData={loadAllDatabaseData}
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
                AdminLoginAPI={adminLoginApi}
                notLoginAPI={notLoginApi}
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
                ItemValue: [itemValue, setItemValue],
                SearchValue: [searchValue, setSearchValue],
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
                ItemValue: [itemValue, setItemValue],
                SearchValue: [searchValue, setSearchValue],
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
