import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import "../styles/servicesStyle.css";

const UAEVisaForm = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook

  const [serviceType, setServiceType] = useState('');
  const [passportCount, setPassportCount] = useState(1);
  const [applicantName, setApplicantName] = useState('');
  const [servicePrice, setservicePrice] = useState(499);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

      let obj = {
        demandType : 'UAE Visa For Residents',
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
        <h2 className='specialText fs-3 text-md-center'>{t('uaeVisaForResidents')}</h2> 
        <form onSubmit={handleSubmit} className='fillForm'>
          <div className="form-group mt-2">
            <label htmlFor="passportCount">{t('passportCount')}</label>
            <input
              type="number"
              min={1}
              className="form-control"
              id="passportCount"
              placeholder={t('enterPassportCount')}
              value={passportCount}
              onChange={(e) =>{ 
                const passportCo=e.target.value
                setPassportCount(e.target.value)
                setservicePrice(passportCo*499)
              }
            }
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="applicantName"><AiOutlineUser className='specialText fs-3'/> {t('applicantName')}</label>
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
            <label htmlFor="phoneNumber"><AiOutlinePhone className='specialText fs-3'/> {t('phoneNumber')}</label>
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
            <label htmlFor="email"><AiOutlineMail className='specialText fs-3'/> {t('emailAddress')}</label> 
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
            <h1 className='serviceFee fs-4'>{t('serviceCost')}</h1>
            <p className='priceText specialText fs-5'>{servicePrice} {t('saudiRiyals')}</p> 
          </div>
          <div className="container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-success">{t('submitRequest')} <IoCheckmarkDoneSharp className='fs-4' /></button> {/* Translate button text */}
          </div>
        </form>
      </div>
    </>
  );
};

export default UAEVisaForm;
