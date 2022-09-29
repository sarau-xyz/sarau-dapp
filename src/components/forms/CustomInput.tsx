import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

type InputProps = JSX.IntrinsicElements["input"];

const CustomInput: React.FC<InputProps> = ({ name, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(
    name as string
  );
  useEffect(() => {
    registerField({
      name: fieldName,
      path: "value",
      ref: inputRef.current,
    });
  }, [fieldName, registerField]);
  return (
    <>
      <input
        className="form-control"
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
};
export default CustomInput;
