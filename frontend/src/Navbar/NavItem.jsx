import { CardActionArea } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ menu, setMenu, label, Icon, portTo, loadData }) => {
  const liClass = `mt-1 ${menu && "nav-item mt-lg-0"}`;
  const NavClass = `nav-link ${!menu && "dropdown-item"}`;

  return (
    <>
      <li className={liClass}>
        <CardActionArea className="w-100 NavAction">
          <NavLink
            className={`${NavClass} ${loadData ? "noColor" : ""}`}
            to={portTo}
            onClick={() => {
              setMenu(false);
              if (loadData) loadData();
            }}
          >
            <Icon />
            {label}
          </NavLink>
        </CardActionArea>
      </li>
    </>
  );
};

export default NavItem;
