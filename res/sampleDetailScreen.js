import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';


export default function SampleDetailScreen({ route }) {

  const { type, data, list } = route.params || {};
 

  const [tasks, setTasks] = useState(list || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredCustom = useMemo(() => {
    return tasks.filter(item => {
      const matchSearch =
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTab =
        activeTab === 'All' || item.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [tasks, searchQuery, activeTab]);

  const statusSummary = useMemo(() => {
    const summary = {
      Approved: 0,
      Pending: 0,
      Rejected: 0,
    };

    tasks.forEach(item => {
      if (summary[item.status] !== undefined) {
        summary[item.status]++;
      }
    });

    return summary;
  }, [tasks]);


  const getTitle = () => {
    if (type === 'yarn') return 'Yarn Approval Details';
    if (type === 'spinning') return 'Spinning Approval Details';
    if (type === 'dyeing') return 'Dyeing Approval Details';
    return 'Approval Details';
  };

  const renderTaskItem = ({ item }) => (
    <View>
      <View style={styles.taskCard}>

        {/* Customer + Status */}
        <View style={styles.headerRow}>
          <Text style={styles.customerStyle}>{item.customer}</Text>
          <Text
            style={[
              styles.statusText,
              item.status === 'Approved' && { color: '#4CAF50' },
              item.status === 'Pending' && { color: '#FFC107' },
              item.status === 'Rejected' && { color: '#F44336' },
            ]}
          >
            {item.status} ({item.TotalDays} Days) </Text>
        </View>

        {/* Details */}
        <View style={styles.DetailsRow}>

          <Text style={styles.empName}>Lead : {item.leadName} </Text>
          <Text style={styles.empName}>Employee : {item.empName} </Text>


        </View>

        {item.status === 'Rejected' && item.Reason ? (
          <Text style={[styles.empName, { color: '#F44336' }]}>
            Reason : {item.Reason}
          </Text>
        ) : null}

      </View>
      <View style={styles.taskCardBottom}>
        <View style={styles.headerRowBottom}>

          <Text style={styles.Date}>{item.sampleDate} </Text>
          <Text style={styles.Date}>{item.ResponceDate} </Text>

        </View>
      </View>
    </View>

  );


  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['All', 'Approved', 'Pending', 'Rejected'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

const renderEmptyState = () => {
  if (filteredCustom.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptyText}>
          No matching data for "{searchQuery}"
        </Text>
      </View>
    );
  }
  return null;
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderColor: '#4CAF50' }]}>
          <Text style={styles.summaryValue}>{statusSummary.Approved}</Text>
          <Text style={styles.summaryLabel}>Approved</Text>
        </View>

        <View style={[styles.summaryCard, { borderColor: '#FFC107' }]}>
          <Text style={styles.summaryValue}>{statusSummary.Pending}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>

        <View style={[styles.summaryCard, { borderColor: '#F44336' }]}>
          <Text style={styles.summaryValue}>{statusSummary.Rejected}</Text>
          <Text style={styles.summaryLabel}>Rejected</Text>
        </View>
      </View>


      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Company"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      {renderTabs()}

      {/* List */}
      <FlatList
        data={filteredCustom}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ece9e9ff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  DetailsRow: {

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  headerRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  taskCard: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 15,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  taskCardBottom: {
    backgroundColor: "grey",
    marginBottom: 10,
    padding: 12,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  empName: {
    fontSize: 15,
    color: "#666",


  },
  Date: {
    fontSize: 12,
    color: "white"
  },
  customerStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
  },
  EmpView: {
    marginTop: 5,
    flexDirection: "row-reverse",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },

  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clearButton: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#666",
  },
  clearButtonDisabled: {
    opacity: 0.3,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  clearFilterText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
  },
  approved: {
    color: '#4CAF50',
    fontSize: 16,
    marginBottom: 8,
  },
  pending: {
    color: '#FFC107',
    fontSize: 16,
    marginBottom: 8,
  },
  rejected: {
    color: '#F44336',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  summaryCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    color: '#666',
  },


});
