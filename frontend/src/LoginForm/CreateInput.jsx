import React from "react";

const CreateInput = (props) => {
  return (
    <>
      <input
        autoComplete="off"
        className="input"
        type={props.type}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        onKeyUp={props.onKeyUp ? props.onKeyUp : undefined}
        onFocus={props.inputProps[0]}
        onBlur={props.inputProps[1]}
        required={props.required !== undefined ? props.required : true}
        disabled={props.disabled !== undefined ? props.disabled : false}
      />
      <label>{props.label}</label>

      <div className="i">
        <props.icon />
      </div>
    </>
  );
};

export default CreateInput;
