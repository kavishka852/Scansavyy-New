import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import {router, useRouter} from 'expo-router';
import HttpService from "@/utils/httpService";
import Loading from "@/components/Loading";
import {capitalize, priceFormat} from "@/utils/common";

const PurchaseHistoryScreen = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    /**
     * Initial data load
     * */
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Fetch the purchase history
     * */
    const fetchData = async () => {
        setRefreshing(true);
        try {
            // Retrieve the transaction data
            const response = await HttpService.get('/api/checkout/history');
            if (response.data.success) {
                setTransactions(response.data.data);
            }
            // You would typically fetch new data here
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    }

    /**
     * Get the color according to the status
     * @param status
     * */
    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return '#4CAF50';
            case 'pending':
                return '#FFC107';
            case 'refunded':
                return '#F44336';
            default:
                return '#000000';
        }
    };

    /**
     * Get the category icon
     * @param category
     * */
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'laptop':
                return 'laptop';
            case 'monitor':
                return 'desktop';
            case 'entertainment':
                return 'gamepad';
            default:
                return 'shopping-bag';
        }
    };

    /**
     * Render the transaction item component
     * @param item
     * */
    const renderTransaction = ({item}: { item: Payment }) => (
        <TouchableOpacity
            style={styles.transactionCard}
            onPress={() => {
                router.push(`/purchaseDetails?payment_id=${item.transaction_id}`);
            }}
        >
            <View style={styles.iconContainer}>
                <FontAwesome5
                    name={getCategoryIcon('shopping-bag')}
                    size={24}
                    color="#007AFF"
                />
            </View>
            <View style={styles.transactionContent}>
                <View style={styles.transactionHeader}>
                    <View style={styles.merchantInfo}>
                        <Text style={styles.merchantName}>Order ID:</Text>
                        <Text style={styles.merchantId}>{item.transaction_id.slice(0, 10)}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amount}>
                            LKR {priceFormat(item.amount)}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            {backgroundColor: getStatusColor(item.status) + '20'}
                        ]}>
                            <Text style={[
                                styles.status,
                                {color: getStatusColor(item.status)}
                            ]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.transactionFooter}>
                    <View style={styles.paymentMethodContainer}>
                        <FontAwesome5 name={item.payment_method == "paypal" ? "paypal" : "credit-card"} size={12} color="#666"/>
                        <Text style={styles.paymentMethod}>{capitalize(item.payment_method)}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <MaterialIcons name="access-time" size={12} color="#666"/>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark"/>

            <View style={styles.header}>
                <Text style={styles.title}>Purchase History</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <MaterialIcons name="filter-list" size={24} color="#007AFF"/>
                </TouchableOpacity>
            </View>

            <View style={{
                marginTop: 30,
                marginBottom: 10,
                marginRight: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TouchableOpacity style={[styles.clearButton]} onPress={fetchData}>
                    <Text style={styles.clearButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#666"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search transactions..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Display the loading */}
            {refreshing && (
                <Loading/>
            )}

            <FlatList
                data={transactions}
                keyExtractor={item => item._id}
                renderItem={({item}) => (
                    <View style={styles.dateGroup}>
                        <Text style={styles.dateHeader}>{item._id}</Text>
                        {item.payments.map(transaction => (
                            <View key={transaction._id}>
                                {renderTransaction({item: transaction})}
                            </View>
                        ))}
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

// Types
interface Payment {
    _id: string;
    user_id: string;
    amount: number;
    payment_method: string;
    transaction_id: string;
    card_details?: string | null;
    status: string;
    time: string;
}

interface Transaction {
    _id: string;
    payments: Payment[];
}

interface TransactionGrouping {
    title: string;
    data: Transaction[];
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212529',
    },
    filterButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        padding: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#212529',
    },
    listContainer: {
        padding: 16,
    },
    dateGroup: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 12,
    },
    transactionCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    transactionContent: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    merchantInfo: {
        flex: 1,
        marginRight: 16,
    },
    merchantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    merchantId: {
        fontSize: 14,
        fontWeight: '500',
        color: '#212529',
        marginBottom: 4,
    },
    categoryContainer: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    category: {
        fontSize: 12,
        color: '#6C757D',
        fontWeight: '500',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentMethod: {
        fontSize: 12,
        color: '#6C757D',
        marginLeft: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        color: '#6C757D',
        marginLeft: 4,
    },
    clearButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1e90ff',
        alignSelf: 'center',
        marginLeft: 'auto'
    },
    clearButtonText: {
        color: '#1e90ff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default PurchaseHistoryScreen;
