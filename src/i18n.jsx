import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome:
        "Johar 🙏 , I'm <b>UDDP ChatBot</b> and I am here to help you regarding information about the Resident Portal as well as any scheme related query.",
      assist:
        "I can assist you in finding government schemes that you may be eligible for based on your demographic and socio-economic information.",
      options: "To begin, kindly choose from below options",
      unknown: "Sorry, I do not understand your message 😢!",
      option1: "Click here to know your scheme eligibility by typing a query",
      option2:
        "Click here to know your scheme eligibility by providing eligibility criteria",
      option3: "Click here for queries related to portal and schemes",
      typeQuery: "Please type your query below:",
      fillForm: "Please fill out the eligibility form.",
      chooseLanguage: "To start, kindly choose your <b>Preferred Language:</b>",
    },
  },
  hi: {
    translation: {
      welcome:
        "जोहार 🙏, मैं <b>UDDP चैटबॉट</b> हूं और मैं पोर्टल और योजनाओं से संबंधित किसी भी जानकारी के लिए आपकी सहायता करने के लिए यहां हूं।",
      assist:
        "मैं आपको सरकारी योजनाएँ खोजने में सहायता कर सकता हूँ जिसके लिए आप अपने जनसांख्यिकीय और सामाजिक-आर्थिक जानकारी के आधार पर पात्र हो सकते हैं।",
      options: "शुरू करने के लिए, कृपया नीचे दिए गए विकल्पों में से चुनें",
      unknown: "मुझे आपका संदेश समझ नहीं आया 😢!",
      option1: "अपनी पात्रता जानने के लिए यहां क्लिक करें",
      option2: "अपनी पात्रता की जानकारी प्रदान करें",
      option3: "पोर्टल और योजनाओं से संबंधित प्रश्नों के लिए यहां क्लिक करें",
      typeQuery: "कृपया अपना प्रश्न नीचे टाइप करें:",
      fillForm: "कृपया पात्रता फॉर्म भरें।",
      chooseLanguage: "शुरू करने के लिए, कृपया अपनी पसंदीदा भाषा का चयन करें:",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
