import React, { useState, useEffect } from "react";
import ChatBot, {
  PathsContext,
  BotOptionsContext,
  getDefaultBotOptions,
} from "react-chatbotify";
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
  const [language, setLanguage] = useState("");
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [paths, setPaths] = useState([]);
  const [userName, setUserName] = useState("");
  // const [userAge, setUserAge] = useState("");

  const defaultBotOptions = getDefaultBotOptions();

  const [botOptions, setBotOptions] = useState({
    ...defaultBotOptions,
    theme: {
      ...defaultBotOptions.theme,
      primaryColor: "#198754",
      secondaryColor: "#125F3B",
      fontFamily: "Arial, sans-serif",
    },
    userBubble: {
      ...defaultBotOptions.userBubble,
      showAvatar: false,
      animate: true,
    },
    botBubble: {
      ...defaultBotOptions.botBubble,
      showAvatar: false,
      simStream: true,
      animate: true,
      dangerouslySetInnerHtml: true,
    },
    chatHistory: {
      ...defaultBotOptions.chatHistory,
      disabled: false,
      storageKey: "example_custom_paths",
    },
    chatWindowStyle: {
      ...defaultBotOptions.chatWindowStyle,
      width: "475px",
      height: "650px",
    },
    footer: { ...defaultBotOptions.footer, text: `Chatbot` },
    header: {
      ...defaultBotOptions.header,
      title: (
        <>
          {" "}
          <b style={{ padding: "2px ", fontSize: "20px" }}>UDDPBot</b> 🤖
        </>
      ),
    },
    notification: {
      ...defaultBotOptions.notification,
      disabled: false,
      defaultToggledOn: true,
      volume: 0.2,
      showCount: true,
    },
    tooltip: {
      ...defaultBotOptions.tooltip,
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
      ...defaultBotOptions.audio,
      disabled: false,
      defaultToggledOn: false,
      language: language === "en",
    },
    voice: {
      ...defaultBotOptions.voice,
      disabled: false,
      autoSendDisabled: true,
      language: language === "en",
    },
    chatButton: { ...defaultBotOptions.chatButton, icon: chatbot1 },
    chatWindow: {
      ...defaultBotOptions.chatWindow,
      showScrollbar: true,
      showMessagePrompt: true,
    },
    fileAttachment: { ...defaultBotOptions.fileAttachment, disabled: true },
    emoji: {
      ...defaultBotOptions.emoji,
      list: [
        "😀",
        "😃",
        "😄",
        "😅",
        "😊",
        "😌",
        "😇",
        "🙃",
        "🤣",
        "😍",
        "🥰",
        "🥳",
        "🎉",
        "🎈",
        "🚀",
        "⭐️",
      ],
    },
    advance: {
      ...defaultBotOptions.advance,
      useCustomPaths: true,
      useCustomBotOptions: true,
    },
    chatInput: { ...defaultBotOptions.chatInput, allowNewline: true },
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    console.log(language);
    setBotOptions((prevOptions) => ({
      ...prevOptions,
      audio: {
        ...prevOptions.audio,
        language: language === "en" ? "en-IN" : "hi-IN",
      },
      voice: {
        ...prevOptions.voice,
        language: language === "en" ? "en-IN" : "hi-IN",
      },
      // advance: {
      //   // useCustomPaths: true,
      //   useCustomBotOptions: true,
      // },
    }));
  }, [language]);
  const jumpToStart = () => {
    setPaths((prev) => [...prev, "language_selection"]);
  };

  const jumpToEnd = () => {
    setPaths((prev) => [...prev, "second_loop"]);
  };

  const handleLanguageSelection = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsLanguageSelected(true);
  };

  const flow = {
    start: {
      path: "ask_name",
      transition: { duration: 300 },
    },
    ask_name: {
      message: "Hello there! What is your name?",
      path: "collect_name",
    },
    collect_name: {
      transition: { duration: 0 },
      path: (params) => {
        setUserName(params.userInput);
        return "welcome_name";
      },
    },
    welcome_name: {
      message: (params) =>
        `Johar 🙏 ${params.userInput}, Welcome to UDDP chatbot`,
      path: "language_selection",
      transition: { duration: 500 },
    },
    language_selection: {
      message: `To start kindly choose your Preferred Language:`,
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
      render: async (params) => {
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
      // after handling api query, prompt user for choice to continue
      path: "prompt_user_query",
      transition: { duration: 100 },
    },
    // use a prompt user block to ask for their choice
    prompt_user_query: {
      message: t("restart"),
      options: [t("continue"), t("menu"), t("lang")],
      path: (params) => {
        // if yes go next question, else back to second_loop
        if (params.userInput === t("continue")) {
          return "next_question_query";
        } else if (params.userInput === t("menu")) {
          return "second_loop";
        } else if (params.userInput === t("lang")) {
          return "language_selection";
        }
      },
    },
    next_question_query: {
      message: t("typeQuery"),
      // continue to path to somewhere
      path: "handle_api_query",
    },
    next_question_chat: {
      message: "chatttttt",
      path: "handle_api_chat",
    },
    render1: {
      render: <EligibilityForm />,
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
      path: "prompt_user_chat",
      transition: { duration: 100 },
    },

    prompt_user_chat: {
      message: t("restart"),
      options: [t("continue"), t("menu"), t("lang")],
      path: (params) => {
        // if yes go next question, else back to second_loop
        if (params.userInput === t("continue")) {
          return "next_question_chat";
        } else if (params.userInput === t("menu")) {
          return "second_loop";
        } else if (params.userInput === t("lang")) {
          return "language_selection";
        }
      },
    },
    next_question_chat: {
      message: t("generalQuery"),
      // continue to path to somewhere
      path: "handle_api_chat",
    },
    repeat: {
      transition: { duration: 3000 },
      path: "second_loop",
    },
    unknown_input: {
      message: t("unknown"),
      options: [t("option1"), t("option3")],
      path: "handle_option_selection",
    },
  };

  return (
    <>
      {/* <Button onClick={jumpToStart} text="language" />
      <Button onClick={jumpToEnd} text="restart" /> */}
      <PathsContext.Provider value={{ paths: paths, setPaths: setPaths }}>
        <BotOptionsContext.Provider value={{ botOptions, setBotOptions }}>
          <ChatBot
            options={botOptions}
            flow={flow}
            language={language}
            setLanguage={handleLanguageSelection}
          />
        </BotOptionsContext.Provider>
      </PathsContext.Provider>
    </>
  );
};

const buttonStyle = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "10px 20px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  margin: 10,
};

const Button = (props) => {
  return (
    <button style={buttonStyle} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default App;
