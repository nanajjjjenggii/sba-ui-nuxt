import { parseNumber, formatNumber, formatDate } from '@progress/kendo-intl';

export const getNumberFormatter = (data: string, format = 'n2'): string => {
  return formatNumber(parseNumber(data), format);
};

export const getDateFormatter = (data: Date, format = 'dd/MM/yyyy'): string => {
  return formatDate(data, format);
};
