import React from "react";
import Login from "../Images/login.jpg";
import { Button } from "@mui/material";
import { translatePage } from "../Functions/Functions";
import { useNavigate } from "react-router-dom";

const SelectPage = ({ inputProps, setLogin }) => {
  const navigate = useNavigate();

  return (
    <>
      <form
        className="selectPage"
        style={{
          transform: "translateY(-60rem)",
          opacity: "0",
          display: "none",
        }}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Select Page</h2>

        <Button
          className="btn text-capitalize mb-4"
          onClick={() => {
            setLogin((prev) => ({ ...prev, adminPath: "afghanAndDealer" }));
            navigate("/afghanAndDealer/purchaseList");
          }}
        >
          Afghan Land & Dealer
        </Button>
        <Button
          className="btn text-capitalize mb-4"
          onClick={() => {
            setLogin((prev) => ({ ...prev, adminPath: "stockMarket" }));
            navigate("/stockMarket/purchaseList");
          }}
        >
          Stock Market Shop
        </Button>
        <Button
          className="btn text-capitalize mb-5"
          onClick={() => navigate("/")}
        >
          Tek Delivery Service(Cargo)
        </Button>

        <h5
          onClick={() => {
            translatePage("loginForm", "X", "selectPage", "Y", "-60");
            inputProps[2]();
          }}
        >
          Back to Login
        </h5>
      </form>
    </>
  );
};

export default SelectPage;
