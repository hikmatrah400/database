import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, useLocation } from "react-router-dom";
import BodyClickCircle from "./UI/BodyClickCircle/BodyClickCircle";
import { BsModalDialog } from "./UI/BsModalDialog/BsModalDialog";

const RenderComponent = () => {
  const location = useLocation();

  return (
    <BodyClickCircle
      effectColor="#54afff7d"
      duration={1.4}
      marginTop={location.pathname === "/" ? 0 : 9.5}
    >
      <BsModalDialog>
        <App />
      </BsModalDialog>
    </BodyClickCircle>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <RenderComponent />
  </BrowserRouter>
);
