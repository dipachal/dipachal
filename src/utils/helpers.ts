export const toBnNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

export const formatCurrency = (amount: number, lang: 'bn' | 'en' = 'bn'): string => {
  const formatted = amount.toLocaleString('en-IN');
  if (lang === 'bn') {
    return `৳${toBnNumber(formatted)}`;
  }
  return `BDT ${formatted}`;
};

export const formatDate = (dateStr: string, lang: 'bn' | 'en' = 'bn'): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formatted = date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', options);
    return formatted;
  } catch {
    return dateStr;
  }
};

export const generateTicketNumber = (): string => {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const currentYear = new Date().getFullYear();
  return `DWIP-${currentYear}-${randomSuffix}`;
};
