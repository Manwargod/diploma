import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { cancelOrder, listOrders } from '../utils/orderService';

const ORDER_STEPS = ['confirmed', 'processing', 'quality_check', 'delivered'];

const OrderDetail = ({ isDark }) => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const orders = await listOrders();
      const found = orders.find((o) => o.orderId === orderId);
      setOrder(found || null);
    };
    load();
  }, [orderId]);

  const activeIndex = useMemo(() => {
    if (!order?.status) return 0;
    const idx = ORDER_STEPS.indexOf(order.status);
    return idx === -1 ? 0 : idx;
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary font-black uppercase"
        >
          <ArrowLeft size={18} /> {t('common.back')}
        </button>
        <div className="p-6 rounded-2xl border border-white/10 bg-surface text-muted">
          {t('common.notFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-primary font-black uppercase"
      >
        <ArrowLeft size={18} /> {t('common.back')}
      </button>

      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/10' : 'bg-white border-black/10'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-muted font-black">{order.orderId}</p>
            <h2 className="text-3xl font-black italic uppercase">{t('dashboard.tracking')}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted uppercase">{t('dashboard.status')}</p>
            <p className="font-black text-primary">{order.status || 'confirmed'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {ORDER_STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${index <= activeIndex ? 'bg-primary' : isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              <span className="text-sm font-bold uppercase">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted uppercase">{t('checkout.delivery')}</p>
            <p className="font-bold">{order.delivery?.city} • {order.delivery?.address || t('checkout.pickup')}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase">{t('checkout.payment')}</p>
            <p className="font-bold">{order.payment?.method || '—'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {order.items?.map((item) => (
            <div key={`${order.orderId}-${item.id}`} className="flex justify-between text-xs">
              <span>{item.name} × {item.quantity}</span>
              <span>{item.price} ₸</span>
            </div>
          ))}
        </div>

        {order.status !== 'cancelled' && (
          <button
            onClick={async () => {
              await cancelOrder(order.orderId);
              setMessage(t('dashboard.orderCancelled'));
              setOrder((prev) => ({ ...prev, status: 'cancelled' }));
              setTimeout(() => setMessage(''), 2000);
            }}
            className="mt-6 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-black uppercase text-xs"
          >
            {t('dashboard.cancelOrder')}
          </button>
        )}

        {message && (
          <div className="mt-4 p-3 rounded-xl border border-emerald-500/30 text-emerald-400 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
