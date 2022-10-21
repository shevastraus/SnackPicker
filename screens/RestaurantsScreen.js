import React from 'react';
import {
    Alert, BackHandler, FlatList, Picker, Platform, ScrollView,
    StyleSheet, Text, View
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StackNavigator } from "react-navigation";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Root, Toast } from "native-base";
import { NativeBaseProvider, useToast } from "native-base";
import Constants from "expo-constants";
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';

const Stack = createNativeStackNavigator();


const list = [
    { name: "item1" },
    { name: "item2" },
];

export default function RestaurantsScreen() {
    return (
        <NativeBaseProvider>
            <Stack.Navigator
                initialRouteName='RestaurantList'
                backBehavior='none'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="RestaurantList" component={RestaurantList} listData={list} />
                <Stack.Screen name="AddRestaurant" component={AddRestaurant} />
            </Stack.Navigator>
        </NativeBaseProvider>
    );
};

const RestaurantList = ({ navigation, listData }) => {
    const toast = useToast();
    return (
        <View
            style={styles.listScreenContainer}
        >
            <CustomButton
                text="Add Restaurant 😘"
                width="94%"
                onPress={
                    () => {
                        navigation.navigate("AddRestaurant");
                    }
                }
            />
            <FlatList
                style={styles.restaurantList}
                data={list}
                renderItem={({ item }) =>
                    <View
                        style={styles.restaurantContainer}
                    >
                        <Text
                            style={styles.restaurantName}
                        >{item.name}</Text>
                        <CustomButton
                            text="Delete"
                            onPress={() => {
                                Alert.alert(
                                    "Please confirm",
                                    "Are you sure you want to delete this restaurant?",
                                    [
                                        {
                                            text: "Yes",
                                            onPress: () => {
                                                toast.show({
                                                    placement: "bottom",
                                                    // type: "danger",
                                                    duration: 2000,
                                                    description: "Item deleted from list!",
                                                    style: { backgroundColor: "red" }
                                                })
                                            }
                                        },
                                        { text: "No" },
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        }
                                    ],
                                    { cancelable: true }
                                )
                            }}
                        />
                    </View>
                }

            />
        </View>

    )
}

const AddRestaurant = ({ navigation }) => {
    return (
        <Text>Add Restaurant Sub-screen</Text>
    )
}

const styles = StyleSheet.create({
    listScreenContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        ...Platform.select({
            ios: { paddingTop: Constants.statusBarHeight },
            android: { paddingTop: Constants.statusBarHeight }
        })
    },
    restaurantList: { width: "94%" },
    restaurantContainer: {
        flexDirection: "row", marginTop: 4, marginBottom: 4,
        borderColor: "#e0e0e0", borderBottomWidth: 2, alignItems: "center"
    },
    restaurantName: { flex: 1 },
});