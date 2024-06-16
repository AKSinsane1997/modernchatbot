import React, { useEffect, useState } from "react";
import ChatBot from "react-chatbotify";

const App = () => {
  const [form, setForm] = useState([]);
  const [flow, setFlow] = useState({});
  const [schemeResults, setSchemeResults] = useState([]);
  const [currentStep, setCurrentStep] = useState("");

  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  };

  useEffect(() => {
    fetch(
      "http://localhost:8090/uddpcitizenapi/public/get-eligibility-questions"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status && data.result) {
          const newFlow = buildFlow(data.result);
          setFlow(newFlow);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    if (currentStep === "fetchSchemes") {
      fetchEligibility();
    }
  }, [currentStep]);

  const buildFlow = (questions) => {
    const newFlow = {};

    questions.forEach((question, index) => {
      newFlow[`question_${index}`] = {
        message: question.question,
        options: question.values.map((value) => value.valuename),
        chatDisabled: question.type === "select" || question.type === "radio",
        function: (params) => {
          const selectedValue = question.values.find(
            (value) => value.valuename === params.userInput
          );
          setForm((prevForm) => [
            ...prevForm,
            {
              labelId: question.labelid,
              valueId: selectedValue.valueid,
              question: question.question,
              answer: selectedValue.valuename,
            },
          ]);
        },
        path: index === questions.length - 1 ? "end" : `question_${index + 1}`,
      };
    });

    newFlow["start"] = {
      message: "Hello there! What is your name?",
      function: (params) =>
        setForm((prevForm) => [
          ...prevForm,
          { labelId: "name", valueId: params.userInput },
        ]),
      path: "question_0",
    };

    newFlow["end"] = {
      message: "Thank you for your responses. Here is the summary:",
      render: (
        <div style={formStyle}>
          <h3>Summary of Your Answers:</h3>
          {form.map((entry, index) => (
            <p key={index}>
              <strong>Question:</strong> {entry.question || entry.labelId}
              <br />
              <strong>Answer:</strong> {entry.answer || entry.valueId}
            </p>
          ))}
          <button onClick={() => setCurrentStep("fetchSchemes")}>
            Fetch Eligible Schemes
          </button>
        </div>
      ),
      chatDisabled: true,
      path: "fetchSchemes",
    };

    newFlow["fetchSchemes"] = {
      message: "Fetching your eligible schemes...",
      path: "showSchemes",
    };

    newFlow["showSchemes"] = {
      message: "Here are the eligible schemes for you:",
      render: (
        <div style={formStyle}>
          {schemeResults.length > 0 ? (
            schemeResults.map((scheme, index) => (
              <button
                key={index}
                onClick={() => window.open(scheme.SchemeDetails.url, "_blank")}
              >
                {scheme.SchemeDetails.schemeName}
              </button>
            ))
          ) : (
            <p>No eligible schemes found.</p>
          )}
        </div>
      ),
      options: ["New Application"],
      chatDisabled: true,
      path: "start",
    };

    return newFlow;
  };

  const fetchEligibility = () => {
    console.log("fetchEligibility called");

    const postData = form
      .filter((entry) => entry.valueId && entry.labelId !== "name")
      .map((entry) => ({
        valueId: entry.valueId,
        labelId: entry.labelId,
      }));

    console.log("Post Data:", postData);

    fetch("http://localhost:8090/uddpcitizenapi/public/check-eligibility", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.status && data.result) {
          setSchemeResults(data.result);
        } else {
          setSchemeResults([]);
        }
        setCurrentStep("showSchemes");
      })
      .catch((error) => {
        console.error("Error checking eligibility:", error);
        setCurrentStep("showSchemes");
      });
  };

  const options = {
    isOpen: true,
    theme: {
      primaryColor: "#42b0c5",
      secondaryColor: "#491d8d",
      fontFamily: "Arial, sans-serif",
    },
    audio: {
      disabled: false,
    },
  };

  if (!Object.keys(flow).length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Chatbot</h1>
      <ChatBot options={options} flow={flow} />
    </div>
  );
};

export default App;
