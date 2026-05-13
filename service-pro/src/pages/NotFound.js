import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <h1 className="text-5xl font-black italic uppercase">404</h1>
      <p className="mt-4 text-muted">{t('common.notFound')}</p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 rounded-xl bg-primary text-black font-black uppercase"
      >
        {t('common.home')}
      </Link>
    </div>
  );
};

export default NotFound;
