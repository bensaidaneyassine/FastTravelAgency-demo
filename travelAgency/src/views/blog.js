import React from 'react'
import "../styles/blog.css"
import { FaRegClock } from "react-icons/fa6";
import mainArticlePhoto from "../images/london.webp"
import amesterdamPhoto from "../images/amesterdam.webp"
import sushi from "../images/sushi.webp"
import italy from "../images/italy.webp"
import ireland from "../images/irelland.webp"
import { FaLocationArrow } from "react-icons/fa";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations
import { NavLink } from 'react-router-dom';

export default function Blog() {
  const { t } = useTranslation(); // Initialize useTranslation hook

const cardData = [
  { 
    image: amesterdamPhoto,
    title: t('amsterdam_exploration', 'Amsterdam Exploration'),
    description: t('amsterdam_description', 'Discover the vibrant culture and picturesque scenery of Amsterdam, Netherlands, as you wander through its charming streets and iconic landmarks.')
  },
  { 
    image: sushi,
    title: t('sushi_delights', 'Sushi Delights'),
    description: t('sushi_description', 'Treat yourself to a culinary journey through the flavors of Japan with our selection of fresh sushi and traditional delicacies.')
  },
  { 
    image: ireland,
    title: t('irish_adventure', 'Irish Adventure'),
    description: t('ireland_description', 'Experience the magic of Ireland with its breathtaking landscapes, rich history, and lively culture, making it an unforgettable destination.')
  },
  { 
    image: italy,
    title: t('italian_escapade', 'Italian Escapade'),
    description: t('italy_description', 'Indulge in the romance and charm of Italy as you explore its historic cities, savor authentic cuisine, and soak in the beauty of its scenic countryside.')
  }
];

  return (
    <div className="blog m-0 p-2" >
        <h1 id='blog'>{t('read_our')} <span className='specialText'>{t('blog')}</span></h1>
        <div className="articles container">
        <div className="mainArticle gap-3">
            <div className="articlePhoto">
                    <img src={mainArticlePhoto} className='mainArticlePhoto' alt="" />
                </div>
                <div className="articleDescription d-flex flex-column justify-content-center">
                    <div className="labels d-flex gap-2">
                        <div className="label specialText">
                            {t('United Kingdom')}
                        </div>
                        <div className="label">
                           <FaRegClock className='clockIcon mx-2'/>
                            <span className='specialText p-1 m-0'>2 {t('Minutes')}</span>
                        </div>
                    </div>
                    <div className="article d-flex flex-column  gap-2 my-1">
                        <h2 className='mt-2'>{t('new_london_restaurants')}</h2>
                        <p className='text-muted'>{t('new_london_restaurants_descritpion')}</p>
                        <NavLink to={"/visaDemand"}>
                          <buttton className="btn btn-primary learnMoreBtn col-2">{t('learn_more')}<FaLocationArrow className='mx-2'/></buttton>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="secondarryArticles row justify-content-start align-items-start gap-1 p-1 my-2">
                {cardData.map((card, index) => (
                    <div key={index} className="card visitCard col-lg m-0 p-0">
                        <img src={card.image} className="card-img-top visitCardImage" alt={`Tour`} />
                        <div className="card-body">
                            <h5 className="card-title fw-medium">{t(`${card.title}`)}</h5>
                            <p className="card-text tourDescription fw-normal">{t(`${card.description}`)}</p>
                            <NavLink to={"/visaDemand"}>
                              <button className="btn btn-primary learnMoreBtn col-12 align-bottom">{t('learn_more')}<FaLocationArrow className='mx-2'/></button>
                            </NavLink>
                        </div>
                    </div>
                ))}
            </div>
      </div>
    </div>
  )
}
