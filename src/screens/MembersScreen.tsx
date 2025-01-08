import React, { useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Modal } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useMembers } from '../hooks/useMembers';
import MemberCard from '../components/MemberCard';
import EditMemberForm from '../components/EditMemberForm'; // Assuming an edit form exists
import { FlashList } from '@shopify/flash-list';
import { Member } from '../types';

export default function MembersScreen() {
  const { members, loading, searchMembers, refresh } = useMembers();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Filtered members based on search query
  const filteredMembers = searchQuery ? searchMembers(searchQuery) : members;

  // Refresh the member list
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // Handle member editing
  const handleEdit = (member: Member) => {
    setEditingMember(member);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setEditingMember(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search members..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <FlashList
          data={filteredMembers}
          renderItem={({ item }) => (
            <MemberCard member={item} onEdit={handleEdit} />
          )}
          estimatedItemSize={200}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      {editingMember && (
        <Modal visible={true} animationType="slide" onRequestClose={closeEditModal}>
          <EditMemberForm member={editingMember} onClose={closeEditModal} />
        </Modal>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  separator: {
    height: 16,
  },
});
