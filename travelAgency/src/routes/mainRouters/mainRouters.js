import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from '../../views/login.js';
import Subscribe from '../../views/Subscribe.js';
import MainPage from '../../views/mainPage.js';
import VisaDemand from '../../views/visaDemand.js';
import PassportRenewalForm from '../../views/passportRenewal.js';
import InternationalLicence from "../../views/internationalLicence.js"
import TrasnlationService from "../../views/translationService.js"
import TravelForm from '../../views/fillTravelForm.js';
import IELTSForm from '../../views/ielts.js';
import BahrainVisaForm from '../../views/bahrinVisaForm.js';
import UAEVisaForm from '../../views/UAEVisaForResidents.js';
import UniversityAdmissionsForm from '../../views/universityAcceptance.js';
import PassportForResidents from '../../views/passportForResidents.js';
import VehicleInsuranceForm from '../../views/VehiculeInssurance.js';
import AboutUs from '../../views/aboutUs.js';
import QatarVisaForm from '../../views/QatariVisa.js';
import NotificationModal from '../../components/notificationModal.js';
import ContactUs from "../../views/contactUs.js"
import MyDemands from '../../views/myDemands.js';
export default function mainRouters() {
  return (
    <Routes>
    <Route path='/' element={<MainPage />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/createAccount' element={<Subscribe />}></Route>
    <Route path='/visaDemand' element={<VisaDemand />}></Route>
    <Route path='/PassportRenewal' element={<PassportRenewalForm />}></Route>
    <Route path='/InternationalLicense' element={<InternationalLicence />}></Route>
    <Route path='/InternationalLicense' element={<InternationalLicence />}></Route>
    <Route path='/Translation' element={<TrasnlationService />}></Route>
    <Route path='/TravelFormFilling' element={<TravelForm />}></Route>
    <Route path='/IELTS' element={<IELTSForm />}></Route>
    <Route path='/BahrainVisa' element={<BahrainVisaForm />}></Route>
    <Route path='/UAEVisa' element={<UAEVisaForm />}></Route>
    <Route path='/UniversityAcceptance' element={<UniversityAdmissionsForm />}></Route>
    <Route path='/ResidentPassport' element={<PassportForResidents />}></Route>
    <Route path='/VehicleInsurance' element={<VehicleInsuranceForm />}></Route>
    <Route path='/QatariVisa' element={<QatarVisaForm />}></Route>
    <Route path='/contact' element={<ContactUs />}></Route>
    <Route path='/aboutUs' element={<AboutUs />}></Route>
  <Route path='/my-demands' element={<MyDemands />}></Route>

    
   </Routes>
  )
}
