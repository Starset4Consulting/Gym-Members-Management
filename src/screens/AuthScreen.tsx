import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native'; // Import Text here
import { TextInput, Button, HelperText } from 'react-native-paper';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function AuthScreen() {
  const { session, signIn, signUp, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    if (session) {
      // If session exists, the user is logged in, so show "Sign Out" button
      setEmail(session.user.email || '');
      setIsLogin(false);
    }
  }, [session]);

  const handleSubmit = async () => {
    setError('');
    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        setError(error.message);
      } else {
        Alert.alert('Signed out successfully');
      }
    } catch (error) {
      setError('Error signing out');
    }
  };

  if (loading) {
    return <Layout><View><Text>Loading...</Text></View></Layout>;
  }

  return (
    <Layout>
      <View style={styles.container}>
        {session ? (
          <>
            <Button mode="contained" onPress={handleSignOut} style={styles.button}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} // Toggle password visibility
              style={styles.input}
            />
            {error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              onPress={() => setIsLogin(!isLogin)}
              style={styles.switchButton}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
            </Button>

            {/* Show Password Button */}
            <Button
              mode="text"
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Button>
          </>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    padding: 8,
  },
  switchButton: {
    marginTop: 8,
  },
  showPasswordButton: {
    marginTop: 8,
  },
});
