import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Member } from '../types';
import { useAppContext } from '../context/AppContext';
import { format, isValid, parseISO } from 'date-fns';

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void; // Callback to handle editing
}

export default function MemberCard({ member, onEdit }: MemberCardProps) {
  const { deleteMember } = useAppContext();

  // Log the member data for debugging
  console.log('Member data:', member);

  // Validate and format expiry date
  const expiryDate = member.expiry_date ? parseISO(member.expiry_date) : null;
  const formattedExpiryDate = expiryDate && isValid(expiryDate)
    ? format(expiryDate, 'dd/MM/yyyy')
    : 'Not Available';

  // Ensure amounts are properly parsed and formatted
  const amountPaid = member.amount_paid !== undefined && member.amount_paid !== null
    ? member.amount_paid.toFixed(2) // Ensure it's a number with two decimal places
    : '0.00';
  const dueAmount = member.due_amount !== undefined && member.due_amount !== null
    ? member.due_amount.toFixed(2) // Ensure it's a number with two decimal places
    : '0.00';

  // Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteMember(member.id); // Call deleteMember function
              Alert.alert('Success', `${member.name} has been deleted.`);
            } catch (error) {
              Alert.alert('Error', 'There was an issue deleting the member.');
            }
          } 
        },
      ]
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{member.name}</Text>
        <Text variant="bodyMedium">Gender: {member.gender || 'Not Specified'}</Text>
        <Text variant="bodyMedium">Mobile: {member.mobile}</Text>
        <Text variant="bodyMedium">Plan: {member.plan_type}</Text>
        <Text variant="bodyMedium">Expiry: {formattedExpiryDate}</Text>
        <Text variant="bodyMedium">Amount Paid: ₹{amountPaid}</Text>
        {parseFloat(dueAmount) > 0 && (
          <Text variant="bodyMedium" style={styles.dueAmount}>
            Due Amount: ₹{dueAmount}
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button onPress={handleDelete} color="red">
          Delete
        </Button>
        <Button onPress={() => onEdit(member)} color="blue">
          Edit
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  dueAmount: {
    color: 'red',
  },
});
