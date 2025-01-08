import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Member } from '../types';
import { sendWhatsAppMessage, sendSMS, createRenewalMessage } from '../utils/messaging';
import { formatDate } from '../utils/date';

interface RenewalReminderCardProps {
  member: Member;
}

export default function RenewalReminderCard({ member }: RenewalReminderCardProps) {
  const handleSendReminder = async (type: 'whatsapp' | 'business_whatsapp' | 'sms') => {
    const message = createRenewalMessage(member);

    try {
      switch (type) {
        case 'whatsapp':
          await sendWhatsAppMessage(member.mobile, message);
          break;
        case 'business_whatsapp':
          await sendWhatsAppMessage(member.mobile, message, true);
          break;
        case 'sms':
          await sendSMS(member.mobile, message);
          break;
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{member.name}</Text>
        <Text variant="bodyMedium">Mobile: {member.mobile}</Text>
        <Text variant="bodyMedium">Plan: {member.plan_type}</Text>
        <Text variant="bodyMedium">
          Expiry: {formatDate(member.expiry_date)}
        </Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            compact
            onPress={() => handleSendReminder('whatsapp')}
            style={styles.button}
          >
            WhatsApp
          </Button>
          <Button
            mode="contained"
            compact
            onPress={() => handleSendReminder('business_whatsapp')}
            style={styles.button}
          >
            Business WhatsApp
          </Button>
          <Button
            mode="contained"
            compact
            onPress={() => handleSendReminder('sms')}
            style={styles.button}
          >
            SMS
          </Button>
        </View>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
