import React, { useRef, useState } from 'react';
import { BsFillPlayFill } from "react-icons/bs";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import videoMp4 from "../videos/adsVideo.mp4";
import videoWebm from "../videos/adsVideo.webm";
import "../styles/discover.css";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations

export default function Discover() {
  const videoRef = useRef(null);
  const steps = ['Step 1', 'Step 2', 'Step 3'];
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation(); // Initialize useTranslation hook
  const stepsTitles = [
    t('choose_adventure'),
    t('book_in_a_few_clicks'),
    t('get_ready_to_explore')
  ]; 
  const stepsContent = [
    t('browse_our_tours_and_choose_one_of_them'),
    t('fill_in_the_required_information_to_book_a_tour'),
    t("we'll_send_a_pre_departure_email_with_all_the_essentials")
  ]; 

  const playVideo = () => {
    videoRef.current.play();
  };

  return (
    <div className="guide p-0 container-fluid mt-3 "  >
      <div className="row m-0">
        <div className="col-lg-6 col-md-12 col-sm-12 guideText p-3 d-flex flex-column justify-content-center align-items-center" id="discover">
          <h1 className='guideTitle'>{t('how_do_we_organize_our_trips_in_europe')}</h1>
          <p className='guideDescription'>{t('learn_more_about_our_trips_in_three_minute_video')}</p>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12 guideVideo d-flex justify-content-center align-items-center">
          <div className="playButtonContainer">
            <button className='btn playButton' onClick={playVideo}>
              <BsFillPlayFill />
            </button>
          </div>
          <video id="video" loop className='video' ref={videoRef}>
            <source src={videoMp4} type='video/mp4'/>
            <source src={videoWebm} type='video/webm'/>
          </video>
        </div>
      </div>
      <div className="row m-0 mt-5 p-2 d-flex justify-content-center ">
        <div className="col-lg-10 col-sm-12 p-3 stepsContainer">
          <div className="col-12">
            <h1 className='text-center  mb-5'>{t('how_to_book_a_tour_in_first_service_travel')}</h1>
          </div>
          <div className="row m-0 p-0">
            {steps.map((label, index) => (
              <div key={label} className="col-lg-4 col-md-11">
                <div className="step d-flex justify-content-center flex-column align-items-center">
                  <button className="stepButton">
                    <div className="stepTextContainer">
                      <span className="stepText">{t(`${label}`)}</span>
                    </div>
                  </button>
                  <div className="stepDescription d-flex flex-column align-items-center justify-content-center m-2">
                    <h3>{stepsTitles[index]}</h3>
                    <p className='stepContent text-center'>{stepsContent[index]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
