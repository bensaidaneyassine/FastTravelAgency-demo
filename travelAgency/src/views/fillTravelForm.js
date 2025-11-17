import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import "../styles/servicesStyle.css";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations

const TravelForms = () => {
  const [formType, setFormType] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const { t } = useTranslation(); // Initialize useTranslation hook
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

      let obj = {
        demandType : formType,
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
        <h2 className='specialText fs-3 text-md-center'>{t('fill_travel_forms')}</h2>
        <form onSubmit={handleSubmit} className='fillForm'>
        
          <div className="form-group mt-2">
            <label htmlFor="formType">{t('type_of_form_to_fill')}</label>
            <select
              className="form-control"
              id="formType"
              onChange={(e) => setFormType(e.target.value)}
            >
              <option value="Embassady Form">{t('embassy_form')}</option>
              <option value="Hotel Reservation">{t('hotel_reservation')}</option>
              <option value="Flight Form">{t('flight_form')}</option>
              <option value="Flight Form + Hotel Reservation">{t('flight_form_and_hotel_reservation')}</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="applicantName"><AiOutlineUser className='specialText fs-3'/> {t('applicant_name')}</label>
            <input
              type="text"
              className="form-control"
              id="applicantName"
              placeholder={t('enter_applicant_name')}
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="phoneNumber"><AiOutlinePhone className='specialText fs-3'/> {t('phone_number')}</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder={t('enter_phone_number')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="email"><AiOutlineMail className='specialText fs-3'/> {t('email_address')}</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={t('enter_email_address')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="container d-flex justify-content-center flex-column align-items-center mt-2">
            <h1 className='serviceFee fs-4'>{t('service_cost')}</h1>
            <p className='priceNotes fs-5'>{t('service_cost_notes')}</p>
          </div>
          <div className="container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-success">{t('submit_request')} <IoCheckmarkDoneSharp className='fs-4' /></button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TravelForms;
