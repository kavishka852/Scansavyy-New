import React, {useEffect, useRef, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Platform,
    StatusBar,
    View,
    TouchableOpacity,
    Text, Image, Alert
} from "react-native";
import {Stack, useRouter} from "expo-router";
import {CameraView, Camera} from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import HttpService from "@/utils/httpService";
import {FontAwesome5} from "@expo/vector-icons";

const ImageRecognition = () => {
    const router = useRouter();
    const cameraRef = useRef(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(true);
    const [photo, setPhoto] = useState(undefined);

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
    }, []);

    if (hasCameraPermission === undefined) {
        return <Text>Requesting permissions...</Text>
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted. Please change this in settings.</Text>
    }

    const takePic = async () => {
        if (!cameraRef.current) return;

        const options = {
            quality: 1,
            base64: true,
            exif: false
        };

        const newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
    };

    if (photo) {
        const savePhoto = async () => {
            try {
                Alert.alert('Loading', 'Please wait while analyzing the image.', []);
                // Retrieve the product data
                const response = await HttpService.post('/api/image-recognition', {
                    uri: "data:image/jpg;base64," + photo.base64,
                    type: "image/jpeg",
                    name: "photo.jpg",
                });
                // Add the success message
                Alert.alert('Success', 'Image analyze successful.');

                console.log(response.data.data.related_products)

                // Redirect to the related products screen
                router.push(`/(screens)/relatedProducts?products=${JSON.stringify(response.data.data.related_products)}`);
            } catch (error) {
                console.log(error)
                Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
            }
        };

        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
                <View style={{
                    position: 'absolute',
                    bottom: 30,
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    {hasMediaLibraryPermission ? <TouchableOpacity style={[styles.button, {marginRight: 20}]} title="Save" onPress={savePhoto}>
                        <Text style={{color: '#fff', fontStyle: 600, fontSize: 16}}>Proceed</Text>
                    </TouchableOpacity> : undefined}
                    <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}]} onPress={() => setPhoto(undefined)}>
                        <Text style={{color: '#fff', fontStyle: 600, fontSize: 16}}>Discard</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <>
            <Stack.Screen
                title="QR Code Scan"
                options={{headerShown: false}}
            />
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView style={styles.container} ref={cameraRef}>
                <TouchableOpacity style={{
                    position: 'absolute',
                    bottom: 80,
                    left: 20,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }} onPress={() => router.push('/(screens)/(tabs)')}>
                    <FontAwesome5 name="arrow-left" size={30} color="#ffffff"/>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    position: 'absolute',
                    bottom: 80,
                    width: 80,
                    height: 80,
                    borderColor: '#ffffff',
                    backgroundColor: '#ffffff',
                    borderWidth: 4,
                    borderRadius: '50%',
                }} onPress={takePic}></TouchableOpacity>
            </CameraView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        backgroundColor: '#fff',
        alignSelf: 'flex-end'
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    },
    button: {
        backgroundColor: '#1E90FF',
        width: 100,
        height: 50,
        borderRadius: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ImageRecognition;