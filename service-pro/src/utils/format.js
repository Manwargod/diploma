export const formatPrice = (value) => `${value.toLocaleString('ru-RU')} ₸`;

export const formatDate = (value) => new Date(value).toLocaleDateString('ru-RU');

const formatUtils = { formatPrice, formatDate };

export default formatUtils;
