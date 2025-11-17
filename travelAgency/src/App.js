import './App.css'; // Main CSS file
import { BrowserRouter ,Routes,Route ,} from 'react-router-dom';
import MainRouters from "./routes/mainRouters/mainRouters.js"
import AuthEmailAndOtp from './components/authEmailAndOtp';
import { useEffect } from 'react';
import { withTranslation,useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

function App() {
  const { t, i18n } = useTranslation();
  const storedLanguage = Cookies.get('language') || 'ar';
  // initilize AR 
  useEffect(() => {
    i18n.changeLanguage(storedLanguage);
  }, []);
  

  const isArabic = storedLanguage === 'ar';
  const applyRTLStyles = () => {
    if (isArabic) {
      document.body.classList.add('rtl-body');
    } else {
      document.body.classList.remove('rtl-body');
    }
  };

  useEffect(() => {
    applyRTLStyles();
  }, [isArabic]);

  return (
    <>
  <BrowserRouter basename="/">
        <MainRouters className={isArabic ? 'rtl-container' : 'ltr-container'}></MainRouters>
  {/* Mount the auth modal globally so Navbar buttons can open it anywhere */}
  <AuthEmailAndOtp />
  </BrowserRouter>
 
   </>
  );
}

export default withTranslation()(App);
