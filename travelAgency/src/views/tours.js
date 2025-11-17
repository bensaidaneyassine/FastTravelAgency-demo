import React, { useState, useEffect } from 'react';
import { Rating } from '@mui/material/';
import { BiExpandAlt } from "react-icons/bi";
import { useTranslation } from 'react-i18next';
import TravelDetail from './travelDetail';
import "../styles/tours.css";
import ukImage from "../images/uk.webp";
import czechImage from "../images/czech.webp";
import finlandImage from "../images/finland.webp";
import norwayImage from "../images/norway.webp";
import switzerlandImage from "../images/switzerland.webp";
import irelandImage from "../images/ireland.webp";
import italyImage from "../images/italy.webp";
import franceImage from "../images/france.webp";
import spainImage from "../images/spain.webp";
import greeceImage from "../images/greece.webp";
import turkeyImage from "../images/turkey.webp";
import germanyImage from "../images/germany.webp";

const tourData = [
  { image: ukImage, rating: 4, price: 27, country: "United Kingdom" },
  { image: czechImage, rating: 3.5, price: 38, country: "Czech Republic" },
  { image: finlandImage, rating: 2, price: 24, country: "Finland" },
/*   { image: norwayImage, rating: 5, price: 32, country: "Norway" },
  { image: switzerlandImage, rating: 1, price: 155, country: "Switzerland" },
  { image: irelandImage, rating: 3.5, price: 201, country: "Ireland" },
  { image: italyImage, rating: 4, price: 75, country: "Italy" },
  { image: franceImage, rating: 2, price: 100, country: "France" },
  { image: spainImage, rating: 4, price: 45, country: "Spain" },
  { image: greeceImage, rating: 3, price: 78, country: "Greece" },
  { image: turkeyImage, rating: 2, price: 28, country: "Turkey" },
  { image: germanyImage, rating: 1, price: 32, country: "Germany" }, */
];

const TourCard = React.memo(({ tour, index, imagesLoaded, t }) => (
  <div className="card m-0 p-0 col-lg-3 col-md-4 col-sm-5" key={index}>
    <img 
      src={tour.image} 
      className={`card-img-topTour ${imagesLoaded ? 'loaded' : ''}`} 
      alt={`Tour ${index + 1}`} 
    />
    <div className="card-body">
      <p className="card-text tourDescription fw-medium">{t(tour.country)}</p>
      <div className="container-fluid d-flex gap-2">
        <Rating
          name={`rating-${index}`}
          value={tour.rating}
          precision={0.5}
          readOnlyb
          className='rating'
        />
      </div>
      <div className="container-fluid d-flex justify-content-between align-items-baseline">
        <p>{t('from')} <span className='tourPrice'>${tour.price}</span></p>
        <a href="#"  data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-primary s-flex justify-content-end m-1" id="viewTourButtons"> 
          {t('details')} &nbsp;&nbsp;<BiExpandAlt className='fs-5 '/>
        </a>
      </div>
    </div>
  </div>
));

export default function Tours() {
  const { t } = useTranslation();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImage = () => {
      const imagePromises = tourData.map(tour => new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.src = tour.image;
      }));
      Promise.all(imagePromises).then(() => setImagesLoaded(true));
    };

    loadImage();
  }, []);

  return (
    <div className={`tours p-2 m-0 ${imagesLoaded ? 'loaded' : ''}`}>
      <h1 id='tours'>{t('availableTours')} <span className="specialText">{t('tours')}</span></h1>
      <div className="row m-0 p-0 toursList d-flex gap-3 justify-content-center">
        {tourData.map((tour, index) => (
          <TourCard key={index} tour={tour} index={index} imagesLoaded={imagesLoaded} t={t} />
        ))}
      </div>
      <TravelDetail/>
    </div>
  );
}
