import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import { useAuth } from './src/hooks/useAuth';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import MembersScreen from './src/screens/MembersScreen';
import AddMemberScreen from './src/screens/AddMemberScreen';
import RenewalRemindersScreen from './src/screens/RenewalRemindersScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Replace with a loading spinner or splash screen if needed
  }

  return (
    <AppProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!session ? (
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
              />
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Members" component={MembersScreen} />
                <Stack.Screen name="AddMember" component={AddMemberScreen} />
                <Stack.Screen
                  name="RenewalReminders"
                  component={RenewalRemindersScreen}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}
