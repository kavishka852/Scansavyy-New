import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import {MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import HttpService from "@/utils/httpService";
import {capitalize, priceFormat} from "@/utils/common";
import Loading from "@/components/Loading";

const PurchaseDetailScreen = () => {
    const router = useRouter();
    const {payment_id} = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<Transaction>({
        _id: '',
        amount: 0,
        created_at: '',
        payment_method: '',
        products: [],
        shipping_address: {
            address: '',
            city: '',
            country: '',
            postal_code: ''
        },
        shipping_cost: 0,
        status: '',
        subtotal: 0,
        tax: 0,
        transaction_id: '',
        user_id: ''
    });

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
        setLoading(true);
        try {
            // Retrieve the transaction data
            const response = await HttpService.get(`/api/payment/${payment_id}`);
            if (response.data.success) {
                console.log(response.data.data)
                setTransaction(response.data.data);
            }
            // You would typically fetch new data here
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Get the color according to the status
     * @param status
     * */
    const getStatusColor = (status: string) => {
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
     * Format the date
     * @param date
     * */
    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back-ios" size={24} color="#007AFF"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <MaterialIcons name="share" size={24} color="#007AFF"/>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={{marginTop: 20}}>
                    <Loading/>
                </View>
            )}

            {!loading && (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Status Card */}
                    <View style={styles.card}>
                        <View style={styles.statusHeader}>
                            <View style={[
                                styles.statusBadge,
                                {backgroundColor: getStatusColor(transaction.status) + '20'}
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    {color: getStatusColor(transaction.status)}
                                ]}>
                                    {capitalize(transaction.status)}
                                </Text>
                            </View>
                            <Text style={styles.orderNumber}>Order #{transaction.transaction_id.slice(0, 10)}</Text>
                        </View>
                        <Text style={styles.dateText}>{formatDate(transaction.created_at)}</Text>
                    </View>

                    {/* Items Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Items</Text>
                        {transaction.products.map((item, index) => (
                            <View key={item._id} style={styles.itemContainer}>
                                <Image
                                    source={{uri: item.product_details.images[0]}}
                                    style={styles.itemImage}
                                />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{item.product_details.name}</Text>
                                    <Text style={styles.itemQuantity}>Quantity: {item.qty}</Text>
                                    <Text style={styles.itemPrice}>LKR {priceFormat(item.product_details.price * item.qty)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Payment Details Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Payment Details</Text>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Payment Method</Text>
                            <View style={styles.paymentMethod}>
                                <FontAwesome5 name={transaction.payment_method == "paypal" ? "paypal" : "credit-card"} size={16} color="#666"/>
                                <Text style={styles.paymentText}>{capitalize(transaction.payment_method)}</Text>
                            </View>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Subtotal</Text>
                            <Text style={styles.paymentText}>LKR {priceFormat(transaction.subtotal)}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Tax</Text>
                            <Text style={styles.paymentText}>LKR {priceFormat(transaction.tax)}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Shipping cost</Text>
                            <Text style={styles.paymentText}>LKR {priceFormat(transaction.shipping_cost)}</Text>
                        </View>
                        <View style={[styles.paymentRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>LKR {priceFormat(transaction.amount)}</Text>
                        </View>
                    </View>

                    {/* Shipping Address Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Shipping Address</Text>
                        <View style={styles.addressContainer}>
                            <MaterialIcons name="location-on" size={20} color="#666"/>
                            <Text style={styles.addressText}>{
                                `${transaction.shipping_address.address}, ${transaction.shipping_address.city}, ${transaction.shipping_address.postal_code}, ${transaction.shipping_address.country}`
                            }</Text>
                        </View>
                    </View>

                    {/* Support Button */}
                    <TouchableOpacity style={styles.supportButton}>
                        <MaterialIcons name="headset-mic" size={20} color="#fff"/>
                        <Text style={styles.supportButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

interface ProductDetails {
    name?: string;
    price?: number;
    images?: any;
}

interface Product {
    _id: string;
    product_details: ProductDetails;
    product_id: string;
    qty: number;
}

interface ShippingAddress {
    address: string;
    city: string;
    country: string;
    postal_code: string;
}

interface Transaction {
    _id: string;
    amount: number;
    created_at: string;
    payment_method: string;
    products: Product[];
    shipping_address: ShippingAddress;
    shipping_cost: number;
    status: string;
    subtotal: number;
    tax: number;
    transaction_id: string;
    user_id: string;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        paddingTop: 30,
        borderBottomColor: '#E9ECEF',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
    },
    shareButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderNumber: {
        fontSize: 16,
        color: '#6C757D',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 14,
        color: '#6C757D',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        paddingBottom: 16,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#212529',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6C757D',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentLabel: {
        fontSize: 14,
        color: '#6C757D',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentText: {
        fontSize: 14,
        color: '#212529',
        marginLeft: 8,
    },
    totalRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212529',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        color: '#212529',
        marginLeft: 8,
        lineHeight: 20,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 32,
    },
    supportButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default PurchaseDetailScreen;