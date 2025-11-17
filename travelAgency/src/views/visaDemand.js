import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import { MdNavigateNext } from 'react-icons/md';
import Calendar from 'react-calendar';
import { GrLinkNext } from "react-icons/gr";
import { FaPerson } from "react-icons/fa6";
import { GrLinkPrevious } from "react-icons/gr";
import { useTranslation } from 'react-i18next';
import { getApiBase } from '../utils/apiBase';
import PaymentModal from "../components/PaymentModal"
import '../styles/visaDemand.css';

const countries = require('../dataSources/countries');

export default function VisaDemand() {
  const [users,setUsers]=useState([]);
  const { t,i18n } = useTranslation();
  const [user, setUser] = useState({ name: '', firstName: '', email: '', phone: '', gender: t('male'), birthdate: '', passportScan: '', customerPhoto: '', idCardScan: '', otherAttachements: '' });
  const isArabic = i18n.language.includes('ar'); 
  const [passportScans, setPassportScans] = useState([]);
  // Track auth state and user to avoid prompting signed-in users
  const [isAuth, setIsAuth] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  // If user clicks next while unauthenticated, remember to auto-continue after login
  const pendingNextRef = useRef(false);
  useEffect(() => {
    let cancelled = false;
  const load = async () => {
      try {
  const token = localStorage.getItem('clientToken');
        if(!token){ if(!cancelled){ setIsAuth(false); setAuthUser(null);} return false; }
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: 'Bearer ' + token, 'Accept':'application/json' }});
        if (!cancelled) {
          if (res.status === 200) {
            const data = await res.json().catch(() => null);
            setIsAuth(true);
            setAuthUser(data);
            return true;
          } else if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('clientToken');
            setIsAuth(false);
            setAuthUser(null);
            return false;
          } else {
            setIsAuth(false);
            setAuthUser(null);
            return false;
          }
        }
    return false;
      } catch (_) {
        if (!cancelled) {
          setIsAuth(false);
          setAuthUser(null);
        }
    return false;
      }
    };
  load();
  const onAuthChanged = async () => {
    const authed = await load();
      // If a next-step was pending and now authenticated, continue automatically
    if (!cancelled && pendingNextRef.current && authed) {
        pendingNextRef.current = false;
        proceedToStepThree();
      }
    };
    window.addEventListener('auth-changed', onAuthChanged);
    return () => { cancelled = true; window.removeEventListener('auth-changed', onAuthChanged); };
  }, []);

  const handleInputChange=async (field,event)=>{
    const newUser={...user};
    if (field == 'passportScan' || field == 'customerPhoto' || field == 'idCardScan' || field == 'otherAttachements') {
      const file = event.target.files[0];
      const base64 = await convertBase64(file) ;

      const updatedScans = [...passportScans];
      updatedScans[activePerson] = base64;
      setPassportScans(updatedScans);

      newUser[field] = updatedScans[activePerson];
      setUser(newUser);
    }else {
      newUser[field]=event.target.value;
      setUser(newUser);
    }
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const [activeStates, setActiveStates] = useState([
    'visaStepActive',
    'visaStepNotActive',
    'visaStepNotActive',
    'visaStepNotActive'
  ]);
  const [totalCost, setTotalCost] = useState(0);
  const [travelersVector, setTravelersVector] = useState([]);
  const [countriesCopy, setCountriesCopy] = useState(countries);
  const [activePerson,setActivePerson]=useState(0);
  const [missingDataAlert, setMissingDataAlert] = useState(false);
  const stepOne=useRef(null);
  const stepTwo=useRef(null);
  const stepThree=useRef(null);
  const stepFour=useRef(null);
  // Auth modal is mounted globally; we'll trigger it via a window event when needed
  const hasEmptyField=(obj)=> {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                return true;
            }
        }
    }
    return false;
}
  const HandleActivePersonPlus=()=>{
    if(checkIfAllUserDataIsFilled()) {
      setMissingDataAlert(false);
      if((activePerson + 1 ) <visaData.noOfTraverlers)
      {
        if(hasEmptyField(user))
        {
          document.getElementById("dataPassError").classList.remove("d-none")
        }
        else 
        {
          document.getElementById("dataPassError").classList.add("d-none")
          setActivePerson(activePerson+1);
          const NewUsersList=[...users,user] 
          setUsers(NewUsersList);
          setUser({
                name: '',
                firstName: '',
                email: '',
                phone: '',
                gender: t("male"),
                birthdate: '',
            passportScan: '',
            customerPhoto: '',
            idCardScan: '',
            otherAttachements: ''
              });
            document.getElementById('inputPassportScan').value = '';
            }
      }
      else if((activePerson + 1 )==visaData.noOfTraverlers)
      {
        const NewUsersList=[...users,user] 
        setUsers(NewUsersList);
        setActiveStates([
          'visaStepNotActive',
          'visaStepNotActive',
          'visaStepNotActive',
          'visaStepActive'
        ]);
        stepOne.current.classList.add("d-none");
        stepTwo.current.classList.add("d-none");
        stepThree.current.classList.add("d-none");
        stepFour.current.classList.remove("d-none");

      }
    } else {
      setMissingDataAlert(true);
    }
  };

  const checkIfAllUserDataIsFilled = () => {
    return user.name != '' &&
              user.firstName != '' &&
              user.email != '' &&
              user.phone != '' &&
              user.birthdate != '' &&
      user.passportScan != '' &&
      user.customerPhoto != '' &&
      user.idCardScan != ''
  }
  const HandleActivePersonMinus=()=>{
    if(checkIfAllUserDataIsFilled()) {
      if(activePerson>=1)
      {
        setMissingDataAlert(false);
        setActivePerson(activePerson-1);
        setUser(users[activePerson-1])
      }
    } else {
      setMissingDataAlert(true);
    }
      
  };
  const [visaData, setVisaData] = useState({
    country: '',
    visaType: '',
    visaDate: '',
    noOfTraverlers: 0
  });
  const changeVisaDate = event => {
    let date = new Date(event);
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var year = date.getFullYear();
    date = day + '-' + month + '-' + year;

    setVisaData({ ...visaData, visaDate: date });
  };
  const setTravelers = updateValue => {
    let noOfTraverlers = visaData.noOfTraverlers + updateValue;
    if (noOfTraverlers >= 0) {
      setVisaData({ ...visaData, noOfTraverlers });
    }
    let v=[];
    for(var i=0;i<noOfTraverlers;i++)
    {
      v.push(0);
    }

    setTravelersVector(v);
    calculateCost(noOfTraverlers);
  };
  const searchCountry = event => {
    const countryTranslations = {
      "المملكة المتحدة": "United Kingdom",
      "الجمهورية التشيكية": "Czech Republic",
      "فنلندا": "Finland",
      "النرويج": "Norway",
      "سويسرا": "Switzerland",
      "أيرلندا": "Ireland",
      "إيطاليا": "Italy",
      "فرنسا": "France",
      "إسبانيا": "Spain",
      "اليونان": "Greece",
      "تركيا": "Turkey",
      "ألمانيا": "Germany",
      "أرمينيا": "Armenia",
      "أستراليا": "Australia",
      "النمسا": "Austria",
      "أذربيجان": "Azerbaijan",
      "البوسنة والهرسك": "Bosnia and Herzegovina",
      "الصين": "China",
      "قبرص": "Cyprus",
      "الدانمارك": "Denmark",
      "مصر": "Egypt",
      "هنغاريا": "Hungary",
      "إندونيسيا": "Indonesia",
      "الهند": "India",
      "اليابان": "Japan",
      "كوريا الجنوبية": "South Korea",
      "ماليزيا": "Malaysia",
      "هولندا": "Netherlands",
      "نيوزيلندا": "New Zealand",
      "البرتغال": "Portugal",
      "روسيا": "Russia",
      "السويد": "Sweden",
      "سنغافورة": "Singapore",
      "فيتنام": "Vietnam"
    };
 
    const countryKeyWord=(countryTranslations[event.target.value] || event.target.value).toLowerCase();
    
    setCountriesCopy(
      countries.filter(country => {
        return (
          country.countryName
            .toLowerCase()
            .indexOf(countryKeyWord) != -1
        );
      })
    );
  };
  const calculateCost = (noOfTraverlers) => {
    const visaCost = countries.filter(element => {
      return element.countryName === visaData.country;
    });
    setTotalCost(visaCost[0].pricePerPerson *noOfTraverlers);
  };

  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{

      let obj = {
        demandType : 'Visa Demand',
        ...visaData
      }
  const token = localStorage.getItem('clientToken');
  const headers = { "Content-Type": "application/json" };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const response = await fetch("/api/demands/client-application", {
            method: "POST",
    headers,
            body: JSON.stringify(obj),
        });

        const responseData = await response.json();
        setShowAlert(true);
      setAlertMsg(responseData.message)
      resetFileInputs()
    } catch (error) {
        console.log(error)
        setShowAlert(true);
        setAlertMsg(error);
    }
  };

  const resetFileInputs = () => {
    const fileInputs = [
      'inputPassportScan',
      'inputCustomerPhoto',
      'inputIdCard',
      'otherAttachements'
    ];

    fileInputs.forEach(inputId => {
      const element = document.getElementById(inputId);
      if (element) {
        element.value = '';
      }
    });
  }

  const handleCloseAlert = () => {
    setShowAlert(false);
  }

  const handlePayment = async (event) => {
    try{

      let obj = {
        demandType : 'Visa demand',
        ...visaData,
        travelers : users,
        totalCost,

      }
  const token = localStorage.getItem('clientToken');
  const headers = { "Content-Type": "application/json" };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const response = await fetch("/api/demands/client-application", {
            method: "POST",
    headers,
            body: JSON.stringify(obj),
        });

        const responseData = await response.json();
        setShowAlert(true);
        setAlertMsg(responseData.message)
    } catch (error) {
        console.log(error)
        setShowAlert(true);
        setAlertMsg(error);
    }
  };

  // Extracted flow to step three so we can reuse after login
  const proceedToStepThree = () => {
    setActiveStates([
      'visaStepNotActive',
      'visaStepNotActive',
      'visaStepActive',
      'visaStepNotActive'
    ]);
    stepOne.current.classList.add('d-none');
    stepTwo.current.classList.add('d-none');
    stepThree.current.classList.remove('d-none');
  };

  return (
    <>
      <Navbar />
      <div className='visaContainer row d-flex justify-content-center h-100'>
        {isAuth ? (
          <div className='w-100 d-flex flex-column align-items-center mt-2 gap-2'>
            <Link to='/my-demands' className='btn btn-outline-primary btn-sm'>My Demands</Link>
          </div>
        ) : null}
        <div className='container VisaStepsContainer  d-flex flex-wrap p-2 px-0 '>
          <button
            className={
              'col-lg-3 col-md-6 col-sm-12 visaStep ' + activeStates[0]
            }
            onClick={() => {
              setActiveStates([
                'visaStepActive',
                'visaStepNotActive',
                'visaStepNotActive',
                'visaStepNotActive'
              ]);
              stepOne.current.classList.remove("d-none");
              stepTwo.current.classList.add("d-none");
              stepThree.current.classList.add("d-none");
            }}
          >
            <span>{t('step 1')} :</span> {t('selectCountryAndVisaType')}
          </button>
          <button
            className={
              'col-lg-3 col-md-6 col-sm-12 visaStep ' + activeStates[1]
            }
            onClick={() => {
              setActiveStates([
                'visaStepNotActive',
                'visaStepActive',
                'visaStepNotActive',
                'visaStepNotActive'
              ]);
              stepOne.current.classList.add("d-none");
              stepTwo.current.classList.remove("d-none");
              stepThree.current.classList.add("d-none");
            }}
          >
            <span>{t('step 2')}  :</span> {t('travelersDetails')}
          </button>
          <button
            className={
              'col-lg-3 col-md-6 col-sm-12 visaStep ' + activeStates[2]
            }
            onClick={() => {
              setActiveStates([
                'visaStepNotActive',
                'visaStepNotActive',
                'visaStepActive',
                'visaStepNotActive'
              ]);
              stepOne.current.classList.add("d-none");
              stepTwo.current.classList.add("d-none");
              stepThree.current.classList.remove("d-none");
            }}
          >
            <span>{t('step 3')} :</span> {t('passengerInformation')}
          </button>
          <button
            className={
              'col-lg-3 col-md-6 col-sm-12 visaStep ' + activeStates[3]
            }
            onClick={() => {
              setActiveStates([
                'visaStepNotActive',
                'visaStepNotActive',
                'visaStepNotActive',
                'visaStepActive'
              ]);
              stepOne.current.classList.add("d-none");
              stepTwo.current.classList.add("d-none");
              stepThree.current.classList.add("d-none");
              stepFour.current.classList.remove("d-none");
            }}
          >
            <span>{t('step 4')} :</span> {t('appointmentAndPayment')}
          </button>
        </div>
        { showAlert ? (
            <div className='row mt-5'>
              <span className='alert alert-success text-success h2'> {t(alertMsg)} </span>
            </div>

          ) : 
          <> </>
        }
        {missingDataAlert ? (<div className='row mt-5'>
              <span className='alert alert-error text-error h2'> {t("should fill all the data")} </span>
            </div>

          ) : 
          <> </>}
        <section className='stepOne d-flex justify-content-center' ref={stepOne}>
          <div className='visaStep1Container  col-lg-10 mt-2 p-0 bg-white py-2'>
            <h1 className='text-center fs-3'>
              {t('selectCountryAndVisaType')}
            </h1>
            <div className='container col-lg-10 col.sm-12 searchZone '>
              <input
                type='text'
                className='searchInput'
                placeholder={t('searchForCountry')}
                onChange={event => {
                  searchCountry(event);
                }}
              />
            </div>
            <div className='visaCountriesCountainer  mt-2 col-12 row-gap-2 column-gap-2 d-flex flex-wrap justify-content-center m-0 p-0'>
              {countriesCopy.map((country, index) => {
                return (
                  <div
                    key={index}
                    className='card countryVisaCard col-lg-3 col-md-4 col-sm-5 pb-2'
                  >
                    <img
                      src={require(`../images/countriesAMFlags/${country.path}`)}
                      className='card-img-top p-0 countryImageV'
                      alt='...'
                    />
                    <div className='card-footer countryNameOverlay'>
                      <span className='countryName'>{t(`${country.countryName}`)}</span>
                    </div>
                    <div className='card-footer d-flex justify-content-center'>
                      <div className='dropdown'>
                        <div className='choices card-footer'>{t('choicesHere')}</div>
                        <div className='dropdown'>
                          <button
                            className='btn btn-secondary dropdown-toggle startVisaButton'
                            type='button'
                            id='dropdownMenuButton'
                            data-bs-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                          >
                            {t('startVisaDemand')}
                          </button>
                          <div
                            className='dropdown-menu p-2 dropDownContainer   text-center'
                            id='dropdown'
                            aria-labelledby='dropdownMenuButton'
                          >
                            {country.visaTypes.map((type, index) => {
                              return (
                                <button
                                  key={index}
                                  className='btn btn-primary mt-2 visaTypeButton'
                                  onClick={() => {
                                    setVisaData({
                                      ...visaData,
                                      country: country.countryName,
                                      visaType: type
                                    });
                                    setActiveStates([
                                      'visaStepNotActive',
                                      'visaStepActive',
                                      'visaStepNotActive',
                                      'visaStepNotActive'
                                    ]);
                                    stepOne.current.classList.add("d-none");
                                    stepTwo.current.classList.remove("d-none");
                                    stepThree.current.classList.add("d-none");
                                  }}
                                >
                                  {t(`${type}`)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className='stepTwo d-none d-flex align-items-center flex-column' ref={stepTwo}>
          <div className='visaStep1Container col-lg-10 mt-2 p-0 bg-white py-2'>
            <h1 className='text-center fs-3'>
              {t('expectedTravelDate')}
            </h1>
            <div className='calendarContainer container-fluid p-2'>
              <Calendar
                className='calendar h-100 w-100'
                onChange={event => {
                  changeVisaDate(event);
                }}
                
              />
            </div>
            <h1 className='text-center mt-2'>{t('expectedTravelDate')} :</h1>
            <p className='travelDate text-center'>{visaData.visaDate}</p>
          </div>
          <div className='visaStep1Container col-lg-10 mt-2 p-0 bg-white py-2'>
            <h1 className='text-center fs-3'>
              {t('chooseNumberOfTravelers')}
            </h1>
            <div className='row p-2'>
              <div className=' visaDataContainer row d-flex justify-content-center m-0'>
                <div className='row travelersInfosContainer d-flex  m-0 align-items-center'>
                  <div className='col infoContainer'>{t('numberOfTravelers')}</div>
                  <div className='col d-flex m-0  infoContainer justify-content-around'>
                    <button className='btn btn-outline'>
                      <FaMinus
                        className='setTravelersButton'
                        onClick={() => {
                          setTravelers(-1);
                        }}
                      />
                    </button>
                    <p className='numberOfTrav m-0 p-0'>
                      {visaData.noOfTraverlers}
                    </p>
                    <button className='btn btn-outline'>
                      <FaPlus
                        className='setTravelersButton'
                        onClick={() => {
                          setTravelers(1);
                        }}
                      />
                    </button>
                  </div>
                  <div className='col infoContainer m-0 p-0 '>
                    <span className='cost mx-2'>
                      {' '}
                      {totalCost}{' '}
                    </span>{' '}
                    {t('Saudi Riyal')}
                  </div>
                </div>
                <div className='row travelersInfosContainer d-flex  m-0  align-items-center'>
                  <div className='col infoContainer'>{t('haveCoupon')}</div>
                  <div className='col  m-0 p-0 infoContainer couponContainer '>
                    <input
                      type='text'
                      name='couponValue'
                      id='couponValue'
                      placeholder={t('writeYourCoupon')}
                    />
                  </div>
                  <div className='col infoContainer m-0 '>
                    <button
                      className='btn btn-primary applyCouponBtn'
                      onClick={calculateCost}
                    >
                      {t('applyCoupon')}
                    </button>
                  </div>
                </div>
                <div className='row totalCost  m-0 p-2 text-center'>
                  <p className='totalCostHeader'>{t('totalCost')}</p>
                  <p className='travelDate text-center'>
                    {totalCost} {t('Saudi Riyal')}
                  </p>
                  <p className='alert alert-success text-success h2'>
                    {t('priceIncludes')}
                  </p>
                </div>
              </div>
            </div>
            <div className='container-fluid p-2 text-center r'>
              <button
                className='btn btn-primary p-2 submitBTN'
                onClick={async () => {
                  // If not authenticated, prompt login/register and stop
                  if (!isAuth) {
                    pendingNextRef.current = true;
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                    return;
                  }
                  // Authenticated: proceed to next step without prompting
                  proceedToStepThree();
                }}
              >
                {t('nextStep')} : {t('fillPassengerData')}{' '}
              </button>
            </div>
          </div>
        </section>
        {/* AuthEmailAndOtp is now mounted globally in App.js */}
        <section className='stepTwo d-none d-flex align-items-center flex-column' ref={stepThree}>
          <div className='visaStep1Container col-lg-10 mt-2 p-0 bg-white py-2'>
            <h1 className='text-center fs-3'>
              {t('fillPassengerData')}
            </h1>
            <div className="container-fluid d-flex column-gap-5 justify-content-center">
              {
              travelersVector.map((element,index)=>{
                if(index===activePerson){
                  return (
                    <FaPerson className="fs-1  personAvatar activePersonAvatar" key={'person' +index}></FaPerson>
                  )}
                else if (index<activePerson){
                  return (
                  <FaPerson className="fs-1  personAvatar donePersonAvatar" key={'person' +index}></FaPerson>
                )}
                else
                {
                  return (
                    <FaPerson className="fs-1  personAvatar " key={'person' +index}></FaPerson>
                  )
                }
               
              })
              }
            </div>
            <div className='calendarContainer container-fluid p-2'>
            <form>
      <div className="form-group mt-2">
    <label  className="alert alert-danger d-none" id='dataPassError'  htmlFor="inputName">{t('Passenger data error message')}</label>
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputName">{t('name')}</label>
    <input type="text" className="form-control" id="inputName" placeholder={t('enterYourName')} onChange={(event)=>{handleInputChange('name',event)}}  value={user['name']}/>
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputFirstName">{t('firstName')}</label>
    <input type="text" className="form-control" id="inputFirstName" placeholder={t('enterYourFirstName')} onChange={(event)=>{handleInputChange('firstName',event)}} value={user['firstName']} />
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputGender">{t('gender')}</label>
    <select className="form-control" id="inputGender" onChange={(event)=>{handleInputChange('gender',event)}} value={user['gender']}>
      <option selected value={t('male')}>{t('male')}</option>
      <option value={t('female')}>{t('female')}</option>
    </select>
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputEmail">{t('emailAddress')}</label>
    <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder={t('enterEmail')} value={user['email']} onChange={(event)=>{handleInputChange('email',event)}} />
    <small id="emailHelp" className="form-text text-muted">{t('weNeverShare')}</small>
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputPhoneNumber">{t('phoneNumber')}</label>
    <input type="text" className="form-control" id="inputPhoneNumber" placeholder={t('enterYourPhoneNumber')} value={user['phone']} onChange={(event)=>{handleInputChange('phone',event)}} />
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputDateOfBirth">{t('dateOfBirth')}</label>
    <input type="date" className="form-control" id="inputDateOfBirth" onChange={(event)=>{handleInputChange('birthdate',event)}} value={user['birthdate']}/>
  </div>
  <div className="form-group mt-2">
    <label  className="specialText" htmlFor="inputPassportScan">{t('passportScan')}</label>
    <br /> 
    <input type="file" className="form-control-file" id="inputPassportScan"  onChange={(event)=>{handleInputChange('passportScan',event)}}/>
                  {!user.passportScan && (<small id="passportScanHelp" className="form-text text-error">{t('uploadScan')}</small>)}
                </div>

                <div className="form-group mt-2">
                  <label className="specialText" htmlFor="inputCustomerPhoto">{t('customerPhoto')}</label>
                  <br />
                  <input
                    type="file"
                    className="form-control-file"
                    id="inputCustomerPhoto"
                    onChange={(event) => { handleInputChange('customerPhoto', event) }}
                  />
                  {!user.customerPhoto && (<small id="customerPhotoHelp" className="form-text text-error">{t('uploadCustomerPhoto')}</small>)}
                </div>

                <div className="form-group mt-2">
                  <label className="specialText" htmlFor="inputIdCard">{t('idCardScan')}</label>
                  <br />
                  <input
                    type="file"
                    className="form-control-file"
                    id="inputIdCard"
                    onChange={(event) => { handleInputChange('idCardScan', event) }}
                  />
                  {!user.idCardScan && (<small id="idCardHelp" className="form-text text-error">{t('uploadIdCard')}</small>)}


                </div>
                <div className="form-group mt-2">
                  <label className="specialText" htmlFor="otherAttachements">{t('otherAttachements')}</label>
                  <br />
                  <input
                    type="file"
                    className="form-control-file"
                    id="otherAttachements"
                    onChange={(event) => { handleInputChange('otherAttachements', event) }}
                  />
                </div>
  <div className="container-fluid d-flex justify-content-center column-gap-1">
  {! isArabic ? (
  <>
      <button type="button" className="btn nextPerson" onClick={HandleActivePersonMinus}><GrLinkPrevious className='mx-2'></GrLinkPrevious> {t('previousPerson')}</button>
    
    <button type="button" className="btn nextPerson"  onClick={HandleActivePersonPlus}>{t('nextPerson')}  <GrLinkNext className='mx-2'></GrLinkNext></button>
  </>
) : (
  <>
      <button type="button" className="btn nextPerson" onClick={HandleActivePersonMinus}>
      <GrLinkNext className='mx-2'></GrLinkNext> {t('previousPerson')}
    </button>
    <button type="button" className="btn nextPerson" onClick={HandleActivePersonPlus}>
    {t('nextPerson')} <GrLinkPrevious className='mx-2'></GrLinkPrevious> 
    </button>

  </>
)}

  </div>
</form>
            </div>
            </div>
            </section>
            <section className='stepFour  d-flex align-items-center flex-column d-none' ref={stepFour}>
            <div className='visaStep1Container  col-lg-10 mt-2 p-0 bg-white py-2'>
            <h1 className='text-center fs-3'>
            {t('SummaryOfYourDemand')}
              </h1>
              <div className="col-12 p-3 mt-2 visaInformationsContainer">
                <h1 className='specialText'>{t('travelersDetails')}</h1>
              
              <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">{t("applicantName")}</th>
      <th scope="col">{t("phoneNumber")}</th>
      <th scope="col">{t("emailAddress")}</th>
      <th scope="col">{t("gender")}</th>
    
    </tr>
  </thead>
  <tbody>
    {users.map((userInfo,index)=>{
      return (
        <tr key={index}>
      <td scope="col">{index+1}</td>
      <td scope="col">{userInfo.firstName+' '+userInfo.name}</td>
      <td scope="col">{userInfo.phone}</td>
      <td scope="col">{userInfo.email}</td>
      <td scope="col">{userInfo.gender}</td>
    </tr>
      )
    })}
   
  </tbody>
</table>
</div>
  <div className="col-12 p-3 mt-2 visaInformationsContainer">
  <h1 className='specialText'>{t('travelInformation')}</h1>
  <p className='fw-normal'>{t("travelCountry")}</p>
  <p className='specialText'>{t(visaData.country)}</p>
  <p className='fw-normal'>{t("numberOfTravelers")}</p>
  <p className='specialText'>{visaData.noOfTraverlers}</p>
  <p className='fw-normal'>{t("visaType")}</p>
  <p className='specialText'>{t(visaData.visaType)}</p>
  <p className='fw-normal'>{t("travelDate")}</p>
  <p className='specialText'>{visaData.visaDate}</p>
  <p className='fw-normal'>{t("Price")}</p>
  <p className='specialText'>{totalCost} {t('Saudi Riyal')}</p>
  </div>
    <div className='d-flex mt-2 justify-content-center'>
    <PaymentModal onPayment={handlePayment}/>
    </div>
              </div>
          </section>
      </div>
    </>
  );
}
