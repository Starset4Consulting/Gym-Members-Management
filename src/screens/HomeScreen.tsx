import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Layout } from '../components/Layout';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  return (
    <Layout>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Starset Consultancy
          (Target Fitness)
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="account-group"
            style={styles.button}
            onPress={() => navigation.navigate('Members' as never)}
          >
            Members List
          </Button>

          <Button
            mode="contained"
            icon="account-plus"
            style={styles.button}
            onPress={() => navigation.navigate('AddMember' as never)}
          >
            Add New Member
          </Button>

          <Button
            mode="contained"
            icon="bell"
            style={styles.button}
            onPress={() => navigation.navigate('RenewalReminders' as never)}
          >
            Renewal Reminders
          </Button>

          <Button
            mode="outlined"
            icon="logout"
            style={styles.button}
            onPress={signOut}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    padding: 8,
  },
});