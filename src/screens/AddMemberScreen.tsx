import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, List } from 'react-native-paper';
import { Layout } from '../components/Layout';
import { ErrorMessage } from '../components/ErrorMessage';
import { useMembers } from '../hooks/useMembers';
import { PLANS } from '../constants/plans';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddMemberScreen() {
  const { addMember } = useMembers();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    planType: '',
    amountPaid: '',
    dueAmount: '',
    gender: '',
    joinDate: new Date(),
    expiryDate: new Date(),
  });
  const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.gender) throw new Error('Please select a gender');
      if (!formData.planType) throw new Error('Please select a plan');

      await addMember({
        name: formData.name,
        mobile: formData.mobile,
        plan_type: formData.planType,
        amount_paid: Number(formData.amountPaid),
        due_amount: Number(formData.dueAmount || '0'),
        gender: formData.gender,
        join_date: formData.joinDate.toISOString(),
        expiry_date: formData.expiryDate.toISOString(),
      });

      navigation.goBack();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
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

        <List.Section title="Select Gender">
          {['Male', 'Female', 'Other'].map((gender) => (
            <List.Item
              key={gender}
              title={gender}
              onPress={() => setFormData({ ...formData, gender })}
              right={() =>
                formData.gender === gender ? <List.Icon icon="check" /> : null
              }
            />
          ))}
        </List.Section>

        <List.Section title="Select Plan">
          {PLANS.map((plan) => (
            <List.Item
              key={plan.id}
              title={`${plan.name}`}
              description={`${plan.duration} days`}
              onPress={() => setFormData({ ...formData, planType: plan.name })}
              right={() =>
                formData.planType === plan.name ? <List.Icon icon="check" /> : null
              }
            />
          ))}
        </List.Section>

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

        <View>
          <Button onPress={() => setShowJoinDatePicker(true)} style={styles.dateButton}>
            Select Join Date
          </Button>
          <HelperText type="info">
            {`Selected Join Date: ${formData.joinDate.toDateString()}`}
          </HelperText>
          {showJoinDatePicker && (
            <DateTimePicker
              value={formData.joinDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowJoinDatePicker(false);
                if (selectedDate) {
                  setFormData({ ...formData, joinDate: selectedDate });
                }
              }}
            />
          )}
        </View>

        <View>
          <Button onPress={() => setShowExpiryDatePicker(true)} style={styles.dateButton}>
            Select Expiry Date
          </Button>
          <HelperText type="info">
            {`Selected Expiry Date: ${formData.expiryDate.toDateString()}`}
          </HelperText>
          {showExpiryDatePicker && (
            <DateTimePicker
              value={formData.expiryDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowExpiryDatePicker(false);
                if (selectedDate) {
                  setFormData({ ...formData, expiryDate: selectedDate });
                }
              }}
            />
          )}
        </View>

        {error && <ErrorMessage message={error} />}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        >
          Add Member
        </Button>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  dateButton: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
    padding: 8,
  },
});
