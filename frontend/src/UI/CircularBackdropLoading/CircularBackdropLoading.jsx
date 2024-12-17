import React from "react";
import PropTypes from "prop-types";
import { Backdrop } from "@mui/material";
import SimpleLoad from "../SimpleLoad";

const CircularBackdropLoading = ({
  open = true,
  circleColor = "#fff",
  circleDuration = 1000,
  background = "",
  color = "",
  text = "Please Wait...",
}) => {
  return (
    <Backdrop
      sx={() => ({
        background: background ? background : "",
        width: "100%",
        color: color ? color : "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 999,
      })}
      open={open}
    >
      <SimpleLoad
        circleColor={circleColor}
        duration={circleDuration}
        size={60}
      />

      <h2
        style={{
          fontFamily: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    "Noto Sans", "Liberation Sans", Arial, sans-serif`,
          fontWeight: "500",
          fontSize: "2rem",
          marginTop: "25px",
        }}
      >
        {text}
      </h2>
    </Backdrop>
  );
};

CircularBackdropLoading.propTypes = {
  open: PropTypes.bool,
  circleColor: PropTypes.string,
  circleDuration: PropTypes.number,
  background: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
};

export default CircularBackdropLoading;
