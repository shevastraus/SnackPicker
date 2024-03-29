import React, { useState, useEffect } from 'react';
import { BackHandler, Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import DecisionScreen from "./screens/DecisionScreen";
import SnacksScreen from "./screens/Snacks";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

console.log(`Hello, dev! SnackPicker starting on ${Platform.OS}`);

const Tab = createBottomTabNavigator();

export default function App() {
  const [snackList, setSnackList] = useState([]);
  const { getItem } = useAsyncStorage('@storage_key');

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => { return true; });
    readItemFromStorage();
  }, []);

  const readItemFromStorage = async () => {
    const item = await getItem();
    const itemParsed = item != null ? JSON.parse(item) : [];
    itemParsed.forEach(snackObj => snackObj.checked = false);
    itemParsed.sort((a, b) => a.name > b.name ? 1 : -1);
    setSnackList(itemParsed);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName={snackList.length > 0 ? 'DecisionScreen' : 'SnacksScreen'}
            backBehavior='none'
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#ff0000",
              tabBarInactiveTintColor: 'gray',
              unmountOnBlur: true
            }}
          >

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
      </NativeBaseProvider>
    </SafeAreaView>
  );
}
