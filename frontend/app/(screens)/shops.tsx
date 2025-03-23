import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {priceFormat} from "@/utils/common";
import {FontAwesome} from "@expo/vector-icons";
import {useAuthorization} from "@/hooks/useAuthorization";
import HttpService from "@/utils/httpService";
import Loading from "@/components/Loading";
import {getSecureItem, SECURE_STORAGE_KEYS} from "@/utils/secureStoreUtils";

const Shops = () => {
    const {shop} = useLocalSearchParams();
    const {checkAccess} = useAuthorization();
    const [shopLoading, setShopLoading] = useState<boolean>(true);
    const [shops, setShops] = useState<any>([]);

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
     * Fetch all the shops
     * */
    const fetchData = async () => {
        try {
            let url = '/api/shops';
            if (shop) {
                url += `?name=${shop}`;
            }
            // Retrieve the shops
            const response = await HttpService.get(url);
            if (response.data.success) {
                setShops(response.data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setShopLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.box}>
            <ScrollView style={styles.container}>
                <View style={{width: '100%', paddingHorizontal: 20, marginBottom: 100}}>
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        marginTop: 10
                    }}>
                        {shopLoading && (
                            <Loading/>
                        )}
                        {(shops.length === 0 && !shopLoading) && (
                            <View style={{width: '100%', backgroundColor: '#e8e8e8', borderRadius: 12, marginTop: 10}}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    paddingVertical: 20,
                                    paddingLeft: 10,
                                    textTransform: 'capitalize',
                                    textAlign: 'center'
                                }}>No Shops Found</Text>
                            </View>
                        )}
                        {!shopLoading && shops.map((item: any, index: number) => (
                            <View style={styles.cardContainer} key={`shops-${item._id}-${index}`}>
                                <View
                                    style={styles.card}
                                >
                                    {/* Shop Image */}
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{uri: item.image}}
                                            style={styles.image}
                                            onPress={() => router.push(`/(screens)/shopDetails?id=${item._id}`)}
                                        />
                                    </View>

                                    {/* Shop Details */}
                                    <View style={styles.detailsContainer}>
                                        {/* Name */}
                                        <Text numberOfLines={2} style={styles.title} onPress={() => router.push(`/(screens)/shopDetails?id=${item._id}`)}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingBottom: 0
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
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
        height: '100%',
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
        width: '100%',
        textAlign: 'center',
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
        textAlign: 'center',
        color: '#1e90ff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Shops;
