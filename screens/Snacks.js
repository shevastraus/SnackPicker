import React, { useState, useEffect } from 'react';
import {
    Alert, FlatList, Image, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
// import { StackNavigator } from "react-navigation";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Root, Toast } from "native-base";
import { useToast } from "native-base";
import Constants from "expo-constants";
import startCase from 'lodash.startcase';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import AddSnackAttributes from '../components/AddSnackAttributes';
import { popularSnacks } from '../data/popularSnacks.js';

export default function SnacksScreen({ snackList, readItemFromStorage, navigation }) {
    const [snackToEdit, setSnackToEdit] = useState({});

    const Stack = createNativeStackNavigator();

    const { setItem } = useAsyncStorage('@storage_key');

    const writeItemToStorage = async newSnack => {
        newSnack.name = startCase(newSnack.name);
        let newList;
        // If key exists, an item is being edited
        if (snackList.find(snack => snack.key === newSnack.key)) {
            newList = snackList;
            const editIndex = newList.findIndex(snack => snack.key === snackToEdit.key);
            newSnack.key = `r_${new Date().getTime()}`;
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


    const removeArrayFromStorage = async arrayToKeep => {
        const arrayStringified = JSON.stringify(arrayToKeep);
        await setItem(arrayStringified);
        readItemFromStorage();
    }

    // Uncomment this and reload app to clear local data storage:
    // const clearAll = async () => {
    //     await setItem(JSON.stringify([]));
    // }
    // clearAll();

    return (
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



            <Stack.Screen name="DeleteSnacks">
                {(props) => <DeleteSnacks
                    snackList={snackList}
                    handleDelete={removeArrayFromStorage}
                    {...props} />}
            </Stack.Screen>




            <Stack.Screen name="DefaultSnackList">
                {(props) => <DefaultSnackList
                    snackList={snackList}
                    handleAddSnack={writeArrayToStorage}
                    handleDelete={removeItemFromStorage}
                    {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const SnacksList = ({ navigation, snackList, handleDelete, setSnackToEdit }) => {

    const toast = useToast();

    return (
        <View
            style={styles.listScreenContainer}
        >
            <View style={styles.addScreenButtonsContainer}>
                <CustomButton
                    text="Add Snack"
                    buttonStyle={{ backgroundColor: "green" }}
                    width="44%"
                    onPress={
                        () => {
                            navigation.navigate("AddSnacks");
                        }
                    }
                />
                <CustomButton
                    text="Delete Snacks"
                    buttonStyle={{ backgroundColor: "red" }}
                    width="44%"
                    onPress={
                        () => {
                            navigation.navigate("DeleteSnacks");
                        }
                    }
                />
            </View>

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
                        >{item.name} {item.emoji}</Text>
                        <CustomButton
                            text="Edit"
                            buttonStyle={{ paddingLeft: 20, paddingRight: 20 }}
                            onPress={() => {
                                setSnackToEdit(item);
                                navigation.navigate("AddSnacks");
                            }}
                        />


                        {/* <CustomButton
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
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        }
                                    ],
                                    { cancelable: true }
                                )
                            }}
                        /> */}


                    </View>
                }
            />
        </View>

    )
}

const AddSnacks = ({ navigation, snackList, handleAddSnack, snackToEdit, setSnackToEdit }) => {
    const [name, setName] = useState(snackToEdit.name || "");
    const [healthy, setHealthy] = useState(snackToEdit.healthy || "");
    const [texture, setTexture] = useState(snackToEdit.texture || "");
    const [flavour, setFlavour] = useState(snackToEdit.flavour || "");
    const [temperature, setTemperature] = useState(snackToEdit.temperature || "");
    const [moistness, setMoistness] = useState(snackToEdit.moistness || "");
    const [key] = useState(snackToEdit.key || `r_${new Date().getTime()}`);

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
                                        name, healthy, texture, flavour, temperature, moistness, key, checked: false
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

const DeleteSnacks = ({ navigation, snackList, handleDelete }) => {
    const [checkedSnackList, setCheckedSnackList] = useState(snackList);
    const [selectedSnacks, setSelectedSnacks] = useState(snackList);
    // useEffect(() => {
    //     setCheckedSnackList([...snackList]);
    //     setSelectedSnacks([...snackList]);
    // }, []);

    // for debugging:
    useEffect(() => {
        console.log("updated state: selectedSnacks: ", selectedSnacks);
    }, [selectedSnacks])

    const toast = useToast();

    const onCheck = (key) => {
        let listCopy = JSON.parse(JSON.stringify(checkedSnackList));
        let index = listCopy.findIndex(snack => snack.key === key);
        listCopy[index].checked = !listCopy[index].checked;
        console.log("Selected snack and key: ", listCopy[index].name, key);
        setCheckedSnackList([...listCopy]);
        let selected = listCopy.filter(snackObj => snackObj.checked === false);
        setSelectedSnacks([...selected]);
    }

    return (
        <View style={styles.listScreenContainer}>
            {console.log("---Delete component loaded---")}
            <Text style={styles.moodHeadline}>Delete snacks</Text>
            <FlatList
                style={styles.snacksList}
                keyExtractor={(item) => item.key}
                ListEmptyComponent={<Text style={styles.snacksListPlaceholder}
                >You don't have any snacks on your list</Text>}
                data={checkedSnackList}
                renderItem={(snackObj) =>
                    <TouchableOpacity
                        key={snackObj.item.key}
                        style={styles.defaultSnacksTouchable}
                        onPress={() => onCheck(snackObj.item.key)}
                    >
                        {snackObj.item.checked === true ?
                            (<Image source={require('../images/checkboxChecked.png')} style={styles.defaultSnacksCheckbox} />) : (<Image source={require('../images/checkboxEmpty.png')} style={styles.defaultSnacksCheckbox} />)}
                        {snackObj.item.checked === true ?
                            (<Text style={{ ...styles.defaultSnacksName, fontWeight: "bold" }}>{snackObj.item.name}</Text>) : (<Text style={styles.defaultSnacksName}>{snackObj.item.name}</Text>)}
                    </TouchableOpacity>
                }
            />
            <View style={styles.addScreenButtonsContainer}>
                <CustomButton
                    text="Cancel ✖️"
                    width="44%"
                    buttonStyle={{ backgroundColor: "red" }}
                    onPress={() => {
                        navigation.navigate("SnacksList");
                    }} />
                {snackList.length > 0 &&
                    <CustomButton
                        text="Delete 🗑️"
                        width="44%"
                        buttonStyle={{ backgroundColor: "green" }}
                        onPress={() => {
                            // need to change this check!
                            if (selectedSnacks.length === checkedSnackList.length) {
                                toast.show({
                                    placement: "top",
                                    duration: 5000,
                                    description: `Please choose some snacks`,
                                    style: { backgroundColor: "red" }
                                });
                                return;
                            };
                            handleDelete(selectedSnacks);
                            toast.show({
                                placement: "bottom",
                                duration: 2000,
                                description: "Your snacks list has been updated",
                                style: { backgroundColor: "green" }
                            });
                            navigation.navigate("SnacksList");
                            // }
                        }}
                    />}
            </View>
        </View>
    )
}

const DefaultSnackList = ({ navigation, snackList, handleAddSnack }) => {
    const [defaultSnacks, setDefaultSnacks] = useState([])
    const [selectedSnacks, setSelectedSnacks] = useState([]);
    useEffect(() => {
        const filteredList = () => popularSnacks.filter(obj1 => !snackList.some(obj2 => obj1.name === obj2.name));
        setDefaultSnacks(filteredList);
    }, []);

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
                            (<Text style={{ ...styles.defaultSnacksName, fontWeight: "bold" }}>{snackObj.item.name}</Text>) : (<Text style={styles.defaultSnacksName}>{snackObj.item.name}</Text>)}
                    </TouchableOpacity>
                }
            />
            <View style={styles.addScreenButtonsContainer}>
                <CustomButton
                    text="Cancel"
                    width="44%"
                    buttonStyle={{ backgroundColor: "red" }}
                    onPress={() => {
                        navigation.navigate("SnacksList");
                    }} />
                {defaultSnacks.length > 0 &&
                    <CustomButton
                        text="Save"
                        width="44%"
                        buttonStyle={{ backgroundColor: "green" }}
                        onPress={() => {
                            if (selectedSnacks.length === 0) {
                                toast.show({
                                    placement: "top",
                                    duration: 5000,
                                    description: `Please choose some snacks`,
                                    style: { backgroundColor: "red" }
                                });
                                return;
                            };
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
                    />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listScreenContainer: {
        flex: 1,
        alignItems: "center",
        ...Platform.select({
            ios: { paddingTop: Constants.statusBarHeight },
            android: {}
        }),
    },
    snacksList: {
        width: "90%",
    },
    snacksListPlaceholder: {
        textAlign: "center",
        fontSize: 20,
        fontStyle: "italic",
        marginTop: 8,
        margin: 20,
        marginTop: 40,
    },
    snacksContainer: {
        flexDirection: "row",
        marginTop: 4,
        marginBottom: 4,
        borderColor: "#e0e0e0",
        borderBottomWidth: 2,
        alignItems: "center"
    },
    snacksName: { flex: 1, fontSize: 18 },
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
    moodHeadline: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
        textAlign: "center",
    },
    defaultSnacksTouchable: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 12,
        paddingTop: 12,
        borderColor: "#e0e0e0",
        borderBottomWidth: 2,
        width: "100%",
    },
    defaultSnacksName: {
        flex: 1,
        fontSize: 20,
    },
    defaultSnacksCheckbox: {
        marginRight: 16,
    },
});