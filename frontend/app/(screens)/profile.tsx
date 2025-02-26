import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {ScrollView} from 'react-native-gesture-handler';
import HttpService from "@/utils/httpService";
import {getSecureItem, SECURE_STORAGE_KEYS, setSecureItem} from "@/utils/secureStoreUtils";
import {router} from "expo-router";
import {APIResponse} from "@/config/types";

const MyProfileScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        profileImage: require('../../assets/images/avatar/1.png'),
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
    });

    /**
     * Initial data load
     * */
    useEffect(() => {
        fetchUserProfileData();
    }, []);

    /**
     * Fetch the data for home page
     * */
    const fetchUserProfileData = async () => {
        try {
            // Get the user from storage
            const user = JSON.parse(await getSecureItem(SECURE_STORAGE_KEYS.USER_DATA));
            setUserData(user);
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    }

    /**
     * Profile save on submit handler
     * */
    const handleSave = async () => {
        if (!userData.name || !userData.email) {
            Alert.alert('Validation Error', 'Please fill in all the fields.');
            return;
        }

        if (userData.password && !userData.password) {
            Alert.alert('Validation Error', 'Please fill the confirm password.');
            return;
        }
        
        if (userData.password != userData.confirm_password) {
            Alert.alert('Validation Error', 'Entered passwords do not match.');
            return;
        }
        
        setLoading(true);
        try {
            // Replace this with your actual API endpoint
            const response: APIResponse = await HttpService.post('/api/profile/update', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            });

            // Store the token if exists
            if (response.data.success) {
                // Set the user data
                await setSecureItem(SECURE_STORAGE_KEYS.USER_DATA, response.data.data);
                // Update the user data state
                setUserData((prevData) => {
                    return {...prevData, ...{password: '', confirm_password: ''}};
                })
                // Display the success alert
                Alert.alert('Success', 'Your account details have been updated.');
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

    /**
     * Input onchange handler
     * @param field
     * @param value
     * */
    const handleInputChange = (field: keyof typeof userData, value: string) => {
        setUserData({...userData, [field]: value});
    };

    /**
     * Image upload input onchange handler
     * */
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Denied', 'We need access to your photos to update your profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setUserData({...userData, profileImage: {uri: result.assets[0].uri}});
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff"/>
                </TouchableOpacity>

                {/* Header Section */}
                <LinearGradient colors={['#1e90ff', '#87cefa']} style={styles.header}>
                    <TouchableOpacity onPress={pickImage} style={styles.profileWrapper}>
                        <Image source={userData.profileImage} style={styles.profileImage}/>
                    </TouchableOpacity>
                    <Text style={styles.profileName}>{userData.name}</Text>
                    <Text style={styles.profileEmail}>{userData.email}</Text>
                </LinearGradient>

                {/* Editable Fields */}
                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={userData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                        />
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email address"
                            value={userData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter a new password"
                            value={userData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Comfirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Re-Enter a new password"
                            value={userData.confirm_password}
                            onChangeText={(text) => handleInputChange('confirm_password', text)}
                            secureTextEntry
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <LinearGradient
                        colors={['#1e90ff', '#6495ed']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={[styles.gradientButton]}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

type UserData = {
    email: string,
    username: string,
    name: string
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 5,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    profileWrapper: {
        width: 100,
        height: 100,
        borderRadius: 60,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 5,
        marginBottom: 10,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    profileEmail: {
        fontSize: 16,
        color: '#f0f8ff',
        opacity: 0.8,
    },
    form: {
        backgroundColor: '#fff',
        marginTop: 10,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 15,
        elevation: 3,
    },
    field: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        elevation: 2,
    },
    saveButton: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
    },
    gradientButton: {
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
});

export default MyProfileScreen;
