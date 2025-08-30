import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import { useAuthorization } from "@/hooks/useAuthorization";
import HttpService from "@/utils/httpService";
import Loading from "@/components/Loading";

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 16; // Account for padding

const Shops = () => {
    const { shop } = useLocalSearchParams();
    const { checkAccess } = useAuthorization();
    const [shopLoading, setShopLoading] = useState(true);
    const [shops, setShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const filteredShops = shops.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderSkeletonLoaders = () => {
        return Array(4).fill(0).map((_, index) => (
            <View style={[styles.cardContainer, { opacity: 0.6 }]} key={`skeleton-${index}`}>
                <View style={styles.card}>
                    <View style={[styles.imageContainer, { backgroundColor: '#e0e0e0' }]}>
                        <View style={{ width: '100%', height: 120 }} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <View style={{ height: 20, width: '80%', backgroundColor: '#e0e0e0', borderRadius: 4, marginBottom: 8 }} />
                        <View style={{ height: 16, width: '60%', backgroundColor: '#e0e0e0', borderRadius: 4 }} />
                    </View>
                </View>
            </View>
        ));
    };

    const renderShopItem = (item, index) => {
        if (viewMode === 'grid') {
            return (
                <TouchableOpacity 
                    style={styles.cardContainer} 
                    key={`shops-${item._id}-${index}`}
                    onPress={() => router.push(`/(screens)/shopDetails?id=${item._id}`)}
                    activeOpacity={0.8}
                >
                    <View style={styles.card}>
                        {/* Blue Line/Border at the top */}
                        <View style={styles.blueBorder} />
                        
                        {/* Shop Image with Gradient Overlay */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />
                            <View style={styles.gradientOverlay} />
                        </View>

                        {/* Shop Details */}
                        <View style={styles.detailsContainer}>
                            {/* Name */}
                            <Text numberOfLines={2} style={styles.title}>
                                {item.name}
                            </Text>
                            
                            {/* Additional Info (if available from API) */}
                            {item.category && (
                                <Text style={styles.categoryText}>
                                    {item.category}
                                </Text>
                            )}
                            
                            {/* Rating (if available from API) */}
                            {item.rating && (
                                <View style={styles.ratingContainer}>
                                    <FontAwesome name="star" size={14} color="#FFD700" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else {
            // List view
            return (
                <TouchableOpacity 
                    style={styles.listItemContainer} 
                    key={`shops-list-${item._id}-${index}`}
                    onPress={() => router.push(`/(screens)/shopDetails?id=${item._id}`)}
                    activeOpacity={0.8}
                >
                    <View style={styles.listItem}>
                        {/* Blue Line/Border on the left */}
                        <View style={styles.listItemBlueBorder} />
                        
                        {/* Shop Image */}
                        <Image
                            source={{ uri: item.image }}
                            style={styles.listItemImage}
                        />
                        
                        {/* Shop Details */}
                        <View style={styles.listItemDetails}>
                            <Text numberOfLines={1} style={styles.listItemTitle}>
                                {item.name}
                            </Text>
                            
                            {item.category && (
                                <Text style={styles.categoryText}>
                                    {item.category}
                                </Text>
                            )}
                            
                            {item.rating && (
                                <View style={styles.ratingContainer}>
                                    <FontAwesome name="star" size={14} color="#FFD700" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                </View>
                            )}
                        </View>
                        
                        <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <SafeAreaView style={styles.box}>
            {/* Header with Search and View Toggle */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search shops..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <FontAwesome name="times-circle" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity 
                    style={styles.viewToggle}
                    onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                    <FontAwesome 
                        name={viewMode === 'grid' ? 'list' : 'th-large'} 
                        size={18} 
                        color="#1F2937" 
                    />
                </TouchableOpacity>
            </View>
            
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.shopContainer}>
                    {shopLoading ? (
                        renderSkeletonLoaders()
                    ) : filteredShops.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <FontAwesome name="store" size={50} color="#D1D5DB" />
                            <Text style={styles.emptyText}>
                                {searchQuery.length > 0 
                                    ? `No shops found matching "${searchQuery}"`
                                    : 'No shops available'}
                            </Text>
                            {searchQuery.length > 0 && (
                                <TouchableOpacity 
                                    style={styles.clearButton}
                                    onPress={() => setSearchQuery('')}
                                >
                                    <Text style={styles.clearButtonText}>Clear Search</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <>
                            {filteredShops.map((item, index) => renderShopItem(item, index))}
                        </>
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#1F2937',
    },
    viewToggle: {
        marginLeft: 12,
        padding: 8,
    },
    shopContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
        paddingVertical: 12,
        paddingBottom: 100,
    },
    cardContainer: {
        width: '50%',
        padding: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        position: 'relative',
    },
    // Blue border at the top of each card in grid view
    blueBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#1e90ff',
        zIndex: 10,
    },
    imageContainer: {
        position: 'relative',
        height: 140,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    detailsContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: '#4B5563',
        marginLeft: 4,
    },
    emptyContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 16,
        textAlign: 'center',
    },
    clearButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1e90ff',
    },
    clearButtonText: {
        color: '#1e90ff',
        fontSize: 14,
        fontWeight: '600',
    },
    // List view styles
    listItemContainer: {
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    // Blue border on the left side for list view items
    listItemBlueBorder: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 4,
        backgroundColor: '#1e90ff',
    },
    listItemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        resizeMode: 'cover',
        marginLeft: 8, // Add some space after the blue border
    },
    listItemDetails: {
        flex: 1,
        paddingHorizontal: 12,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
});

export default Shops;