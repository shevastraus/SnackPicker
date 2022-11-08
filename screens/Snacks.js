import React, { useState, useEffect } from 'react';
import {
    Alert, BackHandler, FlatList, Image, Platform, ScrollView,
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
import { popularSnacks } from '../data/popularSnacks.js';



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
        }
        // Else, new item is being created
        else {
            newList = [...snackList, newSnack];
        }
        const newListStringified = JSON.stringify(newList);
        await setItem(newListStringified);
        setSnackToEdit({});

        readItemFromStorage();
        navigation.navigate("SnacksList");
    }

    const writeArrayToStorage = async newSnackArray => {
        let newList;
        newList = [...snackList, ...newSnackArray];
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
                <Stack.Screen name="DefaultSnackList">
                    {(props) => <DefaultSnackList
                        snackList={snackList}
                        handleAddSnack={writeArrayToStorage}
                        handleDelete={removeItemFromStorage}
                        {...props} />}
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
                                                });
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
    const [temperature, setTemperature] = useState(snackToEdit.temperature || ""); // Cold/Not Cold
    const [moistness, setMoistness] = useState(snackToEdit.moistness || ""); // wet/dry
    const [key, setKey] = useState(snackToEdit.key || `r_${new Date().getTime()}`);

    const toast = useToast();

    return (
        <ScrollView style={styles.addScreenContainer}>
            <View style={styles.addScreenInnerContainer}>
                <View style={styles.addScreenFormContainer}>
                    <CustomTextInput label="Snack" maxLength={20} stateSetter={setName} stateFieldName={name} defaultText={name} />

                    <AddSnackAttributes attributeField="Texture" attributes={["Crunchy/Crispy", "Chewy/Creamy", "Liquid"]} state={texture} stateSetter={setTexture} />

                    <AddSnackAttributes attributeField="Healthiness" attributes={["Healthy", "Not Healthy"]} state={healthy} stateSetter={setHealthy} />

                    <AddSnackAttributes attributeField="Flavour" attributes={["Sweet", "Savoury/Salty"]} state={flavour} stateSetter={setFlavour} />

                    <AddSnackAttributes attributeField="Temperature" attributes={["Cold", "Not Cold"]} state={temperature} stateSetter={setTemperature} />

                    <AddSnackAttributes attributeField="Moistness" attributes={["Moist", "Dry"]} state={moistness} stateSetter={setMoistness} />
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
                        buttonStyle={{ backgroundColor: "green" }}
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
                <View style={styles.addScreenButtonsContainer}>
                    <CustomButton
                        text="Choose from list of popular snacks"
                        width="93%"
                        onPress={() => {
                            navigation.navigate("DefaultSnackList");
                        }} />
                </View>
            </View>
        </ScrollView>
    )
}

