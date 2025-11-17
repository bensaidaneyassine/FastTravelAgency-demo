import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import "../styles/servicesStyle.css";

const UniversityAdmissionsForm = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook

  const [serviceType, setServiceType] = useState('');
  const [studyCountry, setStudyCountry] = useState('');
  const [nationality, setNationality] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [studyLevel, setStudyLevel] = useState('');
  const [toeflOrIelts, setToeflOrIelts] = useState('');
  const [servicePrice, setservicePrice] = useState(259);

  const [applicantName, setApplicantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

      let obj = {
        demandType : 'University Admissions Service',
        studyCountry,
        nationality,
        paymentMethod,
        studyLevel,
        toeflOrIelts,
        applicantName,
        phoneNumber,
        email
      }
      const response = await fetch("/api/demands/client-application", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });

        const responseData = await response.json();
        setShowAlert(true);
        setAlertMsg(responseData.message)
    } catch (error) {
        console.log(error)
        setShowAlert(true);
        setAlertMsg(error);
    }
    event.preventDefault();
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  }


  return (
    <>
      <Navbar />
      <div className="container fillFormContainer" style={{ marginTop: "15vh" }}>
        { showAlert ? (
            <div className='row mt-5'>
              <span className='alert alert-success text-success h2'> {t(alertMsg)} </span>
            </div>

          ) : 
          <> </>
        }
        <h2 className='specialText fs-3 text-md-center'>{t('universityAdmissions')}</h2> {/* Translate component title */}
        <form onSubmit={handleSubmit} className='fillForm'>
          <div className="form-group mt-2">
            <label htmlFor="studyCountry">{t('selectCountryOfStudy')}</label> {/* Translate label */}
            <select
              className="form-control"
              id="studyCountry"
              value={studyCountry}
              onChange={(e) => setStudyCountry(e.target.value)}
            >
              <option value="">{t('selectStudyCountry')}</option> {/* Translate option */}
              <option value="Canada">{t('canada')}</option>
              <option value="Britain">{t('unitedKingdom')}</option>
              <option value="USA">{t('usa')}</option>
              <option value="Australia">{t('australia')}</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="nationality">{t('enterNationality')}</label> {/* Translate label */}
            <input
              type="text"
              className="form-control"
              id="nationality"
              placeholder={t('enterNationality')}
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="paymentMethod">{t('paymentMethodForTuitionFees')}</label> {/* Translate label */}
            <select
              className="form-control"
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">{t('selectPaymentMethod')}</option> {/* Translate option */}
              <option value="Government Bourse">{t('governmentBourse')}</option>
              <option value="Own Sponsorship">{t('ownSponsorship')}</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="studyLevel">{t('selectStudyLevel')}</label> {/* Translate label */}
            <select
              className="form-control"
              id="studyLevel"
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
            >
              <option value="">{t('selectStudyLevel')}</option> {/* Translate option */}
              <option value="Secondary">{t('secondary')}</option>
              <option value="Baccalaureate">{t('baccalaureate')}</option>
              <option value="Master">{t('master')}</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="toeflOrIelts">{t('toeflOrIeltsCertificate')}</label> {/* Translate label */}
            <select
              className="form-control"
              id="toeflOrIelts"
              value={toeflOrIelts}
              onChange={(e) => setToeflOrIelts(e.target.value)}
            >
              <option value="">{t('selectResponse')}</option> {/* Translate option */}
              <option value="I have TOEFL">{t('iHaveTOEFL')}</option>
              <option value="I have IELTS">{t('iHaveIELTS')}</option>
              <option value="None">{t('none')}</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="applicantName"><AiOutlineUser className='specialText fs-3'/> {t('applicantName')}</label> {/* Translate label */}
            <input
              type="text"
              className="form-control"
              id="applicantName"
              placeholder={t('enterApplicantName')}
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="phoneNumber"><AiOutlinePhone className='specialText fs-3'/> {t('phoneNumber')}</label> {/* Translate label */}
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder={t('enterPhoneNumber')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="email"><AiOutlineMail className='specialText fs-3'/> {t('emailAddress')}</label> {/* Translate label */}
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={t('enterEmailAddress')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="container d-flex justify-content-center flex-column align-items-center mt-2">
            <h1 className='serviceFee fs-4'>{t('serviceCost')}</h1> {/* Translate service fee title */}
            <p className='priceText specialText fs-5'>{t('serviceCostNote')}</p> {/* Translate price note */}
          </div>
          <div className="container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-success">{t('submitRequest')} <IoCheckmarkDoneSharp className='fs-4' /></button> {/* Translate button text */}
          </div>
        </form>
      </div>
    </>
  );
};

export default UniversityAdmissionsForm;
