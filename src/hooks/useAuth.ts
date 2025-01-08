import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getStoredSession = async () => {
    try {
      const storedSession = await AsyncStorage.getItem('user_session');
      if (storedSession) {
        setSession(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error('Error retrieving session from AsyncStorage', error);
    } finally {
      setLoading(false);
    }
  };

  const storeSession = async (session: Session) => {
    try {
      await AsyncStorage.setItem('user_session', JSON.stringify(session));
    } catch (error) {
      console.error('Error storing session in AsyncStorage', error);
    }
  };

  useEffect(() => {
    getStoredSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        storeSession(session);
      } else {
        setSession(null);
        AsyncStorage.removeItem('user_session');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.session) {
      storeSession(data.session);
      setSession(data.session);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      AsyncStorage.removeItem('user_session');
    }
    return { error };
  };

  return { session, loading, signIn, signUp, signOut };
}
