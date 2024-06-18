import React, { useEffect, useState } from "react";
import ChatBot from "react-chatbotify";
import SummaryForm from "./SummaryForm"; // Import the new SummaryForm component
import { ReactTyped } from "react-typed";

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
        options:
          index === 0 ? null : question.values.map((value) => value.valuename),
        chatDisabled:
          index === 0
            ? false
            : question.type === "select" || question.type === "radio",
        function: (params) => {
          let selectedValue;
          if (index === 0) {
            selectedValue = {
              labelid: question.labelid,
              valueid: params.userInput,
            };
          } else {
            selectedValue = question.values.find(
              (value) => value.valuename === params.userInput
            );
          }
          setForm((prevForm) => [
            ...prevForm,
            {
              labelId: selectedValue.labelid,
              valueId: selectedValue.valueid,
              question: question.question,
              answer: selectedValue.valueid,
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
        <SummaryForm
          form={form}
          onFetchSchemes={() => setCurrentStep("fetchSchemes")}
        />
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
    header: {
      title: "UDDP chatbot",
    },
    footer: {
      text: (
        <>
          <div>
            <ReactTyped
              strings={[
                "Hello 👋 I'm your chatbot🤖",
                "I am here to assist you!!",
                "Scheme Eligibility Information",
                "Detailed Scheme Descriptions",
              ]}
              typeSpeed={40}
              backSpeed={50}
              loop
              style={{ color: "green", fontWeight: "bold" }}
            />
            <br />
          </div>
        </>
      ),
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
