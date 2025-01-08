import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Member, Plan } from '../types';
import { parseISO, addDays, isSameDay, startOfDay } from 'date-fns';
import { supabase } from '../lib/supabase'; // Assuming you have a Supabase instance set up

interface AppContextType {
  members: Member[];
  plans: Plan[];
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMember: (id: string, updatedData: Partial<Member>) => Promise<void>;
  getMembersNearingExpiry: () => Member[];
  searchMembers: (query: string) => Member[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PLANS: Plan[] = [
  { id: '1', name: 'Monthly', duration: 30, price: 1000 },
  { id: '2', name: 'Quarterly', duration: 90, price: 2500 },
  { id: '3', name: '6 Months', duration: 180, price: 4000 },
  { id: '4', name: 'Yearly', duration: 365, price: 8000 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans] = useState<Plan[]>(DEFAULT_PLANS);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase.from('members').select('*');
      if (error) {
        console.error('Error fetching members:', error);
        return;
      }
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const saveMembersToAsyncStorage = async (updatedMembers: Member[]) => {
    try {
      await AsyncStorage.setItem('members', JSON.stringify(updatedMembers));
    } catch (error) {
      console.error('Error saving members:', error);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const { data, error } = await supabase.from('members').insert([memberData]);
      if (error) {
        console.error('Error adding member:', error);
        throw new Error('Failed to add member to database.');
      }

      const newMember = { ...memberData, id: data[0].id };
      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
      saveMembersToAsyncStorage(updatedMembers);
    } catch (error) {
      console.error('Error adding member:', error);
      throw new Error('An error occurred while adding member.');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) {
        console.error('Error deleting member:', error);
        throw new Error('Failed to delete member from database.');
      }

      const updatedMembers = members.filter((member) => member.id !== id);
      setMembers(updatedMembers);
      saveMembersToAsyncStorage(updatedMembers);
    } catch (error) {
      console.error('Error deleting member:', error);
      throw new Error('An error occurred while deleting member.');
    }
  };

  const updateMember = async (id: string, updatedData: Partial<Member>) => {
    try {
      const { error } = await supabase.from('members').update(updatedData).eq('id', id);
      if (error) {
        console.error('Error updating member:', error);
        throw new Error('Failed to update member in database.');
      }

      const updatedMembers = members.map((member) =>
        member.id === id ? { ...member, ...updatedData } : member
      );
      setMembers(updatedMembers);
      saveMembersToAsyncStorage(updatedMembers);
    } catch (error) {
      console.error('Error updating member:', error);
      throw new Error('An error occurred while updating member.');
    }
  };

  const getMembersNearingExpiry = () => {
    const today = startOfDay(new Date());
    const threeDaysFromNow = addDays(today, 3);
    const prevDay = addDays(today, -1);

    return members.filter((member) => {
      const expiryDate = startOfDay(parseISO(member.expiryDate));
      return (
        isSameDay(expiryDate, today) ||
        isSameDay(expiryDate, prevDay) ||
        (expiryDate >= today && expiryDate <= threeDaysFromNow)
      );
    });
  };

  const searchMembers = (query: string) => {
    const searchTerm = query.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm) || member.mobile.includes(searchTerm)
    );
  };

  const value = {
    members,
    plans,
    addMember,
    deleteMember,
    updateMember,
    getMembersNearingExpiry,
    searchMembers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
