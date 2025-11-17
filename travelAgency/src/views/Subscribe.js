import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation from react-i18next
import "../styles/Subscribe.css";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { FiLogIn } from "react-icons/fi";

export default function Subscribe() {
  const { t } = useTranslation(); // Initialize useTranslation hook

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        const countriesList = response.data.map(country => country.name.common);
        setCountries(countriesList);
      })
      .catch(error => {
        console.log(t("messages.failedToLoadCountries")); // Use translation for error message
      });
  }, [t]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className='formContainer m-0 p-0'>
      <div className='container-fluid d-flex justify-content-center form '>
        <form className='col-6' onSubmit={handleSubmit}>
          <div className='avatar'></div>
          {step === 1 && (
            <>
              <div className='mb-3'>
                <label htmlFor='firstNameInput' className='form-label'>
                  {t("labels.firstName")}
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='firstNameInput'
                  placeholder={t("placeholders.firstName")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='lastNameInput' className='form-label'>
                  {t("labels.lastName")}
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='lastNameInput'
                  placeholder={t("placeholders.lastName")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='nationalityInput' className='form-label'>
                  {t("labels.nationality")}
                </label>
                <select
                    name="nationalityInput"
                    id="nationalityInput"
                    onChange={(e) => setNationality(e.target.value)}
                    className='form-control'
                >
                  <option value="">{t("placeholders.nationality")}</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </select>
              </div>
             <div className="col-12 d-flex justify-content-end">
             <button type='button' className='btn btn-primary nextBtn' onClick={handleNextStep}>
             {t("labels.nextStep")}
              <GrLinkNext className='mx-1'></GrLinkNext>
              </button>
             </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className='mb-3'>
                <label htmlFor='passwordInput' className='form-label'>
                  {t("labels.password")}
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='passwordInput'
                  placeholder={t("placeholders.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='confirmPasswordInput' className='form-label'>
                  {t("labels.confirmPassword")}
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='confirmPasswordInput'
                  placeholder={t("placeholders.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='birthdateInput' className='form-label'>
                  {t("labels.birthdate")}
                </label>
                <input
                  type='date'
                  className='form-control'
                  id='birthdateInput'
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='genderInput' className='form-label'>
                  {t("labels.gender")}
                </label>
                <select
                  className='form-select'
                  id='genderInput'
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value=''>{t("options.gender.default")}</option>
                  <option value='male'>{t("options.gender.male")}</option>
                  <option value='female'>{t("options.gender.female")}</option>
                  <option value='other'>{t("options.gender.other")}</option>
                </select>
              </div>
              <div className='mb-3'>
                <label htmlFor='phoneInput' className='form-label'>
                  {t("labels.phoneNumber")}
                </label>
                <input
                  type='tel'
                  className='form-control'
                  id='phoneInput'
                  placeholder={t("placeholders.phoneNumber")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="col-12 d-flex gap-2 justify-content-end">
                <button type='button' className='btn btn-secondary mr-2 previousBtn p-2' onClick={handlePrevStep}>
                <GrLinkPrevious className='mx-1'></GrLinkPrevious>
                {t("labels.previousStep")}
              </button>
              <button type='submit' className='btn btn-primary submitBtn'>
                {t("labels.signUp")}
                <FiLogIn className='mx-1 fs-4'></FiLogIn>
              </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
