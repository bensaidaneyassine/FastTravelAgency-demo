import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import './authEmailAndOtp.css';
import { FaPhone } from 'react-icons/fa';
import { MdOutlineMail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { getApiBase } from '../utils/apiBase';
import GoogleSignInButton from './GoogleSignInButton';

const AuthEmailAndOtp = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState('login'); // login | register
  const [method, setMethod] = React.useState('email'); // email | phone
  const [login, setLogin] = React.useState({ email: '', phoneNumber: '', password: '' });
  const [reg, setReg] = React.useState({ name: '', phoneNumber: '', email: '', password: '' });
  const [showPassword, setShowPassword] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    const handler = (e) => {
      const m = e?.detail?.mode;
      if (m === 'register') setMode('register'); else if (m === 'login') setMode('login');
      setOpen(true);
    };
    window.addEventListener('open-auth-modal', handler);
    return () => window.removeEventListener('open-auth-modal', handler);
  }, []);

  const submitLogin = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (method==='email' && (!login.email || !login.password)) { setError(t('email_and_password_required','Email and password are required')); return; }
    if (method==='phone' && (!login.phoneNumber || !login.password)) { setError(t('phone_and_password_required','Phone number and password are required')); return; }
    try {
      const payload = method==='email' ? { email: login.email, password: login.password } : { phoneNumber: login.phoneNumber, password: login.password };
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(payload) });
      let rawText = '';
      try { rawText = await res.clone().text(); } catch(_){}
      let data = {};
      try { data = await res.json(); } catch(_) { data = {}; }
  console.log('[AUTH][login] status', res.status, 'headers X-Debug-JWT=', res.headers.get('X-Debug-JWT'), 'keys=', Object.keys(data||{}), 'bodyRawLen=', rawText.length);
      if(!res.ok){
        if(res.status===403) setError(t('forbidden_wrong_portal','This account must use the admin portal.'));
        else if(res.status===429) setError(t('too_many_attempts','Too many attempts. Please wait a minute.'));
        else setError(data.message || t('invalid_credentials','Invalid email or password'));
        return;
      }
      if(data && data.token){
  localStorage.setItem('clientToken', data.token);
  console.log('[AUTH][login] stored token len', data.token.length, 'API_BASE', API_BASE);
        setSuccess(t('login_success','Login successful'));
        try {
          const API_BASE2 = process.env.REACT_APP_API_BASE || 'http://localhost';
          await fetch(`${API_BASE2}/api/auth/me`, { headers:{ Authorization: 'Bearer '+data.token, 'Accept':'application/json' } });
        } catch(err){ console.warn('[AUTH][login] me fetch failed', err); }
      } else {
        console.warn('[AUTH][login] token missing in response JSON');
        setError(t('token_missing','Authentication token missing in response'));
      }
      window.dispatchEvent(new Event('auth-changed'));
      setTimeout(()=>{ setOpen(false); setSuccess(''); }, 400); // small delay to show success
    } catch { setError(t('network_error_try_again','Network error. Please try again.')); }
  };

  const submitRegister = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!reg.name || !reg.phoneNumber || !reg.email || !reg.password) { setError(t('all_fields_required','All fields are required')); return; }
    try {
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/auth/register`, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({ ...reg, password_confirmation: reg.password }) });
      let rawText = '';
      try { rawText = await res.clone().text(); } catch(_){}
      let data = {};
      try { data = await res.json(); } catch(_) { data = {}; }
  console.log('[AUTH][register] status', res.status, 'headers X-Debug-JWT=', res.headers.get('X-Debug-JWT'), 'keys=', Object.keys(data||{}), 'bodyRawLen=', rawText.length);
      if(!res.ok){
        if(res.status===422) setError(data.message || t('registration_failed','Registration failed'));
        else if(res.status===429) setError(t('too_many_attempts','Too many attempts. Please wait a minute.'));
        else setError(t('registration_failed','Registration failed'));
        return;
      }
      if(data && data.token){
  localStorage.setItem('clientToken', data.token);
  console.log('[AUTH][register] stored token len', data.token.length, 'API_BASE', API_BASE);
        setSuccess(t('registration_success','Registration successful'));
        try {
          const API_BASE2 = process.env.REACT_APP_API_BASE || 'http://localhost';
          await fetch(`${API_BASE2}/api/auth/me`, { headers:{ Authorization: 'Bearer '+data.token, 'Accept':'application/json' } });
        } catch(err){ console.warn('[AUTH][register] me fetch failed', err); }
      } else {
        console.warn('[AUTH][register] token missing in response JSON');
      }
      window.dispatchEvent(new Event('auth-changed'));
      setTimeout(()=>{ setOpen(false); setSuccess(''); }, 600);
    } catch { setError(t('network_error_try_again','Network error. Please try again.')); }
  };

  return (
    <div>
      <Button className='d-none' ref={ref} onClick={()=>setOpen(true)}>{t('open_modal','Open modal')}</Button>
      <Modal open={open} onClose={()=>setOpen(false)}>
        <Box className='modalBox'>
          <h1 className='text-center specialText fs-3'>{t('first_service_travel','First Service Travel')}</h1>
          <div className='d-flex justify-content-between flex-wrap mb-3'>
            <div className='mb-2'>
              <button type='button' className={`btn me-2 ${mode==='login'?'selected':'notSelected'}`} onClick={()=>setMode('login')}>{t('sign_in','Sign In')}</button>
              <button type='button' className={`btn ${mode==='register'?'selected':'notSelected'}`} onClick={()=>setMode('register')}>{t('register','Register')}</button>
            </div>
            <div className='mb-2'>
              <button type='button' className={`btn me-2 ${method==='email'?'selected':'notSelected'}`} onClick={()=>setMethod('email')}>{t('email_address','Email Address')}</button>
              <button type='button' className={`btn ${method==='phone'?'selected':'notSelected'}`} onClick={()=>setMethod('phone')}>{t('phone_number','Phone Number')}</button>
            </div>
          </div>
          {error && <div className='alert alert-danger py-1'>{error}</div>}
          {success && <div className='alert alert-success py-1'>{success}</div>}
          {mode==='login' && method==='email' && (
            <form onSubmit={submitLogin} className='mt-2'>
              <div className='input-group mb-3'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100'><MdOutlineMail/></span>
                </div>
                <input type='email' className='form-control h-75 rounded-1' placeholder={t('email_placeholder','your email address please ')} value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} />
              </div>
              <div className='input-group mb-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100'><MdOutlineMail/></span>
                </div>
                <input type={showPassword?'password':'text'} className='form-control h-75 rounded-1' placeholder={t('password_placeholder','your password here please ')} value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} />
              </div>
              <div className='form-check mb-2'>
                <input className='form-check-input' type='checkbox' id='showPassLogin' onChange={()=>setShowPassword(!showPassword)}/>
                <label className='form-check-label' htmlFor='showPassLogin'>{showPassword ? t('show_password','Show password') : t('hide_password','Hide password')}</label>
              </div>
              <button className='btn continueVia w-100' type='submit'>{t('sign_in','Sign In')}</button>
            </form>
          )}
          {mode==='login' && (
            <>
              <div className='text-center my-2 text-muted'>or</div>
              <GoogleSignInButton onSuccess={()=>{ setOpen(false); }} onError={(m)=>setError(String(m||'Google sign-in failed'))} />
            </>
          )}
          {mode==='login' && method==='phone' && (
            <form onSubmit={submitLogin} className='mt-2'>
              <div className='input-group mb-3'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100'><FaPhone/></span>
                </div>
                <input type='tel' className='form-control h-75 rounded-1' placeholder={t('phone_placeholder','your phone number please')} value={login.phoneNumber} onChange={e=>setLogin({...login,phoneNumber:e.target.value})} />
              </div>
              <div className='input-group mb-2'>
                <div className='input-group-prepend'>
                  <span className='input-group-text emailIcon h-100'><MdOutlineMail/></span>
                </div>
                <input type={showPassword?'password':'text'} className='form-control h-75 rounded-1' placeholder={t('password_placeholder','your password here please ')} value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} />
              </div>
              <div className='form-check mb-2'>
                <input className='form-check-input' type='checkbox' id='showPassLoginPhone' onChange={()=>setShowPassword(!showPassword)}/>
                <label className='form-check-label' htmlFor='showPassLoginPhone'>{showPassword ? t('show_password','Show password') : t('hide_password','Hide password')}</label>
              </div>
              <button className='btn continueVia w-100' type='submit'>{t('sign_in','Sign In')}</button>
            </form>
          )}
          {mode==='register' && (
            <form onSubmit={submitRegister} className='mt-2'>
              <div className='input-group mb-2'>
                <div className='input-group-prepend'><span className='input-group-text emailIcon h-100'><MdOutlineMail/></span></div>
                <input type='text' className='form-control h-75 rounded-1' placeholder={t('name_placeholder','your full name')} value={reg.name} onChange={e=>setReg({...reg,name:e.target.value})} />
              </div>
              <div className='input-group mb-2'>
                <div className='input-group-prepend'><span className='input-group-text emailIcon h-100'><FaPhone/></span></div>
                <input type='tel' className='form-control h-75 rounded-1' placeholder={t('phone_placeholder','your phone number please')} value={reg.phoneNumber} onChange={e=>setReg({...reg,phoneNumber:e.target.value})} />
              </div>
              <div className='input-group mb-2'>
                <div className='input-group-prepend'><span className='input-group-text emailIcon h-100'><MdOutlineMail/></span></div>
                <input type='email' className='form-control h-75 rounded-1' placeholder={t('email_placeholder','your email address please ')} value={reg.email} onChange={e=>setReg({...reg,email:e.target.value})} />
              </div>
              <div className='input-group mb-2'>
                <div className='input-group-prepend'><span className='input-group-text emailIcon h-100'><MdOutlineMail/></span></div>
                <input type={showPassword?'password':'text'} className='form-control h-75 rounded-1' placeholder={t('password_placeholder','your password here please ')} value={reg.password} onChange={e=>setReg({...reg,password:e.target.value})} />
              </div>
              <div className='form-check mb-2'>
                <input className='form-check-input' type='checkbox' id='showPassReg' onChange={()=>setShowPassword(!showPassword)}/>
                <label className='form-check-label' htmlFor='showPassReg'>{showPassword ? t('show_password','Show password') : t('hide_password','Hide password')}</label>
              </div>
              <button className='btn continueVia w-100' type='submit'>{t('create_account','Create Account')}</button>
              <button type='button' className='btn btn-link w-100 mt-2' onClick={()=>setMode('login')}>{t('back_to_login','Back to login')}</button>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
});

export default AuthEmailAndOtp;
