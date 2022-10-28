import React, { useState } from 'react';
import { Alert, Backhandler, Button, FlatList, Image, Modal, ssPlatform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, useToast, Checkbox } from "native-base";
import Constants from "expo-constants";
import CustomButton from '../components/CustomButton';

let participants;
let filteredSnacks;
let chosenSnack;

const getRandom = (inMin, inMax) => {
    inMin = Math.ceil(inMin);
    inMax = Math.floor(inMax);
    return Math.floor(Math.random() * (inMax - inMin + 1)) + inMin;
};

export default function DecisionScreen({ navigation, snackList }) {
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
                        snackList={snackList}
                        {...props}
                    />}
                </Stack.Screen>
                <Stack.Screen name="Moods" component={Moods} />
            </Stack.Navigator>
        </NativeBaseProvider>
    );
};

const DecisionTime = ({ navigation, snackList }) => {
    return (
        <View style={styles.decisionTimeScreenContainer}>
            <TouchableOpacity
                style={styles.decisionTimeScreenTouchable}
                onPress={() => {
                    if (!snackList.length) {
                        Alert.alert("Oops!", "You haven't added any snacks! " + "Head over to the Snacks tab and start adding your favourite nibblies.", [{ text: "OK" }], { cancelable: false });
                    } else {
                        navigation.navigate("Moods");
                    }
                }}
            >
                <Image source={require("../images/its-decision-time.android.png")} />
                <Text style={{ paddingTop: 20 }}>Let's get started!</Text>

            </TouchableOpacity>
        </View>
    );
}

const Moods = ({ navigation }) => {
    const [healthy, setHealthy] = useState("");
    const [texture, setTexture] = useState(""); // crunchy/chewy
    const [flavour, setFlavour] = useState(""); // sweetSavoury
    const [temperature, setTemperature] = useState(""); // frozen
    const [moistness, setMoistness] = useState(""); // wet/dry
    return (
        <ScrollView style={styles.moodContainer}>
            <View style={styles.moodInnerContainer}>
                <View style={styles.moodScreenFormContainer}>
                    <View style={styles.moodHeadlineContainer}>
                        <Text style={styles.moodHeadline}>I'm in the mood for something...</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
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
    moodHeadline: { fontSize: 30, marginTop: 20, marginBottom: 20 }
});