import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { listProviderRequests, updateRepairStatus, addRepairMedia, listWarranties } from '../utils/requestService';
import { Image, UploadCloud, ShoppingBag } from 'lucide-react';
import serviceCenters from '../data/serviceCenters';
import authService from '../utils/authService';
import { createProduct, listProducts } from '../utils/productService';
import productsData from '../data/products';
import { listCenterInventory, upsertCenterInventory } from '../utils/inventoryService';

const STATUS_OPTIONS = [
  { value: 'received' },
  { value: 'diagnosed' },
  { value: 'in_repair' },
  { value: 'quality_check' },
  { value: 'ready' },
  { value: 'delivered' }
];

const ProviderDashboard = ({ isDark }) => {
  const { t } = useTranslation();
  const { user, updateSession } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [requests, setRequests] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [centerId, setCenterId] = useState(user?.centerId || '');
  const [centerError, setCenterError] = useState('');
  const [savingCenter, setSavingCenter] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'components',
    price: '',
    specs: '',
    description: '',
    centerId: '',
    quantity: '0'
  });
  const [productStatus, setProductStatus] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inventoryCatalog, setInventoryCatalog] = useState([]);
  const [inventoryRows, setInventoryRows] = useState({});
  const [inventoryBaselineRows, setInventoryBaselineRows] = useState({});
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventorySavingId, setInventorySavingId] = useState('');
  const [inventoryStatus, setInventoryStatus] = useState('');
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryImages, setInventoryImages] = useState([]);

  const INVENTORY_PAGE_SIZE = 8;

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [requestsData, warrantiesData] = await Promise.all([
          listProviderRequests(user?.centerId || 'almaty'),
          listWarranties()
        ]);
        if (!isMounted) return;
        setRequests(requestsData || []);
        setWarranties(warrantiesData || []);
      } catch (error) {
        if (!isMounted) return;
        setRequests([]);
        setWarranties([]);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user?.centerId, refreshKey]);

  useEffect(() => {
    if (activeTab !== 'inventory' || !user?.centerId) return;
    let mounted = true;

    const loadInventory = async () => {
      setInventoryLoading(true);
      setInventoryStatus('');
      try {
        const [apiProducts, centerInventory] = await Promise.all([
          listProducts().catch(() => []),
          listCenterInventory(user.centerId).catch(() => [])
        ]);

        if (!mounted) return;

        const mergedMap = new Map();
        [...productsData, ...(apiProducts || [])].forEach((product) => {
          if (!product?.id) return;
          mergedMap.set(String(product.id), product);
        });

        setInventoryCatalog(Array.from(mergedMap.values()));

        const rowMap = {};
        (centerInventory || []).forEach((row) => {
          rowMap[String(row.product_id)] = {
            is_available: Boolean(row.is_available),
            quantity: Number(row.quantity) || 0,
            price: Number(row.price) || 0
          };
        });
        setInventoryRows(rowMap);
        setInventoryBaselineRows(rowMap);
        setInventoryPage(1);
      } catch (error) {
        if (!mounted) return;
        setInventoryCatalog([]);
        setInventoryRows({});
        setInventoryBaselineRows({});
      } finally {
        if (mounted) setInventoryLoading(false);
      }
    };

    loadInventory();
    return () => {
      mounted = false;
    };
  }, [activeTab, user?.centerId]);

  const filteredRequests = requests.filter((req) => {
    if (!search) return true;
    return (
      req.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      req.device?.toLowerCase().includes(search.toLowerCase()) ||
      req.id?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredByStatus = statusFilter === 'all'
    ? filteredRequests
    : filteredRequests.filter((req) => req.status === statusFilter);

  const filteredWarranties = search
    ? warranties.filter((w) =>
        `${w.clientName} ${w.device} ${w.requestId}`.toLowerCase().includes(search.toLowerCase())
      )
    : warranties;

  const filteredInventory = inventoryCatalog.filter((product) => {
    if (!inventorySearch) return true;
    return product.name?.toLowerCase().includes(inventorySearch.toLowerCase());
  });

  const totalInventoryPages = Math.max(1, Math.ceil(filteredInventory.length / INVENTORY_PAGE_SIZE));
  const visibleInventory = filteredInventory.slice((inventoryPage - 1) * INVENTORY_PAGE_SIZE, inventoryPage * INVENTORY_PAGE_SIZE);

  const updateInventoryDraft = (productId, patch) => {
    const key = String(productId);
    setInventoryRows((prev) => {
      const current = prev[key] || { is_available: false, quantity: 0, price: 0 };
      return {
        ...prev,
        [key]: {
          ...current,
          ...patch
        }
      };
    });
  };

  const isInventoryDirty = (productId) => {
    const key = String(productId);
    const current = inventoryRows[key] || { is_available: false, quantity: 0, price: 0 };
    const baseline = inventoryBaselineRows[key] || { is_available: false, quantity: 0, price: 0 };
    return current.is_available !== baseline.is_available
      || String(current.quantity) !== String(baseline.quantity)
      || String(current.price) !== String(baseline.price);
  };

  const normalizeNumberString = (value, maxDigits) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, maxDigits);

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleAutoFillProduct = () => {
    const query = productForm.name.trim().toLowerCase();
    if (!query) return;
    const match = [...productsData].find((product) => product.name.toLowerCase().includes(query) || query.includes(product.name.toLowerCase()));
    if (!match) return;
    setProductForm((prev) => ({
      ...prev,
      specs: match.specs?.slice(0, 300) || prev.specs,
      description: match.description?.slice(0, 500) || prev.description,
      price: String(match.price || prev.price || '')
    }));
  };

  const handleInventorySave = async (productId) => {
    const key = String(productId);
    const row = inventoryRows[key] || { is_available: false, quantity: 0, price: 0 };
    setInventorySavingId(key);
    setInventoryStatus('');
    try {
      const saved = await upsertCenterInventory({
        centerId: user.centerId,
        productId,
        quantity: Math.max(0, Number(row.quantity) || 0),
        price: Math.max(0, Number(row.price) || 0),
        isAvailable: Boolean(row.is_available)
      });
      setInventoryRows((prev) => ({
        ...prev,
        [key]: {
          is_available: Boolean(saved.is_available),
          quantity: Number(saved.quantity) || 0,
          price: Number(saved.price) || 0
        }
      }));
      setInventoryStatus('Inventory saved');
      setTimeout(() => setInventoryStatus(''), 1500);
    } catch (error) {
      setInventoryStatus('Failed to save inventory');
    } finally {
      setInventorySavingId('');
    }
  };

  if (!user || user.role !== 'provider') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-6 rounded-2xl border border-white/10 bg-surface">
          <h2 className="text-2xl font-black">{t('auth.roleProvider')}</h2>
          <p className="text-muted">{t('auth.signIn')}</p>
        </div>
      </div>
    );
  }

  const handleCenterSave = async () => {
    if (!centerId) {
      setCenterError(t('validation.required'));
      return;
    }
    setCenterError('');
    setSavingCenter(true);
    try {
      const newSession = await authService.updateProviderCenter({ userId: user.id, centerId });
      updateSession(newSession);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setCenterError(t('auth.errors.backendRequired'));
    } finally {
      setSavingCenter(false);
    }
  };

  if (!user.centerId) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'border-white/10 bg-surface' : 'border-black/10 bg-white'}`}>
          <h2 className="text-2xl font-black">{t('provider.title')}</h2>
          <p className="text-muted">{t('provider.selectCenter')}</p>
          <select
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
          >
            <option value="">{t('provider.chooseCenter')}</option>
            {serviceCenters.map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>
          {centerError && <p className="text-sm text-red-400">{centerError}</p>}
          <button
            onClick={handleCenterSave}
            disabled={savingCenter}
            className="px-4 py-3 rounded-xl bg-primary text-black font-black uppercase"
          >
            {savingCenter ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (requestId, status) => {
    const label = t(`status.${status}`);
    await updateRepairStatus(requestId, status, label);
    setRefreshKey((prev) => prev + 1);
  };

  const handleMediaUpload = (requestId, status, files) => {
    const fileList = Array.from(files);
    const readers = fileList.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            type: file.type,
            url: reader.result
          });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then(async (media) => {
      await addRepairMedia(requestId, status, media);
      setRefreshKey((prev) => prev + 1);
    });
  };

  const filteredByTab = filteredByStatus.filter((req) => {
    if (activeTab === 'incoming') return req.status === 'received';
    if (activeTab === 'active') return ['diagnosed', 'in_repair', 'quality_check', 'ready'].includes(req.status);
    return req.status === 'delivered';
  });

  const getSlaHours = (req) => {
    const latest = req.timeline?.[req.timeline.length - 1]?.timestamp || req.createdAt;
    if (!latest) return '—';
    const hours = Math.round((Date.now() - new Date(latest).getTime()) / 36e5);
    return `${hours}h`;
  };

  const getSlaMeta = (req) => {
    const latest = req.timeline?.[req.timeline.length - 1]?.timestamp || req.createdAt;
    if (!latest) return { hours: 0, level: 'low' };
    const hours = Math.round((Date.now() - new Date(latest).getTime()) / 36e5);
    const level = hours >= 48 ? 'high' : hours >= 24 ? 'medium' : 'low';
    return { hours, level };
  };

  const getNextStatus = (status) => {
    if (status === 'received') return 'diagnosed';
    if (status === 'diagnosed') return 'in_repair';
    if (status === 'in_repair') return 'quality_check';
    if (status === 'quality_check') return 'delivered';
    return status;
  };

  const BOARD_COLUMNS = [
    { key: 'received', label: t('provider.queue') },
    { key: 'diagnosed', label: t('provider.diagnostics') },
    { key: 'in_repair', label: t('provider.inRepair') },
    { key: 'quality_check', label: t('provider.qualityCheck') },
    { key: 'delivered', label: t('provider.delivered') }
  ];

  const handleDragStart = (event, requestId) => {
    event.dataTransfer.setData('text/plain', requestId);
  };

  const handleDrop = async (event, status) => {
    event.preventDefault();
    const requestId = event.dataTransfer.getData('text/plain');
    if (!requestId) return;
    await handleStatusUpdate(requestId, status);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black italic uppercase">{t('provider.title')}</h1>
        <p className="text-muted">{user.name}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['incoming', 'active', 'completed', 'board', 'warranty', 'products', 'inventory'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${activeTab === tab ? 'bg-primary text-black' : 'bg-white/5'}`}
          >
            {tab === 'incoming'
              ? t('provider.incoming')
              : tab === 'active'
              ? t('provider.active')
              : tab === 'completed'
              ? t('provider.completed')
              : tab === 'board'
              ? t('provider.workflowBoard')
              : tab === 'warranty'
              ? t('provider.warrantyRegistry')
              : tab === 'products'
              ? t('provider.products')
              : 'Inventory Management'}
          </button>
        ))}
      </div>

      {activeTab !== 'warranty' && activeTab !== 'products' && activeTab !== 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('provider.searchPlaceholder')}
              className="w-full md:w-96 px-4 py-3 rounded-xl bg-surface border border-white/10 outline-none"
            />
            <div className="hidden md:flex items-center gap-2">
              {['all', 'received', 'diagnosed', 'in_repair', 'quality_check', 'delivered'].map((key) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-2 rounded-full text-[10px] font-black uppercase transition-all ${statusFilter === key ? 'bg-primary text-black' : 'bg-white/5'}`}
                >
                  {key === 'all' ? t('provider.allStatuses') : t(`status.${key}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredByTab.map((req) => (
              <div key={req.id} className="p-6 rounded-2xl border border-white/10 bg-surface space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase text-muted font-black">{req.id}</p>
                    <h3 className="text-xl font-black">{req.device}</h3>
                    <p className="text-sm text-muted">{req.clientName} • {req.clientPhone}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-surface border border-white/10 text-sm"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{t(`status.${opt.value}`)}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'diagnosed')}
                        className="px-3 py-2 rounded-xl bg-white/5 text-xs font-black uppercase"
                      >
                        {t('provider.startDiagnostics')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'in_repair')}
                        className="px-3 py-2 rounded-xl bg-white/5 text-xs font-black uppercase"
                      >
                        {t('provider.startWork')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'delivered')}
                        className="px-3 py-2 rounded-xl bg-white/5 text-xs font-black uppercase"
                      >
                        {t('provider.finishWork')}
                      </button>
                    </div>
                    <label className="px-3 py-2 rounded-xl bg-white/5 text-sm font-black flex items-center gap-2 cursor-pointer">
                      <UploadCloud size={16} /> {t('provider.addMedia')}
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => handleMediaUpload(req.id, req.status, e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {req.timeline.map((step) => (
                    <div key={`${req.id}-${step.status}`} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <p className="text-xs uppercase text-muted font-black">{t(`status.${step.status}`)}</p>
                      {step.label && <p className="text-sm font-bold">{step.label}</p>}
                      <p className="text-sm text-muted">{new Date(step.timestamp).toLocaleString()}</p>
                      {step.media?.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {step.media.map((media) => (
                            <div key={media.id} className="rounded-lg overflow-hidden border border-white/10">
                              {media.type.startsWith('video') ? (
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
            ))}
            {filteredByTab.length === 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-surface text-muted">
                {t('common.noData')}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {BOARD_COLUMNS.map((column) => (
            <div
              key={column.key}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, column.key)}
              className={`rounded-2xl border p-4 ${isDark ? 'bg-[#0f0f12] border-white/10' : 'bg-white border-black/10'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase text-muted">{column.label}</h3>
                <span className="text-xs font-black text-primary">{filteredRequests.filter((req) => req.status === column.key).length}</span>
              </div>
              <div className="space-y-3">
                {filteredRequests
                  .filter((req) => req.status === column.key)
                  .map((req) => (
                    <div
                      key={req.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, req.id)}
                      className={`p-3 rounded-xl border cursor-move ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                    >
                      <p className="text-xs uppercase text-muted font-black">{req.id}</p>
                      <p className="font-black text-sm">{req.clientName}</p>
                      <p className="text-xs text-muted">{req.device}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-muted uppercase">{t('provider.slaLabel')}</span>
                        <span className={`text-[10px] font-black ${getSlaMeta(req).level === 'high' ? 'text-red-400' : getSlaMeta(req).level === 'medium' ? 'text-amber-400' : 'text-primary'}`}>
                          {getSlaHours(req)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase ${getSlaMeta(req).level === 'high' ? 'bg-red-500/20 text-red-400' : getSlaMeta(req).level === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {t(`provider.priority.${getSlaMeta(req).level}`)}
                        </span>
                        {req.status !== 'delivered' && (
                          <button
                            onClick={() => handleStatusUpdate(req.id, getNextStatus(req.status))}
                            className="text-[9px] px-2 py-1 rounded-full bg-white/10 font-black uppercase"
                          >
                            {t('provider.advance')}
                          </button>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'diagnosed')}
                          className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase"
                        >
                          {t('provider.startDiagnostics')}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'in_repair')}
                          className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase"
                        >
                          {t('provider.startWork')}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'delivered')}
                          className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase"
                        >
                          {t('provider.finishWork')}
                        </button>
                      </div>
                    </div>
                  ))}
                {filteredRequests.filter((req) => req.status === column.key).length === 0 && (
                  <div className="text-xs text-muted">{t('common.noData')}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'warranty' && (
        <div className="space-y-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('provider.searchPlaceholder')}
            className="w-full md:w-96 px-4 py-3 rounded-xl bg-surface border border-white/10 outline-none"
          />
          {filteredWarranties.map((warranty) => (
            <div key={warranty.requestId} className="p-6 rounded-2xl border border-white/10 bg-surface flex flex-col md:flex-row justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-muted font-black">{warranty.requestId}</p>
                <h3 className="text-lg font-black">{warranty.clientName}</h3>
                <p className="text-sm text-muted">{warranty.device}</p>
              </div>
              <a
                href={warranty.downloadUrl}
                download
                className="px-4 py-2 rounded-xl bg-primary text-black font-black text-sm flex items-center gap-2"
              >
                <Image size={16} /> PDF
              </a>
            </div>
          ))}
          {filteredWarranties.length === 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-surface text-muted">
              {t('provider.warrantyRegistry')} — {t('common.comingSoon')}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/10' : 'bg-white border-black/10'} space-y-4`}>
            <h3 className="text-xl font-black">{t('provider.addProduct')}</h3>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAutoFillProduct}
                className="px-3 py-2 rounded-lg bg-white/10 text-xs font-black uppercase"
              >
                Auto-fill
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={productForm.name}
                maxLength={100}
                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value.slice(0, 100) }))}
                placeholder={t('provider.productName')}
                className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              />
              <select
                value={productForm.category}
                onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="smartphones">{t('market.smartphones')}</option>
                <option value="laptops">{t('market.laptops')}</option>
                <option value="components">{t('market.components')}</option>
              </select>
              <input
                value={productForm.price}
                onFocus={(e) => {
                  if (e.target.value === '0') setProductForm((prev) => ({ ...prev, price: '' }));
                }}
                onBlur={(e) => {
                  if (!e.target.value) setProductForm((prev) => ({ ...prev, price: '0' }));
                }}
                onChange={(e) => setProductForm((prev) => ({ ...prev, price: normalizeNumberString(e.target.value, 8) }))}
                placeholder={t('provider.productPrice')}
                className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              />
              <select
                value={productForm.centerId}
                onChange={(e) => setProductForm((prev) => ({ ...prev, centerId: e.target.value }))}
                className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="">{t('provider.chooseCenter')}</option>
                {serviceCenters.map((center) => (
                  <option key={center.id} value={center.id}>{center.name}</option>
                ))}
              </select>
              <input
                value={productForm.quantity}
                onFocus={(e) => {
                  if (String(e.target.value) === '0') setProductForm((prev) => ({ ...prev, quantity: '' }));
                }}
                onBlur={(e) => {
                  if (String(e.target.value) === '') setProductForm((prev) => ({ ...prev, quantity: '0' }));
                }}
                onChange={(e) => setProductForm((prev) => ({ ...prev, quantity: normalizeNumberString(e.target.value, 4) }))}
                placeholder="Quantity"
                className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              />
              <input
                value={productForm.specs}
                maxLength={300}
                onChange={(e) => setProductForm((prev) => ({ ...prev, specs: e.target.value.slice(0, 300) }))}
                placeholder={t('provider.productSpecs')}
                className={`p-3 rounded-xl outline-none md:col-span-2 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              />
              <textarea
                value={productForm.description}
                maxLength={500}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value.slice(0, 500) }))}
                placeholder={t('provider.productDescription')}
                rows="3"
                className={`p-3 rounded-xl outline-none md:col-span-2 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              />
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase opacity-60">Images</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 3);
                    const mapped = files.filter((file) => file.size <= 5 * 1024 * 1024).map((file) => ({
                      id: `${Date.now()}-${file.name}`,
                      file,
                      url: URL.createObjectURL(file),
                      name: file.name
                    }));
                    setInventoryImages(mapped);
                  }}
                  className={`w-full p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
                />
                {inventoryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {inventoryImages.map((image) => (
                      <img key={image.id} src={image.url} alt={image.name} className="w-full h-20 object-cover rounded-xl" />
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted">Data auto-filled from public sources. Please verify before saving.</p>
              </div>
            </div>
            {productStatus && <p className="text-sm text-emerald-400">{productStatus}</p>}
            <button
              onClick={async () => {
                try {
                  const imageUrls = await Promise.all(
                    inventoryImages.map((image) => fileToDataUrl(image.file))
                  );
                  const coverImage = imageUrls[0] || '';

                  const created = await createProduct({
                    name: productForm.name,
                    category: productForm.category,
                    price: Number(productForm.price || 0),
                    specs: productForm.specs,
                    description: productForm.description,
                    image: coverImage,
                    images: imageUrls
                  });
                  if (productForm.centerId) {
                    await upsertCenterInventory({
                      centerId: productForm.centerId,
                      productId: created.id,
                      quantity: Number(productForm.quantity || 0),
                      price: Number(productForm.price || 0),
                      isAvailable: Number(productForm.quantity || 0) > 0 && Number(productForm.price || 0) > 0
                    });
                  }
                  setProductStatus(t('provider.productSaved'));
                  inventoryImages.forEach((image) => {
                    if (image.url?.startsWith('blob:')) {
                      URL.revokeObjectURL(image.url);
                    }
                  });
                  setInventoryImages([]);
                  setProductForm({ name: '', category: 'components', price: '', specs: '', description: '', centerId: '', quantity: '0' });
                  setTimeout(() => setProductStatus(''), 2000);
                } catch (error) {
                  setProductStatus(t('auth.errors.backendRequired'));
                }
              }}
              className="px-4 py-3 rounded-xl bg-primary text-black font-black uppercase"
            >
              {t('provider.saveProduct')}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/10' : 'bg-white border-black/10'} space-y-4`}>
            <h3 className="text-xl font-black">Inventory Management</h3>
            <input
              value={inventorySearch}
              onChange={(e) => {
                setInventorySearch(e.target.value);
                setInventoryPage(1);
              }}
              placeholder="Search product by name"
              className={`w-full md:w-96 p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
            />
            {inventoryStatus && <p className="text-sm text-emerald-400">{inventoryStatus}</p>}
            {inventoryLoading ? (
              <div className="text-sm text-muted">Loading inventory...</div>
            ) : (
              <div className="space-y-3">
                {visibleInventory.map((product) => {
                  const row = inventoryRows[String(product.id)] || { is_available: false, quantity: 0, price: 0 };
                  const isActive = Boolean(row.is_available && Number(row.quantity) > 0 && Number(row.price) > 0);
                  return (
                    <div
                      key={product.id}
                      className={`grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                    >
                      <div className="lg:col-span-4 flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white'}`}>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <ShoppingBag size={18} className="opacity-50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm truncate">{product.name}</p>
                          <p className={`text-xs ${isActive ? 'text-emerald-400' : 'text-muted'}`}>
                            {isActive ? 'Published on Market' : 'Not published'}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-2 flex items-center">
                        <label className="inline-flex items-center gap-2 text-sm font-bold">
                          <input
                            type="checkbox"
                            checked={Boolean(row.is_available)}
                            onChange={(e) => updateInventoryDraft(product.id, { is_available: e.target.checked })}
                          />
                          {row.is_available ? 'In Stock' : 'Not Available'}
                        </label>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black uppercase opacity-60 mb-1">Quantity / Количество</label>
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={row.quantity}
                          onFocus={(e) => {
                            if (String(e.target.value) === '0') updateInventoryDraft(product.id, { quantity: '' });
                          }}
                          onBlur={(e) => {
                            if (String(e.target.value) === '') updateInventoryDraft(product.id, { quantity: 0 });
                          }}
                          onChange={(e) => updateInventoryDraft(product.id, { quantity: normalizeNumberString(e.target.value, 4) })}
                          className={`w-full p-2 rounded-lg outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10'}`}
                          placeholder="0"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black uppercase opacity-60 mb-1">Price / Цена (₸)</label>
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={row.price}
                          onFocus={(e) => {
                            if (String(e.target.value) === '0') updateInventoryDraft(product.id, { price: '' });
                          }}
                          onBlur={(e) => {
                            if (String(e.target.value) === '') updateInventoryDraft(product.id, { price: 0 });
                          }}
                          onChange={(e) => updateInventoryDraft(product.id, { price: normalizeNumberString(e.target.value, 8) })}
                          className={`w-full p-2 rounded-lg outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10'}`}
                          placeholder="0"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <button
                          onClick={() => handleInventorySave(product.id)}
                          disabled={inventorySavingId === String(product.id) || !isInventoryDirty(product.id)}
                          className={`w-full px-3 py-2 rounded-lg font-black uppercase text-xs transition-all ${inventorySavingId === String(product.id) || !isInventoryDirty(product.id) ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-primary text-black'}`}
                        >
                          {inventorySavingId === String(product.id) ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {visibleInventory.length === 0 && <div className="text-sm text-muted">No products found.</div>}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setInventoryPage((prev) => Math.max(1, prev - 1))}
                disabled={inventoryPage <= 1}
                className="px-3 py-2 rounded-lg bg-white/10 text-xs font-black uppercase disabled:opacity-40"
              >
                Prev
              </button>
              <p className="text-xs text-muted">Page {inventoryPage} / {totalInventoryPages}</p>
              <button
                onClick={() => setInventoryPage((prev) => Math.min(totalInventoryPages, prev + 1))}
                disabled={inventoryPage >= totalInventoryPages}
                className="px-3 py-2 rounded-lg bg-white/10 text-xs font-black uppercase disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
