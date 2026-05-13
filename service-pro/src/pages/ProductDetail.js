import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingBag, ArrowLeft, Check, MapPin, BadgeCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import products from '../data/products';
import storage from '../utils/storage';
import { formatPrice } from '../utils/format';
import { listProducts } from '../utils/productService';
import { listMarketInventory } from '../utils/inventoryService';

const MAX_REVIEW = 500;

const ProductDetail = ({ isDark }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState([]);
  const [centerListings, setCenterListings] = useState([]);
  const [customerLocation, setCustomerLocation] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadCatalogAndListings = async () => {
      try {
        const [apiProducts, listings] = await Promise.all([
          listProducts().catch(() => []),
          listMarketInventory(productId).catch(() => [])
        ]);
        if (!mounted) return;
        const map = new Map();
        [...products, ...(apiProducts || [])].forEach((item) => {
          if (!item?.id) return;
          map.set(String(item.id), item);
        });
        setCatalog(Array.from(map.values()));
        setCenterListings(listings || []);
      } catch (error) {
        if (!mounted) return;
        setCatalog(products);
        setCenterListings([]);
      }
    };

    loadCatalogAndListings();
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setCustomerLocation(null);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const product = catalog.find((p) => String(p.id) === String(productId));
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [extraReviews, setExtraReviews] = useState(() => storage.get(`sp_reviews_${productId}`, []));

  const reviews = useMemo(() => (product ? [...(product.reviews || []), ...extraReviews] : []), [product, extraReviews]);

  const haversineDistanceKm = (a, b) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const aa =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  };

  const availableCenters = useMemo(() => {
    const mapped = (centerListings || []).map((row) => {
      const center = row.serviceCenter || {};
      const lat = Number(center.lat);
      const lng = Number(center.lng);
      const distance = customerLocation && Number.isFinite(lat) && Number.isFinite(lng)
        ? haversineDistanceKm(customerLocation, { lat, lng })
        : null;
      return {
        ...row,
        distance
      };
    });

    return mapped.sort((a, b) => {
      if (a.distance == null && b.distance == null) return 0;
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }, [centerListings, customerLocation]);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-4xl font-black italic uppercase">{t('product.notFound')}</h2>
        <button
          onClick={() => navigate('/market')}
          className="px-8 py-4 bg-primary text-black font-black rounded-xl uppercase hover:scale-105 transition-all"
        >
          {t('product.backToMarket')}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/market')}
          className="flex items-center gap-2 text-[#00f2ff] font-black uppercase hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} />
          {t('product.backToMarket')}
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className={`flex items-center justify-center rounded-[3rem] border aspect-square ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
            <ShoppingBag className="w-32 h-32 opacity-20" />
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : isDark ? 'text-white/20' : 'text-black/20'}
                  />
                ))}
              </div>
              <span className="text-lg font-black">{product.rating}</span>
              <span className="text-sm opacity-60 font-bold">({reviews.length} {t('market.reviews')})</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg">{product.description}</p>
            </div>

            {/* Price */}
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <p className="text-sm font-bold opacity-50 uppercase mb-2">{t('market.price')}</p>
              <p className="text-4xl font-black text-primary">{formatPrice(product.price)}</p>
            </div>

            <div className="flex items-center gap-3">
              <Check className="text-emerald-500" size={24} />
              <div>
                <p className="font-black uppercase text-sm">{t('market.inStock')}</p>
                <p className="text-sm opacity-50 flex items-center gap-1">
                  <MapPin size={14} />
                  {product.stock}
                </p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, description: product.description, quantity: 1 })}
              className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl uppercase italic shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <ShoppingBag size={24} />
              {t('market.addToCart')}
            </button>

            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
              <h3 className="text-xl font-black uppercase mb-4">Available at service centers</h3>
              {availableCenters.length === 0 && (
                <p className="text-sm opacity-60">Currently unavailable at service centers.</p>
              )}

              {availableCenters.length === 1 && (
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} space-y-2`}>
                  <p className="font-black">{availableCenters[0].serviceCenter?.name}</p>
                  <p className="text-sm opacity-70">{availableCenters[0].serviceCenter?.address}</p>
                  <p className="text-sm font-bold">{formatPrice(availableCenters[0].price)} • {availableCenters[0].quantity} left</p>
                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: Number(availableCenters[0].price) || product.price,
                        description: product.description,
                        quantity: 1,
                        serviceCenterId: availableCenters[0].service_center_id
                      });
                      navigate('/checkout', { state: { preselectedCenterId: availableCenters[0].service_center_id } });
                    }}
                    className="w-full py-3 rounded-xl bg-primary text-black font-black uppercase"
                  >
                    Order from this center
                  </button>
                </div>
              )}

              {availableCenters.length > 1 && (
                <div className="space-y-3">
                  {availableCenters.map((listing) => (
                    <div
                      key={`${listing.service_center_id}-${listing.product_id}`}
                      className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
                    >
                      <div>
                        <p className="font-black">{listing.serviceCenter?.name}</p>
                        <p className="text-sm opacity-70">{listing.serviceCenter?.address}</p>
                        <p className="text-xs opacity-60">
                          {listing.distance != null ? `${listing.distance.toFixed(1)} km away` : 'Distance unavailable'}
                        </p>
                      </div>
                      <div className="sm:text-right space-y-1">
                        <p className="font-black text-primary">{formatPrice(listing.price)}</p>
                        <p className="text-sm opacity-70">{listing.quantity} left</p>
                        <button
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: Number(listing.price) || product.price,
                              description: product.description,
                              quantity: 1,
                              serviceCenterId: listing.service_center_id
                            });
                            navigate('/checkout', { state: { preselectedCenterId: listing.service_center_id } });
                          }}
                          className="px-4 py-2 rounded-xl bg-primary text-black font-black uppercase text-xs"
                        >
                          Order from this center
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specs */}
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
              <p className="font-black uppercase text-sm mb-4 opacity-50">{t('product.specs')}</p>
              <p className="text-lg font-bold">{product.specs}</p>
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
          <h2 className="text-3xl font-black italic uppercase mb-6">{t('market.extendedSpecs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.extendedSpecs).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <p className="text-xs uppercase text-muted font-black mb-1">{key}</p>
                <p className="font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
          <h2 className="text-3xl font-black italic uppercase mb-8">{t('product.features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#00f2ff] text-black flex items-center justify-center flex-shrink-0 mt-1">
                  <Check size={16} />
                </div>
                <p className="font-bold text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
          <h2 className="text-3xl font-black italic uppercase mb-6">{t('product.leaveReview')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder={t('product.reviewName')}
              className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
            />
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className={`p-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <div className="text-xs text-muted flex items-center justify-end">{reviewText.length}/{MAX_REVIEW}</div>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, MAX_REVIEW))}
            placeholder={t('product.reviewText')}
            rows="4"
            className={`w-full mt-4 p-4 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
          />
          <button
            onClick={() => {
              if (!reviewName || !reviewText) return;
              const newReview = {
                id: `r-${Date.now()}`,
                name: reviewName,
                rating: reviewRating,
                text: reviewText,
                date: new Date().toISOString().slice(0, 10),
                verified: false
              };
              const updated = [newReview, ...extraReviews];
              storage.set(`sp_reviews_${productId}`, updated);
              setExtraReviews(updated);
              setReviewName('');
              setReviewText('');
            }}
            className="mt-4 px-6 py-3 rounded-xl bg-primary text-black font-black uppercase"
          >
            {t('product.reviewSubmit')}
          </button>

          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black">{review.name}</p>
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                  {review.verified && (
                    <span className="text-xs font-black uppercase text-emerald-500 flex items-center gap-1">
                      <BadgeCheck size={14} /> {t('market.verified')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : isDark ? 'text-white/20' : 'text-black/20'} />
                  ))}
                </div>
                <p className="text-sm text-muted mt-2">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-black italic uppercase mb-8">{t('product.recommended')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className={`group flex flex-col p-6 rounded-[2.5rem] border transition-all hover:-translate-y-2 h-full cursor-pointer ${
                    isDark
                      ? 'bg-[#0f0f12] border-white/5 hover:border-[#00f2ff]/30'
                      : 'bg-white border-black/5 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 mb-6 flex items-center justify-center relative overflow-hidden group-hover:from-[#00f2ff]/20 group-hover:to-[#7000ff]/20 transition-all">
                    <ShoppingBag className="w-16 h-16 opacity-20 group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="font-black italic uppercase text-lg mb-2 leading-tight line-clamp-2 group-hover:text-[#00f2ff] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[10px] font-bold opacity-50 uppercase mb-4 line-clamp-2">{p.specs}</p>
                  <div className="h-px bg-white/10 my-4"></div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-black text-primary">{formatPrice(p.price)}</span>
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" size={12} />
                      <span className="text-[10px] font-black text-white">{p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
