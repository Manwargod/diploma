import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Phone, MessageCircle, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../utils/authService';
import serviceCenters from '../data/serviceCenters';
import ConsentGate from '../components/ConsentGate';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{9,14}$/;

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithOtp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState(location.state?.mode || 'signin');
  const [role, setRole] = useState(location.state?.role || 'client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [centerId, setCenterId] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  React.useEffect(() => {
    if (role === 'provider' && mode === 'signup') {
      setMode('signin');
    }
  }, [role, mode]);

  const handleEmailAuth = async () => {
    setError('');
    if (mode === 'signup' && role === 'provider' && !centerId) {
      setError(t('validation.required'));
      return;
    }
    if (!emailRegex.test(email)) {
      setError(t('validation.email'));
      return;
    }
    if (!password || password.length < 8) {
      setError(t('validation.password'));
      return;
    }
    if (mode === 'signup' && role === 'client' && !consentChecked) {
      setError(t('validation.privacyConsent'));
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'signin') {
        await signIn({ email, password });
      } else {
        await signUp({ email, password, role, name: email.split('@')[0], centerId: role === 'provider' ? centerId : null });
      }
      navigate(role === 'provider' ? '/provider' : '/dashboard');
    } catch (err) {
      if (err.message === 'EMAIL_EXISTS') {
        setError(t('auth.errors.emailExists'));
      } else if (err.message === 'BACKEND_REQUIRED') {
        setError(t('auth.errors.backendRequired'));
      } else {
        setError(t('auth.errors.invalid'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    if (!phoneRegex.test(phone)) {
      setError(t('validation.phone'));
      return;
    }
    setIsLoading(true);
    try {
      await authService.sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      if (err.message === 'OTP_UNAVAILABLE' || err.message === 'BACKEND_REQUIRED') {
        setError(t('auth.errors.otpUnavailable'));
      } else {
        setError(t('auth.errors.otp'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    setError('');
    if (role === 'provider' && !centerId) {
      setError(t('validation.required'));
      return;
    }
    if (!phoneRegex.test(phone)) {
      setError(t('validation.phone'));
      return;
    }
    if (!otp) {
      setError(t('validation.required'));
      return;
    }
    setIsLoading(true);
    try {
      await signInWithOtp({ phone, otp, role, centerId: role === 'provider' ? centerId : null });
      navigate(role === 'provider' ? '/provider' : '/dashboard');
    } catch (err) {
      if (err.message === 'OTP_UNAVAILABLE' || err.message === 'BACKEND_REQUIRED') {
        setError(t('auth.errors.otpUnavailable'));
      } else {
        setError(t('auth.errors.otp'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    if (role === 'provider' && !centerId) {
      setError(t('validation.required'));
      return;
    }
    setIsLoading(true);
    try {
      await signInWithGoogle({ role, centerId: role === 'provider' ? centerId : null });
      navigate(role === 'provider' ? '/provider' : '/dashboard');
    } catch (err) {
      if (err.message === 'OAUTH_NOT_CONFIGURED') {
        setError(t('auth.errors.oauthUnavailable'));
      } else if (err.message === 'BACKEND_REQUIRED') {
        setError(t('auth.errors.backendRequired'));
      } else {
        setError(t('auth.errors.invalid'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="p-8 rounded-[2rem] border border-white/10 bg-surface">
              <h1 className="text-4xl font-black italic uppercase mb-3">
                {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
              </h1>
              <p className="text-muted mb-6">ServicePro.kz</p>
              <ul className="space-y-3 text-sm text-muted">
                <li>• {t('repair.title')}</li>
                <li>• {t('build.title')}</li>
                <li>• {t('market.title')}</li>
                <li>• {t('provider.title')}</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRole('client');
                  setCenterId('');
                }}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${role === 'client' ? 'bg-primary text-black' : 'bg-[var(--sp-surface-2)] border border-[var(--sp-border)]'}`}
              >
                {t('auth.roleClient')}
              </button>
              <button
                onClick={() => setRole('provider')}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${role === 'provider' ? 'bg-primary text-black' : 'bg-[var(--sp-surface-2)] border border-[var(--sp-border)]'}`}
              >
                {t('auth.roleProvider')}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('signin')}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${mode === 'signin' ? 'bg-primary text-black' : 'bg-[var(--sp-surface-2)] border border-[var(--sp-border)]'}`}
              >
                {t('auth.signIn')}
              </button>
              {role !== 'provider' && (
                <button
                  onClick={() => setMode('signup')}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${mode === 'signup' ? 'bg-primary text-black' : 'bg-[var(--sp-surface-2)] border border-[var(--sp-border)]'}`}
                >
                  {t('auth.signUp')}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-surface space-y-4">
              {role === 'provider' && (
                <div>
                  <label className="text-xs font-black uppercase text-muted">{t('provider.selectCenter')}</label>
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={centerId}
                      onChange={(e) => setCenterId(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    >
                      <option value="">{t('provider.chooseCenter')}</option>
                      {serviceCenters.map((center) => (
                        <option key={center.id} value={center.id}>{center.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-black uppercase text-muted">{t('auth.email')}</label>
                <div className="flex items-center gap-2 mt-2">
                  <Mail size={16} className="text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="email@servicepro.kz"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-muted">{t('auth.password')}</label>
                <div className="flex items-center gap-2 mt-2">
                  <Lock size={16} className="text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="********"
                  />
                </div>
              </div>
              <button
                onClick={handleEmailAuth}
                disabled={isLoading || (mode === 'signup' && role === 'client' && !consentChecked)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-black font-black uppercase sp-ripple"
              >
                {isLoading ? t('common.loading') : mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
              </button>
              {mode === 'signup' && role === 'client' && (
                <ConsentGate
                  checked={consentChecked}
                  onChange={setConsentChecked}
                  text={t('checkout.consent')}
                  policyLabel={t('common.privacyPolicy')}
                  policyUrl={process.env.REACT_APP_PRIVACY_POLICY_URL}
                  isDark={false}
                />
              )}
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-surface space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-muted">{t('auth.phone')}</label>
                <div className="flex items-center gap-2 mt-2">
                  <Phone size={16} className="text-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="+77001234567"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSendOtp}
                  className="flex-1 py-2 rounded-xl bg-[var(--sp-surface-2)] border border-[var(--sp-border)] font-black uppercase text-xs"
                >
                  {t('auth.sendCode')}
                </button>
                <div className="flex-1 flex items-center gap-2 px-3 rounded-xl bg-[var(--sp-surface-2)] border border-[var(--sp-border)]">
                  <MessageCircle size={16} className="text-muted" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent outline-none"
                    placeholder={t('auth.otp')}
                  />
                </div>
              </div>
              <button
                onClick={handleOtpLogin}
                disabled={isLoading || !otpSent}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-black font-black uppercase sp-ripple"
              >
                {isLoading ? t('common.loading') : t('auth.signIn')}
              </button>
            </div>

            <button
              onClick={handleGoogle}
              className="w-full py-3 rounded-xl border border-white/10 font-black uppercase text-sm flex items-center justify-center gap-2"
            >
              <Globe size={18} /> {t('auth.google')}
            </button>

            {error && (
              <div className="p-3 rounded-lg border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
