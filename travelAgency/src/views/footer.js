import React from 'react';

import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "../styles/footer.css";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations

export default function Footer() {
  const { t } = useTranslation(); // Initialize useTranslation hook

  return (
    <div className="footer container-fluid p-4">
        <div className="row m-0  ">
            <div className="col-lg-3 col-sm-12 d-flex flex-column navigationContainer">
                <a>{t('navigation')}</a>
                <a>{t('tours')}</a>
                <a>{t('reviews')}</a>
                <a>{t('blog')}</a>
                <a>{t('faqs')}</a>
            </div>
            <div className="col-lg-3 col-sm-12 d-flex flex-column navigationContainer">
                <a>{t('socials')}</a>
                <div className="icons d-flex gap-2">
                    <FaFacebook></FaFacebook>
                    <FaLinkedin></FaLinkedin>
                    <MdEmail></MdEmail>
                </div>
            </div>
            <div className="col-lg-3 col-sm-12 d-flex flex-column navigationContainer">
                <a>{t('contact_us')}</a>
                <a>info@fastservicetravel.com</a>
            </div>
            <div className="col-lg-3 col-sm-12 d-flex flex-column navigationContainer">
                <a>{t('location')}</a>
                <a>Riyadh ,Saudi Arabia</a>
            </div>
        </div>
        <div className="row m-0 mt-5 p-0 logoAndInformations">
            <div className="container-fluid">
                <p className="logo">Fast Service Travel <span className="specialText">.</span></p>
            </div>
            <div className="row  m-0 p-0 privacyInformation">
             
                <div className="col-lg-6 col-md-12">
                    <a href='' className='mx-2' >{t('privacy_policy')}</a>
                    <a href='' className='mx-2' >{t('public_offer')}</a>
                </div>
                <div className="col-lg-6 col-md-12 d-flex justify-content-end">
                <span className="fs-5">&copy; {t('created_in')} {new Date().getFullYear()}</span>
                
                </div>
            </div>

        </div>
    </div>
  )
}
