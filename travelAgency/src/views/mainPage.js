import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
// import Testimonials from './testimonials';
// import Discover from './discover';
// import Blog from './blog';
// import LandingComponent from '../components/landingComponent';
// import Tours from './tours';
// import Countries from "./countries";
// import Footer from './footer';
// import Navbar from '../components/navbar';
// import Services from './services';
// import Loader from "./loading";
import { Suspense } from 'react';

const Testimonials = React.lazy(() => import('./testimonials'));
const Discover = React.lazy(() => import('./discover'));
const Blog = React.lazy(() => import('./blog'));
const LandingComponent = React.lazy(() => import('../components/landingComponent'));
const Tours = React.lazy(() => import('./tours'));
const Countries = React.lazy(() => import('./countries'));
const Footer = React.lazy(() => import('./footer'));
const Navbar = React.lazy(() => import('../components/navbar'));
const Services = React.lazy(() => import('./services'));
const Loader = React.lazy(() => import('./loading'));
const TravelDetail = React.lazy(() => import('./travelDetail'));



export default function MainPage() {
  const [showLoader, setShowLoader] = useState(false);



  return (
    <>
      <Navbar />
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <LandingComponent />
          <Services />
            {/* <Discover /> */}
            {/* <Tours /> */}
          <Blog />
          <Countries />
            {/* <Testimonials /> */}
          <TravelDetail />
          <Footer />
        </>
      )}
    </>
  );
}
