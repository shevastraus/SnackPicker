import React, { useState } from 'react';
import { Alert, Backhandler, Button, FlatList, Image, Modal, ssPlatform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, useToast, Checkbox } from "native-base";
import Constants from "expo-constants";
import CustomButton from '../components/CustomButton';
import AddSnackAttributes from '../components/AddSnackAttributes';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
// import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

let participants;
let filteredSnacks;
let chosenSnack;

const getRandom = (inMin, inMax) => {
    inMin = Math.ceil(inMin);
    inMax = Math.floor(inMax);
    return Math.floor(Math.random() * (inMax - inMin + 1)) + inMin;
};

export default function DecisionScreen({ navigation, snackList }) {
    const [snackMatchArray, setSnackMatchArray] = useState([]);
    const Stack = createNativeStackNavigator();

    return (
        <NativeBaseProvider>
            <Stack.Navigator
                initialRouteName='DecisionTime'
                backBehavior='none'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="DecisionTime">
                    {(props) => <DecisionTime
                        isSnackList={snackList.length}
                        {...props}
                    />}
                </Stack.Screen>
                <Stack.Screen name="Moods">
                    {(props) => <Moods
                        snackList={snackList}
                        snackMatchArraySetter={setSnackMatchArray}
                        {...props}
                    />}
                </Stack.Screen>
                <Stack.Screen name="Result">
                    {(props) => <Result
                        snackMatchArray={snackMatchArray}
                        {...props}
                    />}
                </Stack.Screen>
            </Stack.Navigator>
        </NativeBaseProvider>
    );
};

const DecisionTime = ({ navigation, isSnackList }) => {
    return (
        <View style={styles.decisionTimeScreenContainer}>
            <TouchableOpacity
                style={styles.decisionTimeScreenTouchable}
                onPress={() => {
                    if (!isSnackList) {
                        Alert.alert("Oops!", "You haven't added any snacks! " + "Head over to the Snacks tab and start adding your favourite nibblies.", [{ text: "OK" }], { cancelable: false });
                    } else {
                        navigation.navigate("Moods");
                    }
                }}
            >
                <Image source={require("../images/its-decision-time.android.png")} />
                <Text style={{ paddingTop: 20 }}>Tap here to get started!</Text>

            </TouchableOpacity>
        </View>
    );
}

