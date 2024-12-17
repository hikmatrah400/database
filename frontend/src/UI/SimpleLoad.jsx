import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";

const useStylesFacebook = makeStyles(() => ({
  circle: {
    strokeLinecap: "round",
  },
}));

const FacebookCircularProgress = ({
  className,
  style,
  circleColor = "#4481eb",
  duration = 1000,
  size = 20,
  thickness = 4,
}) => {
  const classes = useStylesFacebook();
  return (
    <CircularProgress
      className={className}
      variant="indeterminate"
      style={{
        color: circleColor,
        animationDuration: `${duration}ms`,
        ...style,
      }}
      classes={{
        circle: classes.circle,
      }}
      size={size}
      thickness={thickness}
    />
  );
};

const SimpleLoad = (porps) => {
  return (
    <>
      <FacebookCircularProgress {...porps} />
    </>
  );
};

SimpleLoad.propTypes = {
  circleColor: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number,
  thickness: PropTypes.number,
};

export default SimpleLoad;
