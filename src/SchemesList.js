import React from "react";
import { useTranslation } from "react-i18next";

const SchemesList = ({ schemes, language }) => {
  const { t } = useTranslation();
  const splitCharacter = language === "hi" ? "-" : "\n";

  const filteredSchemes = schemes
    .split(splitCharacter)
    .map((scheme, index) => {
      if (index === 0) {
        return null;
      }
      return `${scheme.trim().replace(/^-/, "")}`;
    })
    .filter(
      (scheme) =>
        scheme !== null &&
        !scheme.includes(".txt") &&
        scheme !== "Sona-Sobran Dhoti-Saree Distribution Scheme"
    );

  return (
    <div>
      <p>{t("schemeDetails")}</p>
      {filteredSchemes.map((scheme, index) => (
        <button
          className="schemeButton"
          key={index}
          style={{ display: "block", margin: "10px " }}
        >
          {scheme}
        </button>
      ))}
    </div>
  );
};

export default SchemesList;
