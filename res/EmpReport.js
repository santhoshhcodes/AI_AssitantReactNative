import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function EmpReport() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = () => {
    setTimeout(() => {
      const mockData = {
        EmpNo: 1,
        empName: "Sandy",
        dept: "Mobile App Developer",
        designation: "Junior Developer",
        joinDate: "2022-01-15",
        email: "sandy@company.com",
        contact: "+91 7010725156",
        location: "Scoto systech",

        // Performance Metrics
        TotalCompanyVisit: 30,
        Total_Sample: 28,
        ApprovelSample: 25,
        RejectSample: 3,
        Performance: 90,

        // Attendance Metrics
        AttendancePercentage: 90,
        TotalWorkingDays: 100,
        PresentDays: 90,
        AbsentDays: 10,
        LeaveDays: 5,
        LateArrivals: 2,

        // Task Categories
        tasksCompleted: 120,
        tasksPending: 8,
        tasksOverdue: 2,

        // Quality Metrics
        qualityScore: 94,
        clientSatisfaction: 92,
        peerRating: 4.5,

        // Recent Activities
        recentActivities: [
          { date: "2024-01-15", activity: "Completed project milestone", type: "success" },
          { date: "2024-01-14", activity: "Client meeting - Positive feedback", type: "info" },
          { date: "2024-01-13", activity: "Submitted weekly report", type: "normal" },
          { date: "2024-01-12", activity: "Code review completed", type: "success" },
          { date: "2024-01-11", activity: "Team coordination meeting", type: "info" },
        ],
      };

      setEmployee(mockData);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Employee Report... </Text>
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No employee data found</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {employee.empName.charAt(0)}
          </Text>
        </View>
      </View>
      <View style={styles.headerInfo}>
        <Text style={styles.empName}>{employee.empName}</Text>
        <Text style={styles.empDept}>{employee.dept}</Text>
        <Text style={styles.empDesignation}>{employee.designation}</Text>

        <View style={styles.headerStats}>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeValue}>#{employee.EmpNo}</Text>
            <Text style={styles.statBadgeLabel}>Emp ID </Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeValue}>{employee.Performance}%</Text>
            <Text style={styles.statBadgeLabel}>Performance </Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeValue}>{employee.qualityScore}%</Text>
            <Text style={styles.statBadgeLabel}>Quality </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {["overview", "performance", "attendance", "details"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProgressBar = (percentage, color = "#007AFF") => (
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          { width: `${percentage}%`, backgroundColor: color }
        ]}
      />
    </View>
  );

  const renderMetricCard = (value, label, color = "#1a1a1a") => (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Performance Overview </Text>

      {/* Performance Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Overall Performance </Text>
        <Text style={styles.scoreValue}>{employee.Performance}%</Text>
        {renderProgressBar(employee.Performance, "#007AFF")}
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        {renderMetricCard(employee.TotalCompanyVisit, "Company Visits ")}
        {renderMetricCard(employee.Total_Sample, "Total Samples ")}
        {renderMetricCard(employee.ApprovelSample, "Approved ", "#4CAF50")}
        {renderMetricCard(employee.RejectSample, "Rejected ", "#F44336")}
      </View>

      {/* Sample Distribution */}
      <View style={styles.sampleContainer}>
        <Text style={styles.chartTitle}>Sample Distribution</Text>
        <View style={styles.sampleRow}>
          <View style={styles.sampleItem}>
            <View style={[styles.sampleDot, { backgroundColor: "#4CAF50" }]} />
            <Text style={styles.sampleText}>Approved: {employee.ApprovelSample} </Text>
          </View>
          <View style={styles.sampleItem}>
            <View style={[styles.sampleDot, { backgroundColor: "#F44336" }]} />
            <Text style={styles.sampleText}>Rejected: {employee.RejectSample} </Text>
          </View>
          <View style={styles.sampleItem}>
            <View style={[styles.sampleDot, { backgroundColor: "#FF9800" }]} />
            <Text style={styles.sampleText}>Pending: {employee.Total_Sample - employee.ApprovelSample - employee.RejectSample} </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPerformance = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Performance Details</Text>

      {/* Performance Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Overall Performance</Text>
          <Text style={styles.statValue}>{employee.Performance}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Quality Score</Text>
          <Text style={styles.statValue}>{employee.qualityScore}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Client Satisfaction</Text>
          <Text style={styles.statValue}>{employee.clientSatisfaction}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Peer Rating</Text>
          <Text style={styles.statValue}>{employee.peerRating}/5</Text>
        </View>
      </View>

      {/* Tasks Summary */}
      <View style={styles.tasksContainer}>
        <Text style={styles.chartTitle}>Tasks Summary</Text>
        <View style={styles.taskRow}>
          <View style={styles.taskItem}>
            <Text style={[styles.taskValue, { color: "#4CAF50" }]}>{employee.tasksCompleted}</Text>
            <Text style={styles.taskLabel}>Completed </Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={[styles.taskValue, { color: "#FF9800" }]}>{employee.tasksPending}</Text>
            <Text style={styles.taskLabel}>Pending </Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={[styles.taskValue, { color: "#F44336" }]}>{employee.tasksOverdue}</Text>
            <Text style={styles.taskLabel}>Overdue </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAttendance = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Attendance Analysis</Text>

      {/* Attendance Rate */}
      <View style={styles.attendanceCard}>
        <Text style={styles.attendanceValue}>{employee.AttendancePercentage}%</Text>
        <Text style={styles.attendanceLabel}>Attendance Rate </Text>
        {renderProgressBar(employee.AttendancePercentage, "#4CAF50")} </View>

      {/* Attendance Details */}
      <View style={styles.attendanceGrid}>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceItemValue, { color: "#4CAF50" }]}>
            {employee.PresentDays}
          </Text>
          <Text style={styles.attendanceItemLabel}>Present Days </Text>
        </View>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceItemValue, { color: "#F44336" }]}>
            {employee.AbsentDays}
          </Text>
          <Text style={styles.attendanceItemLabel}>Absent Days </Text>
        </View>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceItemValue, { color: "#FF9800" }]}>
            {employee.LeaveDays}
          </Text>
          <Text style={styles.attendanceItemLabel}>Leave Days </Text>
        </View>
        <View style={styles.attendanceItem}>
          <Text style={[styles.attendanceItemValue, { color: "#9C27B0" }]}>
            {employee.LateArrivals}
          </Text>
          <Text style={styles.attendanceItemLabel}>Late Arrivals </Text>
        </View>
      </View>

      {/* Total Working Days */}
      <View style={styles.daysContainer}>
        <Text style={styles.daysLabel}>Total Working Days: {employee.TotalWorkingDays}</Text>
        {renderProgressBar((employee.PresentDays / employee.TotalWorkingDays) * 100, "#2196F3")}
      </View>
    </View>
  );

  const renderDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Employee Details</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Employee ID</Text>
          <Text style={styles.detailValue}>#{employee.EmpNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Department</Text>
          <Text style={styles.detailValue}>{employee.dept}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Designation</Text>
          <Text style={styles.detailValue}>{employee.designation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Join Date</Text>
          <Text style={styles.detailValue}>{employee.joinDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{employee.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Contact</Text>
          <Text style={styles.detailValue}>{employee.contact}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{employee.location}</Text>
        </View>
      </View>

      {/* Recent Activities */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Activities</Text>
      <View style={styles.activitiesContainer}>
        {employee.recentActivities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[
              styles.activityDot,
              {
                backgroundColor: activity.type === "success" ? "#4CAF50" :
                  activity.type === "info" ? "#2196F3" : "#9E9E9E"
              }
            ]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{activity.activity}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "performance":
        return renderPerformance();
      case "attendance":
        return renderAttendance();
      case "details":
        return renderDetails();
      default:
        return renderOverview();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderHeader()}
      {renderTabs()}
      {renderTabContent()}

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          {employee.empName} is performing exceptionally well with a {employee.Performance}% performance score.
          The employee maintains {employee.AttendancePercentage}% attendance rate and has completed {employee.tasksCompleted} tasks
          with a {employee.qualityScore}% quality score. Recent feedback indicates high client satisfaction.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    marginBottom: 20,
    textAlign: "center",
  },
  headerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: {
    flex: 1,
  },
  empName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  empDept: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  empDesignation: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 12,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBadge: {
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 70,
  },
  statBadgeValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statBadgeLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
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
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: "#f0f7ff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  sampleContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  sampleRow: {
    marginTop: 8,
  },
  sampleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sampleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  sampleText: {
    fontSize: 14,
    color: "#333",
  },
  statsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  tasksContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskItem: {
    alignItems: "center",
    flex: 1,
  },
  taskValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  taskLabel: {
    fontSize: 12,
    color: "#666",
  },
  attendanceCard: {
    backgroundColor: "#f0f7ff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  attendanceValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  attendanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  attendanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  attendanceItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  attendanceItemValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  attendanceItemLabel: {
    fontSize: 12,
    color: "#666",
  },
  daysContainer: {
    marginTop: 10,
  },
  daysLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detailsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 2,
    textAlign: "right",
  },
  activitiesContainer: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: "#999",
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
});