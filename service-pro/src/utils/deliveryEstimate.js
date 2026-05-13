const HOLIDAYS = new Set([
  '2026-01-01',
  '2026-01-02',
  '2026-03-08',
  '2026-03-21',
  '2026-03-22',
  '2026-03-23',
  '2026-05-01',
  '2026-05-07',
  '2026-05-09',
  '2026-07-06',
  '2026-08-30',
  '2026-12-16',
  '2026-12-17'
]);

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const isBusinessDay = (date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6 && !HOLIDAYS.has(formatDateKey(date));
};

const addBusinessDays = (startDate, businessDays) => {
  const result = new Date(startDate);
  let remaining = businessDays;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) remaining -= 1;
  }
  return result;
};

const formatRangeText = (start, end, locale = 'en') => {
  if (locale.startsWith('ru')) {
    const month = start.toLocaleDateString('ru-RU', { month: 'long' });
    return `${start.getDate()}–${end.getDate()} ${month}`;
  }
  if (locale.startsWith('kz')) {
    const month = start.toLocaleDateString('kk-KZ', { month: 'long' });
    return `${start.getDate()}–${end.getDate()} ${month}`;
  }
  const month = start.toLocaleDateString('en-US', { month: 'short' });
  return `${month} ${start.getDate()}–${end.getDate()}`;
};

export const getDeliveryEstimate = ({ placedAt = new Date(), cutoffHour = 14, locale = 'en' } = {}) => {
  const now = new Date(placedAt);
  const todayBusiness = isBusinessDay(now) && now.getHours() < cutoffHour;
  if (todayBusiness) {
    return { mode: 'today', label: 'today' };
  }

  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextBusiness = isBusinessDay(nextDay) ? nextDay : addBusinessDays(now, 1);
  const anotherBusiness = addBusinessDays(nextBusiness, 2);

  if (isBusinessDay(nextBusiness) && nextBusiness.getDate() === addBusinessDays(now, 1).getDate()) {
    return { mode: 'tomorrow', label: 'tomorrow' };
  }

  return {
    mode: 'range',
    from: nextBusiness,
    to: anotherBusiness,
    label: formatRangeText(nextBusiness, anotherBusiness, locale)
  };
};

export default getDeliveryEstimate;
