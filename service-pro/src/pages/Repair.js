import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, MapPin, MapPinCheck, UploadCloud, Image, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import serviceCenters from '../data/serviceCenters';
import { createRepairRequest, storeWarranty } from '../utils/requestService';
import generateWarrantyPdf from '../utils/warrantyPdf';
import ServiceCenterModal from '../components/ServiceCenterModal';
import LoginModal from '../components/LoginModal';
import profileService from '../utils/profileService';
import ConsentGate from '../components/ConsentGate';

const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

const Repair = ({ isDark }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    device: 'smartphone',
    issue: '',
    serviceCenter: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [warrantyUrl, setWarrantyUrl] = useState('');
  const [requestId, setRequestId] = useState('');
  const [serviceCenterOpen, setServiceCenterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (files) => {
    const list = Array.from(files || []);
    const totalSize = list.reduce((sum, file) => sum + file.size, 0) + uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      setError(t('validation.fileSize'));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    const invalid = list.find((file) => !validTypes.includes(file.type));
    if (invalid) {
      setError(t('validation.fileType'));
      return;
    }

    const mapped = list.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: URL.createObjectURL(file)
    }));

    setUploadedFiles((prev) => [...prev, ...mapped]);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!user) {
      setLoginOpen(true);
      return;
    }
    if (step === 1) {
      if (!formData.phone || !/^\+?[1-9]\d{9,14}$/.test(formData.phone)) {
        setError(t('validation.phone'));
        return;
      }
      if (!formData.address) {
        setError(t('validation.required'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.issue) {
        setError(t('validation.required'));
        return;
      }
      setStep(3);
    } else {
      if (!formData.serviceCenter) {
        setError(t('validation.required'));
        return;
      }
      const serviceCenter = serviceCenters.find((sc) => sc.id === formData.serviceCenter);
      try {
        profileService.mergeProfileFromSubmission(user?.id, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        });
        const request = await createRepairRequest({
          clientId: user?.id || 'guest',
          clientName: formData.name,
          clientPhone: formData.phone,
          address: formData.address,
          device: formData.device,
          issue: formData.issue,
          serviceCenter,
          uploads: uploadedFiles.map((file) => ({
            name: file.name,
            type: file.type,
            preview: file.preview
          }))
        });

        const trackingUrl = `${window.location.origin}/dashboard?request=${request.id}`;
        const pdf = await generateWarrantyPdf({
          requestId: request.id,
          clientName: formData.name,
          device: formData.device,
          serviceCenter: serviceCenter?.name,
          date: new Date().toLocaleDateString(),
          trackingUrl
        });
        const pdfBlob = pdf.output('blob');
        const downloadUrl = URL.createObjectURL(pdfBlob);
        setWarrantyUrl(downloadUrl);
        setRequestId(request.id);
        await storeWarranty({
          requestId: request.id,
          clientName: formData.name,
          device: formData.device,
          downloadUrl
        });
        setSubmitted(true);
      } catch (err) {
        setError('Request failed. Please retry.');
      }
    }
  };

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
          <MapPinCheck size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black italic uppercase">{t('repair.requestAccepted')}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{t('repair.successMessage')}</p>
        <p className="text-lg font-black text-primary">{t('repair.requestId')}: {requestId}</p>
        {warrantyUrl && (
          <a href={warrantyUrl} download className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-black uppercase">
            {t('repair.warrantyPdf')}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-2xl flex items-center justify-center">
            <Smartphone size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t('repair.title')}</h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-black uppercase opacity-60">
          <span>{t('repair.step')} {step} {t('repair.of')} 3</span>
          <span>{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff] transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      {/* Form */}
      <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-6`}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase">{t('repair.contacts')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase opacity-60">{t('repair.name')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase opacity-60">{t('repair.phone')} *</label>
                <input type="tel" name="phone" placeholder="+7 (777) 123-45-67" value={formData.phone} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t('repair.address')} *</label>
              <input type="text" name="address" placeholder="Almaty, Abai 42" value={formData.address} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all" />
            </div>
          </div>
        )}

        {/* Step 2: Device & Issue */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase">{t('repair.issue')}</h3>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t('repair.deviceType')}</label>
              <select name="device" value={formData.device} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all">
                <option value="smartphone">{t('repair.devices.smartphone')}</option>
                <option value="laptop">{t('repair.devices.laptop')}</option>
                <option value="tablet">{t('repair.devices.tablet')}</option>
                <option value="watch">{t('repair.devices.watch')}</option>
                <option value="other">{t('repair.devices.other')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t('repair.issue')} *</label>
              <textarea name="issue" placeholder="Describe the issue in detail" value={formData.issue} onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value.slice(0, 500) }))} rows="4" className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all resize-none" />
              <p className="text-xs text-muted text-right">{formData.issue.length}/500</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase opacity-60">{t('repair.upload')}</label>
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-3 text-muted">
                  <UploadCloud size={18} />
                  <span className="text-xs">{t('repair.uploadHint')}</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="mt-3"
                />
              </div>
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="rounded-xl border border-white/10 overflow-hidden">
                      {file.type.startsWith('video') ? (
                        <video src={file.preview} controls className="w-full h-28 object-cover" />
                      ) : (
                        <img src={file.preview} alt={file.name} className="w-full h-28 object-cover" />
                      )}
                      <div className="p-2 text-xs text-muted flex items-center gap-2">
                        {file.type.startsWith('video') ? <Video size={12} /> : <Image size={12} />}
                        <span className="truncate">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Service Center */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase">{t('repair.serviceCenter')}</h3>
            {formData.serviceCenter ? (
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-[#00f2ff]/10' : 'bg-[#00f2ff]/20'}`}>
                    <MapPin size={18} className="text-[#00f2ff]" />
                  </div>
                  <div>
                    <h4 className="font-black">{serviceCenters.find((sc) => sc.id === formData.serviceCenter)?.name}</h4>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {serviceCenters.find((sc) => sc.id === formData.serviceCenter)?.address}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-sm ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-black/10 text-black/60'}`}>
                {t('validation.required')}
              </div>
            )}
            <button
              onClick={() => setServiceCenterOpen(true)}
              className="w-full py-3 rounded-xl font-black uppercase bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black"
            >
              {t('repair.serviceCenter')}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-center">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-black uppercase text-sm hover:border-white/30 transition-all">
            {t('common.back')}
          </button>
        )}
        <button onClick={handleSubmit} disabled={step === 3 && !consentChecked} className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-xl uppercase text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {step === 3 ? t('repair.submitRequest') : t('common.continue')}
        </button>
      </div>
      {step === 3 && (
        <ConsentGate
          checked={consentChecked}
          onChange={setConsentChecked}
          text={t('checkout.consent')}
          policyLabel={t('common.privacyPolicy')}
          policyUrl={process.env.REACT_APP_PRIVACY_POLICY_URL}
          isDark={isDark}
        />
      )}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      <ServiceCenterModal
        isOpen={serviceCenterOpen}
        onClose={() => setServiceCenterOpen(false)}
        onConfirm={(centerId) => {
          setFormData((prev) => ({ ...prev, serviceCenter: centerId }));
          setServiceCenterOpen(false);
        }}
        centers={serviceCenters}
        initialCenterId={formData.serviceCenter}
        isDark={isDark}
        title={t('repair.serviceCenter')}
        confirmLabel={t('common.confirmSelection')}
        nearestLabel={t('common.nearestToYou')}
        selectLabel={t('common.select')}
        distanceLabel={t('common.kmAway')}
      />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        isDark={isDark}
        title={t('auth.signIn')}
      />
    </div>
  );
};

export default Repair;