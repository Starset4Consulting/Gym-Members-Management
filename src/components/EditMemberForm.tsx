import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, List, Text } from 'react-native-paper';
import { Member } from '../types';
import { useAppContext } from '../context/AppContext';
import { calculateExpiryDate } from '../utils/date';
import { ErrorMessage } from './ErrorMessage';

interface EditMemberFormProps {
  member: Member;
  onClose: () => void;
}

export default function EditMemberForm({ member, onClose }: EditMemberFormProps) {
  const { updateMember, plans } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: member.name,
    mobile: member.mobile,
    amountPaid: member.amount_paid.toString(),
    dueAmount: member.due_amount.toString(),
  });
  const [renewalData, setRenewalData] = useState({
    planType: '',
    newAmountPaid: '',
    newDueAmount: '',
  });
  const [isRenewing, setIsRenewing] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError('');

      const updatedMember = {
        ...member,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        amount_paid: parseFloat(formData.amountPaid),
        due_amount: parseFloat(formData.dueAmount),
      };

      await updateMember(member.id, updatedMember);
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewal = async () => {
    try {
      setLoading(true);
      setError('');

      const selectedPlan = plans.find((plan) => plan.name === renewalData.planType);
      if (!selectedPlan) throw new Error('Please select a valid plan.');

      const joinDate = new Date();
      const expiryDate = calculateExpiryDate(joinDate, selectedPlan.duration);

      const updatedMember = {
        ...member,
        plan_type: renewalData.planType,
        amount_paid: parseFloat(renewalData.newAmountPaid),
        due_amount: parseFloat(renewalData.newDueAmount || '0'),
        join_date: joinDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
      };

      await updateMember(member.id, updatedMember);
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while renewing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {isRenewing ? 'Renew Membership' : 'Edit Member'}
      </Text>

      {!isRenewing ? (
        <>
          <TextInput
            label="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Mobile"
            value={formData.mobile}
            onChangeText={(text) => setFormData({ ...formData, mobile: text })}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Amount Paid"
            value={formData.amountPaid}
            onChangeText={(text) => setFormData({ ...formData, amountPaid: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Due Amount"
            value={formData.dueAmount}
            onChangeText={(text) => setFormData({ ...formData, dueAmount: text })}
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <List.Section title="Select New Plan">
            {plans.map((plan) => (
              <List.Item
                key={plan.id}
                title={plan.name}
                description={`${plan.duration} days`}
                onPress={() => setRenewalData({ ...renewalData, planType: plan.name })}
                right={() =>
                  renewalData.planType === plan.name ? (
                    <List.Icon icon="check" />
                  ) : null
                }
              />
            ))}
          </List.Section>
          <TextInput
            label="Amount Paid"
            value={renewalData.newAmountPaid}
            onChangeText={(text) => setRenewalData({ ...renewalData, newAmountPaid: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Due Amount"
            value={renewalData.newDueAmount}
            onChangeText={(text) => setRenewalData({ ...renewalData, newDueAmount: text })}
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      )}

      {error && <ErrorMessage message={error} />}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => setIsRenewing(!isRenewing)}
          style={styles.button}
        >
          {isRenewing ? 'Edit Details' : 'Renew Plan'}
        </Button>
        <Button
          mode="contained"
          onPress={isRenewing ? handleRenewal : handleUpdate}
          loading={loading}
          style={styles.button}
        >
          {isRenewing ? 'Confirm Renewal' : 'Update'}
        </Button>
        <Button
          mode="outlined"
          onPress={onClose}
          style={styles.button}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    padding: 8,
  },
});
