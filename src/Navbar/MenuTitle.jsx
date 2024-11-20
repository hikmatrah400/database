import React from "react";

const MenuTitle = ({ menu, label }) => {
  return (
    menu && (
      <>
        <hr className="menuLine" />
        <h4 className="menuHeader">{label}</h4>
      </>
    )
  );
};

export default MenuTitle;
