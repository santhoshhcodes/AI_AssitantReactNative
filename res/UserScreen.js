import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';

export default function UserScreen  ({ route, navigation }) {
  const { userId, userName } = route.params || {};
  const [searchQuery, setSearchQuery] = useState(userId || '');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    if (userId) {
      handleSearch();
    }
    loadRecentUsers();
  }, []);

  const loadRecentUsers = () => {
    // Mock recent users - Replace with API
    const mockRecent = [
      { id: '101', name: 'John Doe', email: 'john@example.com' },
      { id: '102', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '103', name: 'Robert Johnson', email: 'robert@example.com' },
    ];
    setRecentUsers(mockRecent);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // Mock API call - Replace with: axios.get(`your-api/users/${searchQuery}`)
    setTimeout(() => {
      const mockUser = {
        id: searchQuery,
        name: userName || 'John Doe',
        email: 'user@example.com',
        phone: '+91 9876543210',
        joinDate: '2024-01-15',
        totalOrders: 24,
        totalSpent: 125000,
        status: 'Active',
        outstanding: 30000,
      };
      
      setUserData(mockUser);
      setLoading(false);
    }, 1500);
  };

  const renderUserCard = () => {
    if (!userData) return null;

    return (
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userId}>ID: {userData.id}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            userData.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
          ]}>
            <Text style={styles.statusText}>{userData.status}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{userData.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{userData.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Join Date</Text>
            <Text style={styles.detailValue}>{userData.joinDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Orders</Text>
            <Text style={styles.detailValue}>{userData.totalOrders}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{userData.totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{userData.outstanding.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Outstanding</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search User</Text>
        {userId && (
          <Text style={styles.autoText}>Searched by voice for: {userId}</Text>
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter User ID or Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching user...</Text>
        </View>
      ) : userData ? (
        renderUserCard()
      ) : (
        <>
          <Text style={styles.sectionTitle}>Recent Users</Text>
          {recentUsers.map(user => (
            <TouchableOpacity 
              key={user.id}
              style={styles.recentUserCard}
              onPress={() => {
                setSearchQuery(user.id);
                handleSearch();
              }}
            >
              <View style={styles.recentAvatar}>
                <Text style={styles.recentAvatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{user.name}</Text>
                <Text style={styles.recentId}>ID: {user.id}</Text>
              </View>
              <Text style={styles.recentEmail}>{user.email}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  autoText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    color: '#333',
  },
  userCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  detailItem: {
    width: '50%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  recentUserCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentId: {
    fontSize: 12,
    color: '#666',
  },
  recentEmail: {
    fontSize: 12,
    color: '#007AFF',
  },
});