const Moods = ({ navigation, snackList, snackMatchArraySetter }) => {
    const [healthy, setHealthy] = useState("");
    const [texture, setTexture] = useState(""); // crunchy/chewy
    const [flavour, setFlavour] = useState(""); // sweet/savoury
    const [temperature, setTemperature] = useState(""); // frozen
    const [moistness, setMoistness] = useState(""); // wet/dry
    const [selected, setSelected] = useState({})

    const filterSnacks = () => {
        let matchedSnacks = [];
        snackList.forEach(snackObj => {
            if (
                (!healthy || snackObj.healthy === healthy) &&
                (!texture || snackObj.texture === texture) &&
                (!flavour || snackObj.flavour === flavour) &&
                (!temperature || snackObj.temperature === temperature) &&
                (!moistness || snackObj.moistness === moistness)

            ) {
                matchedSnacks.push(snackObj.name);
            };
        });
        snackMatchArraySetter(matchedSnacks);
    }

    return (
        <ScrollView style={styles.moodContainer}>
            <View style={styles.moodInnerContainer}>
                <View style={styles.moodScreenFormContainer}>
                    <View style={styles.moodHeadlineContainer}>
                        <Text style={styles.moodHeadline}>I'm in the mood for something...</Text>
                    </View>
                    <View>
                        <AddSnackAttributes attributeField="Texture" attribute1="Crunchy/Crispy" attribute2="Chewy" state={texture} stateSetter={setTexture} isMoodSelection={true} />

                        <AddSnackAttributes attributeField="Healthiness" attribute1="Healthy" attribute2="Not Healthy" state={healthy} stateSetter={setHealthy} isMoodSelection={true} />

                        <AddSnackAttributes attributeField="Flavour" attribute1="Sweet" attribute2="Savoury/Salty" state={flavour} stateSetter={setFlavour} isMoodSelection={true} />

                        <AddSnackAttributes attributeField="Temperature" attribute1="Frozen" attribute2="Not frozen" state={temperature} stateSetter={setTemperature} isMoodSelection={true} />

                        <AddSnackAttributes attributeField="Moistness" attribute1="Moist" attribute2="Dry" state={moistness} stateSetter={setMoistness} isMoodSelection={true} />

                    </View>
                    <View style={styles.addScreenButtonsContainer}>
                        <CustomButton
                            text="Cancel"
                            width="44%"
                            buttonStyle={{ backgroundColor: "red" }}
                            onPress={() => {
                                navigation.navigate("DecisionTime");
                            }} />
                        <CustomButton
                            text="Decide!"
                            width="44%"
                            buttonStyle={{ backgroundColor: "green" }}
                            onPress={() => {
                                filterSnacks();
                                navigation.navigate("Result");
                            }} />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const Result = ({ navigation, snackMatchArray }) => {
    return (
        <View style={styles.matchListContainer}>
            <View style={styles.moodScreenFormContainer}>
                <Text style={styles.moodHeadline}>💥 Results 💥</Text>
            </View>
            <FlatList
                style={styles.matchList}
                keyExtractor={(item) => item.index}
                ListEmptyComponent={<View style={styles.noResultsOuterContainer}><View style={styles.noResultsInnerContainer}><Text style={styles.noResultsTitle}>Terrible news!</Text><Text style={styles.noResultsMessage}> You are not in the mood for anything on your snack list! </Text><Text style={styles.noResultsEmoji}>😒😒😒😒😒</Text></View></View>}
                data={snackMatchArray}
                renderItem={(item) =>
                    <View style={styles.snacksContainer}>
                        <Text style={styles.snacksContainerText}>{item.item}</Text>
                    </View>
                }
            />
            <View style={styles.moodScreenFormContainer}>
                {snackMatchArray.length ?
                    <Text style={styles.moodHeadline}>Enjoy your snack!</Text> :
                    <Text style={styles.noResultsMessage}>Add more items to your snack list or reduce your preferences for better results.</Text>}
            </View>
            <CustomButton
                text="Back to Preferences"
                buttonStyle={{ backgroundColor: "green" }}
                width="94%"
                onPress={
                    () => {
                        navigation.goBack();
                    }
                }
            />
        </View>

    )
}



const styles = StyleSheet.create({
    decisionTimeScreenContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    decisionTimeScreenTouchable: {
        alignItems: "center",
        justifyContent: "center"
    },
    moodContainer:
        { marginTop: Constants.statusBarHeight },
    moodInnerContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
        width: "100%"
    },
    moodScreenFormContainer: { width: "96%" },
    moodHeadlineContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    moodHeadline: { fontSize: 30, marginTop: 20, marginBottom: 20, textAlign: "center" },
    fieldLabel: { marginLeft: 10 },
    addScreenButtonsContainer: { flexDirection: "row", justifyContent: "center" },
    matchListContainer: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
        width: "100%"
    },
    matchList: { width: "90%", },
    noResultsOuterContainer: { flex: 1, justifyContent: "center" },
    noResultsInnerContainer: { width: "94%" },
    noResultsTitle: { textAlign: "center", fontSize: 30, fontStyle: "italic", marginTop: 8, alignSelf: "center" },
    noResultsEmoji: { textAlign: "center", fontSize: 20, marginTop: 8, alignSelf: "center" },
    noResultsMessage: { textAlign: "center", fontSize: 20, fontStyle: "italic", marginTop: 8, alignSelf: "center" },
    snacksContainer: {
        flexDirection: "row", marginTop: 4, marginBottom: 4,
        borderColor: "#e0e0e0", borderBottomWidth: 2, alignItems: "center",
    },
    snacksContainerText: {
        fontSize: 24
    }
});

// Checkbox test:
// <Checkbox
//     aria-label="Test checkbox"
//     style={styles.checkbox}
//     // checked={selected[item.key]}
//     checked={selected}
//     onPress={() => {
//         // const selectedCopy = selected;
//         // selectedCopy[item.key] = !selected[item.key];
//         // setSelected(selectedCopy);
//         console.log("Check!");
//     }}
// />