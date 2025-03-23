import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundTriangles from '@/components/Scansavy_Prop/BackgroundTriangles';
import HttpService from "@/utils/httpService";
import { SECURE_STORAGE_KEYS, setSecureItem } from "@/utils/secureStoreUtils";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response: LoginResponse = await HttpService.post('/api/login', {
                email: email,
                password: password,
            });
            const data: LoginData = response.data.data;

            if (data.access_token) {
                await setSecureItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
                await setSecureItem(SECURE_STORAGE_KEYS.USER_DATA, data.user_data);

                // Update the user first login status
                if (!data.user_data.first_login) {
                    await HttpService.post('/api/profile/update', {
                        first_login: true,
                    });
                }

                Alert.alert('Success', 'Login Successful');

                setTimeout(() => {
                    if (!data.user_data.first_login) {
                        router.push('/(screens)/Onboarding');
                        return;
                    }
                    // Navigate to the main app
                    router.push('/(screens)/(tabs)');
                }, 1000);
            }
        } catch (error) {
            if (error.status === 401) {
                Alert.alert('Warning', 'Invalid email or password');
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
                {/* Animated Background Elements */}
                <BackgroundTriangles />
                
                {/* Logo and Title Container */}
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/Applogo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleRow1}>Welcome</Text>
                        <Text style={styles.titleRow2}>To ScanSavvy!</Text>
                    </View>
                </View>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    {/* Email Input */}
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

                    {/* Password Input */}
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
                            style={styles.eyeIcon}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        >
                            <Icon
                                name={passwordVisible ? 'eye-slash' : 'eye'}
                                size={20}
                                color="#B0B0B0"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity 
                        style={styles.forgotPasswordContainer}
                        onPress={() => router.push('/(screens)/ForgotPassword')}
                    >
                        {/* <Text style={styles.forgotPasswordText}>Forgot Password?</Text> */}
                    </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(screens)/Signup')}>
                        <Text style={styles.signupLinkText}>Sign Up</Text>
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
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#fff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    loginButton: {
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
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#fff',
        fontSize: 16,
    },
    signupLinkText: {
        color: '#6200EE',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
});

type UserData = {
    email: string,
    username: string,
    name: string,
    first_login: boolean,
}

type LoginData = {
    access_token: string,
    user_data: UserData
}

type LoginResponse = {
    success: boolean;
    message?: string;
    data: any;
};

export default Login;