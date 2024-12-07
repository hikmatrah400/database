import React, { useEffect } from "react";
import NoPageFound from "../NoPageFound/NoPageFound";
import InputList from "./Components/InputList";
import Gridveiw from "./Components/Gridveiw";
import { sellApi } from "../Apis";
import { useParams } from "react-router-dom";
import { filterPageType } from "../Functions/Functions";

const Sell = ({ PageProp, GetTypes }) => {
  const { path } = useParams();

  const {
    pagePath,
    purchaseData,
    sellData,
    Login,
    onlyDataAndFilter,
    setDataAndFilter,
    load,
    GetOptions,
    FilterGridType,
    FilterType,
  } = PageProp;

  const loadData = async () => {
    const filterPurData = filterPageType(purchaseData, Login[0]);
    const filterSellData = filterPageType(sellData, Login[0]);

    setDataAndFilter(filterSellData);
    GetOptions(filterPurData);
  };

  const FilterSellType = (value) => {
    if (value === "All" && FilterGridType[0] === "All") {
      onlyDataAndFilter(sellData);
    } else {
      const filterType = sellData.filter(
        (elm) => elm.type === FilterGridType[0]
      );
      const filterData = filterType.filter((elm) => elm.sellType === value);
      const filterFromSell = sellData.filter((elm) => elm.sellType === value);

      const ShowData =
        value === "All" && FilterGridType[0] !== "All"
          ? filterType
          : FilterGridType[0] === "All"
          ? filterFromSell
          : filterData;

      onlyDataAndFilter(ShowData);
    }
  };

  useEffect(() => {
    Login[1]();
    FilterSellType(FilterType[0]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [Login[0].adminPath]);

  return ((Login[0].path === path && Login[0].type === "Seller") ||
    Login[0].path === "all") &&
    !load ? (
    <>
      <div className="container-fluid allPurchaseCon">
        <div className="row mt-5 justify-content-evenly">
          <InputList
            ApiName={sellApi}
            More={false}
            {...{ GetTypes, pagePath }}
            {...PageProp}
          />

          <Gridveiw
            gridHeight="calc(100vh - 390px)"
            marginTop="5 mt-md-3"
            ApiName={sellApi}
            More={false}
            {...{
              loadData,
              GetTypes,
              FilterType,
              FilterSellType,
              pagePath,
              FilterGridType,
            }}
            {...PageProp}
          />
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Sell;
