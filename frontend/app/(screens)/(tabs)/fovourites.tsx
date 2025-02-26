import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import {router} from 'expo-router';
import {priceFormat} from "@/utils/common";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import {useAuthorization} from "@/hooks/useAuthorization";
import HttpService from "@/utils/httpService";
import Loading from "@/components/Loading";

const FavouritesScreen = () => {
    const {checkAccess} = useAuthorization();
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<any>([]);

    /**
     * Initial data load
     * */
    useEffect(() => {
        // Check user access before fetching data
        checkAccess();
        // Fetch the product data when the component mounts
        fetchData();
    }, []);

    /**
     * Fetch the data for home page
     * */
    const fetchData = async () => {
        try {
            setLoading(true);
            // Retrieve the product data
            const response = await HttpService.get('/api/favourites');
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
    
    /**
     * Remove the product from favorites
     * @param productId
     * */
    const removeFromFavourites = async (productId: string) => {
        try {
            // Add the loading
            Alert.alert('Loading', 'Item removing from wishlist, please wait!', []);

            // Retrieve the product data
            const response = await HttpService.delete(`/api/favourites/${productId}`);

            if (response.data.success) {
                Alert.alert('Success', 'Item successfully removed from favorites.');
                fetchData();
                return;
            }
            Alert.alert('Success', response.data.data.message);
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    }

    return (
        <View style={{width: '100%', paddingHorizontal: 10, marginBottom: 100}}>
            <View style={{
                marginTop: 20,
                marginBottom: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontFamily: "Montserrat",
                    fontWeight: 'bold',
                    fontSize: 30,
                    marginRight: 'auto',
                    marginLeft: 10,
                }}>Favourites</Text>
                <TouchableOpacity style={[styles.clearButton]} onPress={fetchData}>
                    <Text style={styles.clearButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginTop: 10
            }}>
                {(products.length === 0 && !loading) && (
                    <View style={{width: '100%', backgroundColor: '#e8e8e8', borderRadius: 12, marginTop: 15}}>
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
                {loading && (
                    <Loading/>
                )}
                {!loading && products.map((item: any, index: number) => (
                    <View style={styles.cardContainer} key={item._id}>
                        <View
                            style={styles.card}
                        >
                            {/* Product Image */}
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{uri: item.images[0]}}
                                    style={styles.image}
                                    onPress={() => router.push(`/(screens)/productDetails?product=${item.product_id}`)}
                                />
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{item.discount}% OFF</Text>
                                </View>
                            </View>

                            {/* Product Details */}
                            <View style={styles.detailsContainer}>
                                {/* Title */}
                                <Text numberOfLines={2} style={styles.title} onPress={() => router.push(`/(screens)/productDetails?product=${item.product_id}`)}>
                                    {item.name}
                                </Text>

                                {/* Price and Rating Section */}
                                <View style={styles.priceRatingContainer}>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.currentPrice}>LKR {priceFormat(item.price)}</Text>
                                        <Text style={styles.originalPrice}>LKR {priceFormat(item.original_price)}</Text>
                                    </View>

                                    <View style={styles.ratingContainer}>
                                        <FontAwesome name="star" size={16} color="#F59E0B"/>
                                        <Text style={styles.ratingText}>{item.ratings}</Text>
                                    </View>
                                </View>

                                {/* Category and Stock */}
                                <View style={styles.bottomContainer}>
                                    <Text style={styles.categoryText}>{item.category}</Text>
                                    <Text
                                        style={item.qty > 0 ? styles.InStockText : styles.OutOfStockText}>{item.qty > 0 ? "In Stock" : "Out Of Stock"}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={{ color: 'red', textAlign: 'center', cursor: 'pointer' }} onPress={() => removeFromFavourites(item.product_id)}>Delete</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    list: {
        justifyContent: 'space-between',
        paddingBottom: 100, // Ensure padding to avoid overlap with the navigator
    },
    cardContainer: {
        width: '50%',
        padding: 8,
    },
    imageContainer: {
        position: 'relative',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#EF4444',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailsContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        height: 44, // Approximately 2 lines
    },
    priceRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceContainer: {
        flex: 1,
    },
    currentPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    originalPrice: {
        fontSize: 13,
        color: '#6B7280',
        textDecorationLine: 'line-through',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        color: '#4B5563',
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: '100%', // Ensure the image covers the card
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    cardContent: {
        padding: 12,
        zIndex: 2,
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#ddd',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
        marginTop: 4,
    },
    emptyText: {
        fontSize: 18,
        color: '#bbb',
        textAlign: 'center',
        marginTop: 50,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 14,
        color: '#6B7280',
    },
    InStockText: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '500',
    },
    OutOfStockText: {
        fontSize: 14,
        color: '#ff0000',
        fontWeight: '500',
    },
    clearButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginLeft: 'auto',
        borderColor: '#1e90ff',
        alignSelf: 'center',
    },
    clearButtonText: {
        color: '#1e90ff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default FavouritesScreen;
