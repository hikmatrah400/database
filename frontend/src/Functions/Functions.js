import { IconButton, Menu } from "@mui/material";
import { KeyboardArrowDownRounded } from "@mui/icons-material";

export const SumNumberArray = (arr) => {
  const total = arr.reduce((cur, tot) => cur + tot, 0);
  return total;
};

//-------------------------------------------------------

const UpdateObj = (DeleteObj, id, bool) => {
  DeleteObj((prev) =>
    prev.map((elm) => {
      if (elm[bool ? "_id" : "delId"] === id)
        return bool ? { ...elm, delId: id } : { ...elm, delId: "" };
      return elm;
    })
  );
};

export const CheckBoxClick = (state, setState, id, DeleteObj) => {
  const selectedIndex = state.indexOf(id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(state, id);
    UpdateObj(DeleteObj, id, true);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(state.slice(1));
    UpdateObj(DeleteObj, id, false);
  } else if (selectedIndex === state.length - 1) {
    newSelected = newSelected.concat(state.slice(0, -1));
    UpdateObj(DeleteObj, id, false);
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      state.slice(0, selectedIndex),
      state.slice(selectedIndex + 1)
    );
    UpdateObj(DeleteObj, id, false);
  }
  setState(newSelected);
};

export const SelectAllClick = (data, state, setState, e) => {
  if (state.length > 0 && state.length < data.length) {
    setState([]);
  } else {
    if (e.target.checked) {
      const newSelected = data.map((n) => n._id);
      setState(newSelected);
      return;
    }
    setState([]);
  }
};

export const RowStyle = (index, id, romove, color) => {
  const Td = document.getElementsByClassName(index);
  const selectedTd = document.getElementsByClassName(id);

  for (let i = 0; i < Td.length; i++) {
    Td[i].style.background = "transparent";
  }
  if (romove) {
    for (let i = 0; i < selectedTd.length; i++) {
      selectedTd[i].style.background = color;
    }
  }
};

export const FilterRow = {
  searchTextBox: (anchorEl, FilterRows) => (newItem, e) => {
    anchorEl(e.currentTarget);
    setTimeout(() => {
      document.getElementById("filterRecord").focus();
    }, 100);
    FilterRows[1]((prev) => ({ ...prev, itemVal: newItem }));

    if (FilterRows[0].prevItem === newItem)
      FilterRows[1]((prev) => ({ ...prev, prevSearch: prev.searchVal }));
    else FilterRows[1]((prev) => ({ ...prev, prevSearch: "" }));
  },
  filterBtn: (state) => (name) => {
    return (
      <IconButton
        style={{ marginTop: "-5px" }}
        size="small"
        onClick={(e) => state(name, e)}
      >
        <KeyboardArrowDownRounded />
      </IconButton>
    );
  },
  filterRecords: (data, itemValue, setData, method) => (value) => {
    const res = data.filter((f) =>
      f[itemValue].toString().toLowerCase().includes(value)
    );

    setData(res);
    if (method) method(res);
  },
  Menu: ({ open, anchorEl, handleClose, FilterRows, filterRecord }) => (
    <Menu
      id="long-menu"
      className="gridFilter"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
      style={{ height: "200px" }}
    >
      <input
        id="filterRecord"
        type="search"
        value={FilterRows[0].prevSearch}
        placeholder="Enter to Filter..."
        onChange={(e) => {
          FilterRows[1]((prev) => ({
            ...prev,
            searchVal: e.target.value,
            prevItem: prev.itemVal,
            prevSearch: e.target.value,
          }));

          filterRecord(e.target.value);
        }}
        style={{
          padding: "0.3rem 0.8rem",
          fontSize: "1.65em",
          outline: "none",
          margin: "0 1rem",
          border: "none",
          fontWeight: "500",
        }}
        className="FilterBox"
      />
    </Menu>
  ),
};

export const filterPageType = (data, login) => {
  const filterData = data.filter((elm) => elm.pageType === login.adminPath);
  return filterData;
};

// Date Functions =--------------------------------------------
export const loadCurrentDate = async (axios, setState) => {
  try {
    const response = await axios.get(
      "http://worldtimeapi.org/api/timezone/Asia/Kabul"
    );
    setState(response.data);
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentDate = (object, setState) => {
  const month = new Date(object).toLocaleString("en-Us", {
    month: "2-digit",
  });
  const year = new Date(object).getFullYear();
  const day = new Date(object).toLocaleString("en-Us", {
    day: "2-digit",
  });
  const newDay = Number(day) + 1;

  if (setState)
    setState((prev) => ({
      ...prev,
      date: `${year}-${month}-${newDay}`,
    }));
  else return `${year}-${month}-${newDay}`;
};

export const generateShortDate = (date) => {
  const day = date.slice(8, 10);
  const newDay = Number(day) + 1;
  const newDate = `${date.slice(0, 8)}${newDay < 10 ? `0${newDay}` : newDay}`;
  const month = new Date(newDate).toLocaleString("default", {
    month: "short",
  });
  const year = new Date(date).getFullYear();

  return `${month}-${day}-${year}`;
};

export const generateTime = (fullDate) => {
  const date = getCurrentDate(fullDate.datetime);

  const day = date.slice(8, 10);
  const newDay = Number(day) + 1;
  const newDate = `${date.slice(0, 8)}${newDay < 10 ? `0${newDay}` : newDay}`;
  const month = new Date(newDate).toLocaleString("default", {
    month: "short",
  });
  const year = new Date(date).getFullYear();

  const showOutput = `${month}-${day}-${year} | ${fullDate.datetime.slice(
    11,
    19
  )}`;

  return showOutput;
};
