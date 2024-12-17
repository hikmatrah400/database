import React, { useContext, useState } from "react";
import "./Navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { Backdrop, Button, CardActionArea, IconButton } from "@mui/material";
import {
  Storefront,
  BusinessCenter,
  CardGiftcard,
  Assignment,
  AddCircleOutline,
  History,
  CloudDownload,
} from "@mui/icons-material";
import NavItem from "./NavItem";
import { FaSellcast } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import MenuIcon from "../images/menuIco.gif";
import MenuTitle from "./MenuTitle";
import ShowDialog from "../UI/BsModalDialog/BsModalDialog";

const DropDownMenu = ({ menu, setMenu, newPath, loadData, path, type }) => {
  const menuitems = { menu, setMenu };
  return (
    <>
      {path === "all" && (
        <>
          <NavItem
            label="Reports"
            Icon={Assignment}
            portTo={`/${newPath}/more/report`}
            {...menuitems}
          />

          <NavItem
            label="History"
            Icon={History}
            portTo={`/${newPath}/more/history`}
            {...menuitems}
          />
        </>
      )}

      <NavItem
        label="Reload Data"
        Icon={CloudDownload}
        portTo={`/${newPath}/${
          path === "all"
            ? "purchaseList"
            : type === "Purchaser"
            ? "purchaseList"
            : "sellList"
        }`}
        loadData={loadData}
        {...menuitems}
      />
    </>
  );
};

const Navbar = ({
  navName,
  path,
  adminPath,
  user,
  badgeColor,
  type,
  pagePath,
  loadData,
}) => {
  const newPath = path === "all" ? adminPath : path;
  const ModalDialog = useContext(ShowDialog);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <Backdrop
          sx={(theme) => ({
            backdrop: {
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
              transition: "0.4s ease !important",
            },
          })}
          open={menu}
          onClick={() => setMenu(false)}
        ></Backdrop>

        <div className="container-fluid px-2 mx-1 px-lg-3 mx-lg-3 px-xl-5 mx-xl-5">
          <span className="navbar-brand">
            <IconButton
              className="userBadge"
              style={{ backgroundColor: badgeColor }}
            >
              {user[0]}
            </IconButton>
            {navName.length > 0 && (
              <>
                <span>{navName[0]}</span>
                <span className="span_style"> {navName[1]}</span>
              </>
            )}
          </span>

          <button
            className="navbar-toggler me-2"
            type="button"
            onClick={() => setMenu(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse responsiveNav navbar-collapse"
            id="navbarSupportedContent"
            style={{ left: menu ? "0" : "-320px" }}
          >
            <h3>
              <img
                src={MenuIcon}
                alt={"Icon"}
                style={{ padding: "0", margin: "0", width: "4.5rem" }}
              />
              <span>Menu</span>
            </h3>

            <div className="leftMenuItems">
              <ul className="navbar-nav ms-auto mb-2 py-2 mb-lg-0 pe-4 mt-3 mt-lg-0">
                {type === "all" || type === "Purchaser" ? (
                  <li className="nav-item mt-1 mt-lg-0">
                    <CardActionArea className="w-100 NavAction">
                      <NavLink
                        className="nav-link"
                        to={`/${newPath}/purchaseList`}
                        onClick={() => setMenu(false)}
                      >
                        <Storefront />
                        Purchase List
                      </NavLink>
                    </CardActionArea>
                  </li>
                ) : null}

                {type === "all" || type === "Seller" ? (
                  <li className="nav-item mt-1 mt-lg-0">
                    <CardActionArea className="w-100 NavAction">
                      <NavLink
                        className="nav-link"
                        to={`/${newPath}/sellList`}
                        onClick={() => setMenu(false)}
                      >
                        <FaSellcast />
                        Sell List
                      </NavLink>
                    </CardActionArea>
                  </li>
                ) : null}

                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to={`/${newPath}/stockListReport`}
                      onClick={() => setMenu(false)}
                    >
                      <CardGiftcard />
                      Stock List Report
                    </NavLink>
                  </CardActionArea>
                </li>

                {path === "all" && (
                  <MenuTitle menu={menu} label="Expenses and Reports" />
                )}
                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to={`/${newPath}/expenseList`}
                      onClick={() => setMenu(false)}
                    >
                      <BusinessCenter />
                      {pagePath ? "Afghan Land" : "Stock Market"} Expenses
                    </NavLink>
                  </CardActionArea>
                </li>

                {menu ? (
                  <DropDownMenu
                    {...{ menu, setMenu, newPath, loadData, path, type }}
                  />
                ) : (
                  <li className="nav-item dropdown">
                    <CardActionArea
                      className="w-100 NavAction"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <NavLink to={`/${newPath}/more`} className="nav-link">
                        <AddCircleOutline />
                        More
                      </NavLink>
                    </CardActionArea>

                    <ul className="dropdown-menu">
                      <DropDownMenu
                        {...{ menu, setMenu, newPath, loadData, path, type }}
                      />
                    </ul>
                  </li>
                )}

                <hr className="menuLine mb-0" />
              </ul>
            </div>

            <div className="menuButtons">
              <Button
                className="menuBtn"
                onClick={() =>
                  ModalDialog.error(
                    "Please Confirm",
                    "Do you want to Logout?",
                    "Yes/No",
                    () => {
                      navigate("/");
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("user");
                    }
                  )
                }
              >
                <BiLogOut />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
