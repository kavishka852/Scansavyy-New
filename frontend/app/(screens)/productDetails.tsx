import { View, Text, Image, useWindowDimensions, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Svg, { Path } from "react-native-svg";
import { AntDesign, Fontisto, FontAwesome, Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
import { useRouter } from 'expo-router';
import HttpService from "@/utils/httpService";
import { useAuthorization } from "@/hooks/useAuthorization";
import { priceFormat } from "@/utils/common";
import Loading from "@/components/Loading";

const ProductDetailsScreen = () => {
    const router = useRouter();
    const { checkAccess } = useAuthorization();
    const { product } = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const { width, height } = useWindowDimensions();
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const [productData, setProductData] = useState<any>({
        _id: '',
        title: '',
        subtitle: '',
        brand: '',
        price: 0,
        original_price: 0,
        images: [],
        color: '',
        category: '',
        rating: 0,
        discount: '',
        specifications: [],
    });
    const [selectedColor, setSelectedColor] = useState('Black');
    const [isWishlisted, setIsWishlisted] = useState(false);

    const colors = ['Black', 'White', 'Grey'];

    /**
     * Initial data load
     * */
    useEffect(() => {
        // Check user access before fetching data
        checkAccess();
        if (product) {
            fetchData(product);
        } else {
            router.push(`/(screens)/(tabs)`);
        }
    }, []);

    /**
     * Fetch the data for home page
     * */
    const fetchData = async (productId: string) => {
        try {
            setLoading(true);
            const response = await HttpService.get(`/api/product/${productId}`);

            if (response.data.success && response.data.data != null) {
                setProductData(response.data.data);
                setMaxQuantity(response.data.data.qty);
                return;
            }
            router.push(`/(screens)/(tabs)`);
            return;
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Quantity change handler
     * */
    const handleQuantityChange = (increment: boolean) => {
        setQuantity(prev => {
            const newValue = increment ? prev + 1 : prev - 1;
            return Math.min(Math.max(1, newValue), maxQuantity);
        });
    };

    /**
     * Add to cart button on press handler
     * @param redirectTo
     * */
    const addToCart = async (redirectTo: string = "cart" | "checkout") => {
        try {
            // Add the loading
            Alert.alert('Loading', 'Updating the cart, please wait!', []);

            // Retrieve the product data
            const response = await HttpService.post('/api/cart/add', {
                product_id: productData._id,
                quantity: quantity,
                color: productData.color,
            });

            if (response.data.success) {
                // Redirect to the cart
                if (redirectTo === "checkout") {
                    // Dismiss loading alert by showing success message
                    Alert.alert('Success', 'Item successfully added to cart.');
                    // Redirect to the checkout
                    router.push(`/(screens)/checkout?product=${product}&qty=${quantity}&cart_id=${response.data.data.cart_id}`)
                } else {
                    // Dismiss loading alert by showing success message
                    Alert.alert('Success', 'Item successfully added to cart.');
                    // Redirect to the cart
                    router.push("/(screens)/cart")
                }
            }
        } catch (error) {
            print(error)
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    }

    /**
     * Add to wishlist button on press handler
     * */
    const addToFavorites = async () => {
        try {
            // Add the loading
            Alert.alert('Loading', 'Adding to the wishlist, please wait!', []);

            // Retrieve the product data
            const response = await HttpService.post(`/api/add-to-favourites`, {
                product_id: product,
            });

            console.log(response.data.data)

            if (response.data.success) {
                Alert.alert('Success', 'Item successfully added to favorites.');
                setIsWishlisted(true);
                return;
            }
            Alert.alert('Success', response.data.data.message);
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        }
    }

    return (
        <View style={styles.container}>
            {loading && (
                <View style={{ marginTop: 50 }}>
                    <Loading />
                </View>
            )}
            {!loading && (
                <>
                    <ScrollView style={styles.scrollView}>
                        {/* Header Section */}
                        <View style={[styles.headerContainer, { height: height / 3 + 80 }]}>
                            {/* Header Buttons */}
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={() => router.push(`/(screens)/(tabs)`)} style={styles.backButton}>
                                    <AntDesign name="arrowleft" size={20} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => addToFavorites()}>
                                    <View style={[styles.wishlistButton, isWishlisted && styles.wishlistedButton]}>
                                        <Fontisto name="favorite" size={20} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Image
                                source={{ uri: productData.images[0] }}
                                style={styles.heroImage}
                            />

                            {/* Decorative SVG */}
                            <View style={styles.svgContainer}>
                                <Svg width={`${width}`} height={150} fill="none">
                                    <Path
                                        d={`M 0 0 C 20 40 40 40 60 40 L ${width - 60} 40 C ${width - 40} 40 ${width - 20} 40 ${width} 80
                      L ${width} 150 C ${width - 20} 110 ${width - 40} 110 ${width - 60} 110 
                      L 60 110 C 40 110 20 110 0 80`}
                                        fill="#fcfaec"
                                        stroke={"transparent"}
                                        strokeWidth={0}
                                    />
                                </Svg>
                            </View>


                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <AntDesign name="star" size={20} color="#eebd06" />
                                    <Text style={styles.statText}>{productData.ratings}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <AntDesign name="eye" size={20} color="#ee5a06" />
                                    <Text style={styles.statText}>120 Views</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.titleSection}>
                            <View style={styles.titleCard}>
                                <Text style={styles.brandText}>{productData.brand}</Text>
                                <Text style={styles.modelText}>{productData.title}</Text>
                                <Text style={styles.subModelText}>{productData.subtitle}</Text>
                            </View>
                        </View>
                        {/* Content */}
                        <View style={styles.contentContainer}>
                            {/* Price Section */}
                            <Text style={styles.currentPrice}>LKR {priceFormat(productData.price)}</Text>
                            <View style={styles.priceSection}>
                                <Text style={styles.originalPrice}>LKR {priceFormat(productData.original_price)}</Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{productData.discount}% OFF</Text>
                                </View>
                            </View>

                            {/* Color Selection */}
                            <View style={styles.colorSection}>
                                <Text style={styles.sectionTitle}>Color</Text>
                                <View style={styles.colorOptions}>
                                    {colors.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorButton,
                                                selectedColor === color && styles.selectedColorButton
                                            ]}
                                            onPress={() => {
                                                setProductData((prevState) => ({
                                                    ...prevState,
                                                    color: color,
                                                }));
                                                setSelectedColor(color);
                                            }}
                                        >
                                            <Text style={[
                                                styles.colorButtonText,
                                                productData.color === color && styles.selectedColorText
                                            ]}>{color}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Quantity Selector */}
                            {productData.qty > 0 && (
                                <View style={styles.quantitySection}>
                                    <Text style={styles.sectionTitle}>Quantity</Text>
                                    <View style={styles.quantitySelector}>
                                        <TouchableOpacity
                                            style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                                            onPress={() => handleQuantityChange(false)}
                                            disabled={quantity <= 1}
                                        >
                                            <AntDesign name="minus" size={20} color={quantity <= 1 ? "#ccc" : "#000"} />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{quantity}</Text>
                                        <TouchableOpacity
                                            style={[styles.quantityButton, quantity >= maxQuantity && styles.quantityButtonDisabled]}
                                            onPress={() => handleQuantityChange(true)}
                                            disabled={quantity >= maxQuantity}
                                        >
                                            <AntDesign name="plus" size={20} color={quantity >= maxQuantity ? "#ccc" : "#000"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {productData.qty === 0 && (
                                <View style={styles.outOfStockBox}>
                                    <Text style={styles.outOfStockText}>Out Of Stock</Text>
                                </View>
                            )}

                            {/* Specifications */}
                            <View style={styles.specSection}>
                                <Text style={styles.sectionTitle}>Specifications</Text>
                                <View style={styles.specList}>
                                    {/* {productData.specifications.map((item: string, index: number) => (
                                        <Text key={`specifications-${index}`} style={styles.specText}>• {item}</Text>
                                    ))} */}
                                    {productData.specifications.map((item, index) => (
                                        <Text key={`specifications-${index}`} style={styles.specText}>
                                            • {typeof item === 'object' ? `${item.key}: ${item.value}` : item}
                                        </Text>
                                    ))}
                                </View>
                            </View>

                            {/* Gallery */}
                            <View style={{ paddingTop: 10 }}>
                                <Text style={{
                                    fontWeight: '500',
                                    fontSize: 25,
                                    color: '#2e2e2e',
                                    paddingBottom: 10
                                }}>Gallery</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                                    {productData.images.map((image: string, index: number) => (
                                        <TouchableOpacity key={`product-image-${index}`}>
                                            <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 15 }} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    {productData.qty > 0 && (
                        <View style={styles.footer}>
                            <View style={styles.footerContent}>
                                <TouchableOpacity onPress={() => addToCart("cart")} style={styles.cartButton}>
                                    <Ionicons name="cart-outline" size={24} color="white" />
                                    <Text style={styles.buttonText}>Add to Cart</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buyButton}>
                                    <FontAwesome name="send" size={24} color="white" />
                                    <Text style={styles.buttonText} onPress={() => addToCart("checkout")}>Buy
                                        Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    titleSection: {
        paddingHorizontal: 5,
        marginBottom: 5,
        backgroundColor: '#fff',
        width: 390
    },
    titleCard: {
        zIndex: 100,
        marginTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        padding: 15,
        backdropFilter: 'blur(10px)',
        borderLeftWidth: 4,
        borderLeftColor: '#1E90FF',
    },

    titleContent: {
        gap: 5,
    },

    brandText: {
        color: '#1E90FF',
        fontSize: 18,
        fontWeight: '600',
    },

    modelText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },

    subModelText: {
        color: '#CCCCCC',
        fontSize: 14,
        fontWeight: '500',
    },
    headerContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 20,
    },
    headerButtons: {
        width: '100%',
        paddingTop: Constants.statusBarHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'absolute',
        zIndex: 200,
    },
    backButton: {
        padding: 8,
        backgroundColor: '#1E90FF',
        borderRadius: 20,
        width: 35,
        height: 35,
    },
    wishlistButton: {
        width: 35,
        height: 35,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
    },
    wishlistedButton: {
        backgroundColor: '#ff0000',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 50,
        position: 'absolute',
        top: 0,
    },
    svgContainer: {
        position: 'absolute',
        height: 150,
        top: 280,
        left: 0,
        backgroundColor: 'transparent',
    },
    titleContainer: {
        position: 'absolute',
        top: 250,
        left: 30,
    },
    titleText: {
        fontWeight: '600',
        fontSize: 35,
        color: '#FFF',
    },
    statsContainer: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontWeight: '500',
        fontSize: 17,
        paddingLeft: 10,
    },
    contentContainer: {
        padding: 20,
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    currentPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        display: 'block',
        marginBottom: 6
    },
    originalPrice: {
        fontSize: 18,
        color: '#666',
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: '#1E90FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginLeft: 10,
    },
    discountText: {
        color: 'white',
        fontWeight: 'bold',
    },
    colorSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    colorOptions: {
        flexDirection: 'row',
        gap: 10,
    },
    colorButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedColorButton: {
        backgroundColor: '#1E90FF',
        borderColor: '#1E90FF',
        color: '#ffffff',
    },
    colorButtonText: {
        color: '#000',
    },
    selectedColorText: {
        color: 'white',
    },
    quantitySection: {
        marginBottom: 20,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonDisabled: {
        backgroundColor: '#eee',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '500',
    },
    specSection: {
        marginBottom: 20,
    },
    specList: {
        gap: 8,
    },
    specText: {
        fontSize: 16,
        color: '#545454',
        lineHeight: 24,
    },
    gallerySection: {
        marginBottom: 20,
    },
    galleryItem: {
        marginRight: 10,
    },
    galleryImage: {
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    morePhotosOverlay: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    morePhotosText: {
        color: 'white',
        fontSize: 23,
        fontWeight: '500',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 15,
        backgroundColor: 'white',
    },
    footerContent: {
        flexDirection: 'row',
        gap: 15,
    },
    cartButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#666',
        padding: 15,
        borderRadius: 25,
    },
    buyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#1E90FF',
        padding: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    outOfStockText: {
        fontSize: 18,
        color: '#ff0000',
        fontWeight: '500',
        textAlign: "center"
    },
    outOfStockBox: {
        padding: 15,
        backgroundColor: 'rgba(255,0,0,0.2)',
        borderRadius: 15,
        marginBottom: 20,
    }
});

export default ProductDetailsScreen;