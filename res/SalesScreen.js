import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';





import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export default function SalesScreen({ route, navigation }) {

  const { autoDownload } = route.params || {};
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // ======================================================
  // LOAD SCREEN DATA (UI ONLY – unchanged behavior)
  // ======================================================
  useEffect(() => {
    fetchSalesData();

    if (autoDownload) {
      setTimeout(() => {
        handleExcelDownload();
      }, 1000);
    }
  }, []);

const fetchSalesData = async () => {
  try {
    setLoading(true);

    const res = await fetch("http://192.168.0.9:8001/api/employees");
    const json = await res.json();

    if (!json.status) {
      throw new Error("API error");
    }

    // 🔁 Map API data → UI expected format
    const mappedData = json.data.map((item, index) => ({
      id: String(index + 1),
      date: "-", // no date in employee table
      customer: item.FirstName,
      amount: 0, // employee screen has no amount
      status: item.isActive ? "Paid" : "Pending"
    }));

    setSalesData(mappedData);
    setLoading(false);

  } catch (error) {
    console.log("API error:", error);
    setLoading(false);
    Alert.alert("Error", "Failed to load data from server");
  }
};


  // ======================================================
  // STORAGE PERMISSION (UNCHANGED)
  // ======================================================
const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  if (Platform.Version < 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  // Android 10+ → no permission needed for Download dir
  return true;
};

  // ======================================================
  // EXCEL DOWNLOAD FROM FASTAPI (ONLY CHANGE)
  // ======================================================
const handleExcelDownload = async () => {
  try {
    setDownloading(true);

    const API_URL = "http://192.168.0.9:8001/api/sales/report/excel";
    const fileName = `employee_report_${Date.now()}.xlsx`;

    const downloadPath =
      ReactNativeBlobUtil.fs.dirs.DownloadDir + "/" + fileName;

    await ReactNativeBlobUtil.config({
      addAndroidDownloads: {
        useDownloadManager: true,   // ✅ REQUIRED
        notification: true,        // ✅ SHOW NOTIFICATION
        path: downloadPath,
        title: "Employee Report",
        description: "Downloading Excel report",
        mime:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        mediaScannable: true,
      },
    }).fetch("GET", API_URL);

    setDownloading(false);

    Alert.alert(
      "Download complete",
      "Excel file saved in Downloads folder"
    );

  } catch (error) {
    setDownloading(false);
    console.log("Download error:", error);
    Alert.alert("Error", "Failed to download Excel report");
  }
};



  // ======================================================
  // UI (UNCHANGED)
  // ======================================================
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemRow}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text
          style={[
            styles.statusText,
            item.status === 'Paid' ? styles.paidStatus : styles.pendingStatus
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.customerText}>{item.customer}</Text>
      <Text style={styles.amountText}>₹{item.amount.toLocaleString()}</Text>
    </View>
  );

  const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);
  const paidOrders = salesData.filter(item => item.status === 'Paid').length;
  const pendingOrders = salesData.filter(item => item.status === 'Pending').length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sales Report</Text>
        {autoDownload && (
          <Text style={styles.autoText}>Auto-download triggered by voice</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{totalSales.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Sales </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{salesData.length}</Text>
          <Text style={styles.statLabel}>Total Orders </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{paidOrders}</Text>
          <Text style={styles.statLabel}>Paid </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleExcelDownload}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.downloadButtonText}>Download Excel Report</Text>
        )}
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading sales data...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <FlatList
            data={salesData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </>
      )}
    </ScrollView>
  );
}

// ======================================================
// STYLES (UNCHANGED)
// ======================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  autoText: { fontSize: 14, color: '#4CAF50', marginTop: 5, fontStyle: 'italic' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  downloadButton: { backgroundColor: '#007AFF', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  downloadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 10, color: '#333' },
  itemCard: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 14, color: '#666' },
  statusText: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  paidStatus: { backgroundColor: '#4CAF50', color: '#fff' },
  pendingStatus: { backgroundColor: '#FF9800', color: '#fff' },
  customerText: { fontSize: 16, fontWeight: '600', marginTop: 5, color: '#333' },
  amountText: { fontSize: 18, fontWeight: 'bold', marginTop: 5, color: '#007AFF' }
});
