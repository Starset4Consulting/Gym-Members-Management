import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { Layout } from '../components/Layout';
import RenewalReminderCard from '../components/RenewalReminderCard';
import { useAppContext } from '../context/AppContext'; 
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useMembers } from '../hooks/useMembers';  // Use the custom hook to get members
import { formatDate } from '../utils/date';  // Assuming you have a date formatting utility

export default function RenewalRemindersScreen() {
  const { members } = useMembers();  // Get the members from the custom hook
  const { getMembersNearingExpiry } = useAppContext();
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to check if the expiry date is today, yesterday, or within 3 days from now
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    // Get previous day (yesterday)
    const prevDay = new Date(today);
    prevDay.setDate(today.getDate() - 1);

    // Check if the expiry date is today, yesterday, or within the next 3 days
    return (
      expiry.toDateString() === today.toDateString() ||  // Expiry is today
      expiry.toDateString() === prevDay.toDateString() ||  // Expiry was yesterday
      (expiry >= today && expiry <= threeDaysFromNow)  // Expiry is within the next 3 days
    );
  };

  // Fetch members nearing expiry when the component mounts
  useEffect(() => {
    // Filter members based on expiry date
    const filteredMembers = members.filter(member => isExpiringSoon(member.expiry_date));
    console.log("Filtered members nearing expiry:", filteredMembers);  // Log filtered members for debugging
    setExpiringMembers(filteredMembers);
    setLoading(false);
  }, [members]);  // Re-run when members list changes

  // Handle renewing member logic
  const handleRenew = (memberId: string) => {
    setExpiringMembers(prevMembers => 
      prevMembers.filter(member => member.id !== memberId)  // Remove the member from the expiring list
    );
    console.log('Member renewed:', memberId);  // Replace with actual renewal logic
  };

  // Handle deleting member logic
  const handleDelete = (memberId: string) => {
    setExpiringMembers(prevMembers => 
      prevMembers.filter(member => member.id !== memberId)  // Remove the member from the expiring list
    );
    console.log('Member deleted:', memberId);  // Replace with actual deletion logic
  };

  if (loading) {
    return <LoadingSpinner />;  // Show loading spinner while data is being fetched
  }

  return (
    <Layout>
      <View style={styles.container}>
        {expiringMembers.length === 0 ? (
          <Text style={styles.noMembers}>No members nearing expiry</Text>  // Display a message if there are no members
        ) : (
          <FlatList
            data={expiringMembers}  // Use the filtered members
            keyExtractor={(item) => item.id}  // Use the member's ID as the key
            renderItem={({ item }) => (
              <RenewalReminderCard
                member={item}  // Pass each member to the RenewalReminderCard
                onRenew={() => handleRenew(item.id)}  // Renew the member when the button is clicked
                onDelete={() => handleDelete(item.id)}  // Delete the member when the button is clicked
              />
            )}
            contentContainerStyle={styles.list}  // Style the list content
          />
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    gap: 16,
  },
  noMembers: {
    textAlign: 'center',
    marginTop: 20,
  },
});
