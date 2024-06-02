import React, { useState } from "react";

const StylishButton = ({ label, onClick }) => (
  <button
    style={{
      padding: "10px 20px",
      margin: "5px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#4f9e07",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s",
    }}
    onClick={onClick}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#3a7405")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#4f9e07")}
  >
    {label}
  </button>
);

const OptionButtons = ({ onOptionClick }) => {
  const handleOptionClick = (option) => {
    onOptionClick(option);
  };

  const helpOptions = [
    "Click here to know your scheme eligibility by typing a query",
    "Click here to know your scheme eligibility by providing eligibility criteria",
    "Click here for queries related to portal and schemes",
  ];

  return (
    <div>
      {helpOptions.map((option) => (
        <StylishButton
          key={option}
          label={option}
          onClick={() => handleOptionClick(option)}
        />
      ))}
    </div>
  );
};

export default OptionButtons;
