import React from 'react';
import PropTypes from "prop-types";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

export default function CustomTextInput({ label, labelStyle, maxLength, textInputStyle, stateSetter, defaultText }) {
    return (
        <View>
            <Text style={[styles.fieldLabel, labelStyle]}>{label}</Text>
            <TextInput
                defaultValue={defaultText}
                maxLength={maxLength}
                onChangeText={
                    (inText) => stateSetter(inText)
                }
                style={[styles.textInput, textInputStyle]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fieldLabel: { marginLeft: 10 },
    textInput: {
        height: 40,
        marginLeft: 10,
        width: "96%",
        marginBottom: 20,
        ...Platform.select({
            ios: {
                marginTop: 4, paddingLeft: 10, borderRadius: 8,
                borderColor: "#c0c0c0", borderWidth: 2
            },
            android: {
                height: 52,
                borderRadius: 8,
                borderColor: "#c0c0c0",
                borderWidth: 2,
                paddingLeft: 10,
                marginTop: 4,
                fontSize: 16
            }
        })
    }
});

CustomTextInput.propTypes = {
    label: PropTypes.string.isRequired,
    labelStyle: PropTypes.object,
    maxLength: PropTypes.number,
    textInputStyle: PropTypes.object,
    stateSetter: PropTypes.func.isRequired,
    stateFieldName: PropTypes.string.isRequired
};