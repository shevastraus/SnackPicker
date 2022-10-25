import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DecisionScreen from "./screens/DecisionScreen";
import PeopleScreen from "./screens/PeopleScreen";
import SnacksScreen from "./screens/Snacks";
import CustomButton from './components/CustomButton';
import Constants from "expo-constants";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

console.log("Hello!");
console.log(`SnackPicker starting on ${Platform.OS}`);
const platformOS = Platform.OS.toLowerCase();

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='PeopleScreen'
        backBehavior='none'
        screenOptions={{
          headerShown: false,
          // tabBarIconStyle: { width: 32, height: 32 },
          tabBarActiveTintColor: "#ff0000",
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="PeopleScreen" component={PeopleScreen} options={
          {
            title: 'People',
            tabBarIcon: ({ color }) => (<Image source={require("./images/icon-people.png")} style={{ tintColor: color }} />)
          }
        } />
        <Tab.Screen name="DecisionScreen" component={DecisionScreen} options={
          {
            title: 'Decision',
            tabBarIcon: ({ color }) => (<Image source={require("./images/icon-decision.png")} style={{ tintColor: color }} />)
          }
        } />
        <Tab.Screen name="SnacksScreen" component={SnacksScreen} options={
          {
            title: 'Snacks',
            tabBarIcon: ({ color }) => (<Image source={require("./images/icon-spoonfork.png")} style={{ tintColor: color }} />)
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tab: {
    width: 32,
    height: 32,
    // tintColor: color
  },
});
