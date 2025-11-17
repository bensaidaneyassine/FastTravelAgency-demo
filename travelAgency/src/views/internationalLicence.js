import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import "../styles/servicesStyle.css";

const NewServiceForm = () => {
  const { t } = useTranslation();
  const [serviceType, setServiceType] = useState('');
  const [numberOfServices, setNumberOfServices] = useState(1);
  const [servicePrice, setservicePrice] = useState(119);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

      let obj = {
        demandType : "International Licence Notebook",
        numberOfServices,
        deliveryMethod,
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
        <h2 className='specialText fs-3 text-md-center'>{t('International Licence Notebook', 'International Licence Notebook')}</h2>
        <form onSubmit={handleSubmit} className='fillForm'>
        
          <div className="form-group mt-2">
            <label htmlFor="numberOfServices">{t('Number of Licences', 'Number of Licences')}</label>
            <input
              type="number"
              min={1}
              className="form-control"
              id="numberOfServices"
              placeholder={t('Enter Number of Services', 'Enter Number of Services')}
              value={numberOfServices}
              onChange={(e) =>{ 
                const noOfServices=e.target.value;
                setNumberOfServices(noOfServices);
                setservicePrice(119 * noOfServices);

              }
              }
          
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="deliveryMethod"><MdLocationOn className='specialText fs-3'/> {t('How Would You Like to Receive the Service?', 'How Would You Like to Receive the Service?')}</label>
            <input
              type="text"
              className="form-control"
              id="deliveryMethod"
              placeholder={t('Enter Delivery Method', 'Enter Delivery Method')}
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="applicantName"><AiOutlineUser className='specialText fs-3'/> {t('Applicant Name', 'Applicant Name')}</label>
            <input
              type="text"
              className="form-control"
              id="applicantName"
              placeholder={t('Enter Applicant Name', 'Enter Applicant Name')}
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="phoneNumber"><AiOutlinePhone className='specialText fs-3'/> {t('Phone Number', 'Phone Number')}</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder={t('Enter Phone Number', 'Enter Phone Number')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="email"><AiOutlineMail className='specialText fs-3'/> {t('Email Address', 'Email Address')}</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={t('Enter Email Address', 'Enter Email Address')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="container d-flex justify-content-center flex-column align-items-center mt-2">
            <h1 className='serviceFee fs-4'>{t('Service Cost', 'Service Cost')}</h1>
            <p className='priceText specialText fs-5'>{servicePrice+" "+t('Saudi Riyals')}</p>
            <p className='priceNotes fs-6'>{t('Price includes: Service fees, issuance of the international license, and receipt at one of our branches. Does not include delivery fees to home')}</p>
          </div>
          <div className="container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-success">{t('Submit Request', 'Submit Request')} <IoCheckmarkDoneSharp className='fs-4' /></button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewServiceForm;
