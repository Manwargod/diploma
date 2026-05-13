import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import loadGoogleMaps from '../utils/googleMapsLoader';

const ASTANA_CENTER = { lat: 51.1605, lng: 71.4704 };

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  if (!from || !to) return null;
  const R = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat))
    * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const getMarkerIcon = (state) => {
  if (state === 'selected') return 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
  if (state === 'nearest') return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
};

const ServiceCenterModal = ({
  isOpen,
  onClose,
  onConfirm,
  centers,
  initialCenterId,
  isDark,
  title,
  confirmLabel,
  nearestLabel,
  selectLabel,
  distanceLabel
}) => {
  const [draftId, setDraftId] = useState(initialCenterId || '');
  const [userLocation, setUserLocation] = useState(null);
  const [nearestId, setNearestId] = useState('');
  const [mapsError, setMapsError] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraftId(initialCenterId || '');
  }, [initialCenterId, isOpen]);

  useEffect(() => {
    if (!isOpen || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUserLocation(null);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }, [isOpen]);

  const distances = useMemo(() => {
    if (!userLocation) return {};
    return centers.reduce((acc, center) => {
      acc[center.id] = getDistanceKm(userLocation, center);
      return acc;
    }, {});
  }, [centers, userLocation]);

  useEffect(() => {
    if (!userLocation || !centers.length) return;
    const nearest = [...centers]
      .map((center) => ({ id: center.id, distance: distances[center.id] }))
      .filter((item) => typeof item.distance === 'number')
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearest?.id) {
      setNearestId(nearest.id);
      if (!draftId) {
        setDraftId(nearest.id);
      }
    }
  }, [centers, distances, draftId, userLocation]);

  useEffect(() => {
    if (!isOpen) return;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    loadGoogleMaps(apiKey)
      .then((google) => {
        setMapsError('');
        if (!mapRef.current) return;
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: userLocation || centers[0] || ASTANA_CENTER,
            zoom: 12,
            disableDefaultUI: true,
            gestureHandling: 'greedy'
          });
        } else if (userLocation) {
          mapInstanceRef.current.setCenter(userLocation);
        }

        const map = mapInstanceRef.current;
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current.clear();

        centers.forEach((center) => {
          const marker = new google.maps.Marker({
            position: { lat: center.lat, lng: center.lng },
            map,
            title: center.name,
            icon: getMarkerIcon(center.id === draftId ? 'selected' : center.id === nearestId ? 'nearest' : 'default')
          });
          marker.addListener('click', () => setDraftId(center.id));
          markersRef.current.set(center.id, marker);
        });

        if (userLocation) {
          if (userMarkerRef.current) userMarkerRef.current.setMap(null);
          userMarkerRef.current = new google.maps.Marker({
            position: userLocation,
            map,
            title: 'You are here',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });
        }
      })
      .catch((error) => {
        if (error?.message === 'GOOGLE_MAPS_API_KEY_MISSING') {
          setMapsError('GOOGLE_MAPS_API_KEY_MISSING');
        } else {
          setMapsError('GOOGLE_MAPS_LOAD_FAILED');
        }
      });
  }, [centers, draftId, isOpen, nearestId, userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach((marker, id) => {
      const state = id === draftId ? 'selected' : id === nearestId ? 'nearest' : 'default';
      marker.setIcon(getMarkerIcon(state));
    });
  }, [draftId, nearestId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!draftId) return;
    onConfirm(draftId);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-6xl h-[88vh] rounded-3xl overflow-hidden shadow-2xl border flex flex-col ${isDark ? 'bg-[#0f0f12] border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-[#00f2ff]/10' : 'bg-[#00f2ff]/20'}`}>
              <MapPin size={18} className="text-[#00f2ff]" />
            </div>
            <div>
              <h3 className="font-black text-lg">{title}</h3>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Astana service centers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 grid lg:grid-cols-[1.05fr_1.3fr] min-h-0">
          <div className={`border-r ${isDark ? 'border-white/10' : 'border-black/10'} overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-black/20' : 'bg-[#f7f8fa]'}`}>
            {centers.map((center) => {
              const distance = distances[center.id];
              const isSelected = draftId === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setDraftId(center.id)}
                  className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/10' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-black/10 bg-white hover:bg-black/5'}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black">{center.name}</h4>
                      {nearestId === center.id && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400">
                          {nearestLabel}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{center.address}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      {distance != null ? distanceLabel.replace('{{distance}}', distance) : '—'}
                    </p>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setDraftId(center.id);
                    }}
                    className={`self-start px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isSelected ? 'bg-primary text-black' : isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'}`}
                  >
                    {selectLabel}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="min-h-0">
            {mapsError ? (
              <div className={`h-full flex items-center justify-center text-sm px-6 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                {mapsError === 'GOOGLE_MAPS_API_KEY_MISSING'
                  ? 'Google Maps API key missing. Set REACT_APP_GOOGLE_MAPS_API_KEY.'
                  : 'Google Maps is unavailable right now.'}
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-full" />
            )}
          </div>
        </div>

        <div className={`px-6 py-4 border-t flex justify-end ${isDark ? 'border-white/10 bg-black/30' : 'border-black/10 bg-[#f7f8fa]'}`}>
          <button
            disabled={!draftId}
            onClick={handleConfirm}
            className="px-6 py-3 rounded-xl font-black uppercase bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterModal;
