import React, { useEffect } from "react";
import "./Styles/Purchase.scss";
import NoPageFound from "../NoPageFound/NoPageFound";
import Gridveiw from "./Components/Gridveiw";
import InputList from "./Components/InputList";
import { purchaseListApi, stockPruchaseApi } from "../Apis";
import { useParams } from "react-router-dom";

const Purchase = ({ PageProp }) => {
  const { path } = useParams();
  const {
    Login,
    purchaseData,
    setDataAndFilter,
    FilterGridType,
    GetOptions,
    load,
    pagePath,
  } = PageProp;

  const loadData = () => {
    setDataAndFilter(purchaseData);
    GetOptions(purchaseData);
  };

  useEffect(() => {
    Login[1]();
    loadData();

    // eslint-disable-next-line
  }, []);

  return Login[0].prevCode === Login[0].userCode &&
    ((Login[0].path === path && Login[0].type === "Purchaser") ||
      Login[0].path === "all") ? (
    <>
      <div className="container-fluid allPurchaseCon">
        <div className="row mt-5 justify-content-center">
          <InputList
            ApiName={pagePath ? purchaseListApi : stockPruchaseApi}
            More={true}
            pagePath={pagePath}
            {...PageProp}
          />

          <Gridveiw
            gridHeight="calc(100vh - 330px)"
            marginTop="5"
            ApiName={pagePath ? purchaseListApi : stockPruchaseApi}
            {...{ loadData, pagePath, FilterGridType }}
            More={true}
            {...PageProp}
          />
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Purchase;
