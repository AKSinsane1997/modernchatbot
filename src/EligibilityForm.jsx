import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./InputContainer.css";
import { FidgetSpinner } from "react-loader-spinner";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useTranslation } from "react-i18next";

const EligibilityForm = ({ language }) => {
  const { t } = useTranslation();

  const [questions, setQuestions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSchemeDetails, setSelectedSchemeDetails] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
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
          <b>{t("fillForm")}</b>
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
                <i>{t("eligibleSchemesCount")}</i>
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
              <b>{t("eligibilityCheckFailed")}</b>
            </div>
          );
        }
      })
      .catch((error) => {
        console.error("Error checking eligibility:", error);
        setResultMessage(t("eligibilityCheckError"));
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
          {language === "hi" ? question.questionHindi : question.question}:
        </div>
        <select
          className="input-box"
          onChange={(e) => handleInputChange(e, question?.labelId)}
        >
          <option value="">{t("select")}</option>
          {question.values.map((option) => (
            <option key={option.valueid} value={option.valueid}>
              {language === "hi" ? option.valuenamehindi : option.valuename}
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
            &nbsp; {t("pleaseWait")}...
          </button>
        ) : (
          <button
            id="submitBtn"
            className="btn btn-md btn-success btn-block btn-signin"
            type="button"
            onClick={handleSubmit}
          >
            {t("submit")}
          </button>
        )}
      </div>

      {memoizedResultMessage && <div>{memoizedResultMessage}</div>}

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
              <b style={{ color: "green" }}>{t("department")}:</b>{" "}
              {selectedSchemeDetails?.SchemeDetails?.departmentName}
            </p>
            <p>
              <b style={{ color: "green" }}>{t("organization")}:</b>{" "}
              {selectedSchemeDetails?.SchemeDetails?.orgName}
            </p>
            <p>
              <b style={{ color: "green" }}>{t("sector")}:</b>{" "}
              {selectedSchemeDetails?.SchemeDetails?.sectorName}
            </p>
            <p>
              <b style={{ color: "green" }}>{t("schemeDescription")}:</b>{" "}
              {selectedSchemeDetails?.SchemeDetails?.schemeDesc}
            </p>
            <p>
              <b style={{ color: "green" }}>{t("URL")}:</b>{" "}
              <a
                href={selectedSchemeDetails?.SchemeDetails?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedSchemeDetails?.SchemeDetails?.url}
              </a>
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default EligibilityForm;
