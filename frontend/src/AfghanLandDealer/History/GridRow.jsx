import React, { useContext, useEffect, useState } from "react";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Star,
  StarOutline,
} from "@mui/icons-material";
import axios from "axios";
import { historyApi } from "../../Apis";
import { CheckBoxClick } from "../../Functions/Functions";
import ShowDialog from "../../UI/BsModalDialog/BsModalDialog";
import { MdMarkEmailRead, MdOutlineMarkEmailUnread } from "react-icons/md";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const GridRow = ({
  userID,
  row,
  ind,
  page,
  HistoryData,
  updateData,
  itemSelected,
  setItemSelected,
  DeleteObj,
  rowType,
}) => {
  const ModalDialog = useContext(ShowDialog);

  const {
    star,
    view,
    date,
    code,
    item,
    billNum,
    qty,
    description,
    amount,
    retailPrice,
    sellPrice,
    commission,
    sellType,
    type,
    delaer,
    modifyed,
  } = row;

  const {
    date: hisDate,
    code: hisCode,
    item: hisItem,
    billNum: hisBillNum,
    qty: hisQty,
    sellType: hisSellType,
    description: hisDescription,
    amount: hisAmount,
    retailPrice: hisRetailPrice,
    sellPrice: hisSellPrice,
    commission: hisCommission,
    type: hisType,
    delaer: hisDealer,
  } = row.prevData !== undefined ? row.prevData : row;

  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const styleBG = (value, value2) => (value !== row[value2] ? "changeBg" : "");

  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line
  }, [page]);

  const updateRow = (value, bool) => {
    const updateRow = HistoryData[0].history.map((elm) => {
      if (elm._id === row._id) return { ...elm, [value]: bool };
      return elm;
    });
    HistoryData[1]((prev) => ({ ...prev, history: updateRow }));

    updateData((prev) =>
      prev.map((elm) => {
        if (elm._id === userID)
          return {
            ...elm,
            history: updateRow,
          };
        return elm;
      })
    );

    axios
      .put(
        `${historyApi}/updateData/${userID}`,
        {
          hisID: row._id,
          value: value,
          bool: bool,
        },
        { headers: { "auth-token": localStorage.getItem("authToken") } }
      )
      .catch((err) => {
        HistoryData[1](HistoryData[0]);
        if (err.stack.includes("Network Error"))
          ModalDialog.error("Network Error", "Can't Connect to Server!");
      });
  };

  const StarRow = (bool) => {
    updateRow("star", bool);
  };

  const boldText = view ? "" : "boldTd";
  const isItemSelected = itemSelected.indexOf(row._id) !== -1;

  return (
    <>
      <TableRow className={classes.root}>
        {rowType === "updated" && (
          <TableCell className="outerTd">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                updateRow("view", true);
                setOpen(!open);
              }}
            >
              {open ? (
                <KeyboardArrowUp className="svg" />
              ) : (
                <KeyboardArrowDown className="svg" />
              )}
            </IconButton>
          </TableCell>
        )}
        <TableCell className="outerTd">
          <IconButton size="small" onClick={() => StarRow(!star)}>
            {star ? (
              <Star className="svg" style={{ color: "#008cff" }} />
            ) : (
              <StarOutline className="svg" />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <Checkbox
            className="gridCheck"
            onChange={() =>
              CheckBoxClick(
                itemSelected,
                setItemSelected,
                row._id,
                (DeleteObj = DeleteObj[1])
              )
            }
            checked={isItemSelected}
          />
        </TableCell>
        <TableCell className={boldText}>{ind + 1}</TableCell>
        <TableCell className={`outerTd ${boldText}`}>{date}</TableCell>
        {page === "prl" && (
          <TableCell className={`outerTd ${boldText}`}>{billNum}</TableCell>
        )}

        {page === "exl" && (
          <>
            <TableCell className={`outerTd ${boldText}`}>
              {description}
            </TableCell>
            <TableCell className={`outerTd ${boldText}`}>{amount}</TableCell>
          </>
        )}

        {page !== "exl" && (
          <>
            <TableCell className={`outerTd ${boldText}`}>{code}</TableCell>
            <TableCell className={`outerTd ${boldText}`}>{item}</TableCell>
            <TableCell className={`outerTd ${boldText}`}>{qty}</TableCell>
            <TableCell className={`outerTd ${boldText}`}>
              {page === "prl"
                ? Number(retailPrice).toLocaleString()
                : page === "sll"
                ? Number(sellPrice).toLocaleString()
                : 0}
            </TableCell>
          </>
        )}
        {page === "prl" && (
          <TableCell className={`outerTd ${boldText}`}>{sellPrice}</TableCell>
        )}
        {page !== "exl" && (
          <>
            <TableCell className={`outerTd ${boldText}`}>{type}</TableCell>
            <TableCell className={`outerTd ${boldText}`}>
              {delaer === "" ? "N/A" : delaer}
            </TableCell>
          </>
        )}
        {page === "sll" && (
          <>
            <TableCell className={`outerTd ${boldText}`}>{sellType}</TableCell>
            <TableCell className={`outerTd ${boldText}`}>
              {commission / qty}
            </TableCell>
          </>
        )}
        <TableCell className={`outerTd ${boldText}`}>{modifyed}</TableCell>
        <TableCell className={`outerTd ${boldText}`}>
          <IconButton
            className="deleteBtn"
            onClick={() => updateRow("view", !view)}
          >
            {view ? (
              <MdMarkEmailRead style={{ color: "#008cff" }} />
            ) : (
              <MdOutlineMarkEmailUnread />
            )}
          </IconButton>
        </TableCell>
      </TableRow>

      {open && row.prevData !== undefined ? (
        <TableRow key={ind}>
          <TableCell className="innerTd" colSpan={4}></TableCell>
          <TableCell className={`innerTd ${styleBG(hisDate, "date")}`}>
            {hisDate}
          </TableCell>

          {page === "exl" && (
            <>
              <TableCell
                className={`innerTd ${styleBG(hisDescription, "description")}`}
              >
                {hisDescription}
              </TableCell>
              <TableCell className={`innerTd ${styleBG(hisAmount, "amount")}`}>
                {hisAmount}
              </TableCell>
            </>
          )}

          {page === "prl" && (
            <TableCell className={`innerTd ${styleBG(hisBillNum, "billNum")}`}>
              {hisBillNum}
            </TableCell>
          )}
          {page !== "exl" && (
            <>
              <TableCell className={`innerTd ${styleBG(hisCode, "code")}`}>
                {hisCode}
              </TableCell>
              <TableCell className={`innerTd ${styleBG(hisItem, "item")}`}>
                {hisItem}
              </TableCell>
              <TableCell className={`innerTd ${styleBG(hisQty, "qty")}`}>
                {hisQty}
              </TableCell>
            </>
          )}
          {page === "prl" && (
            <TableCell
              className={`innerTd ${styleBG(hisRetailPrice, "retailPrice")}`}
            >
              {Number(hisRetailPrice).toLocaleString()}
            </TableCell>
          )}
          {page !== "exl" && (
            <>
              <TableCell
                className={`innerTd ${styleBG(hisSellPrice, "sellPrice")}`}
              >
                {Number(hisSellPrice).toLocaleString()}
              </TableCell>
              <TableCell className={`innerTd ${styleBG(hisType, "type")}`}>
                {hisType}
              </TableCell>
              <TableCell className={`innerTd ${styleBG(hisDealer, "delaer")}`}>
                {hisDealer === "" ? "N/A" : hisDealer}
              </TableCell>
            </>
          )}
          {page === "sll" && (
            <>
              <TableCell
                className={`innerTd ${styleBG(hisSellType, "sellType")}`}
              >
                {hisSellType}
              </TableCell>
              <TableCell
                className={`innerTd ${styleBG(hisCommission, "commission")}`}
              >
                {hisCommission / hisQty}
              </TableCell>
            </>
          )}
          <TableCell className="innerTd" colSpan={2}></TableCell>
        </TableRow>
      ) : null}
    </>
  );
};

export default GridRow;
