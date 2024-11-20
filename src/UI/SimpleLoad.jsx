import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStylesFacebook = makeStyles(() => ({
  circle: {
    strokeLinecap: "round",
  },
}));

const FacebookCircularProgress = ({
  className,
  style,
  circleColor,
  duration,
  size,
  thickness,
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
  circleColor: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  thickness: PropTypes.number.isRequired,
};
SimpleLoad.defaultProps = {
  circleColor: "#4481eb",
  duration: 1000,
  size: 20,
  thickness: 4,
};

export default SimpleLoad;
