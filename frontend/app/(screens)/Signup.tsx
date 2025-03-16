import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import BackgroundTriangles from '@/components/Scansavy_Prop/BackgroundTriangles';
import Icon from 'react-native-vector-icons/FontAwesome';
import HttpService from "@/utils/httpService";

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Warning', 'All fields are required!');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Warning', 'Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            const response = await HttpService.post('/api/register', {
                name: fullName,
                email: email,
                password: password,
            });

            if (response.status === 200) {
                Alert.alert('Success', 'User registered successfully!');
                router.push('/(screens)/Login');
                return;
            }
            Alert.alert('Error', 'Registration failed!');
        } catch (error) {
            if (error.status === 401) {
                Alert.alert('Warning', 'Email already registered on our system.');
                return;
            }
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <BackgroundTriangles />
                
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/Applogo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleRow1}>Create</Text>
                        <Text style={styles.titleRow2}>Your Account</Text>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Icon 
                            name="user" 
                            size={20} 
                            color="#B0B0B0" 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#B0B0B0"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Icon 
                            name="envelope" 
                            size={20} 
                            color="#B0B0B0" 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            placeholderTextColor="#B0B0B0"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Icon 
                            name="lock" 
                            size={20} 
                            color="#B0B0B0" 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={!passwordVisible}
                            placeholderTextColor="#B0B0B0"
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        >
                            <Icon
                                name={passwordVisible ? 'eye-slash' : 'eye'}
                                size={20}
                                color="#B0B0B0"
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Icon 
                            name="lock" 
                            size={20} 
                            color="#B0B0B0" 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry={!confirmPasswordVisible}
                            placeholderTextColor="#B0B0B0"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        >
                            <Icon
                                name={confirmPasswordVisible ? 'eye-slash' : 'eye'}
                                size={20}
                                color="#B0B0B0"
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.signupButton, loading && styles.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.signupButtonText}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(screens)/Login')}>
                        <Text style={styles.loginLinkText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0391FA',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    titleRow1: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    titleRow2: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        paddingHorizontal: 15,
    },
    signupButton: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
    },
    loginLinkText: {
        color: '#6200EE',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
});

export default Signup;