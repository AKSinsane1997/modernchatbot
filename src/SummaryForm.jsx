import React from "react";

const SummaryForm = ({ form, onFetchSchemes }) => {
  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  };

  return (
    <div style={formStyle}>
      <h3>Summary of Your Answers:</h3>
      {form.map((entry, index) => (
        <p key={index}>
          <strong>Question:</strong> {entry.question || entry.labelId} <br />
          <strong>Answer:</strong> {entry.answer || entry.valueId}
        </p>
      ))}
      <button onClick={onFetchSchemes}>Fetch Eligible Schemes</button>
    </div>
  );
};

export default SummaryForm;
