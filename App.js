import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Screens
import VoiceAssistantScreen from './res/VoiceAssistantScreen';
import SalesScreen from './res/SalesScreen';
import UserScreen from './res/UserScreen';
import TaskScreen from './res/TaskScreen';
import LoginScreen from './res/LoginScreen';
import HomeScreen from './res/HomeScreen';
import EmpRating from './res/EmpRating';
import EmpReport from './res/EmpReport';
import SampleStatus from './res/SampleStatus';
import sampleDetailScreen from './res/sampleDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (

      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">

          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen
            name="VoiceAssistant"
            component={VoiceAssistantScreen}
            options={{ title: 'Voice Assistant' }}
          />

          <Stack.Screen
            name="SalesScreen"
            component={SalesScreen}
            options={{ title: 'Sales Report' }}
          />

          <Stack.Screen
            name="UserScreen"
            component={UserScreen}
            options={{ title: 'User Search' }}
          />

          <Stack.Screen
            name="TaskScreen"
            component={TaskScreen}
            options={{ title: 'Task Status' }}
          />
          <Stack.Screen
            name="EmpRating"
            component={EmpRating}
            options={{ title: 'Rating' }}
          />
          <Stack.Screen
            name="EmpReport"
            component={EmpReport}
            options={{ title: 'Employee Report' }}
          />
          <Stack.Screen
            name="SampleStatus"
            component={SampleStatus}
            options={{ title: 'Sample Screen' }}
          />
          <Stack.Screen
            name="sampleDetailScreen"
            component={sampleDetailScreen}
            options={{ title: 'sampleDetailScreen' }}
          />

        </Stack.Navigator>
      </NavigationContainer>

  );
}
