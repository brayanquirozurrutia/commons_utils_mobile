import React from 'react';
import { TextInput as PaperInput, Text } from 'react-native-paper';
import { StyleSheet, View, Keyboard } from 'react-native';

const CommonInput = ({
                         label,
                         value,
                         onChangeText,
                         secureTextEntry = false,
                         error = null,
                         onBlur = () => {},
                         required = false,
                         placeholder,
                         keyboardType,
                         onSubmitEditing,
                     }) => {

    const colors = {
        error: '#FF5252',
        blue: '#007BFF',
        blue_2: '#0056B3',
    };

    return (
        <View style={styles.container}>
            <PaperInput
                keyboardType={keyboardType}
                label={required ? `${label} *` : label}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                mode="outlined"
                style={styles.input}
                placeholder={placeholder}
                outlineColor={error ? colors.error : colors.blue}
                activeOutlineColor={error ? colors.error : colors.blue_2}
                theme={{ colors: { error: colors.error } }}
                onBlur={onBlur}
                blurOnSubmit={true}
                onSubmitEditing={onSubmitEditing}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    input: {
        backgroundColor: '#fff',
        marginTop: 5,
    },
    errorText: {
        color: '#FF5252',
        marginTop: 5,
        fontSize: 12,
    },
});

export default CommonInput;
