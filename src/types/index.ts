export interface Member {
  id: string;
  name: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other'; // New property added
  planType: string;
  amountPaid: number;
  dueAmount: number;
  expiryDate: string;
  joinDate: string;
}

export interface Plan {
  id: string;
  name: string;
  duration: number; // in days
  price: number;
}

export type ReminderType = 'whatsapp' | 'business_whatsapp' | 'sms';
