import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Backdrop } from "@material-ui/core";

const useStylesFacebook = makeStyles(() => ({
  circle: {
    strokeLinecap: "round",
  },
}));

const FacebookCircularProgress = ({ circleColor, circleDuration }) => {
  const classes = useStylesFacebook();
  return (
    <CircularProgress
      variant="indeterminate"
      style={{ color: circleColor, animationDuration: `${circleDuration}ms` }}
      classes={{
        circle: classes.circle,
      }}
      size={60}
      thickness={3.5}
    />
  );
};

const CircularBackdropLoading = ({
  open,
  circleColor,
  circleDuration,
  background,
  color,
}) => {
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      background: background ? background : "",
      width: "100%",
      zIndex: theme.zIndex.drawer + 1,
      color: color ? color : "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  }));
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <FacebookCircularProgress
        circleColor={circleColor}
        circleDuration={circleDuration}
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
        Please Wait...
      </h2>
    </Backdrop>
  );
};

CircularBackdropLoading.propTypes = {
  open: PropTypes.bool.isRequired,
  circleColor: PropTypes.string.isRequired,
  circleDuration: PropTypes.number.isRequired,
  background: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
CircularBackdropLoading.defaultProps = {
  open: true,
  circleColor: "#fff",
  circleDuration: 1000,
  background: "",
  color: "",
};

export default CircularBackdropLoading;
