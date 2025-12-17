import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

export default function EmpRating() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ratedEmpDetails();
  }, []);

  const ratedEmpDetails = () => {
    setTimeout(() => {
      const mockTasks = [
        { id: 1, empName: "Sandy", dept: "Mobile App Developer", AllocatedWork: 20, CompletedWork: 20, Rating: 5, Score: 100 },
        { id: 2, empName: "Muthu", dept: "PHP Developer", AllocatedWork: 20, CompletedWork: 1, Rating: 0.5, Score: 10 },
        { id: 3, empName: "Santhosh", dept: "React Developer", AllocatedWork: 25, CompletedWork: 20, Rating: 4, Score: 90 },
        { id: 4, empName: "Shalini", dept: "React Developer", AllocatedWork: 25, CompletedWork: 23, Rating: 4.5, Score: 98 },
        { id: 5, empName: "Alex", dept: "Mobile App Developer", AllocatedWork: 30, CompletedWork: 28, Rating: 4.3, Score: 93 },
      ];

      setTasks(mockTasks);
      setLoading(false);
    }, 800);
  };

  const filteredRating = useMemo(() => {
    return tasks
      .filter(item =>
        item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.Score - a.Score);
  }, [tasks, searchQuery]);

  const getRankColor = (index) => {
    if (index === 0) return "#FFD700"; // Gold for 1st
    if (index === 1) return "#C0C0C0"; // Silver for 2nd
    if (index === 2) return "#CD7F32"; // Bronze for 3rd
    return "#007AFF"; 
  };

  const renderTaskItem = ({ item, index }) => (
    <View style={styles.taskCard}>
      <Text style={[styles.rank, { color: getRankColor(index) }]}>
        #{index + 1}
      </Text>
      
      <View style={styles.headerRow}>
        <Text style={styles.empName}>{item.empName}</Text>
        {/* <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{item.Score}</Text>
        </View> */}
      </View>

      <Text style={styles.deptText}>{item.dept}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Allocation</Text>
          <Text style={styles.statValue}>
            {item.CompletedWork}/{item.AllocatedWork}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rating</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{item.Rating.toFixed(1)}/5</Text>
            <Text style={styles.star}>⭐</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Completion</Text>
          <Text style={[
            styles.statValue,
            { color: item.CompletedWork === item.AllocatedWork ? '#4CAF50' : '#FF9800' }
          ]}>
            {Math.round((item.CompletedWork / item.AllocatedWork) * 100)}%
          </Text>
        </View>
      </View>

      {/* <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${(item.CompletedWork / item.AllocatedWork) * 100}%`,
              backgroundColor: item.CompletedWork === item.AllocatedWork ? '#4CAF50' : '#2196F3'
            }
          ]} 
        />
      </View> */}
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading ratings...</Text>
        </View>
      );
    }

    if (searchQuery && filteredRating.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>
            No employees match "{searchQuery}"
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Employee Ratings</Text>
        <Text style={styles.subtitle}>
          Total Employees: {tasks.length}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or department"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => setSearchQuery("")}
          disabled={!searchQuery}
        >
          <Text style={[styles.clearButtonText, 
            !searchQuery && styles.clearButtonDisabled
          ]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          Rankings {filteredRating.length > 0 && `(${filteredRating.length})`}
        </Text>
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearFilterText}>Clear filter</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* List */}
      <FlatList
        data={filteredRating}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
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
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: "white",
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  rank: {
    position: "absolute",
    top: 16,
    right: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  empName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
  },
  scoreBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  deptText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },
  star: {
    fontSize: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
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
});