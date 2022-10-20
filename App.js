import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DecisionScreen from "./screens/DecisionScreen";
import PeopleScreen from "./screens/PeopleScreen";
import RestaurantsScreen from "./screens/RestaurantsScreen";
import Constants from "expo-constants";

const Stack = createNativeStackNavigator();

console.log("!!! ", Platform);

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PeopleScreen">
        <Stack.Screen name="PeopleScreen" component={PeopleScreen} options={{ title: 'People' }} />
        <Stack.Screen name="DecisionScreen" component={DecisionScreen} options={{ title: 'Decision' }} />
        <Stack.Screen name="RestaurantsScreen" component={RestaurantsScreen} options={{ title: 'Restaurants' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
