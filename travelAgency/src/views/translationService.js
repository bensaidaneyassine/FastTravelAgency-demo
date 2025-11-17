import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import Navbar from '../components/navbar';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { MdInsertDriveFile } from "react-icons/md";
import "../styles/servicesStyle.css";

const TranslationServiceForm = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
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
        demandType : 'Translation Service',
        content,
        applicantName,
        phoneNumber,
        email
      }

      const base64 = await convertBase64(file) ;
      obj['file'] = (base64);
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

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

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
        <h2 className='specialText fs-3 text-md-center'>{t('translationService')}</h2>
        <form onSubmit={handleSubmit} className='fillForm'>
          <div className="form-group mt-2">
            <label htmlFor="numberOfPages">{t('numberOfPages')}</label>
            <input
              type="number"
              className="form-control"
              id="numberOfPages"
              placeholder={t('enterNumberOfPages')}
              value={numberOfPages}
              onChange={(e) => {
                const noOfPages=e.target.value;
                setNumberOfPages(noOfPages)
                setservicePrice(noOfPages*259)
              }
              }
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="file"><MdInsertDriveFile className='specialText fs-3' /> {t('attachFile')}</label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input d-none"
                id="file"
                accept=".jpg, .jpeg, .png, .pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button className="btn custom-file-label submitBtn text-white" htmlFor="file" onClick={() => {
                document.getElementById("file").click()
              }}>{t('chooseFile')}</button>
            </div>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="content">{t('contentToTranslate')}</label>
            <textarea
              className="form-control"
              id="content"
              rows="3"
              placeholder={t('enterContent')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="applicantName"><AiOutlineUser className='specialText fs-3' /> {t('applicantName')}</label>
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
            <label htmlFor="phoneNumber"><AiOutlinePhone className='specialText fs-3' /> {t('phoneNumber')}</label>
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
            <label htmlFor="email"><AiOutlineMail className='specialText fs-3' /> {t('emailAddress')}</label>
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
            <h1 className='serviceFee fs-4'>{t('serviceFee')}</h1>
            <p className=' specialText fs-5'>{servicePrice} {t('saudiRiyal')}</p>
            <p className="priceNotes">{t('priceNotes')}</p>
          </div>
          <div className="container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-success">{t('submitRequest')} <IoCheckmarkDoneSharp className='fs-4' /></button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TranslationServiceForm;
