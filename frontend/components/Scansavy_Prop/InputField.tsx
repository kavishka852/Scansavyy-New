// InputField.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputFieldProps {
    placeholder: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, secureTextEntry = false, onChangeText }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="#B0B0B0"
            onChangeText={onChangeText}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#B0B0B0',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        elevation: 3,
    },
});

export default InputField;
