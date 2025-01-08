import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Member } from '../types';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'user_id'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No user found');

      const { error } = await supabase.from('members').insert({
        ...memberData,
        user_id: userData.user.id,
      });

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  };

  const getMembersNearingExpiry = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    return members.filter((member) => {
      const expiryDate = new Date(member.expiry_date);
      return expiryDate <= threeDaysFromNow && expiryDate >= today;
    });
  };

  const searchMembers = (query: string) => {
    const searchTerm = query.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.mobile.includes(searchTerm)
    );
  };

  return {
    members,
    loading,
    addMember,
    deleteMember,
    getMembersNearingExpiry,
    searchMembers,
    refresh: fetchMembers,
  };
}