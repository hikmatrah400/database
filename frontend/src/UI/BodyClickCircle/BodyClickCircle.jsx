import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

const BodyClickCircle = (props) => {
  const { effectColor = "#54afff7d", duration = 1.4, marginTop = 0 } = props;

  const handleClick = (e) => {
    try {
      const { x, y } = e.nativeEvent;
      const continer = document.querySelector(".Shapecontiner");

      const Shadow = `inset 1px 1px 10px ${effectColor}, inset 1px 1px 10px ${effectColor},inset 1px 1px 10px ${effectColor}, inset 1px 1px 10px ${effectColor},inset -1px -1px 10px ${effectColor}, inset -1px -1px 10px ${effectColor},inset -1px -1px 10px ${effectColor}, inset -1px -1px 10px ${effectColor}, 0 0 10px ${effectColor}`;

      const ripple = document.createElement("span");
      ripple.classList.add("shape");

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.boxShadow = Shadow;
      ripple.style.animation = `BodyClickedCircle ${duration}s ease 1`;
      continer.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 2000);
    } catch (err) {
      return console.log(err);
    }
  };

  return (
    <div
      className="Shapecontiner"
      style={{
        height: `calc(100vh - ${(marginTop * 6) / 10}rem)`,
        marginTop: `${(marginTop * 6) / 10}rem`,
      }}
      onClick={handleClick}
    >
      {props.children}

      <div className="BodyAnimatedCircles"></div>
    </div>
  );
};

BodyClickCircle.propTypes = {
  marginTop: PropTypes.number,
  effectColor: PropTypes.string,
  duration: PropTypes.number,
};

export default BodyClickCircle;
