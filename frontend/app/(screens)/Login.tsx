import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundTriangles from '@/components/Scansavy_Prop/BackgroundTriangles';
import HttpService from "@/utils/httpService";
import {SECURE_STORAGE_KEYS, setSecureItem} from "@/utils/secureStoreUtils";


const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Get started button onclick handler
     * */
    const handleGetStarted = () => {
        router.push('/(screens)/(tabs)');
    };

    /**
     * Login button onclick handler
     * */
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Replace this with your actual API endpoint
            const response: LoginResponse = await HttpService.post('/api/login', {
                email: email,
                password: password,
            });
            const data: LoginData = response.data.data;

            // Store the token if exists
            if (data.access_token) {
                // Set the access token
                await setSecureItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
                // Set the user data
                await setSecureItem(SECURE_STORAGE_KEYS.USER_DATA, data.user_data);

                Alert.alert('Success', 'User login successful');

                setTimeout(() => {
                    // Navigate to the main app
                    router.push('/(screens)/(tabs)');
                    return;
                }, 1000)
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
        <View style={styles.container}>
            {/* Animated Background Elements */}
            <BackgroundTriangles />

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleRow1}>Welcome</Text>
                <Text style={styles.titleRow2}>Back!</Text>
            </View>

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            {/* Password Input with Show/Hide */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
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

            {/* Login Button */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 14 }}>- OR Continue With -</Text>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                    <Image source={require('../../assets/google-icon.png')} style={styles.socialIcon} />
                    <Text style={styles.socialText}>Login with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                    <Image source={require('../../assets/facebook-icon.png')} style={styles.socialIcon} />
                    <Text style={styles.socialText}>Login with Facebook</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.link} onPress={() => router.push('/(screens)/Signup')}>
                Don’t have an account? Sign up
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0391FA',
    },
    titleContainer: {
        marginBottom: 40,
        alignItems: 'stretch',
    },
    titleRow1: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 5,
        fontFamily: 'sans-serif',
    },
    titleRow2: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 5,
        fontFamily: 'sans-serif',
    },

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
    passwordContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B0B0B0',
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: '#fff',
        elevation: 3,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    eyeIcon: {
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    socialContainer: {
        marginTop: 20,
        width: '80%',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        justifyContent: 'center',
    },
    googleButton: {
        backgroundColor: '#DB4437',
    },
    facebookButton: {
        backgroundColor: '#4267B2',
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    socialText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#6200EE',
        marginTop: 15,
        fontSize: 16,
        zIndex: 1,
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
});

type UserData = {
    email: string,
    username: string,
    name: string
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