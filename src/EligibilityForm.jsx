import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./InputContainer.css";
import { FidgetSpinner } from "react-loader-spinner";
import Offcanvas from "react-bootstrap/Offcanvas";

const EligibilityForm = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSchemeDetails, setSelectedSchemeDetails] = useState(null);
  const [show, setShow] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setIsClient(true);
    setIsLoading(true);
    axios
      .get(
        "http://localhost:8090/uddpcitizenapi/public/get-eligibility-questions"
      )
      .then((response) => {
        if (response?.data?.status) {
          setQuestions(response?.data?.result);
          setSelectedValues(
            response.data.result.map((question) => ({
              valueId: "",
              labelId: question?.labelId,
            }))
          );
        } else {
          console.error("Failed to fetch questions:", response?.data?.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e, labelId) => {
    const { value } = e.target;
    setSelectedValues((prevValues) =>
      prevValues.map((prevValue) => {
        if (prevValue.labelId === labelId) {
          return { ...prevValue, valueId: value };
        }
        return prevValue;
      })
    );
  };

  const validateForm = () => {
    return selectedValues.every((value) => value.valueId !== "");
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setResultMessage(
        <div>
          <b>Please answer all questions before submitting.</b>
        </div>
      );
      return;
    }

    setIsSubmitted(true);
    setIsLoading(true);
    axios
      .post(
        "http://localhost:8090/uddpcitizenapi/public/check-eligibility",
        selectedValues
      )
      .then((response) => {
        console.log(response.data);
        if (response?.data?.status) {
          const schemes = response?.data?.result;
          const schemeCount = schemes.length;
          const schemeDetails = schemes.map((scheme) => (
            <div key={scheme.schemeId}>
              <button
                className="schemeButton"
                onClick={() => {
                  setSelectedSchemeDetails(scheme);
                  handleShow();
                }}
              >
                {scheme?.SchemeDetails?.schemeName}
              </button>
            </div>
          ));
          setResultMessage(
            <div>
              <p>
                <i>Number of Schemes for which you are eligible is : </i>
                <b>{schemeCount}</b>
              </p>
              {schemeDetails}
            </div>
          );
        } else {
          console.error(
            "Failed to check eligibility:",
            response?.data?.message
          );
          setResultMessage(
            <div>
              <b>Failed to check eligibility, kindly refill the form again.</b>
            </div>
          );
        }
      })
      .catch((error) => {
        console.error("Error checking eligibility:", error);
        setResultMessage("Error checking eligibility");
      })
      .finally(() => {
        setIsSubmitted(false);
        setIsLoading(false);
      });
  };

  const renderQuestion = (question) => {
    return (
      <div key={question.labelId}>
        <div
          className="input-label"
          style={{ textShadow: "4px -1px 5px rgba(0,0,0,0.6)" }}
        >
          {question.question}:
        </div>
        <select
          className="input-box"
          onChange={(e) => handleInputChange(e, question?.labelId)}
        >
          <option value="">Select</option>
          {question.values.map((option) => (
            <option key={option.valueid} value={option.valueid}>
              {option.valuename}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const memoizedResultMessage = useMemo(() => resultMessage, [resultMessage]);

  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <FidgetSpinner
            visible={true}
            height="80"
            width="80"
            ariaLabel="fidget-spinner-loading"
            wrapperStyle={{}}
            wrapperClass="fidget-spinner-wrapper"
          />
        </div>
      )}
      <div className={`input-container ${isLoading ? "hidden" : ""}`}>
        {questions.map((question) => renderQuestion(question))}
        {isSubmitted ? (
          <button className="btn btn-success" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp; please wait...
          </button>
        ) : (
          <button
            id="submitBtn"
            className="btn btn-md btn-success btn-block btn-signin"
            type="button"
            onClick={handleSubmit}
          >
            submit
          </button>
        )}
      </div>

      {memoizedResultMessage && <div>{memoizedResultMessage}</div>}

      {isClient && (
        <Offcanvas show={show} onHide={handleClose} backdrop="static">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              style={{
                color: "green",
                textShadow: "1px -1px 2px rgba(0,0,0,0.6)",
              }}
            >
              <b>{selectedSchemeDetails?.SchemeDetails?.schemeName}</b>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div>
              <p>
                <b style={{ color: "green" }}>Department:</b>{" "}
                {selectedSchemeDetails?.SchemeDetails?.departmentName}
              </p>
              <p>
                <b style={{ color: "green" }}>Organization:</b>{" "}
                {selectedSchemeDetails?.SchemeDetails?.orgName}
              </p>
              <p>
                <b style={{ color: "green" }}>Sector:</b>{" "}
                {selectedSchemeDetails?.SchemeDetails?.sectorName}
              </p>
              <p>
                <b style={{ color: "green" }}>Scheme Description:</b>{" "}
                {selectedSchemeDetails?.SchemeDetails?.schemeDesc}
              </p>
              <p>
                <b style={{ color: "green" }}>URL:</b>{" "}
                <a
                  href={selectedSchemeDetails?.SchemeDetails?.url}
                  target="_blank"
                >
                  {selectedSchemeDetails?.SchemeDetails?.url}
                </a>
              </p>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
};

export default EligibilityForm;
