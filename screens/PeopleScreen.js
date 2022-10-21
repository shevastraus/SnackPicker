import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';

export default function PeopleScreen() {
    return (
        <View style={styles.container}>
            <Text>People Screen here.</Text>
            <CustomButton text="Required text!" onPress={() => { console.log("Button pressed!") }} />
            {/* <CustomTextInput label="Custom input" /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});