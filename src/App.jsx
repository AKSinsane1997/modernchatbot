import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import chatbot1 from "../src/assets/chatbot.gif";
import "./App.css";
import { ReactTyped } from "react-typed";
import EligibilityForm from "./EligibilityForm";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

const options = {
  theme: {
    primaryColor: "#2e5a00",
    secondaryColor: "#4f9e07",
    fontFamily: "Arial, sans-serif",
  },
  userBubble: { showAvatar: false, animate: true },
  botBubble: {
    showAvatar: false,
    simStream: true,
    animate: true,
    dangerouslySetInnerHtml: true,
  },
  chatHistory: {
    disabled: false,
  },
  chatWindowStyle: { width: "475px", height: "650px" },
  footer: {
    text: `AKSinsane`,
  },
  header: {
    title: (
      <>
        {" "}
        <b style={{ padding: "2px ", fontSize: "20px" }}>UDDPBot</b> 🤖
      </>
    ),
  },
  notification: {
    disabled: true,
  },
  tooltip: {
    text: (
      <>
        <div>
          <ReactTyped
            strings={[
              "Hello 👋 I'm your chatbot",
              "I am here to assist you!!",
              "Click here to begin 👉",
            ]}
            typeSpeed={40}
            backSpeed={50}
            loop
            style={{ color: "white", fontWeight: "bold" }}
          />
          <br />
        </div>
      </>
    ),
  },
  audio: {
    disabled: false,
    language: "hi-IN",
  },
  voice: {
    disabled: false,
    autoSendDisabled: true,
    language: "hi-IN",
  },
  chatButton: {
    icon: chatbot1,
  },
  fileAttachment: {
    disabled: true,
  },
};

const queryUrl = "http://20.244.97.59:8000/v1/query";
const chatUrl = "http://20.244.97.59:8000/v1/chat";

const handleApiCall = async (url, body) => {
  try {
    const response = await axios.post(url, body);
    const message = response.data.output.text;
    return message;
  } catch (error) {
    console.error("API call error:", error);
    return "Sorry, I couldn't find any information.";
  }
};

const App = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  const handleLanguageSelection = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsLanguageSelected(true);
  };

  const flow = {
    start: {
      message: t("welcome"),
      path: "assist_message",
      transition: { duration: 300 },
    },
    assist_message: {
      message: t("assist"),
      path: "language_selection",
      transition: { duration: 300 },
    },
    language_selection: {
      message: t("chooseLanguage"),
      options: ["English", "हिन्दी"],
      path: "wait_for_language_selection",
    },
    wait_for_language_selection: {
      transition: { duration: 0 },
      path: async (params) => {
        const selectedLanguage = params.userInput;
        if (selectedLanguage === "English") {
          handleLanguageSelection("en");
        } else if (selectedLanguage === "हिन्दी") {
          handleLanguageSelection("hi");
        }
        return "greeting_message";
      },
    },
    greeting_message: {
      message: t("welcome"),
      path: "first_loop",
      transition: { duration: 300 },
    },
    first_loop: {
      message: t("assist"),
      path: "second_loop",
      transition: { duration: 300 },
    },
    second_loop: {
      message: t("options"),
      options: [t("option1"), t("option2"), t("option3")],

      path: "handle_option_selection",
    },
    handle_option_selection: {
      transition: { duration: 0 },
      path: async (params) => {
        console.log(params);
        const selectedOption = params.userInput;
        if (selectedOption === t("option1")) {
          await params.injectMessage(t("typeQuery"));
          return "handle_user_input_chat";
        } else if (selectedOption === t("option2")) {
          await params.injectMessage(t("fillForm"));
          return "render1";
        } else if (selectedOption === t("option3")) {
          await params.injectMessage(t("typeQuery"));
          return "handle_user_input_query";
        } else {
          return "unknown_input";
        }
      },
    },

    handle_user_input_chat: {
      transition: { duration: 0 },
      path: async (params) => {
        const userInput = params.userInput;
        const apiEndpoint = chatUrl;
        const apiBody = {
          input: {
            language: language,
            text: userInput,
            context: "citizen",
          },
          output: {
            format: "text",
          },
        };
        const message = await handleApiCall(apiEndpoint, apiBody);
        await params.injectMessage(message);
      },
    },
    handle_user_input_query: {
      transition: { duration: 0 },
      path: async (params) => {
        const userInput = params.userInput;
        const apiEndpoint = queryUrl;
        const apiBody = {
          input: {
            language: language,
            text: userInput,
            audienceType: "citizen",
          },
          output: {
            format: "text",
          },
        };
        const message = await handleApiCall(apiEndpoint, apiBody);
        await params.injectMessage(message);
      },
    },
    render1: {
      render: <EligibilityForm />,
    },
    repeat: {
      transition: { duration: 3000 },
      path: "second_loop",
    },
    unknown_input: {
      message: t("unknown"),
      options: [t("option1"), t("option2"), t("option3")],
      path: "handle_option_selection",
    },
  };

  return <ChatBot options={options} flow={flow} />;
};

export default App;
