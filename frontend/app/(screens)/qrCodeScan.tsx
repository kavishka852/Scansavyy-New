import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, AppState, Platform, StatusBar, View, TouchableOpacity} from "react-native";
import {Stack, useRouter} from "expo-router";
import {CameraView} from "expo-camera";
import {FontAwesome5} from "@expo/vector-icons";

const QrCodeScan = () => {
    const router = useRouter();
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
                title="QR Code Scan"
                options={{headerShown: false}}
            />
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
                style={[StyleSheet.absoluteFillObject, {width: '100%', height: '100%'}]}
                facing="back"
                onBarcodeScanned={({ data }) => {
                    if (data && !qrLock.current) {
                        qrLock.current = true;
                        setTimeout(async () => {
                            router.push(`/(screens)/priceComparison?productId=${data}`);
                        }, 500);
                    }
                }}
            />
            {/* Overlay Component */}
            <View style={styles.overlay}>
                <View style={styles.scanBox} />
            </View>
            <TouchableOpacity style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: [{translateX: -40}],
                width: 80,
                height: 80,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }} onPress={() => router.push('/(screens)/(tabs)')}>
                <FontAwesome5 name="arrow-left" size={30} color="#ffffff"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBox: {
        width: 250, // Adjust size
        height: 250, // Adjust size
        borderColor: '#ffffff',
        borderWidth: 4,
        backgroundColor: 'transparent',
    },
});


export default QrCodeScan;