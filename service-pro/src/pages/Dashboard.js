import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listClientRequests } from '../utils/requestService';
import { cancelOrder, listOrders } from '../utils/orderService';
import { listBuilds } from '../utils/buildService';
import profileService from '../utils/profileService';

const Dashboard = ({ isDark }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('repairs');
  const [orders, setOrders] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderMessage, setOrderMessage] = useState('');
  const [profile, setProfile] = useState(() => profileService.getProfile(user?.id) || { name: user?.name || '', phone: user?.phone || '', address: '' });

  useEffect(() => {
    setProfile(profileService.getProfile(user?.id) || { name: user?.name || '', phone: user?.phone || '', address: '' });
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [ordersData, buildsData, repairsData] = await Promise.all([
          listOrders(user?.id),
          listBuilds(user?.id),
          listClientRequests(user?.id || 'guest')
        ]);
        if (!isMounted) return;
        setOrders(ordersData || []);
        setBuilds(buildsData || []);
        setRepairs(repairsData || []);
      } catch (error) {
        if (!isMounted) return;
        setOrders([]);
        setBuilds([]);
        setRepairs([]);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const bonusBalance = null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter">{t('dashboard.title')}</h2>
      </div>

      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-black italic uppercase">{t('dashboard.profileTitle')}</h3>
          <Zap size={20} className={isDark ? 'text-[#00f2ff]' : 'text-cyan-600'} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input value={profile.name || ''} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder={t('dashboard.profileName')} className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`} />
          <input value={profile.phone || ''} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} placeholder={t('dashboard.profilePhone')} className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`} />
          <input value={profile.address || ''} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} placeholder={t('dashboard.profileAddress')} className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`} />
        </div>
        <button
          onClick={() => {
            const saved = profileService.saveProfile(user?.id, profile);
            setProfile(saved || profile);
          }}
          className="px-4 py-3 rounded-xl bg-primary text-black font-black uppercase text-xs"
        >
          {t('common.save')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'purchases', label: t('dashboard.tabs.purchases') },
          { id: 'builds', label: t('dashboard.tabs.builds') },
          { id: 'repairs', label: t('dashboard.tabs.repairs') }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${activeTab === tab.id ? 'bg-primary text-black' : 'bg-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Section */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted font-black">{order.orderId}</p>
                  <h4 className="text-lg font-black">{order.items?.length} items</h4>
                  <p className="text-xs text-muted">{t('dashboard.status')}: {order.status || 'confirmed'}</p>
                </div>
                <div className="text-right space-y-2">
                  <span className="text-primary font-black block">{order.total} ₸</span>
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="text-xs font-black uppercase text-primary"
                    >
                      {t('dashboard.tracking')}
                    </button>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                      className="text-xs font-black uppercase"
                    >
                      {expandedOrder === order.orderId ? t('common.close') : t('dashboard.details')}
                    </button>
                  </div>
                </div>
              </div>
              {expandedOrder === order.orderId && (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted uppercase">{t('checkout.delivery')}</p>
                      <p className="font-bold">{order.delivery?.city} • {order.delivery?.address || t('checkout.pickup')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase">{t('checkout.payment')}</p>
                      <p className="font-bold">{order.payment?.method || '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
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
                        setOrderMessage(t('dashboard.orderCancelled'));
                        const fresh = await listOrders(user?.id);
                        setOrders(fresh || []);
                        setTimeout(() => setOrderMessage(''), 2000);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-black uppercase text-xs"
                    >
                      {t('dashboard.cancelOrder')}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {orderMessage && (
            <div className="p-3 rounded-xl border border-emerald-500/30 text-emerald-400 text-sm">
              {orderMessage}
            </div>
          )}
          {orders.length === 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-surface text-muted">{t('market.noProducts')}</div>
          )}
        </div>
      )}

      {activeTab === 'builds' && (
        <div className="space-y-6">
          {builds.map((build) => (
            <div key={build.id} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted font-black">{build.id}</p>
                  <h4 className="text-lg font-black">{build.purpose}</h4>
                  <p className="text-xs text-muted">{build.cpu} / {build.gpu}</p>
                </div>
                <span className="text-primary font-black">{build.status}</span>
              </div>
            </div>
          ))}
          {builds.length === 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-surface text-muted">{t('common.comingSoon')}</div>
          )}
        </div>
      )}

      {activeTab === 'repairs' && (
        <div className="space-y-6">
          {repairs.map((request) => (
            <div key={request.id} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-muted font-black">{request.id}</p>
                  <h4 className="text-lg font-black">{request.device}</h4>
                  <p className="text-xs text-muted">{request.issue}</p>
                </div>
                <span className="text-primary font-black">{t(`status.${request.status}`)}</span>
              </div>

              <div className="mt-6">
                <h5 className="text-sm font-black uppercase text-muted mb-3">{t('dashboard.requestTimeline')}</h5>
                <div className="space-y-4 relative pl-5">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10"></div>
                  {request.timeline.map((step) => (
                    <div key={step.timestamp} className="relative pl-4">
                      <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                      <p className="font-black uppercase text-sm leading-6">{t(`status.${step.status}`)}</p>
                      {step.label && <p className="text-xs font-bold">{step.label}</p>}
                      <p className="text-xs text-muted">{new Date(step.timestamp).toLocaleString()}</p>
                      {step.media?.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {step.media.map((media) => (
                            <div key={media.id} className="rounded-lg overflow-hidden border border-white/10">
                              {media.type?.startsWith('video') ? (
                                <video src={media.url} controls className="w-full h-24 object-cover" />
                              ) : (
                                <img src={media.url} alt={media.name} className="w-full h-24 object-cover" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {repairs.length === 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-surface text-muted">{t('common.comingSoon')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;