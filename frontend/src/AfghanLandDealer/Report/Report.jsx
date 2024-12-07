import React, { useEffect, useState } from "react";
import "./Report.scss";
import NoPageFound from "../../NoPageFound/NoPageFound";
import { SumNumberArray, filterPageType } from "../../Functions/Functions";
import ShowResult from "./ShowResult";
import { expenseApi, purchaseApi, sellApi } from "../../Apis";

const Report = ({
  pagePath,
  load,
  GetOneData,
  purchaseData,
  sellData,
  expenseData,
  Login,
}) => {
  const containerCol = "col-12 col-sm-11 col-md-8 col-lg-5 col-xl-3";

  const profitStyles = {
    profit: { background: "#0063ed", color: "white" },
    lose: { background: "yellow", color: "red" },
    noProfit: { background: "transparent", color: "red" },
  };

  const [afghanLandData, setAfghanLandData] = useState({
    totalPurchases: 0,
    totalSells: 0,
    totalProfit: 0,
    totalComm: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitPercentage: 0,
  });

  const [dealersData, setDealersData] = useState({
    totalPurchases: 0,
    totalSells: 0,
    totalProfit: 0,
    totalComm: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitPercentage: 0,
  });

  const totalPurandDL =
    afghanLandData.totalPurchases + dealersData.totalPurchases;
  const totalComm = afghanLandData.totalComm + dealersData.totalComm;

  const totalSellandDL = afghanLandData.totalSells + dealersData.totalSells;
  const totalSellProfit = afghanLandData.totalProfit + dealersData.totalProfit;
  const totalProfitSellandDL = afghanLandData.netProfit + dealersData.netProfit;
  const totalExpenses = afghanLandData.totalExpenses + totalComm;

  const totalProfit = afghanLandData.netProfit + dealersData.netProfit;

  const totalPercentage =
    totalProfitSellandDL === 0
      ? 0
      : totalProfitSellandDL < 0
      ? (totalProfitSellandDL / totalExpenses) * 100
      : (totalProfitSellandDL / totalSellandDL) * 100;

  const grandTotal = {
    totalPurchases: totalPurandDL,
    totalSells: totalSellandDL,
    totalProfit: totalSellProfit,
    totalComm: totalComm,
    totalExpenses: afghanLandData.totalExpenses,
    netProfit: totalProfit,
    profitPercentage: totalPercentage.toFixed(2),
  };

  const getData = (purData, selData, expData, filterType) => {
    const pageName = pagePath ? "Afghan Land" : "Stock Market";
    const purFilter = purData.filter((elm) => elm.type === filterType);
    const getPurData = {
      purTotal: purFilter.map((elm) => elm.total),
    };
    const { purTotal } = getPurData;

    const sellFilter = selData.filter((elm) => elm.type === filterType);

    const getSellData = {
      sellTotal: sellFilter.map((elm) => elm.total),
      sellComm: sellFilter.map((elm) => elm.commission),
      sellProfit: sellFilter.map((elm) => elm.profit),
    };
    const { sellTotal, sellComm, sellProfit } = getSellData;

    const getTotalExpenses = expData.map((elm) => elm.amount);

    const totalExpenses =
      filterType === pageName ? SumNumberArray(getTotalExpenses) : 0;

    const netPorfit =
      filterType === pageName
        ? SumNumberArray(sellProfit) - SumNumberArray(getTotalExpenses)
        : SumNumberArray(sellProfit);

    const netPercenPorfit = SumNumberArray(sellProfit) - totalExpenses;
    const totalPercentage =
      netPercenPorfit === 0
        ? 0
        : netPercenPorfit < 0
        ? (netPercenPorfit / totalExpenses) * 100
        : (netPercenPorfit / SumNumberArray(sellTotal)) * 100;

    const createData = {
      totalPurchases: SumNumberArray(purTotal),
      totalSells: SumNumberArray(sellTotal),
      totalProfit: SumNumberArray(sellProfit),
      totalComm: SumNumberArray(sellComm),
      totalExpenses:
        filterType === pageName ? SumNumberArray(getTotalExpenses) : 0,
      netProfit: netPorfit,
      profitPercentage: totalPercentage === 0 ? 0 : totalPercentage.toFixed(2),
    };

    if (filterType === pageName) {
      setAfghanLandData((prev) => ({
        ...prev,
        ...createData,
      }));
    } else {
      setDealersData((prev) => ({
        ...prev,
        ...createData,
      }));
    }
  };

  const loadData = (filterType, load) => {
    if (
      purchaseData.length === 0 &&
      sellData.length === 0 &&
      expenseData.length === 0
    ) {
      GetOneData(
        `${purchaseApi}/getData`,
        (purData) =>
          GetOneData(
            `${sellApi}/getData`,
            (selData) =>
              GetOneData(
                `${expenseApi}/getData`,
                (expData) => {
                  const filterPurRes = filterPageType(purData, Login[0]);
                  const filterSellRes = filterPageType(selData, Login[0]);
                  const filterExpRes = filterPageType(expData, Login[0]);

                  getData(
                    filterPurRes,
                    filterSellRes,
                    filterExpRes,
                    filterType
                  );
                },
                load
              ),
            true
          ),
        true
      );
    } else getData(purchaseData, sellData, expenseData, filterType);
  };

  useEffect(() => {
    Login[1]();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadData(pagePath ? "Afghan Land" : "Stock Market", true);
    loadData("Dealer", false);
    // eslint-disable-next-line
  }, [Login[0].adminPath]);

  return Login[0].path === "all" ? (
    <>
      <h1 className="text-center mt-5">Reports</h1>
      <div className="container-fluid mt-5 pt-2">
        <div className="row gy-5 justify-content-evenly">
          <div className={containerCol}>
            <ShowResult
              load={load}
              title={`${pagePath ? "Afghan Land" : "Stock Market"} Report`}
              data={afghanLandData}
              styles={profitStyles}
              More={true}
            />
          </div>

          <div className={containerCol}>
            <ShowResult
              load={load}
              title="Dealers Report"
              data={dealersData}
              styles={profitStyles}
              More={false}
            />
          </div>

          <div className={containerCol}>
            <ShowResult
              load={load}
              title="Grand Total"
              data={grandTotal}
              styles={profitStyles}
              More={true}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Report;
