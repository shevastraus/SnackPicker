import React, { useState, useEffect } from 'react';
import {
    Alert, BackHandler, FlatList, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
// import { StackNavigator } from "react-navigation";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Root, Toast } from "native-base";
import { NativeBaseProvider, useToast } from "native-base";
import Constants from "expo-constants";
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import AddSnackAttributes from '../components/AddSnackAttributes';



export default function SnacksScreen({ snackList, setSnackList, readItemFromStorage, navigation }) {
    // const [snackList, setSnackList] = useState([]);
    const [snackToEdit, setSnackToEdit] = useState({});

    const Stack = createNativeStackNavigator();

    const { getItem, setItem } = useAsyncStorage('@storage_key');

    const toast = useToast();

    // const readItemFromStorage = async () => {
    //     const item = await getItem();
    //     const itemParsed = item != null ? JSON.parse(item) : [];
    //     setSnackList(itemParsed);
    //     console.log("Memory: ", item);
    // }

    const writeItemToStorage = async newSnack => {
        let newList;
        let toastMessage;
        // If key exists, an item is being edited
        if (snackList.find(snack => snack.key === newSnack.key)) {
            newList = snackList;
            const editIndex = newList.findIndex(snack => snack.key === snackToEdit.key);
            newList.splice(editIndex, 1, newSnack);
            // toastMessage = "successfully edited"
        }
        // Else, new item is being created
        else {
            newList = [...snackList, newSnack];
            // toastMessage = "successfully added to snack list"
        }
        const newListStringified = JSON.stringify(newList);
        await setItem(newListStringified);
        setSnackToEdit({});
        // toast.show({
        //     placement: "bottom",
        //     duration: 2000,
        //     description: `${newSnack.name} ${toastMessage}`,
        //     style: { backgroundColor: "green" }
        // });
        readItemFromStorage();
        navigation.navigate("SnacksList");
    }

    const removeItemFromStorage = async itemToRemove => {
        const itemDeleted = snackList.filter(snack => snack.name !== itemToRemove.name);
        const itemDeletedStringified = JSON.stringify(itemDeleted);
        await setItem(itemDeletedStringified);
        readItemFromStorage();
    }

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", () => { return true; });
    //     readItemFromStorage();
    // }, []);

    // const clearAll = async () => {
    //     try {
    //         await AsyncStorage.clear()
    //     } catch (e) {
    //         // clear error
    //     }
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
                    {(props) => <SnacksList
                        snackList={snackList}
                        handleDelete={removeItemFromStorage}
                        snackToEdit={snackToEdit}
                        setSnackToEdit={setSnackToEdit}
                        {...props} />}
                </Stack.Screen>
                <Stack.Screen name="AddSnacks">
                    {(props) => <AddSnacks snackList={snackList} handleAddSnack={writeItemToStorage} snackToEdit={snackToEdit} setSnackToEdit={setSnackToEdit} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NativeBaseProvider>
    );
};

const SnacksList = ({ navigation, snackList, handleDelete, setSnackToEdit, snackToEdit }) => {

    const toast = useToast();

    return (
        <View
            style={styles.listScreenContainer}
        >
            <CustomButton
                text="Add Snack"
                buttonStyle={{ backgroundColor: "green" }}
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
                data={snackList}
                renderItem={({ item }) =>
                    <View
                        style={styles.snacksContainer}
                    >
                        <Text
                            style={styles.snacksName}
                        >{item.name}</Text>
                        <CustomButton
                            text="Edit"
                            buttonStyle={{ paddingLeft: 20, paddingRight: 20 }}
                            onPress={() => {
                                setSnackToEdit(item);
                                navigation.navigate("AddSnacks");
                            }}
                        />
                        <CustomButton
                            text="Delete"
                            buttonStyle={{ backgroundColor: "red" }}
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

const AddSnacks = ({ navigation, snackList, handleAddSnack, snackToEdit, setSnackToEdit }) => {
    const [name, setName] = useState(snackToEdit.name || "");
    const [healthy, setHealthy] = useState(snackToEdit.healthy || "");
    const [texture, setTexture] = useState(snackToEdit.texture || ""); // crunchy/chewy
    const [flavour, setFlavour] = useState(snackToEdit.flavour || ""); // sweetSavoury
    const [temperature, setTemperature] = useState(snackToEdit.temperature || ""); // frozen
    const [moistness, setMoistness] = useState(snackToEdit.moistness || ""); // wet/dry
    const [key, setKey] = useState(snackToEdit.key || `r_${new Date().getTime()}`);

    const toast = useToast();

    return (
        <ScrollView style={styles.addScreenContainer}>
            <View style={styles.addScreenInnerContainer}>
                <View style={styles.addScreenFormContainer}>
                    <CustomTextInput label="Snack" maxLength={20} stateSetter={setName} stateFieldName={name} defaultText={name} />

                    <AddSnackAttributes attributeField="Texture" attribute1="Crunchy/Crispy" attribute2="Chewy" state={texture} stateSetter={setTexture} />

                    <AddSnackAttributes attributeField="Healthiness" attribute1="Healthy" attribute2="Not Healthy" state={healthy} stateSetter={setHealthy} />

                    <AddSnackAttributes attributeField="Flavour" attribute1="Sweet" attribute2="Savoury/Salty" state={flavour} stateSetter={setFlavour} />

                    <AddSnackAttributes attributeField="Temperature" attribute1="Frozen" attribute2="Not frozen" state={temperature} stateSetter={setTemperature} />

                    <AddSnackAttributes attributeField="Moistness" attribute1="Moist" attribute2="Dry" state={moistness} stateSetter={setMoistness} />
                </View>
                <View style={styles.addScreenButtonsContainer}>
                    <CustomButton
                        text="Cancel"
                        width="44%"
                        buttonStyle={{ backgroundColor: "red" }}
                        onPress={() => {
                            setSnackToEdit({});
                            navigation.navigate("SnacksList");
                        }} />
                    <CustomButton
                        text="Save"
                        width="44%"
                        onPress={() => {
                            if (!name || !texture || !healthy || !flavour || !temperature || !moistness) {
                                toast.show({
                                    placement: "top",
                                    duration: 5000,
                                    description: `Please fill out all fields`,
                                    style: { backgroundColor: "red" }
                                });
                                return;
                            };
                            if (snackList.find(snack => snack.name === name && snack.key !== key)) {
                                toast.show({
                                    placement: "top",
                                    duration: 5000,
                                    description: `${name} is already on your Snacks list`,
                                    style: { backgroundColor: "red" }
                                })
                            } else {
                                handleAddSnack(
                                    {
                                        name, healthy, texture, flavour, temperature, moistness, key
                                    }
                                );
                                const toastMessage = snackList.find(snackObj => snackObj.key === key) ? "successfully edited" : "successfully added to snacks list";
                                toast.show({
                                    placement: "bottom",
                                    duration: 2000,
                                    description: `${name} ${toastMessage}`,
                                    style: { backgroundColor: "green" }
                                });
                            }
                        }}
                    />
                </View>
            </View>
        </ScrollView>
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
    addScreenContainer: { marginTop: Constants.statusBarHeight },
    addScreenInnerContainer: { flex: 1, alignItems: "center", paddingTop: 20, width: "100%" },
    addScreenFormContainer: { width: "96%" },
    addScreenButtonsContainer: { flexDirection: "row", justifyContent: "center" },
    fieldLabel: { marginLeft: 10 },
    pickerContainer: {
        ...Platform.select({
            ios: {},
            android: {
                width: "96%", borderRadius: 8, borderColor: "#c0c0c0", borderWidth: 2,
                marginLeft: 10, marginBottom: 20, marginTop: 4
            }
        })
    },
    picker: {
        ...Platform.select({
            ios: {
                width: "96%", borderRadius: 8, borderColor: "#c0c0c0", borderWidth: 2,
                marginLeft: 10, marginBottom: 20, marginTop: 4
            },
            android: {}
        })
    },
});