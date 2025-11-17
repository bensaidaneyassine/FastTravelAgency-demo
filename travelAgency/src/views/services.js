import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/services.css";
import idl from "../images/serviceImages/idl.png";
import bahrainVisa from "../images/serviceImages/bahrain_visa.png";
import formFilling from "../images/serviceImages/form_filling.png";
import idlCard from  "../images/serviceImages/idl-card.png";
import ielts from  "../images/serviceImages/ielts.png";
import passport from "../images/serviceImages/passport.png";
import passportResident from "../images/serviceImages/passport_resident .png";
import uni from "../images/serviceImages/uni.png";
import bhVehicleInsurance from "../images/serviceImages/bh_vehicle_insurance_img.png";
import translation from "../images/serviceImages/translation.png";
import uaeVisa from "../images/serviceImages/uae_visa.png";
import qatar from "../images/serviceImages/qatar_web.png";

const serviceImages = [
  { src: idl, alt: "IDL" },
  { src: bahrainVisa, alt: "Bahrain Visa" },
  { src: formFilling, alt: "Form Filling" },
  { src: idlCard, alt: "IDL Card" },
  { src: ielts, alt: "IELTS" },
  { src: passport, alt: "Passport" },
  { src: uni, alt: "University" },
  { src: passportResident, alt: "Resident Passport" },
  { src: bhVehicleInsurance, alt: "Bahrain Vehicle Insurance" },
  { src: qatar, alt: "Qatar" },
  { src: translation, alt: "Translation" },
  { src: uaeVisa, alt: "UAE Visa" },
];

const Services = () => {
  const { t } = useTranslation(); // Use the useTranslation hook

  const servicesDescription = [
    t('International License C'),
    t('Bahrain Visa'),
    t('Travel Form Filling'),
    t('International License N'),
    t('IELTS'),
    t('Passport Renewal'),
    t('University Acceptance'),
    t('Resident Passport'),
    t('Vehicle Insurance'),
    t("Qatari's Visa"),
    t('Translation'),
    t('UAE Visa'),
  ];
  const servicesRoutes = [
    "InternationalLicense",
    "BahrainVisa",
    "TravelFormFilling",
    "InternationalLicense",
    "IELTS",
    "PassportRenewal",
    "UniversityAcceptance",
    "ResidentPassport",
    "VehicleInsurance",
    "QatariVisa",
    "Translation",
    "UAEVisa",
  ];

  const settings = {
    dots: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 5,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 300,
    // Adjusting responsive settings to avoid white space at the end
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true, // Set infinite to false for each breakpoint
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true, // Set infinite to false for each breakpoint
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true, // Set infinite to false for each breakpoint
        }
      }
    ]
  };

  return (
    <div className="m-0 mt-2 p-0">
      <h1 className='text-center'>{t('Discover More With Our Premium')} <span className="specialText">{t('Services')}</span></h1>
      <Slider {...settings} className='slider d-flex flex-nowrap m-0 p-0'>
        {serviceImages.map((service, index) => (
          <div className="card serviceCard p-0 m-0" >
              <img className="card-img-top m-0 p-0" src={service.src} alt={service.alt} />
              <Link to={`${servicesRoutes[index]}`} key={index} className="service-link">
                <div className="card-footer serviceCardFooter text-center">{servicesDescription[index]}</div>
              </Link> 
            </div>
        ))}
      </Slider>
    </div>
  );
}

export default Services;
