import React, { useState } from 'react';
import "../styles/main.css";
import "../styles/util.css";
import image from "../images/img-01.png";
import { IoIosSend } from "react-icons/io";
import Navbar from '../components/navbar';
import { useTranslation } from 'react-i18next';

export default function ContactUs() {
  const { t } = useTranslation();

  // Initialize state for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/message/client-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      setShowAlert(true);
      setAlertMsg(responseData.message);
    } catch (error) {
      console.log(error);
      setShowAlert(true);
      setAlertMsg("Error submitting the form.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact1 mt-5">
        <div className="container-contact1">
          <div className="contact1-pic js-tilt" data-tilt>
            <img src={image} alt="IMG" />
          </div>

          <form className="contact1-form validate-form" onSubmit={handleSubmit}>
            <p className="contactTitle">
              {t("contact_us")}
            </p>

            <div className="wrap-input1 validate-input" data-validate="Name is required">
              <input
                className="input1"
                type="text"
                name="name"
                placeholder={t("applicant_name")}
                value={formData.name}
                onChange={handleInputChange}
              />
              <span className="shadow-input1"></span>
            </div>

            <div className="wrap-input1 validate-input" data-validate="Valid email is required: ex@abc.xyz">
              <input
                className="input1"
                type="text"
                name="email"
                placeholder={t("email_address")}
                value={formData.email}
                onChange={handleInputChange}
              />
              <span className="shadow-input1"></span>
            </div>

            <div className="wrap-input1 validate-input" data-validate="Subject is required">
              <input
                className="input1"
                type="text"
                name="subject"
                placeholder={t("subject")}
                value={formData.subject}
                onChange={handleInputChange}
              />
              <span className="shadow-input1"></span>
            </div>

            <div className="wrap-input1 validate-input" data-validate="Message is required">
              <textarea
                className="input1"
                name="message"
                placeholder={t("messageContent")}
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
              <span className="shadow-input1"></span>
            </div>

            <div className="container-contact1-form-btn">
              <button className="contact1-form-btn">
                <span>
                  {t("sendMessage")}
                  <IoIosSend />
                </span>
              </button>
            </div>
          </form>

          {showAlert && <div className="alert alert-info mt-3">{alertMsg}</div>}
        </div>
      </div>
    </>
  );
}
