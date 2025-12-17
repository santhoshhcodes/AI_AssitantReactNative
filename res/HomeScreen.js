import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

export default function HomeScreen({ navigation }) {
  
  const screens = [
    { title: 'Voice Assistant', screen: 'VoiceAssistant', color: '#007AFF' },
    { title: 'Sales Report', screen: 'SalesScreen', color: '#007AFF' },
    { title: 'User Search', screen: 'UserScreen', color: '#007AFF' },
    { title: 'Task Status', screen: 'TaskScreen', color: '#007AFF' },
    { title: 'Rating', screen: 'EmpRating', color: '#007AFF' },
    { title: 'EmpReport', screen: 'EmpReport', color: '#007AFF' },
    { title: 'Sample Status', screen: 'SampleStatus', color: '#007AFF' },
  ];

  return (
    <ScrollView>
    <View style={styles.container}>
      


      {screens.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: item.color }]}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.buttonText}>{item.title}</Text>
        </TouchableOpacity>
      ))}

    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  button: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});