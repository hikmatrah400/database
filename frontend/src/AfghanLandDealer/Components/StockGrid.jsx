import React, { useState } from "react";
import { FilterRow, SumNumberArray } from "../../Functions/Functions";
import SimpleLoad from "../../UI/SimpleLoad";

const StockGrid = ({
  load,
  mainData,
  filtermainData,
  setMainData,
  FilterRows,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const FilterRecords = FilterRow.filterBtn(
    FilterRow.searchTextBox(setAnchorEl, FilterRows)
  );
  const FilterLowerItems = FilterRow.filterRecords(
    filtermainData,
    FilterRows[0].itemVal,
    setMainData
  );

  return (
    <div className="allGridContainer">
      <div
        className="table-responsive gridView"
        style={{ height: "calc(100vh - 22rem)" }}
      >
        <table className="table table-hover">
          <tbody>
            {load ? (
              <>
                <tr>
                  <td colSpan={10}>
                    <div className="d-flex justify-content-center align-items-center">
                      <SimpleLoad />
                      <span className="ms-3 fw-medium">Data is Loading...</span>
                    </div>
                  </td>
                </tr>
              </>
            ) : mainData.length === 0 ? (
              <tr>
                <td colSpan={10}>No Data Found</td>
              </tr>
            ) : (
              mainData.map((elm, ind) => {
                const { code, item, in: indata, out, balance } = elm;
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{code}</td>
                    <td>{item}</td>
                    <td>{indata}</td>
                    <td>{out}</td>
                    <td>{balance}</td>
                  </tr>
                );
              })
            )}
          </tbody>

          <thead>
            <tr>
              <th>S.No</th>
              <th>Code {FilterRecords("code")}</th>
              <th>Item {FilterRecords("item")}</th>
              <th>In {FilterRecords("in")}</th>
              <th>Out {FilterRecords("out")}</th>
              <th>Balance {FilterRecords("balance")}</th>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <th colSpan={2}>Grand Total</th>
              <th>{mainData.length}</th>
              <th>
                {SumNumberArray(
                  mainData.map((elm) => elm.in),
                  false
                )}
              </th>
              <th>
                {SumNumberArray(
                  mainData.map((elm) => elm.out),
                  false
                )}
              </th>
              <th>
                {SumNumberArray(
                  mainData.map((elm) => elm.balance),
                  false
                )}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <FilterRow.Menu
        {...{ open, anchorEl, handleClose, FilterRows }}
        filterRecord={FilterLowerItems}
      />
    </div>
  );
};

export default StockGrid;
