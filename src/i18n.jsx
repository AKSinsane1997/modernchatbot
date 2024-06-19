import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome:
        "Johar 🙏 , I'm UDDP ChatBot and I am here to help you regarding information about the Resident Portal as well as any scheme related query.",
      assist:
        "I can assist you in finding government schemes that you may be eligible for based on your demographic and socio-economic information.",
      options: "To begin, kindly choose from below options",
      unknown: "Sorry, I do not understand your message 😢!",
      option1: "Click here to know your scheme eligibility by typing a query",
      option2:
        "Click here to know your scheme eligibility by providing your eligibility criteria",
      option3: "Click here for general queries related to portal and schemes",
      option4:
        "Discover your scheme eligibility by answering a few quick questions. Click here to get started!",
      typeQuery:
        "Please input your age, gender, occupation, marital status, family income, disability status and community in the below input box to know your eligible schemes. e.g - <b>\n(I am 61 years old female construction worker belonging to scheduled caste category. what are my eligible schemes?)</b>",
      fillForm: "Please fill out the eligibility form.",
      generalQuery:
        "please type your query in the below input box. e.g - <b>\n1) What is maternity scheme\n2) what is eligible criteria of maternity\n3) I have 3 children. Am I eligible?</b>",
      chooseLanguage:
        "Johar 🙏 ,To start kindly choose your Preferred Language:",
      submit: "Submit",
      select: "Select",
      pleaseAnswerAllQuestions:
        "Please answer all questions before submitting.",
      schemeDetails: "Here are the schemes you are eligible for:",
      schemeName: "Scheme Name",
      schemeDescription: "Scheme Description",
      moreDetails: "More Details",
      errorSubmittingForm: "Error submitting form. Please try again.",

      continue: "Do you want to continue the conversation?",
      menu: "Main menu",
      lang: "Language",
      yes: "Yes",
      no: "No",
      choose: "kindly choose from below options",
      chat: "kindly continue your conversation",
    },
  },
  hi: {
    translation: {
      welcome:
        "जोहार 🙏, मैं यूडीडीपी चैटबॉट हूं और मैं पोर्टल और योजनाओं से संबंधित किसी भी जानकारी के लिए आपकी सहायता करने के लिए यहां हूं।",
      assist:
        "मैं आपको सरकारी योजनाएँ खोजने में सहायता कर सकती हूँ जिसके लिए आप अपने जनसांख्यिकीय और सामाजिक-आर्थिक जानकारी के आधार पर पात्र हो सकते हैं।",
      options: "शुरू करने के लिए, कृपया नीचे दिए गए विकल्पों में से चुनें",
      unknown: "मुझे आपका संदेश समझ नहीं आया 😢!",
      option1: "अपनी पात्रता प्रश्न पूछ कर जानने के लिए यहां क्लिक करें",
      option2:
        "अपनी पात्रता मानदंड के द्वारा योजनाओ की पात्रता जानने के लिए यहां क्लिक करें",
      option3:
        "पोर्टल और योजनाओं से संबंधित सामान्य प्रश्नों के लिए यहां क्लिक करें",
      option4:
        "निम्नलिखित कुछ प्रश्नों के उत्तर देकर अपनी योजना पात्रता जानें। आरंभ करने के लिए यहां क्लिक करें!",
      typeQuery:
        "कृपया अपनी पात्र योजनाओं को जानने के लिए नीचे दिए गए इनपुट बॉक्स में अपनी आयु, लिंग, व्यवसाय, वैवाहिक स्थिति, पारिवारिक आय, विकलांगता की स्थिति और समुदाय दर्ज करें। उदा - <b>\n(मैं 61 वर्ष की महिला निर्माण कार्यकर्ता हूं जो अनुसूचित जाति वर्ग से संबंधित है। मेरी योग्य योजनाएँ क्या हैं?)</b>",
      fillForm: "कृपया पात्रता फॉर्म भरें।",
      generalQuery:
        "कृपया अपना प्रश्न नीचे दिए गए इनपुट बॉक्स में टाइप करें। उदा - <b>\n1) मातृत्व योजना क्या है\n2) मातृत्व की पात्रता मापदंड क्या है\n3) मेरे 3 बच्चे हैं। क्या मैं पात्र हूँ?</b>",
      chooseLanguage: "शुरू करने के लिए, कृपया अपनी पसंदीदा भाषा का चयन करें:",
      submit: "जमा करें",
      select: "चुनना",
      pleaseAnswerAllQuestions: "कृपया सभी प्रश्नों के उत्तर दें।",
      schemeDetails: "यहां वे योजनाएं दी गई हैं जिनके लिए आप पात्र हैं:",
      schemeName: "योजना का नाम",
      schemeDescription: "योजना का विवरण",
      moreDetails: "अधिक जानकारी",
      errorSubmittingForm:
        "प्रपत्र जमा करने में त्रुटि। कृपया पुनः प्रयास करें।",

      continue: "क्या आप बातचीत जारी रखना चाहते हैं?",
      menu: "मुख्य मेनू",
      lang: "भाषा",
      yes: "हाँ",
      no: "नहीं",
      choose: "कृपया नीचे दिए गए विकल्पों में से चुनें",
      chat: "कृपया अपनी बातचीत जारी रखें",
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
