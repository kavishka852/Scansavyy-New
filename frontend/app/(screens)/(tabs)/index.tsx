import {
    View,
    Text,
    SafeAreaView,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    Alert
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {FontAwesome5, FontAwesome} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import DiscountBanner from '@/components/Scansavy_Prop/discount';
import HttpService from "@/utils/httpService";
import {getSecureItem, SECURE_STORAGE_KEYS} from "@/utils/secureStoreUtils";
import {useAuthorization} from "@/hooks/useAuthorization";
import {priceFormat} from "@/utils/common";
import Loading from "@/components/Loading";

const {width: screenWidth} = Dimensions.get('window')

const HomeScreens = () => {
    const router = useRouter();
    const {checkAccess} = useAuthorization();
    const [products, setProducts] = useState<any>([]);
    const [username, setUsername] = useState<string>("John Doe");

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
            // Get the user name from storage
            const user = JSON.parse(await getSecureItem(SECURE_STORAGE_KEYS.USER_DATA));
            setUsername(user.name);

            // Retrieve the product data
            const response = await HttpService.get('/api/product/list?category=Laptops');
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    }

    return (
        <SafeAreaView style={styles.box}>
            <ScrollView style={styles.container}>
                <DiscountBanner
                    discount="20% OFF"
                    description="on your first order"
                    code={`WELCOME ${username.toUpperCase()}`}
                />

                {/* {Search product} */}
                <View style={styles.boxSearch}>
                    <View style={styles.boxSearchContent}>
                        <Text style={styles.searchTitle}>
                            What do you want
                        </Text>
                        <Text style={styles.searchTitle}>
                            to try?
                        </Text>
                        <View style={{paddingVertical: 30, position: 'relative'}}>
                            <TextInput placeholder='E.g. Nero PC House' style={{
                                height: 50, paddingRight: 10, paddingVertical: 20,
                                borderRadius: 7, backgroundColor: '#F0F1F1', paddingLeft: 40
                            }} placeholderTextColor={'gray'}></TextInput>
                            <TouchableOpacity style={{position: 'absolute', top: 43, left: 10}}>
                                <FontAwesome name="map-marker" size={24} color="gray"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* category */}
                <View style={{width: '100%', padding: 20}}>
                    {/* Title */}
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                        <FontAwesome5 name="shopping-cart" size={20} color="#1E90FF"/>
                        <Text style={{fontWeight: 'bold', fontSize: 16, paddingLeft: 10}}>Our Services</Text>
                    </View>

                    {/* Icons and Text */}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {[
                            {icon: <FontAwesome name="qrcode" size={30} color="#1E90FF"/>, label: 'Smart QR Scanner'},
                            {
                                icon: <FontAwesome name="camera" size={30} color="#1E90FF"/>,
                                label: 'Instant Image Capture'
                            },
                            {
                                icon: <FontAwesome5 name="bell" size={30} color="#1E90FF"/>,
                                label: 'Stock Release Alerts'
                            },
                            {icon: <FontAwesome name="heart" size={30} color="#1E90FF"/>, label: 'Recommend Alerts'},
                            {
                                icon: <FontAwesome name="gift" size={30} color="#1E90FF"/>,
                                label: 'Exclusive Deals Today'
                            },
                            {
                                icon: <FontAwesome name="shopping-cart" size={30} color="#1E90FF"/>,
                                label: 'Pick your item'
                            },
                        ].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: '30%',
                                    alignItems: 'center',
                                    marginBottom: 20,
                                }}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#EBEBEB',
                                    }}
                                >
                                    {item.icon}
                                </View>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginTop: 10,
                                        color: '#000',
                                        fontFamily: 'Montserrat',
                                        fontSize: 12,
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* list PC */}

                <View style={{width: '100%', paddingHorizontal: 10, marginBottom: 100 }}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                        <FontAwesome name="plane" size={30} color="#1E90FF"/>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            paddingVertical: 20,
                            paddingLeft: 10,
                            textTransform: 'capitalize'
                        }}>PC 2024 (hot)</Text>
                    </View>
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}>
                        {products.length === 0 && (
                            <Loading/>
                        )}
                        {products.map((item: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.cardContainer}
                                onPress={() => router.push(`/(screens)/productDetails?product=${item._id}`)}
                            >
                                <View style={styles.card}>
                                    {/* Product Image */}
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{uri: item.images[0]}}
                                            style={styles.image}
                                        />
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>{item.discount}% OFF</Text>
                                        </View>
                                    </View>

                                    {/* Product Details */}
                                    <View style={styles.detailsContainer}>
                                        {/* Title */}
                                        <Text numberOfLines={2} style={styles.title}>
                                            {item.title}
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
                                            <Text style={item.qty > 0 ? styles.InStockText : styles.OutOfStockText}>{item.qty > 0 ? "In Stock" : "Out Of Stock"}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    box: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        width: '100%',
        height: '100%',
    },
    headerTop: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: '600',
        color: '#1E90FF'
    },
    boxSearch: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 30
    },
    boxSearchContent: {
        width: '100%',
    },
    searchTitle: {
        fontSize: 30,
        fontWeight: '500',
        color: '#000',
        fontFamily: "Montserrat",
        letterSpacing: 2,
        lineHeight: 40
    },
    cardContainer: {
        width: '50%',
        padding: 8,
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
})

export default HomeScreens