const DefaultSnackList = ({ navigation, snackList, handleAddSnack, handleDelete, snackToEdit = "", setSnackToEdit = () => { } }) => {
    const [defaultSnacks, setDefaultSnacks] = useState([])
    const [selectedSnacks, setSelectedSnacks] = useState([]);
    // const [resetChecks, setResetChecks] = useState(true);
    useEffect(() => {
        const filteredList = () => popularSnacks.filter(obj1 => !snackList.some(obj2 => obj1.key === obj2.key));
        setDefaultSnacks(filteredList);
        console.log("checks reset");
    }, []);

    useEffect(() => {
        console.log("state selected snacks updated: ", selectedSnacks);
    }, [selectedSnacks]);

    const toast = useToast();

    const onCheck = (key) => {
        let listCopy = JSON.parse(JSON.stringify(defaultSnacks));
        let index = listCopy.findIndex(snack => snack.key === key);

        listCopy[index].checked = !listCopy[index].checked;

        setDefaultSnacks([...listCopy]);

        let selected = [listCopy.filter(snackObj => snackObj.checked === true)];
        setSelectedSnacks(...selected);
    }

    return (
        <View style={styles.listScreenContainer}>
            <Text style={styles.moodHeadline}>Choose some snacks to add to your list...</Text>
            <View style={styles.addScreenFormContainer}>
                <FlatList
                    style={styles.snacksList}
                    keyExtractor={(item) => item.key}
                    ListEmptyComponent={<Text style={styles.snacksListPlaceholder}
                    >You've already added all the snacks from this list!</Text>}
                    data={defaultSnacks}
                    renderItem={(snackObj) =>
                        <TouchableOpacity
                            key={snackObj.item.key}
                            style={styles.defaultSnacksTouchable}
                            onPress={() => onCheck(snackObj.item.key)}
                        >
                            {snackObj.item.checked === true ?
                                (<Image source={require('../images/checkboxChecked.png')} style={styles.defaultSnacksCheckbox} />) : (<Image source={require('../images/checkboxEmpty.png')} style={styles.defaultSnacksCheckbox} />)}
                            {snackObj.item.checked === true ?
                                (<Text style={{ ...styles.defaultSnacksName, fontWeight: "bold" }}>{snackObj.item.name}, {snackObj.item.checked.toString()}</Text>) : (<Text style={styles.defaultSnacksName}>{snackObj.item.name}</Text>)}
                        </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.addScreenButtonsContainer}>
                <CustomButton
                    text="Cancel"
                    width="44%"
                    buttonStyle={{ backgroundColor: "red" }}
                    onPress={() => {
                        navigation.navigate("SnacksList");
                    }} />
                <CustomButton
                    text="Save"
                    width="44%"
                    buttonStyle={{ backgroundColor: "green" }}
                    onPress={() => {
                        console.log("selected length:", selectedSnacks.length);
                        if (selectedSnacks.length === 0) {
                            console.log("No snacks selected");
                            toast.show({
                                placement: "top",
                                duration: 5000,
                                description: `Please choose some snacks`,
                                style: { backgroundColor: "red" }
                            });
                            return;
                        };

                        // Check names to make sure they don't already appear in the snackList:
                        // map over the selectedSnacks array and check if each item's name matches an item in the snacksList array. If yes, replace the item in snackList with the new item, i.e. delete the one in snackList before adding the new snack(s)
                        console.log("selected snacks to be added: ", selectedSnacks);
                        selectedSnacks.forEach(selectedSnack => {
                            console.log("forEach: ", selectedSnack);
                            const repeatedSnackIndex = snackList.findIndex(originalSnack => originalSnack.name === selectedSnack.name);
                            console.log("repeated snack index: ", repeatedSnackIndex);
                            if (repeatedSnackIndex === -1) {
                                console.log(`${selectedSnack.name} is a unique snack!`);
                                return;
                            } else {
                                console.log(`${selectedSnack.name} is a repeated snack!`);
                                // delete the original instance of this snack from snackList
                                handleDelete(selectedSnack);
                                return
                            }
                        })



                        // If no names are repeats, continue...
                        //  to add new object

                        // selectedSnacks.forEach(snack => {
                        //     console.log(`${snack.name} about to be added!`);
                        //     handleAddSnack(
                        //         {
                        //             name: snack.name, healthy: snack.healthy, texture: snack.texture, flavour: snack.flavour, temperature: snack.temperature, moistness: snack.moistness, key: snack.key
                        //         }
                        //     );
                        //     console.log(`${snack.name} added!`);

                        // })
                        handleAddSnack(selectedSnacks);


                        toast.show({
                            placement: "bottom",
                            duration: 2000,
                            description: "Your snacks list has been updated",
                            style: { backgroundColor: "green" }
                        });
                        navigation.navigate("SnacksList");
                        // }
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listScreenContainer: {
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        ...Platform.select({
            ios: { paddingTop: Constants.statusBarHeight },
            android: {}
        }),
        // backgroundColor: "green"
    },
    snacksList: {
        width: "94%",
        // backgroundColor: "pink"
    },
    snacksListPlaceholder: { textAlign: "center", fontSize: 20, fontStyle: "italic", marginTop: 8 },
    snacksContainer: {
        flexDirection: "row", marginTop: 4, marginBottom: 4,
        borderColor: "#e0e0e0", borderBottomWidth: 2, alignItems: "center"
    },
    snacksName: { flex: 1 },
    addScreenContainer: {
        ...Platform.select({
            ios: { paddingTop: Constants.statusBarHeight },
            android: {}
        })
    },
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
    moodScreenFormContainer: { width: "96%" },
    // moodHeadlineContainer: {
    //     // flex: 1,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     backgroundColor: "red"
    // },
    moodHeadline: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
        textAlign: "center",
        // backgroundColor: "blue"
    },
    defaultSnacksTouchable: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 6,
        // marginBottom: 6,
        paddingBottom: 12,
        paddingTop: 12,
        borderColor: "#e0e0e0",
        borderBottomWidth: 2,
        // backgroundColor: "yellow",
        width: "100%",
    },
    defaultSnacksName: {
        flex: 1,
        fontSize: 20,
        // backgroundColor: "pink"
    },
    defaultSnacksCheckbox: {
        marginRight: 16,
        // paddingRight: 20,


        // paddingTop: 20,
        // marginBottom: 20,

    },
});