import React from 'react';
import "../styles/countries.css";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations

const countryList = [
  "United Kingdom",
  "Czech Republic",
  "Finland",
  "Norway",
  "Switzerland",
  "Ireland",
  "Italy",
  "France",
  "Spain",
  "Greece",
  "Turkey",
  "Germany",
  "United States"
];

const pictures = [
  require("../images/uk.webp"),
  require("../images/czech.webp"),
  require("../images/finland.webp"),
  require("../images/norway.webp"),
  require("../images/switzerland.webp"),
  require("../images/ireland.webp"),
  require("../images/italy.webp"),
  require("../images/france.webp"),
  require("../images/spain.webp"),
  require("../images/greece.webp"),
  require("../images/turkey.webp"),
  require("../images/germany.webp"),
  require("../images/usa.webp")
];

export default function Countries() {
  const { t } = useTranslation(); // Initialize useTranslation hook

  return (
    <div className="countriesList row container p-2 gap-2 justify-content-center" >
      <h1 id='destinations'><span className='specialText'>{t('countries')}</span> {t('travel_to')}</h1>
      {countryList.map((country, index) => (
        <div key={index} className="country d-flex p-2 gap-2 align-items-center col-lg-3">
          <div className="flag" style={{ backgroundImage: `url(${pictures[index]})` }}></div>
          <div className="countryName fs-5 pe-2">
            {t(country)}
          </div>
        </div>
      ))}
    </div>
  );
}
