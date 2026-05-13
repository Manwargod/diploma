const loadGoogleMaps = (apiKey) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('GOOGLE_MAPS_UNAVAILABLE'));
  }
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }
  if (!apiKey) {
    return Promise.reject(new Error('GOOGLE_MAPS_API_KEY_MISSING'));
  }
  if (window.__spMapsLoading) {
    return window.__spMapsLoading;
  }

  window.__spMapsLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('GOOGLE_MAPS_LOAD_FAILED'));
    document.head.appendChild(script);
  });

  return window.__spMapsLoading;
};

export default loadGoogleMaps;
