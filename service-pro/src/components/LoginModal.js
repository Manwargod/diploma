import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, LogIn, UserPlus } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, isDark, title = 'Login required' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 ${isDark ? 'bg-[#0f0f12] border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black italic uppercase">{title}</h3>
            <p className={`text-sm mt-2 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Please sign in to continue.
            </p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black uppercase flex items-center justify-center gap-2"
          >
            <LogIn size={16} /> {t('auth.signIn')}
          </button>
          <button
            onClick={() => navigate('/auth', { state: { mode: 'signup', role: 'client' } })}
            className={`w-full py-3 rounded-xl font-black uppercase flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
          >
            <UserPlus size={16} /> {t('auth.registerLink')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
