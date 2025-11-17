import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useTranslation } from 'react-i18next';
import "../styles/langSwitcher.css";
import Cookies from 'js-cookie';

const countries = [
    { value: "ar", label: "", icon: "https://unpkg.com/language-icons/icons/ar.svg" },
    { value: "en", label: "", icon: "https://unpkg.com/language-icons/icons/en.svg"}
];

const Option = (props) => (
  <components.Option {...props} className="country-option">
    <img src={props.data.icon} alt="logo" className="country-logo" />
    {props.data.label}
  </components.Option>
);

const App = () => {
  const { i18n } = useTranslation();
  const storedLanguage = Cookies.get('language') || i18n.language;

  const [selectedCountry, setSelectedCountry] = useState(countries.filter((el)=> {return el.value == storedLanguage})[0]);

  const handleChange = (value) => {
    setSelectedCountry(value);
    i18n.changeLanguage(value.value);
    Cookies.set('language', value.value, { expires: 7 }); // Save language in cookies for 7 days
  };

  useEffect(() => {
    if (storedLanguage && storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [storedLanguage, i18n]);

  const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>
      <img src={selectedCountry.icon} className="selected-logo" />
      {children}
    </components.SingleValue>
  );

  return (
    <div>
      <Select
        value={selectedCountry}
        options={countries}
        onChange={handleChange}
        styles={{
          singleValue: (base) => ({
            ...base,
            display: "flex",
            alignItems: "center"
          })
        }}
        components={{
          Option,
          SingleValue
        }}
      />
    </div>
  );
};

export default App;
