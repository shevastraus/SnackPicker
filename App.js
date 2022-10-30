import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { BackHandler, StyleSheet, Text, View, Image, Platform } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import DecisionScreen from "./screens/DecisionScreen";
import PeopleScreen from "./screens/PeopleScreen";
import SnacksScreen from "./screens/Snacks";
import CustomButton from './components/CustomButton';
import Constants from "expo-constants";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// To Do (short term):
// 1. AddSnacks: CustomInputField Attribute 1 / 2 props should be changed to an array, and then should populate the options from the array. For texture, add "liquid" to the attribute array 

// To do (long term):
// 1. convert form to formik

console.log(`Hello, dev! SnackPicker starting on ${Platform.OS}`);
const platformOS = Platform.OS.toLowerCase();

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [snackList, setSnackList] = useState([]);
  const { getItem, setItem } = useAsyncStorage('@storage_key');

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => { return true; });
    readItemFromStorage();
  }, []);

  const readItemFromStorage = async () => {
    const item = await getItem();
    const itemParsed = item != null ? JSON.parse(item) : [];
    setSnackList(itemParsed);
    console.log("Memory: ", item);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='DecisionScreen'
        backBehavior='none'
        screenOptions={{
          headerShown: false,
          // tabBarIconStyle: { width: 32, height: 32 },
          tabBarActiveTintColor: "#ff0000",
          tabBarInactiveTintColor: 'gray',
        }}
      >
        {/* <Tab.Screen name="PeopleScreen" component={PeopleScreen} options={
          {
            title: 'People',
            tabBarIcon: ({ color }) => (<Image source={require("./images/icon-people.png")} style={{ tintColor: color }} />)
          }
        } /> */}

        <Tab.Screen name="DecisionScreen" options={
          {
            title: 'Decision',
            tabBarIcon: ({ color }) => (<Image source={require("./images/icon-decision.png")} style={{ tintColor: color }} />)
          }
        }>
          {(props) => <DecisionScreen
            snackList={snackList}
            {...props}
          />}
        </Tab.Screen>

        <Tab.Screen name="SnacksScreen" options={
          {
            title: 'Snacks',
            tabBarIcon: ({ color }) => (<Image source={require("./images/icon-spoonfork.png")} style={{ tintColor: color }} />)
          }
        }>
          {(props) => <SnacksScreen
            snackList={snackList}
            setSnackList={setSnackList}
            readItemFromStorage={readItemFromStorage}
            {...props}
          />}
        </Tab.Screen>
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
