import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function SampleStatus({ navigation }) {

  // =========================
  // STATUS PERCENTAGE DATA
  // =========================








  // =========================
  // PIE DATA GENERATOR
  // =========================
const createPieData = (data) => [
  {
    name: 'Approved',
    population: data.approved,
    color: '#4CAF50',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
  {
    name: 'Pending',
    population: data.pending,
    color: '#FFC107',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
  {
    name: 'Rejected',
    population: data.rejected,
    color: '#F44336',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
];



  const sampleListData = {
    yarn: [
      { id: 1, empName: 'Sandy', leadName: 'Shalini', customer: 'Vijay', status: 'Approved', sampleDate: '01/09/2025', ResponceDate: '03/09/2025', TotalDays: 2, Reason: '' },
      { id: 2, empName: 'Hari', leadName: 'Shalini', customer: 'Ajith', status: 'Pending', sampleDate: '02/09/2025', ResponceDate: '', TotalDays: 0, Reason: '' },
      { id: 3, empName: 'Shalini', leadName: 'Shalini', customer: 'Surya', status: 'Rejected', sampleDate: '01/09/2025', ResponceDate: '05/09/2025', TotalDays: 4, Reason: 'Shade mismatch' },
      { id: 4, empName: 'Muthu', leadName: 'Shalini', customer: 'Simbu', status: 'Approved', sampleDate: '03/09/2025', ResponceDate: '04/09/2025', TotalDays: 1, Reason: '' },
    ],

    spinning: [
      { id: 5, empName: 'Santhosh', leadName: 'Kavin', customer: 'Dhanush', status: 'Approved', sampleDate: '01/09/2025', ResponceDate: '02/09/2025', TotalDays: 1, Reason: '' },
      { id: 6, empName: 'Harish', leadName: 'Kavin', customer: 'Simbu', status: 'Rejected', sampleDate: '02/09/2025', ResponceDate: '06/09/2025', TotalDays: 4, Reason: 'Quality failed' },
    ],

    dyeing: [
      { id: 7, empName: 'Nikhil', leadName: 'Srikanth', customer: 'Manmadhan', status: 'Approved', sampleDate: '01/09/2025', ResponceDate: '02/09/2025', TotalDays: 1, Reason: '' },
      { id: 8, empName: 'Lakh', leadName: 'Srikanth', customer: 'Nayanthara', status: 'Pending', sampleDate: '04/09/2025', ResponceDate: '', TotalDays: 0, Reason: '' },
    ],
  };
  const calculateStatusPercentage = (list) => {
    const total = list.length;

    const approved = list.filter(i => i.status === 'Approved').length;
    const pending = list.filter(i => i.status === 'Pending').length;
    const rejected = list.filter(i => i.status === 'Rejected').length;

    return {
      approved: total ? Math.round((approved / total) * 100) : 0,
      pending: total ? Math.round((pending / total) * 100) : 0,
      rejected: total ? Math.round((rejected / total) * 100) : 0,
    };
  };

  const statusData = {
    yarn: calculateStatusPercentage(sampleListData.yarn),
    spinning: calculateStatusPercentage(sampleListData.spinning),
    dyeing: calculateStatusPercentage(sampleListData.dyeing),
  };


  return (
    <ScrollView style={styles.container}>

      {/* YARN */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Yarn Approval Status (%)</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate('sampleDetailScreen', {
                type: 'yarn',
                data: statusData.yarn,
                list: sampleListData.yarn,
              })
            }
          >
            <Text style={styles.btntext}>More ➪ </Text>
          </TouchableOpacity>
        </View>

        <PieChart
          data={createPieData(statusData.yarn)}
          width={screenWidth - 30}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          chartConfig={chartConfig}
        />
      </View>

      {/* SPINNING */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Spinning Approval Status (%)</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate('sampleDetailScreen', {
                type: 'spinning',
                data: statusData.spinning,
                list: sampleListData.spinning,
              })
            }
          >
            <Text style={styles.btntext}>More ➪ </Text>
          </TouchableOpacity>
        </View>

        <PieChart
          data={createPieData(statusData.spinning)}
          width={screenWidth - 30}
          height={200}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          chartConfig={chartConfig}
        />
      </View>

      {/* DYEING */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dyeing Approval Status (%)</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate('sampleDetailScreen', {
                type: 'dyeing',
                data: statusData.dyeing,
                list: sampleListData.dyeing,
              })
            }
          >
            <Text style={styles.btntext}>More ➪ </Text>
          </TouchableOpacity>
        </View>

        <PieChart
          data={createPieData(statusData.dyeing)}
          width={screenWidth - 30}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          chartConfig={chartConfig}
        />
      </View>

    </ScrollView>
  );
}

// =========================
// CHART CONFIG
// =========================
const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: () => '#000',
};

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  btn: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  btntext: {
    fontSize: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
});
