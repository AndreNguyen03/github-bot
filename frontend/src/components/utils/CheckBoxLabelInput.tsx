import React from "react";

const CheckBoxLabelInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  return (
    <>
      <div>
        <input type="checkbox" id={"labelCheckbox" + label} className="mr-2" />
        <label htmlFor={"labelCheckbox" + label} className="mr-4">
          {label}
        </label>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border p-1"
      />
    </>
  );
};

export default CheckBoxLabelInput;
