import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { GiPositionMarker } from "react-icons/gi";
import Modal from '@mui/material/Modal';
import { MdDateRange, MdOutlineMail, MdPassword } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { CiCreditCard1 } from "react-icons/ci";
import { FaIdCard } from "react-icons/fa";
import { FaWhatsapp } from 'react-icons/fa6';
import "./modal.css"
const AuthEmailAndOtp = ({ onPayment }) => {
  const {t}=useTranslation()
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleToggle = () => setSelected(!selected);
  const usePasswd = () => setShowPassword(!showPassword);

  const userConnect = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    onPayment({});
    handleClose();
    setSubmitted(true);
  };

  return (
    <div>
      <button className='btn btn-primary p-2 submitBTN' onClick={handleOpen}>
        {t("selectPaymentMethod")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className='modalBox'>
          <h1 className='text-center specialText fs-3'>First Service Travel</h1>
          <p className='text-center'>{t("PaymentOptions")}</p>
          
          <button
            className={`btn ${selected ? 'selected' : 'notSelected'}`}
            disabled="true"
            onClick={handleToggle}
          >
            
            {t("MakeCardPayment")}
          </button>
          <button
            className={`btn ${selected ? 'notSelected' : 'selected'}`}
            onClick={handleToggle}
          >
            {t("MakeOnSitePayment")}
          </button>
          
          {/* {selected ? (
            <section className="loginViaEmail mt-3">
              <div className='input-group mb-3 mt-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100' id='basic-addon1'>
                    <CiCreditCard1 />
                  </span>
                </div>
                <input
                  type='text'
                  className='form-control h-75 rounded-1'
                  placeholder={t("CardNumber")}
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  id='emailInput'
                />
              </div>
              <div className='input-group mb-3 mt-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100' id='basic-addon1'>
                    <FaIdCard />
                  </span>
                </div>
                <input
                  type='text'
                  className='form-control h-75 rounded-1'
                  placeholder={t("CardHoldersName")}
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  id='emailInput'
                />
              </div>
              <div className='input-group mb-3 mt-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100' id='basic-addon1'>
                    <MdDateRange />
                  </span>
                </div>
                <input
                  type='text'
                  className='form-control h-75 rounded-1'
                  placeholder={t("CardExpirationDate")}
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  id='emailInput'
                />
              </div>
              <div className='input-group mb-3 mt-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100' id='basic-addon1'>
                    <MdPassword />
                  </span>
                </div>
                <input
                  type='text'
                  className='form-control h-75 rounded-1'
                  placeholder={t("SecurityCode")}
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  id='emailInput'
                />
              </div>
              { showPassword && (
                <div className='input-group mb-3 mt-2'>
                  <div className='input-group-prepend'>
                    <span className='input-group-text emailIcon h-100' id='basic-addon1'>
                      <MdOutlineMail />
                    </span>
                  </div>
                  <input
                    type='password'
                    className='form-control h-75 rounded-1'
                    placeholder='your password here please'
                    aria-label='Password'
                    aria-describedby='basic-addon1'
                    id='passwordInput'
                  />
                </div>
              )}
       
              <div className="container-fluid mt-2 d-flex justify-content-center d-flex flex-column">
                <button className="btn continueVia" onClick={userConnect}>{t("MakePayment")}</button>
              </div>
            </section>
          ) : ( */}
            <section className="loginViaPhone mt-3">
              <div className='input-group mb-3 mt-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100' id='basic-addon1'>
                    <GiPositionMarker />
                  </span>
                </div>
                <p> {t("You can pay with any credit card you want, or by our agents by clicking here ")}
                </p>
              </div>
             
              <div className="container-fluid mt-2 d-flex row-gap-2 justify-content-center d-flex flex-column">
              <button className="btn btnWhpp continueVia"><FaWhatsapp className='whpIcon'></FaWhatsapp> {t("contact_us")}</button>
              <button className="btn continueVia" disabled={submitted} onClick={handleSubmit}>{t("submitDemand")}</button>
              </div>
            </section>
          {/* )} */}

        </Box>
      </Modal>
    </div>
  );
};

export default AuthEmailAndOtp;
