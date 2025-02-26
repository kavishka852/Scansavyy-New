import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import {router} from 'expo-router';
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

    /**
     * Signup button onclick handler
     * */
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

            console.log(response)

            if (response.status === 200) {
                Alert.alert('Success', 'User registered successfully!');
                router.push('/(screens)/Login'); // Redirect to login page
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
        <View style={styles.container}>
            <BackgroundTriangles/>

            <View style={styles.titleContainer}>
                <Text style={styles.titleRow1}>Create</Text>
                <Text style={styles.titleRow2}>Your Account</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#B0B0B0"
                value={fullName}
                onChangeText={setFullName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    placeholderTextColor="#B0B0B0"
                    value={password}
                    onChangeText={setPassword}
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

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    secureTextEntry={!confirmPasswordVisible}
                    placeholderTextColor="#B0B0B0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                    <Icon
                        name={confirmPasswordVisible ? 'eye-slash' : 'eye'}
                        size={20}
                        color="#B0B0B0"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 14 }}>- OR Continue With -</Text>

            <View style={styles.socialContainer}>
                <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                    <Image source={require('../../assets/google-icon.png')} style={styles.socialIcon}/>
                    <Text style={styles.socialText}>Sign up with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                    <Image source={require('../../assets/facebook-icon.png')} style={styles.socialIcon}/>
                    <Text style={styles.socialText}>Sign up with Facebook</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.link} onPress={() => router.push('/(screens)/Login')}>
                Already have an account? Login
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
        textShadowOffset: {width: 3, height: 3},
        textShadowRadius: 5,
        fontFamily: 'sans-serif',
    },
    titleRow2: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: 3, height: 3},
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
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
});

export default Signup;