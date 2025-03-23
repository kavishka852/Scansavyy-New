import {Stack} from 'expo-router';
import ImageRecognition from "@/app/(screens)/imageRecognition";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index"/>
            <Stack.Screen name="splash" options={{headerShown: false}}/>
            <Stack.Screen name="Onboarding" options={{headerShown: false}}/>
            <Stack.Screen name="Login" options={{headerShown: false}}/>
            <Stack.Screen name="Signup" options={{headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="wishList" options={{headerShown: false}}/>
            <Stack.Screen name="cart" options={{headerShown: false}}/>
            <Stack.Screen name="news" options={{headerShown: false}}/>
            <Stack.Screen name="newsDetail" options={{headerShown: false}}/>
            <Stack.Screen name="userAcoount" options={{headerShown: false}}/>
            <Stack.Screen name="profile" options={{headerShown: false}}/>
            <Stack.Screen name="about" options={{headerShown: false}}/>
            <Stack.Screen name="collection" options={{headerShown: false}}/>
            <Stack.Screen name="productDetails" options={{headerShown: false}}/>
            <Stack.Screen name="checkout" options={{headerShown: false}}/>
            <Stack.Screen name="discount" options={{headerShown: false}}/>
            <Stack.Screen name="purchaseHistory" options={{headerShown: false}}/>
            <Stack.Screen name="purchaseDetails" options={{headerShown: false}}/>
            <Stack.Screen name="priceComparison" options={{headerShown: true, title: "Price Comparison"}}/>
            <Stack.Screen name="imageRecognition" options={{headerShown: true, title: "Image Recognition"}}/>
            <Stack.Screen name="relatedProducts" options={{headerShown: true, title: "Related Products"}}/>
            <Stack.Screen name="shopDetails" options={{headerShown: true, title: "Shop Details"}}/>
            <Stack.Screen name="shops" options={{headerShown: true, title: "Shops"}}/>
        </Stack>
    );
};

export default RootLayout;
