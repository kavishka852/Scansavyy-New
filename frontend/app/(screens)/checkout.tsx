import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { PaymentLoadingModal, PaymentSuccessModal } from '@/components/Scansavy_Prop/Payment';
import HttpService from "@/utils/httpService";
import {useAuthorization} from "@/hooks/useAuthorization";
import {priceFormat} from "@/utils/common";
import {router, useLocalSearchParams} from "expo-router";
import {PaymentService} from "@/services/payment-service";

const CheckoutScreen: React.FC = () => {
    const {checkAccess} = useAuthorization();
    const {product, qty, cart_id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [checkOutSubTotal, setCheckOutSubTotal] = useState<number>(0);
    const [checkOutTotal, setCheckOutTotal] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(3500);
    const [tax, setTax] = useState<number>(1250);

    /**
     * Initial data load
     * */
    useEffect(() => {
        // Check user access before fetching data
        checkAccess();
        // Fetch the product data when the component mounts
        fetchCheckOutData(product, qty);
    }, []);

    /**
     * Fetch the checkout data
     * */
    const fetchCheckOutData = async (productId: string, qty: number) => {
        try {
            setLoading(true);
            // Prepare the url
            let url = '/api/cart';
            if (productId) {
                url += `?product_id=${productId}&qty=${qty}&cart_id=${cart_id}`;
            }
            // Retrieve the product data
            const response = await HttpService.get(url);
            if (response.data.success) {
                setCheckOutSubTotal(response.data.data.total);
                setCheckOutTotal(response.data.data.total + tax + shippingCost);
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Card number format function
     * @param text
     * */
    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = cleaned.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length > 0 ? parts.join(' ') : cleaned;
    };

    /**
     * Updated handlePayNow function for your CheckoutScreen
     * */
    const handlePayNow = async () => {
        try {
            // First validate the address
            const addressData = {
                address,
                city,
                postal_code: postalCode,
                country
            };
            PaymentService.validateAddress(addressData);

            // Prepare payment request data
            const paymentData: PaymentRequest = {
                amount: checkOutTotal,
                subtotal: checkOutSubTotal,
                shipping_cost: shippingCost,
                tax: tax,
                payment_method: paymentMethod as 'credit_card' | 'paypal',
                ...addressData,
                product_id: product,
                cart_id: cart_id,
                quantity: parseInt(qty as string)
            };

            // If credit card payment, validate and add card details
            if (paymentMethod === 'credit_card') {
                const cardData = {
                    card_number: cardNumber,
                    expiry,
                    cvv
                };
                PaymentService.validateCardDetails(cardData);
                Object.assign(paymentData, cardData);
            }

            // Show loading
            setLoading(true);

            // Process payment
            const response = await PaymentService.processPayment(paymentData);

            // Handle success
            if (response.success) {
                // Clear form fields after successful payment
                PaymentService.clearFormFields({
                    setAddress,
                    setCity,
                    setPostalCode,
                    setCountry,
                    setCardNumber,
                    setExpiry,
                    setCvv,
                    setPaymentMethod
                });

                // Display the payment success message
                setPaymentSuccess(true);
            } else {
                Alert.alert('Payment Failed', response.error || 'There was an issue processing your payment');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            {/* Back Button and Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="arrowleft" size={24} color="#1D1D1F" />
                </TouchableOpacity>
                <Text style={styles.header}>Checkout</Text>
                <View style={{ width: 40 }}>
                    <Text>{''}</Text>
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Order Summary Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.value}>LKR {priceFormat(checkOutSubTotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.label}>Shipping</Text>
                        <Text style={styles.value}>LKR {priceFormat(shippingCost)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.label}>Tax</Text>
                        <Text style={styles.value}>LKR {priceFormat(tax)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>LKR {priceFormat(checkOutTotal)}</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Customer Address</Text>
                    <View style={styles.divider} />
                    <TextInput
                        placeholder="Street Address"
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                    />
                    <TextInput
                        placeholder="City"
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                    />
                    <TextInput
                        placeholder="Postal Code"
                        style={styles.input}
                        keyboardType="numeric"
                        value={postalCode}
                        onChangeText={setPostalCode}
                    />
                    <TextInput
                        placeholder="Country"
                        style={styles.input}
                        value={country}
                        onChangeText={setCountry}
                    />
                </View>
                {/* Payment Methods */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'credit_card' && styles.selectedPayment]}
                        onPress={() => setPaymentMethod('credit_card')}
                    >
                        <View style={styles.paymentIconContainer}>
                            <AntDesign name="creditcard" size={24} color={paymentMethod === 'credit_card' ? '#007AFF' : '#666'} />
                        </View>
                        <Text style={[styles.paymentText, paymentMethod === 'credit_card' && styles.selectedPaymentText]}>
                            Credit Card
                        </Text>
                        {paymentMethod === 'credit_card' && (
                            <MaterialIcons name="check-circle" size={24} color="#007AFF" style={styles.checkIcon} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'paypal' && styles.selectedPayment]}
                        onPress={() => setPaymentMethod('paypal')}
                    >
                        <View style={styles.paymentIconContainer}>
                            <FontAwesome name="paypal" size={24} color={paymentMethod === 'paypal' ? '#007AFF' : '#666'} />
                        </View>
                        <Text style={[styles.paymentText, paymentMethod === 'paypal' && styles.selectedPaymentText]}>
                            PayPal
                        </Text>
                        {paymentMethod === 'paypal' && (
                            <MaterialIcons name="check-circle" size={24} color="#007AFF" style={styles.checkIcon} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Card Details */}
                {paymentMethod === 'credit_card' && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Card Details</Text>
                        <View style={styles.divider} />
                        <Text style={styles.inputLabel}>Card Number</Text>
                        <TextInput
                            placeholder="4242 4242 4242 4242"
                            style={styles.input}
                            keyboardType="numeric"
                            value={cardNumber}
                            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                            maxLength={19}
                        />
                        <View style={styles.cardRow}>
                            <View style={[{ flex: 1, marginRight: 10 }]}>
                                <Text style={styles.inputLabel}>Expiry Date</Text>
                                <TextInput
                                    placeholder="MM/YY"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={expiry}
                                    onChangeText={setExpiry}
                                    maxLength={5}
                                />
                            </View>
                            <View style={[{ flex: 1 }]}>
                                <Text style={styles.inputLabel}>CVV</Text>
                                <TextInput
                                    placeholder="123"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={cvv}
                                    onChangeText={setCvv}
                                    maxLength={3}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Checkout Button */}
                <TouchableOpacity style={{paddingBottom: 16}} onPress={handlePayNow}>
                    <LinearGradient
                        colors={['#007AFF', '#00C6FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.checkoutButton}
                    >
                        <MaterialIcons name="lock" size={24} color="white" />
                        <Text style={styles.checkoutText}>Pay LKR {priceFormat(checkOutTotal)}</Text>
                    </LinearGradient>
                    {/* Loading Modal */}
                    <PaymentLoadingModal visible={loading} />

                    {/* Success Modal */}
                    <PaymentSuccessModal
                        visible={paymentSuccess}
                        onClose={() => {
                            setPaymentSuccess(false);
                            router.push('/(screens)/(tabs)');
                        }}
                        amount={`LKR ${priceFormat(checkOutTotal)}`}  // You can pass the actual amount here
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
        paddingBottom: 10,
        backgroundColor: '#F5F5F7',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D1D1F',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1D1D1F',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        color: '#6E6E73',
    },
    value: {
        fontSize: 16,
        color: '#1D1D1F',
        fontWeight: '500',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D1D1F',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        backgroundColor: '#F5F5F7',
    },
    selectedPayment: {
        backgroundColor: '#E8F2FF',
        borderColor: '#007AFF',
        borderWidth: 1,
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    paymentText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#1D1D1F',
        flex: 1,
    },
    selectedPaymentText: {
        fontWeight: '600',
        color: '#007AFF',
    },
    checkIcon: {
        marginLeft: 'auto',
    },
    inputLabel: {
        fontSize: 14,
        color: '#6E6E73',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F7',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 12,
        color: '#1D1D1F',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkoutButton: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    checkoutText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginLeft: 12,
    },
});

export default CheckoutScreen;

