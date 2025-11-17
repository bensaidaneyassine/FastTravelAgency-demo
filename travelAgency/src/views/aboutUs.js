import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/aboutUsStyle.css'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'

import Navbar from '../components/navbar'
import { useTranslation } from 'react-i18next'
export default function AboutUs () {
  const { t } = useTranslation() // Initialize useTranslation hook
  return (
    <>
      <Navbar />
      <section className='py-5 mt-5 '>
        <div className='container'>
          <div className='row'>
            <div className='col-md-5'>
              <h2 className='fs-1 fw-bold specialText'>{t('about_us','Who are We ?')}</h2>
              <p className='lead'>{t('aboutUsText')}</p>
              <a className='btn submitBtn text-white mt-2' href='/contact'>
                {t('contact_us')}
              </a>
            </div>
            <div className='col-md-6 offset-md-1'>
              <div class='container-fluid text-center'>
                <div class='row contactInfos  p-3 d-flex justify-content-between'>
                  <div class='col-sm-4'>
                    <div className='iconContainer mb-3'>
                      <span class='icon'>
                        <FaPhoneAlt className='icon' />
                      </span>
                    </div>
                    <h4>{t('phone_number')}</h4>
                    <p>+99 523 663 253..</p>
                  </div>
                  <div class='col-sm-4'>
                    <div className='iconContainer mb-3'>
                      <span class='icon'>
                        <FaEnvelope className='icon' />
                      </span>
                    </div>
                    <h4>{t('email_address')}</h4>
                    <p>info@fastservicetravel.com</p>
                  </div>
                  <div class='col-sm-4'>
                    <div className='iconContainer mb-3'>
                      <span class=''>
                        <FaLocationDot className='icon' />
                      </span>
                    </div>
                    <h4>{t('location')}</h4>
                    <p>Riyadh ,Saudi Arabia</p>
                  </div>
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
        <div className="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.274257380938!2d-70.56068388481569!3d41.45496659976631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e52963ac45bbcb%3A0xf05e8d125e82af10!2sDos%20Mas!5e0!3m2!1sen!2sus!4v1671220374408!5m2!1sen!2sus"
         width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        </div>
      </section>
    </>
  )
}
