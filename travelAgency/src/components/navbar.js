import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiBase } from '../utils/apiBase';
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import LangSwitcher from './langSwitcher';
import avatar_en from "../images/logo_en.jpeg";
import avatar_ar from "../images/logo_ar.jpeg";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [activeList, setActiveList] = useState([false, false, false, false, false, false, false, false]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const path = location.pathname;
    const hash = location.hash;

    const newActiveList = [false, false, false, false, false, false, false, false];

    if (path === '/' && hash === '#landing') {
      newActiveList[0] = true;
    } else if (path === '/visaDemand') {
      newActiveList[1] = true;
    } else if (path === '/' && hash === '#blog') {
      newActiveList[2] = true;
    } else if (path === '/' && hash === '#destinations') {
      newActiveList[3] = true;
    } else if (path === '/contact') {
      newActiveList[4] = true;
    } else if (path === '/aboutUs') {
      newActiveList[5] = true;
    }

    setActiveList(newActiveList);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const setActive = (id) => {
    const newActiveList = activeList.map((item, index) => index === id);
    setActiveList(newActiveList);
  };

  const [pageData, setPageData] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [countdownWarn, setCountdownWarn] = useState(false);

  // Fetch page data on component mount
  useEffect(() => {
  const fetchData = async () => {
      try {
  const API_BASE = getApiBase();
  const response = await axios.get(`${API_BASE}/api/pages?slug=home`);
        setPageData(response.data);
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch session user and keep in sync when location or auth changes
  useEffect(() => {
    let cancelled = false;
    const loadUser = async () => {
      try {
    const token = localStorage.getItem('clientToken');
        if(!token){ if(!cancelled) setAuthUser(null); return; }
  const API_BASE = getApiBase();
  const res = await axios.get(`${API_BASE}/api/auth/me`, { headers:{ Authorization: 'Bearer ' + token }, validateStatus: () => true });
  console.log('[NAVBAR][me] status', res.status, 'ttl hdr', res.headers['x-token-ttl'], 'data', res.data);
        if (res.status === 200) {
          if (!cancelled) {
            setAuthUser(res.data);
            const ttl = res.headers['x-token-ttl'];
            if(ttl) setTokenExpiry(Date.now() + parseInt(ttl,10)*60*1000);
          }
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('clientToken');
          if (!cancelled) setAuthUser(null);
        } else if (!cancelled) {
          setAuthUser(null);
        }
      } catch (_) {
        if (!cancelled) setAuthUser(null);
      }
    };
    loadUser();
    const onAuthChanged = () => loadUser();
    window.addEventListener('auth-changed', onAuthChanged);
    return () => { cancelled = true; window.removeEventListener('auth-changed', onAuthChanged); };
  }, [location]);

  // Countdown + auto refresh (attempt refresh when < 3 minutes left once)
  useEffect(()=>{
    if(!tokenExpiry) return;
    const interval = setInterval(async ()=>{
      const remainingMs = tokenExpiry - Date.now();
      if(remainingMs <= 0){ // expired client side
        localStorage.removeItem('clientToken');
        setAuthUser(null); setTokenExpiry(null); setCountdownWarn(false);
        window.dispatchEvent(new Event('auth-changed'));
        return;
      }
      if(remainingMs < 5*60*1000) setCountdownWarn(true); else setCountdownWarn(false);
      if(remainingMs < 3*60*1000 && remainingMs > 2.5*60*1000){ // single refresh window
        const token = localStorage.getItem('clientToken');
        if(token){
          try {
            const API_BASE = getApiBase();
            const res = await axios.post(`${API_BASE}/api/auth/refresh`, {}, { headers:{ Authorization: 'Bearer '+token }, validateStatus: ()=>true });
            if(res.status===200 && res.data.token){
              localStorage.setItem('clientToken', res.data.token);
              const ttl = res.headers['x-token-ttl'] || res.data.expires_in_minutes;
              if(ttl) setTokenExpiry(Date.now() + parseInt(ttl,10)*60*1000);
              window.dispatchEvent(new Event('auth-changed'));
            } else if(res.status===401){
              localStorage.removeItem('clientToken'); setAuthUser(null); setTokenExpiry(null);
            }
          } catch(_){}
        }
      }
    }, 30*1000);
    return ()=>clearInterval(interval);
  }, [tokenExpiry]);

  const logout = async () => {
    try {
      const token = localStorage.getItem('clientToken');
  const API_BASE = getApiBase();
  if(token){ await axios.post(`${API_BASE}/api/auth/logout`, {}, { headers:{ Authorization: 'Bearer ' + token } }); }
    } catch (_) {}
    localStorage.removeItem('clientToken');
    setAuthUser(null);
  setTokenExpiry(null);
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <nav className="navbar navbar-expand-lg align-items-baseline p-2 m-0">
      <Link className="navbar-brand p-1" to="/">
       {/* <h1 className='specialText'> {t('title','Fast Travel')}</h1> */}
       <img className='specialText' src={isArabic ? avatar_ar : avatar_en} height="30" alt={t('title','Fast Travel')} />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={toggleMenu}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
  <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
        <ul className={`navbar-nav ${isMenuOpen ? 'd-block' : 'd-flex'} flex-row col mx-5 justify-content-center gap-4`} id='navbarNav'>
          <li className="nav-item mx-2" onClick={() => setActive(0)}>
            <Link className={"nav-link " + (activeList[0] ? "active" : "")} to="/#landing">
              {t('home', 'Home')}
            </Link>
          </li>
          <li className="nav-item mx-2" onClick={() => setActive(1)}>
            <Link className={"nav-link " + (activeList[1] ? "active" : "")} to="/visaDemand">
              {t('visa', 'Visa')}
            </Link>
          </li>
          <li className="nav-item mx-2" onClick={() => setActive(2)}>
            <Link className={"nav-link " + (activeList[2] ? "active" : "")} to="/#blog">
              {t('our blog', 'Our Blog')}
            </Link>
          </li>
          <li className="nav-item mx-2" onClick={() => setActive(3)}>
            <Link className={"nav-link " + (activeList[3] ? "active" : "")} to="/#destinations">
              {t('destinations', 'Destinations')}
            </Link>
          </li>
          <li className="nav-item mx-2" onClick={() => setActive(4)}>
            <Link className={"nav-link " + (activeList[4] ? "active" : "")} to="/contact">
              {t('contact us', 'Contact Us')}
            </Link>
          </li>
          <li className="nav-item mx-2" onClick={() => setActive(5)}>
            <Link className={"nav-link " + (activeList[5] ? "active" : "")} to="/aboutUs">
              {t('about_us')}
            </Link>
          </li>
        </ul>
        <LangSwitcher />
  {authUser ? (
          <div className="d-flex align-items-center gap-2 ms-3">
            <span className="text-muted small">{authUser.name || authUser.email}</span>
      {tokenExpiry && <span className={`badge ${countdownWarn? 'bg-danger':'bg-secondary'}`}>{Math.max(0, Math.floor((tokenExpiry-Date.now())/60000))}m</span>}
            <button className="btn btn-outline-secondary btn-sm" onClick={logout}>{t('logout','Logout')}</button>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2 ms-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }))}>
              {t('register', 'Register')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }))}>
              {t('sign_in', 'Sign In')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;