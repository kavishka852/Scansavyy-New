import React, {useState} from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {removeSecureItem, SECURE_STORAGE_KEYS} from "@/utils/secureStoreUtils";

const SettingScreen = () => {
    const router = useRouter();
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [language, setLanguage] = useState('English');

    const toggleTheme = () => setIsDarkTheme((prev) => !prev);
    const toggleNotifications = () => setIsNotificationsEnabled((prev) => !prev);

    /**
     * Destroy the access token and user data
     * */
    const destroySession = async () => {
        await removeSecureItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN);
        await removeSecureItem(SECURE_STORAGE_KEYS.USER_DATA);
        // Redirect to the login page
        router.push(`/Login`);
    }

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Sign Out', onPress: () => destroySession()},
            ],
            {cancelable: true}
        );
    };

    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Settings</Text> */}

            {/* Theme Switch */}
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Dark Theme</Text>
                <Switch value={isDarkTheme} onValueChange={toggleTheme}/>
            </View>

            {/* Notifications Switch */}
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Notifications</Text>
                <Switch value={isNotificationsEnabled} onValueChange={toggleNotifications}/>
            </View>

            {/* Language Picker */}
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Language</Text>
                <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() =>
                        Alert.alert(
                            'Select Language',
                            '', // Pass an empty string instead of null
                            languages.map((lang) => ({
                                text: lang,
                                onPress: () => setLanguage(lang),
                            }))
                        )
                    }
                >
                    <Text style={styles.languageText}>{language}</Text>
                    <Feather name="chevron-right" size={20} color="#555"/>
                </TouchableOpacity>
            </View>

            {/* Privacy Policy */}
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Privacy Policy')}>
                <Text style={styles.settingText}>Privacy Policy</Text>
                <Feather name="chevron-right" size={20} color="#555"/>
            </TouchableOpacity>

            {/* Terms of Service */}
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Terms of Service')}>
                <Text style={styles.settingText}>Terms of Service</Text>
                <Feather name="chevron-right" size={20} color="#555"/>
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity style={[styles.settingItem, styles.signOut]} onPress={handleSignOut}>
                <Text style={[styles.settingText, styles.signOutText]}>Sign Out</Text>
                <Feather name="log-out" size={20} color="#f00"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    settingText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageText: {
        fontSize: 16,
        color: '#555',
        marginRight: 10,
    },
    signOut: {
        marginTop: 30,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    signOutText: {
        color: '#f00',
        fontWeight: 'bold',
    },
});

export default SettingScreen;
