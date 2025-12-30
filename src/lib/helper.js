const convertDate = (date, t) => {
  const dateObject = new Date(date);
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const monthNames = months.map((month) => t(`helper.${month}`));
  const day = dateObject.getDate();
  const month = monthNames[dateObject.getMonth()];
  const year = dateObject.getFullYear();
  return {
    day,
    month,
    year,
  };
};

const getLeastPrice = (tickets) => {
  if (!!tickets?.length) {
    return Math.min(...tickets.map((item) => item.price));
  }
};

const currencyJson = {
  // AED: { en: "UAE Dirham", ar: "درهم اماراتي" },
  // BHD: { en: "Bahraini Dinar'", ar: "دينار بحريني" },
  // EGP: { en: "Egyptian Pound", ar: "الجنيه المصري" },
  // EUR: { en: "Euro", ar: "اليورو" },
  // GBP: { en: "UK Pound Sterling", ar: "المملكة المتحدة الجنيه الاسترليني" },
  // KWD: { en: "Kuwaiti Dinar", ar: "دينار كويتي" },
  // OMR: { en: "Omani Riyal", ar: "الريال العماني" },
  // QAR: { en: "Qatari Riyal", ar: "الريال القطري" },
  // SAR: { en: "Saudi Riyal", ar: "الريال السعودي" },
  // USD: { en: "US Dollar'", ar: "الدولار الأمريكي" },
  AED: { en: "AED", ar: "د.إ" },
  BHD: { en: "BHD'", ar: ".د.ب" },
  EGP: { en: "EGP", ar: "ج.م" },
  EUR: { en: "EUR", ar: "€" },
  GBP: { en: "GBP", ar: "£" },
  KWD: { en: "KWD", ar: "د.ك" },
  OMR: { en: "OMR", ar: "ر.عُ" },
  QAR: { en: "QAR", ar: "ر.ق" },
  SAR: { en: "SAR", ar: "ر.س" },
  USD: { en: "USD'", ar: "$" },
};

export { convertDate, getLeastPrice, currencyJson };
