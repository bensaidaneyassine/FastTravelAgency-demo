import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/landingComponent.css";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations
import { NavLink } from 'react-router-dom';

function LandingComponent() {
    const { t } = useTranslation(); // Initialize useTranslation hook


  const [pageData, setPageData] = useState(null); // State to store fetched data

  // Fetch page data on component mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/pages?title=Home'); 
  //       setPageData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching page data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

    return (
        <div className="container-fluid  landingComponent" id="landing">
            <div className="content container-fluid d-flex flex-column justify-content-center align-items-center h-100 row-gap-5">
            <p className='slogan '>{t('apply_visa_now', pageData?.seo_title)}</p>
                <p className='sloganMessage'>{t('visa_with_direct', pageData?.seo_description)}</p>
                <NavLink to={"/visaDemand"}>
                    <button className="btn btnApply">{t('apply_now', 'Apply for visa now !')}</button>
                </NavLink>
            </div>
        </div>
    );
}

export default LandingComponent;
