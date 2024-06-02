import React from "react";

const Schemes = ({ actions }) => {
  const handleEligibility = () => {
    actions.handleUserInput("eligibility query");
  };

  const handleGeneral = () => {
    actions.handleUserInput("general query");
  };
  const handleEligibleForm = () => {
    actions.handleUserInput("form query");
  };
  return (
    <>
      <button
        className="scheme-btn"
        onClick={handleEligibility}
        style={{ textShadow: "4px -1px 5px rgba(0,0,0,0.6)" }}
      >
        Click here to know your scheme eligibility by typing a query
      </button>
      {/* <span>(fdjlhknl)</span> */}

      <br />
      <button
        className="scheme-btn"
        style={{ marginTop: "5px", textShadow: "4px -1px 5px rgba(0,0,0,0.6)" }}
        onClick={handleEligibleForm}
      >
        Click here to know your scheme eligibility by providing eligibility
        criteria
      </button>
      <br />
      <button
        className="scheme-btn"
        style={{ marginTop: "5px", textShadow: "4px -1px 5px rgba(0,0,0,0.6)" }}
        onClick={handleGeneral}
      >
        Click here for queries related to portal and schemes
      </button>

      {/* <button className="scheme-btn" style={{ marginTop: "5px" }}>
        Eligibility Checker
      </button> */}
    </>
  );
};

export default Schemes;
