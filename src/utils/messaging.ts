import * as SMS from 'expo-sms';
import { Linking } from 'react-native';
import { Member } from '../types';
import { formatDate } from './date';

export const sendWhatsAppMessage = async (
  phone: string,
  message: string,
  business = false
) => {
  const url = business
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
};

export const sendSMS = async (phone: string, message: string) => {
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    await SMS.sendSMSAsync([phone], message);
  }
};

export const createRenewalMessage = (member: Member) => {
  return `Hi ${member.name}, your gym membership is expiring on ${formatDate(
    member.expiry_date
  )}. Please renew your membership to continue using our facilities.`;
};