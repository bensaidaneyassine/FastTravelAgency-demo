import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import "../styles/servicesStyle.css";

const QatarVisaForm = () => {
  const { t } = useTranslation();
  const [passportCount, setPassportCount] = useState(1);
  const [applicantName, setApplicantName] = useState('');  
  const [servicePrice, setservicePrice] = useState(199);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

      let obj = {
        demandType : "Qatar Visa for Residents",
        passportCount,
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
        <h2 className='specialText fs-3 text-md-center'>{t('Qatar Visa for Residents')}</h2>
        <form onSubmit={handleSubmit} className='fillForm'>
        
          
          <div className="form-group mt-2">
            <label htmlFor="passportCount">{t('Number of Passports')}</label>
            <input
              type="number"
              min={1}
              className="form-control"
              id="passportCount"
              placeholder={t('Enter Number of Passports')}
              value={passportCount}
              onChange={(e) => {
                const passportCo=e.target.value
                setPassportCount(passportCo)
                setservicePrice(199*passportCo)
              }
              }
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="applicantName"><AiOutlineUser className='specialText fs-3'/> {t('Applicant Name')}</label>
            <input
              type="text"
              className="form-control"
              id="applicantName"
              placeholder={t('Enter Applicant Name')}
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="phoneNumber"><AiOutlinePhone className='specialText fs-3'/> {t('Phone Number')}</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder={t('Enter Phone Number')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="email"><AiOutlineMail className='specialText fs-3'/> {t('Email Address')}</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={t('Enter Email Address')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="container d-flex justify-content-center flex-column align-items-center mt-2">
            <h1 className='serviceFee fs-4'>{t('Service Cost')}</h1>
            <p className='priceText specialText fs-5'>{servicePrice} {t('Saudi Riyals')}</p>
          </div>
          <div className="container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-success">{t('Submit Request')} <IoCheckmarkDoneSharp className='fs-4' /></button>
          </div>
        </form>
      </div>
    </>
  );
};

export default QatarVisaForm;
