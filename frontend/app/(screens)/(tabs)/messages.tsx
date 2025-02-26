import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import {Feather} from '@expo/vector-icons';
import HttpService from "@/utils/httpService";
import {formattedDate} from "@/utils/common";
import {MainLayoutContext} from "@/providers/main-provider";
import Loading from "@/components/Loading";

const MessageScreen = () => {
    const {setNotificationCount} = useContext(MainLayoutContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Initial data load
     * */
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Fetch the data for home page
     * */
    const fetchData = async () => {
        setLoading(true);
        try {
            // Retrieve the product data
            const response = await HttpService.get('/api/notifications');
            if (response.data.success) {
                setNotifications(response.data.data);
                setNotificationCount(response.data.data.length);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Mark as read functionality
     * @param id
     * */
    const markAsRead = async (id: string) => {
        try {
            // Retrieve the product data
            const response = await HttpService.put(`/api/notifications/${id}/read`);
            if (response.data.success) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === id ? {...notification, read: true} : notification
                    )
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    };

    /**
     * Delete selected notification
     * @param id
     * */
    const deleteSelectedNotification = async (id: string) => {
        try {
            // Retrieve the product data
            const response = await HttpService.delete(`/api/notifications/${id}`);
            if (response.data.success) {
                setNotifications((prev) => prev.filter((item) => item.id !== id));
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    };

    /**
     * Delete selected notification
     * @param id
     * */
    const deleteAllNotifications = async (id: string) => {
        try {
            // Retrieve the product data
            const response = await HttpService.delete(`/api/notifications`);
            if (response.data.success) {
                setNotifications([]);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    };

    /**
     * All notification clear handler
     * */
    const handleClearAll = () => {
        Alert.alert('Clear All Notifications', 'Are you sure you want to clear all notifications?', [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Clear All', onPress: () => deleteAllNotifications()},
        ]);
    };

    /**
     * Single notification clear handler
     * @param id
     * */
    const handleClearSingle = (id: string) => {
        Alert.alert('Clear Notification', 'Are you sure you want to clear this notification?', [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Clear', onPress: () => deleteSelectedNotification(id)},
        ]);
    };

    /**
     * Notification component item render function
     * @param id
     * */
    const renderItem = ({item}: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationItem, item.read && styles.readNotification]}
            onPress={() => markAsRead(item.id)}
        >
            <Feather name={item.type} size={26} color={item.read ? '#aaa' : '#1E88E5'}/>
            <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, item.read && styles.readTitle]}>
                    {item.content}
                </Text>
                <Text style={[styles.notificationTimestamp, item.read && styles.readTimestamp]}>
                    {formattedDate(item.created_at)}
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleClearSingle(item.id)}>
                <Feather name="x-circle" size={22} color="#e74c3c"/>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Clear All Button */}
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TouchableOpacity style={[styles.clearButton, {marginRight: "auto"}]} onPress={fetchData}>
                    <Text style={styles.clearButtonText}>Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.clearButton, notifications.length === 0 && styles.buttonDisabled]} onPress={handleClearAll} disabled={notifications.length === 0}>
                    <Text style={[styles.clearButtonText, notifications.length === 0 && styles.buttonDisabled]}>Clear All Notifications</Text>
                </TouchableOpacity>
            </View>

            {(notifications.length === 0 && !loading) && (
                <View style={{width: '100%'}}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        paddingVertical: 20,
                        paddingLeft: 10,
                        textTransform: 'capitalize',
                        textAlign: 'center'
                    }}>No Notifications</Text>
                </View>
            )}

            {/* Display the loading */}
            {loading && (
                <Loading/>
            )}

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.notificationList}
            />
        </View>
    );
};

// Define the valid Feather icon names
type FeatherIconName =
    | 'filter'
    | 'bold'
    | 'underline'
    | 'mail'
    | 'download'
    | 'lock'
    | 'user-plus'
    | 'type'
    | 'key'
    | 'map'
    | 'search'
    | 'repeat'
    | 'anchor'
    | 'link'
    | 'code'
    | 'menu'
    | 'video'
    | 'circle'
    | 'home'; // Add any other valid icons you need

type Notification = {
    id: string;
    content: string;
    created_at: string;
    type: FeatherIconName;
    read: boolean;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    header: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15, // Reduced margin for better button placement
        textAlign: 'center',
        letterSpacing: 1,
    },
    notificationList: {
        paddingBottom: 80, // Ensure the button is still visible when scrolling
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    notificationContent: {
        marginLeft: 18,
        flex: 1,
    },
    notificationTitle: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    notificationTimestamp: {
        fontSize: 13,
        color: '#777',
        marginTop: 6,
    },
    readNotification: {
        backgroundColor: '#e0e0e0',
    },
    readTitle: {
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
    readTimestamp: {
        color: '#aaa',
    },
    clearButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00796b',
        marginBottom: 15,
        alignSelf: 'center',
    },
    clearButtonText: {
        color: '#00796b',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonDisabled: {
        borderColor: '#d7d7d7',
        color: '#acacac',
    },
});

export default MessageScreen;
