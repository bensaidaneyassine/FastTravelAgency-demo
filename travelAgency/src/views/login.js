import React, { useState } from 'react';
import { getApiBase } from '../utils/apiBase';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css';
import userImage from "../images/fingerprint.webp";
import { useTranslation } from 'react-i18next';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function Login() {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [isRegister,setIsRegister] = useState(false);
  const [error,setError] = useState('');

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const userConnect = async (event) => {
    event.preventDefault();
    setError('');
    if(isRegister){
      if(!user.name || !user.phoneNumber || !user.email || !user.password){
        setError(t('all_fields_required','All fields are required'));
        return;
      }
    } else {
      if(!user.email || !user.password){
        setError(t('email_and_password_required','Email and password are required'));
        return;
      }
    }
  const API_BASE = getApiBase();
  const endpoint = isRegister ? `${API_BASE}/api/auth/register` : `${API_BASE}/api/auth/login`;
    try {
      const res = await fetch(endpoint, {
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(isRegister ? { name:user.name, phoneNumber:user.phoneNumber, email:user.email, password:user.password, password_confirmation:user.password } : { email:user.email, password:user.password })
      });
      const data = await res.json().catch(()=>({message:'error'}));
      if(!res.ok){
        setError(data.message || t('operation_failed','Operation failed'));
        return;
      }
      if(data.token){ localStorage.setItem('clientToken', data.token); }
      window.dispatchEvent(new Event('auth-changed'));
      window.location.href = '/';
    } catch(e){
      setError(t('network_error_try_again','Network error. Please try again.'));
    }
  };

  return (
    <div className='formContainer m-0 p-0'>
      <div className='container-fluid d-flex justify-content-center form'>
        <form className='col-6'>
          <div className='avatar' style={{ backgroundImage: `url(${userImage})` }}>
          </div>
          { isRegister && (
            <div className='mb-3'>
              <label htmlFor='nameInput' className='form-label'>
                {t('Name','Name')}
              </label>
              <input
                type='text'
                className='form-control'
                id='nameInput'
                placeholder={t('Enter your name','Enter your name')}
                onChange={(e)=>handleInputChange('name', e.target.value)}
              />
            </div>
          ) }
          { isRegister && (
            <div className='mb-3'>
              <label htmlFor='phoneInput' className='form-label'>
                {t('Phone','Phone')}
              </label>
              <input
                type='tel'
                className='form-control'
                id='phoneInput'
                placeholder={t('Enter your phone number','Enter your phone number')}
                onChange={(e)=>handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
          ) }
          <div className='mb-3'>
            <label htmlFor='emailInput' className='form-label'>
              {t('Email address', 'Email address')}
            </label>
            <input
              type='email'
              className='form-control'
              id='emailInput'
              aria-describedby='emailHelp'
              placeholder={t('Enter your email', 'Enter your email')}
              onChange={(event) => { handleInputChange('email', event.target.value) }}
            />
            <div id='emailHelp' className='form-text'>
              {t("We'll never share your email with anyone else.", "We'll never share your email with anyone else.")}
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor='passwordInput' className='form-label'>
              {t('Password', 'Password')}
            </label>
            <input
              type='password'
              className='form-control'
              id='passwordInput'
              placeholder={t('Enter your password', 'Enter your password')}
              onChange={(event) => { handleInputChange('password', event.target.value) }}
            />
          </div>
          <div className="d-flex justify-content-between">
            <div className='mb-3 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='exampleCheck1'
              />
              <label className='form-check-label' htmlFor='exampleCheck1'>
                {t('Check me out', 'Check me out')}
              </label>
            </div>
            <div className='mb-3 form-check'>
              <label className='form-check-label fw-semibold specialText' htmlFor=''>
                {t('Forgot Password ?', 'Forgot Password ?')}
              </label>
            </div>
          </div>
          { error && <div className='alert alert-danger py-1'>{error}</div> }
          <button type='submit' className='btn btn-primary submitBTN' onClick={(event) => { userConnect(event) }}>
            { isRegister ? t('Register','Register') : t('Sign In', 'Sign In') }
          </button>
          { !isRegister && (
            <>
              <div className='text-center my-2 text-muted'>or</div>
              <GoogleSignInButton onSuccess={()=>{ window.location.href = '/'; }} onError={(m)=>setError(String(m||'Google sign-in failed'))} />
            </>
          ) }
          { !isRegister ? (
            <p>{t('Not registered yet ?', 'Not registered yet ?')} <span role='button' onClick={()=>setIsRegister(true)} className='fw-semibold specialText'> {t('Create account', 'Create account')}</span> </p>
          ) : (
            <p>{t('Already have account','Already have an account?')} <span role='button' onClick={()=>setIsRegister(false)} className='fw-semibold specialText'> {t('Sign In','Sign In')}</span> </p>
          ) }
        </form>
      </div>
    </div>
  )
}
