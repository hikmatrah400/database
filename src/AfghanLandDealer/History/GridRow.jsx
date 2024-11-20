import React, { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Star,
  StarOutline,
} from "@material-ui/icons";
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
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const styleBG = (value, value2) => (value !== row[value2] ? "changeBg" : "");

  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line
  }, [page]);

  const updateRow = (value, bool) => {
    const updateRow = HistoryData[0].history.map((elm) => {
      if (elm.id === row.id) return { ...elm, [value]: bool };
      return elm;
    });
    HistoryData[1]((prev) => ({ ...prev, history: updateRow }));

    const filterHis = HistoryData[0].history.find((elm) => elm.id === row.id);

    updateData((prev) =>
      prev.map((elm) => {
        if (elm.id === row.id)
          return {
            ...elm,
            history: [{ ...filterHis, [value]: bool }],
          };
        return elm;
      })
    );

    axios
      .put(`${historyApi}/${row.id}`, {
        ...HistoryData[0],
        history: [{ ...filterHis, [value]: bool }],
      })
      .catch(() => {
        HistoryData[1](HistoryData[0]);
        ModalDialog.error("Network Error", "Can't Connect to Server!");
      });
  };

  const StarRow = (bool) => {
    updateRow("star", bool);
  };

  const boldText = view ? "" : "boldTd";
  const isItemSelected = itemSelected.indexOf(row.id) !== -1;

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
                row.id,
                (DeleteObj = DeleteObj[1]),
                updateData
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

      {open &&
        row.prevData.map((historyRow, ind) => {
          const {
            date,
            code,
            item,
            billNum,
            qty,
            sellType,
            description,
            amount,
            retailPrice,
            sellPrice,
            commission,
            type,
            delaer,
          } = historyRow;

          return (
            <TableRow key={ind}>
              <TableCell className="innerTd" colSpan={4}></TableCell>
              <TableCell className={`innerTd ${styleBG(date, "date")}`}>
                {date}
              </TableCell>

              {page === "exl" && (
                <>
                  <TableCell
                    className={`innerTd ${styleBG(description, "description")}`}
                  >
                    {description}
                  </TableCell>
                  <TableCell className={`innerTd ${styleBG(amount, "amount")}`}>
                    {amount}
                  </TableCell>
                </>
              )}

              {page === "prl" && (
                <TableCell className={`innerTd ${styleBG(billNum, "billNum")}`}>
                  {billNum}
                </TableCell>
              )}
              {page !== "exl" && (
                <>
                  <TableCell className={`innerTd ${styleBG(code, "code")}`}>
                    {code}
                  </TableCell>
                  <TableCell className={`innerTd ${styleBG(item, "item")}`}>
                    {item}
                  </TableCell>
                  <TableCell className={`innerTd ${styleBG(qty, "qty")}`}>
                    {qty}
                  </TableCell>
                </>
              )}
              {page === "prl" && (
                <TableCell
                  className={`innerTd ${styleBG(retailPrice, "retailPrice")}`}
                >
                  {Number(retailPrice).toLocaleString()}
                </TableCell>
              )}
              {page !== "exl" && (
                <>
                  <TableCell
                    className={`innerTd ${styleBG(sellPrice, "sellPrice")}`}
                  >
                    {Number(sellPrice).toLocaleString()}
                  </TableCell>
                  <TableCell className={`innerTd ${styleBG(type, "type")}`}>
                    {type}
                  </TableCell>
                  <TableCell className={`innerTd ${styleBG(delaer, "delaer")}`}>
                    {delaer === "" ? "N/A" : delaer}
                  </TableCell>
                </>
              )}
              {page === "sll" && (
                <>
                  <TableCell
                    className={`innerTd ${styleBG(sellType, "sellType")}`}
                  >
                    {sellType}
                  </TableCell>
                  <TableCell
                    className={`innerTd ${styleBG(commission, "commission")}`}
                  >
                    {commission / qty}
                  </TableCell>
                </>
              )}
              <TableCell className="innerTd" colSpan={2}></TableCell>
            </TableRow>
          );
        })}
    </>
  );
};

export default GridRow;
