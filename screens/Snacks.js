import React, { useState, useEffect } from 'react';
import {
    Alert, BackHandler, FlatList, Picker, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
// import { StackNavigator } from "react-navigation";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Root, Toast } from "native-base";
import { NativeBaseProvider, useToast } from "native-base";
import Constants from "expo-constants";
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';



export default function SnacksScreen() {
    const [snackList, setSnackList] = useState([]);

    const Stack = createNativeStackNavigator();

    const { getItem, setItem } = useAsyncStorage('@storage_key');

    const readItemFromStorage = async () => {
        const item = await getItem();
        const itemParsed = item != null ? JSON.parse(item) : [];
        setSnackList(itemParsed);
        console.log("Memory: ", item);
    }

    const writeItemToStorage = async newSnack => {
        const newList = [...snackList, newSnack];
        const newListStringified = JSON.stringify(newList);
        await setItem(newListStringified);
        readItemFromStorage();
    }

    const removeItemFromStorage = async itemToRemove => {
        const itemDeleted = snackList.filter(snack => snack.name !== itemToRemove.name);
        const itemDeletedStringified = JSON.stringify(itemDeleted);
        await setItem(itemDeletedStringified);
        readItemFromStorage();
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => { return true; });
        readItemFromStorage();
    }, []);

    // const clearAll = async () => {
    //     try {
    //         await AsyncStorage.clear()
    //     } catch (e) {
    //         // clear error
    //     }

    //     console.log('Done.')
    // }

    // clearAll();

    return (
        <NativeBaseProvider>
            <Stack.Navigator
                initialRouteName='SnacksList'
                backBehavior='none'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="SnacksList">
                    {(props) => <SnacksList snackList={snackList} handleDelete={removeItemFromStorage} {...props} />}
                </Stack.Screen>
                <Stack.Screen name="AddSnacks">
                    {(props) => <AddSnacks snackList={snackList} handleAddSnack={writeItemToStorage} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NativeBaseProvider>
    );
};

const SnacksList = ({ navigation, snackList, handleDelete }) => {

    const toast = useToast();

    return (
        <View
            style={styles.listScreenContainer}
        >
            <CustomButton
                text="Add Snack"
                width="94%"
                onPress={
                    () => {
                        navigation.navigate("AddSnacks");
                    }
                }
            />
            <FlatList
                style={styles.snacksList}
                keyExtractor={item => item.name}
                ListEmptyComponent={<Text style={styles.snacksListPlaceholder}
                >Add some snacks to get started!</Text>}
                // data={list}
                data={snackList}
                renderItem={({ item }) =>
                    <View
                        style={styles.snacksContainer}
                    >
                        <Text
                            style={styles.snacksName}
                        >{item.name}</Text>
                        <CustomButton
                            text="Delete"
                            onPress={() => {
                                Alert.alert(
                                    "Please confirm",
                                    `Are you sure you want to delete ${item.name}?`,
                                    [
                                        {
                                            text: "Yes",
                                            onPress: () => {
                                                handleDelete(item);
                                                toast.show({
                                                    placement: "bottom",
                                                    duration: 2000,
                                                    description: `${item.name} deleted`,
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

const AddSnacks = ({ navigation, handleAddSnack }) => {
    const { getItem, setItem } = useAsyncStorage('@storage_key');

    return (
        <View style={{ margin: 40 }}>
            {/* <Text>Current value: {value}</Text> */}
            <TouchableOpacity
                onPress={() => {
                    handleAddSnack(
                        {
                            name: Math.random()
                                .toString(36)
                                .substr(2, 5)
                        }

                    );
                    navigation.push("SnacksList");
                }}
            >
                <Text>Update value</Text>
            </TouchableOpacity>
        </View>
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
    snacksList: { width: "94%" },
    snacksListPlaceholder: { textAlign: "center", fontSize: 20, fontStyle: "italic", marginTop: 8 },
    snacksContainer: {
        flexDirection: "row", marginTop: 4, marginBottom: 4,
        borderColor: "#e0e0e0", borderBottomWidth: 2, alignItems: "center"
    },
    snacksName: { flex: 1 },
});