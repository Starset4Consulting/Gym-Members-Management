import { format, addDays, isWithinInterval } from 'date-fns';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const calculateExpiryDate = (joinDate: Date, duration: number) => {
  return addDays(joinDate, duration);
};

export const isExpiringSoon = (expiryDate: string | Date) => {
  const today = new Date();
  const threeDaysFromNow = addDays(today, 3);
  const expiry = new Date(expiryDate);

  return isWithinInterval(expiry, {
    start: today,
    end: threeDaysFromNow,
  });
};