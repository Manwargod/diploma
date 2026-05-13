const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

export const storage = {
  get(key, fallback = null) {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return safeParse(value, fallback);
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

export default storage;
