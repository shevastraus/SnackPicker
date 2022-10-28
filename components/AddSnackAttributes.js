import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from '@react-native-picker/picker';

const AddSnackAttributes = ({ attributeField, attribute1, attribute2, state, stateSetter, isMoodSelection }) => {
    return (
        <>
            <Text style={styles.fieldLabel}>{attributeField}</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} prompt={attributeField} selectedValue={state} onValueChange={(inItemValue) => stateSetter(inItemValue)}>
                    {isMoodSelection ? <Picker.Item label="No preference" value={false} /> : <Picker.Item label="" value="" />}

                    <Picker.Item label={`${attribute1}`} value={`${attribute1}`} />
                    <Picker.Item label={`${attribute2}`} value={`${attribute2}`} />
                </Picker>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
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

export default AddSnackAttributes;