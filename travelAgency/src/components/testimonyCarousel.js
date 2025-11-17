import React, { useEffect, useState } from 'react';
import "../styles/testimonials.css"
import { Rating } from '@mui/material';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useTranslation } from 'react-i18next';

export default function TestimonyCarousel(props) {
  const { t,i18n } = useTranslation();
  const isArabic = i18n.language.includes('ar');
  const { userPhotos, userNames, userRatings, usersReviews } = props;
  var intervalId;
  const [testimonyIndex, setTestimonyIndex] = useState(0);
  useEffect(() => {
     intervalId = setInterval(() => {
      nextItem();
    }, 5000);

 
    return () => {
      clearInterval(intervalId);
    };
  }, []); 
  const previousItem = () => {
    setTestimonyIndex(testimonyIndex === 0 ? userPhotos.length - 1 : testimonyIndex - 1);
    clearInterval(intervalId);

  };

  const nextItem = () => {
    setTestimonyIndex(testimonyIndex === userPhotos.length - 1 ? 0 : testimonyIndex + 1);
    clearInterval(intervalId);
  };
  return (
    <div className='m-2 testimonies p-2'>
      {userPhotos.map((user, index) => {
        const testimonialClass = index === testimonyIndex ? "testimony" : "testimony d-none";
        return (
          <div key={index} className={`testimony d-flex flex-column align-items-center ${testimonialClass}`}>
            <div className="userPhoto" style={{backgroundImage: `url(${require("../images/" + userPhotos[index] + ".jpg")})`}}></div>
            <div className="info">
              <p className="userName my-0">{userNames[index]}</p>
              <p className='userReview my-0'>{usersReviews[index]}</p>
              <Rating
                name={`rating-${index}`}
                value={parseInt(userRatings[index])}
                precision={0.5}
                readOnly
                className='rating'
              />
            </div>
          </div>
        );
      })}
      <div className="navigation">
        {isArabic ? (
            <>
                  <button className='btn switchReviwBtn' onClick={previousItem}><MdKeyboardDoubleArrowRight className='mx-5 fs-2 warningText' /></button>
              <button className='btn switchReviwBtn' onClick={nextItem}><MdKeyboardDoubleArrowLeft className='mx-5 fs-2 warningText' /></button>
                </>
          ) : (
            <>
            <button className='btn switchReviwBtn' onClick={previousItem}><MdKeyboardDoubleArrowLeft className='mx-5 fs-2 warningText' /></button>
                  <button className='btn switchReviwBtn' onClick={nextItem}><MdKeyboardDoubleArrowRight className='mx-5 fs-2 warningText' /></button>
            </>
          )
        }
      </div>
    </div>
  );
}
