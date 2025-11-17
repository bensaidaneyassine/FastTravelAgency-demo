import React from 'react';
import earthImage from '../images/globalEarth.webp';
import '../styles/testimonials.css';
import TestimonialsComponent from "../components/testimonyCarousel";

// Import i18n library (e.g., react-i18next)
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <div className='testimonials p-2 d-flex justify-content-center flex-column align-items-center' id='testimonials'>
      <div className='earthImageContainer m-2 '>
        <img src={earthImage} alt='earth' className='earthImage' />
      </div>
      <h2 className='specialText estimonialsTitle'>{t('testimonialsTitle')}</h2>
      <h1 className='testimonialsQuote'>{t('trustOurClients')}</h1>
      <TestimonialsComponent 
        userNames={[t('userNames.david'), t('userNames.moccha'), t('userNames.alfred')]}
        userPhotos={["person1", "person2", "person3"]} // Assuming images are static
        userRatings={[4.5, 3, 5]}
        usersReviews={[t('userReviews.review1'), t('userReviews.review2'), t('userReviews.review3')]}
      />
    </div>
  );
}
