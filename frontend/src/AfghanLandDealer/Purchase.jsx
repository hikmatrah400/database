import React, { useEffect } from "react";
import "./Styles/Purchase.scss";
import NoPageFound from "../NoPageFound/NoPageFound";
import Gridveiw from "./Components/Gridveiw";
import InputList from "./Components/InputList";
import { purchaseApi } from "../Apis";
import { useParams } from "react-router-dom";
import { filterPageType } from "../Functions/Functions";

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
    const filterData = filterPageType(purchaseData, Login[0]);

    setDataAndFilter(filterData);
    GetOptions(filterData);
  };

  useEffect(() => {
    Login[1]();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [Login[0]]);

  return ((Login[0].path === path && Login[0].type === "Purchaser") ||
    Login[0].path === "all") &&
    !load ? (
    <>
      <div className="container-fluid allPurchaseCon">
        <div className="row mt-5 justify-content-center">
          <InputList
            ApiName={purchaseApi}
            More={true}
            pagePath={pagePath}
            {...PageProp}
          />

          <Gridveiw
            gridHeight="calc(100vh - 330px)"
            marginTop="5"
            ApiName={purchaseApi}
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
