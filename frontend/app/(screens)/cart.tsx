import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import {router, useLocalSearchParams} from 'expo-router';
import {useAuthorization} from "@/hooks/useAuthorization";
import HttpService from "@/utils/httpService";
import {priceFormat} from "@/utils/common";
import Loading from "@/components/Loading";

const CartScreen: React.FC = () => {
    const {checkAccess} = useAuthorization();
    const [loading, setLoading] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    /**
     * Initial data load
     * */
    useEffect(() => {
        // Check user access before fetching data
        checkAccess();
        // Fetch the product data when the component mounts
        fetchCartData();
    }, []);

    /**
     * Fetch the cart data
     * */
    const fetchCartData = async () => {
        try {
            setLoading(true);
            // Retrieve the product data
            const response = await HttpService.get('/api/cart');
            if (response.data.success) {
                setCartItems(response.data.data.items);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Handle cart item quantity update
     * @param id
     * @param qty
     * @param color
     * */
    const handleQuantityChange = async (id: string, qty: number, color: string) => {
        try {
            // Check if the quantity is less than 0
            if (qty < 1) {
                return;
            }
            // Add the loading
            Alert.alert('Loading', 'Updating the cart, please wait!', []);

            // Retrieve the product data
            const response = await HttpService.post('/api/cart/add', {
                product_id: id,
                color: color,
            });

            if (response.data.success) {
                // Dismiss loading alert by showing success message
                Alert.alert('Success', 'Cart updated successfully');

                // Update the cart data
                setCartItems((prev) =>
                    prev.map((item) =>
                        item.id === id ? {...item, cart_qty: response.data.data.quantity} : item
                    )
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    };

    /**
     * Handle cart item remove
     * @param id
     * @param color
     * */
    const handleRemove = async (id: string, color: string) => {
        try {
            // Add the loading
            Alert.alert('Loading', 'Removing the cart item, please wait!', []);

            // Retrieve the product data
            const response = await HttpService.delete(`/api/cart/${id}/${color}`);

            if (response.data.success) {
                // Dismiss loading alert by showing success message
                Alert.alert('Success', 'Item successfully removed!');

                // Update the cart data
                fetchCartData();
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    };

    /**
     * Calculate cart total
     * */
    const calculateTotal = (): string => {
        const total = cartItems
            .reduce((total, item) => total + item.price * item.cart_qty, 0);
        return priceFormat(total);
    };

    /**
     * Render the cart item component
     * */
    const renderItem = ({item}: { item: CartItem }) => (
        <View key={item.id + item.color} style={styles.cartItem}>
            {typeof item.image === 'string' ? (
                <Image source={{uri: item.image}} style={styles.productImage}/>
            ) : (
                <Image source={item.image} style={styles.productImage}/>
            )}
            <View style={styles.details}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>LKR {priceFormat(item.price)}</Text>
                <Text style={styles.productColor}>{item.color}</Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.cart_qty - 1, item.color)}>
                            <AntDesign name="minuscircle" size={24} color="gray"/>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.cart_qty}</Text>
                        <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.cart_qty + 1, item.color)}>
                            <AntDesign name="pluscircle" size={24} color="#1E90FF"/>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: "auto" }}>
                        <Text style={styles.stockText}>{item.cart_qty > 0 ? "In Stock" : "Out Of Stock"}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id, item.color)}>
                <Feather name="trash-2" size={24} color="red"/>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Refresh Button */}
            <View style={{
                marginTop: 40,
                marginBottom: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => router.push(`/(screens)/(tabs)`)} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={20} color="white" />
                </TouchableOpacity>
                <Text style={{
                    textAlign: 'center',
                    fontFamily: "Montserrat",
                    fontWeight: 'bold',
                    fontSize: 30,
                    marginRight: 'auto',
                }}>Cart</Text>
                <TouchableOpacity style={[styles.clearButton]} onPress={fetchCartData}>
                    <Text style={styles.clearButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            {(cartItems.length === 0 && !loading) && (
                <View style={{width: '100%', backgroundColor: '#f1f1f1', borderRadius: 12}}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        paddingVertical: 20,
                        paddingLeft: 10,
                        textTransform: 'capitalize',
                        textAlign: 'center'
                    }}>No Items Found</Text>
                </View>
            )}

            {/* Display the loading */}
            {loading && (
                <Loading/>
            )}

            {/* Product List */}
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id + '-' + item.color}
                contentContainerStyle={styles.listContainer}
            />

            {/* Cart Summary */}
            <View style={styles.summary}>
                <View style={{display: "flex", flexDirection: "row"}}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={[styles.totalText, {marginLeft: "auto"}]}>LKR {calculateTotal()}</Text>
                </View>
                <TouchableOpacity disabled={cartItems.length === 0} style={[styles.checkoutButton, cartItems.length === 0 && styles.buttonDisabled]} onPress={() => {
                    router.push('/(screens)/checkout');
                }}>
                    <Text style={styles.checkoutText}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

interface CartItem {
    id: string;
    name: string;
    color: string;
    price: number;
    image: string;
    cart_qty: number;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingLeft: 15,
        paddingRight: 15
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    listContainer: {
        padding: 0,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    details: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    productPrice: {
        fontSize: 14,
        color: 'gray',
        marginVertical: 5,
    },
    productColor: {
        fontSize: 14,
        color: 'gray',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 10,
        color: 'black',
    },
    summary: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    checkoutButton: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1e90ff',
        alignSelf: 'center',
    },
    clearButtonText: {
        color: '#1e90ff',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#1E90FF',
        borderRadius: 20,
        width: 35,
        height: 35,
        marginRight: 10
    },
    stockText: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '500',
    },
});

export default CartScreen;
