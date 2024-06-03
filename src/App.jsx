import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import chatbot1 from "../src/assets/chatbot.gif";
import "./App.css";
import { ReactTyped } from "react-typed";
import EligibilityForm from "./EligibilityForm";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import SchemesList from "./SchemesList";

const queryUrl = "http://20.244.97.59:8000/v1/query";
const chatUrl = "http://20.244.97.59:8000/v1/chat";

const handleApiCall = async (url, body) => {
  try {
    const response = await axios.post(url, body);
    let message = response.data.output.text;

    if (typeof message !== "string") {
      console.error("API response text is not a string:", message);
      return "Sorry, I couldn't find any information.";
    }

    if (url === chatUrl) {
      message = message.replace(/Source:.*$/, "");
    }

    return message;
  } catch (error) {
    console.error("API call error:", error);
    return "Sorry, I couldn't find any information.";
  }
};

const App = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("hi");
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  const handleLanguageSelection = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsLanguageSelected(true);
  };

  const flow = {
    start: {
      transition: { duration: 100 },
      path: "language_selection",
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
      transition: { duration: 100 },
    },
    first_loop: {
      message: t("assist"),
      path: "second_loop",
      transition: { duration: 100 },
    },
    second_loop: {
      message: t("options"),
      options: [t("option1"), t("option2"), t("option3")],
      path: "handle_option_selection",
    },
    handle_option_selection: {
      transition: { duration: 0 },
      path: (params) => {
        const selectedOption = params.userInput;
        if (selectedOption === t("option1")) {
          return "handle_user_input_query";
        } else if (selectedOption === t("option2")) {
          return "render1";
        } else if (selectedOption === t("option3")) {
          return "handle_user_input_chat";
        } else {
          return "unknown_input";
        }
      },
    },
    handle_user_input_query: {
      message: t("typeQuery"),
      path: "handle_api_query",
    },
    handle_api_query: {
      render: async (params, updateState, createChatBotMessage) => {
        const apiBody = {
          input: {
            language: language,
            text: params?.userInput,
            audienceType: "citizen",
          },
          output: {
            format: "text",
          },
        };
        const message = await handleApiCall(queryUrl, apiBody);
        return <SchemesList schemes={message} language={language} />;
      },
      path: "second_loop",
      transition: { duration: 100 },
    },
    render1: {
      render: <EligibilityForm language={language} />,
    },
    handle_user_input_chat: {
      message: t("generalQuery"),
      path: "handle_api_chat",
    },
    handle_api_chat: {
      render: async (params) => {
        const userInput = params.userInput;
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
        return await handleApiCall(chatUrl, apiBody);
      },
      path: "second_loop",
      transition: { duration: 100 },
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
      text: `Chatbot`,
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
      defaultToggledOn: false,
      language: language === "hi" ? "hi-IN" : "en-IN",
    },
    voice: {
      disabled: false,
      autoSendDisabled: true,
      language: "zh-CN",
    },
    chatButton: {
      icon: chatbot1,
    },
    fileAttachment: {
      disabled: true,
    },
  };

  return (
    <ChatBot
      options={options}
      flow={flow}
      language={language}
      setLanguage={handleLanguageSelection}
    />
  );
};

export default App;
