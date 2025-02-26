import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Loading Modal Component
const PaymentLoadingModal = ({ visible }:any) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <BlurView 
                intensity={80} 
                style={styles.loadingOverlay}
                tint="dark"
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Processing Payment...</Text>
                </View>
            </BlurView>
        </Modal>
    );
};

// Success Modal Component
const PaymentSuccessModal = ({ visible, onClose, amount }: any) => {
    const scaleValue = new Animated.Value(0);
    const checkmarkScale = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            scaleValue.setValue(0);
            checkmarkScale.setValue(0);
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View 
                    style={[
                        styles.modalContent,
                        { transform: [{ scale: scaleValue }] }
                    ]}
                >
                    <LinearGradient
                        colors={['#34D399', '#10B981']}
                        style={styles.iconBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
                            <MaterialIcons name="check" size={48} color="white" />
                        </Animated.View>
                    </LinearGradient>

                    <Text style={styles.title}>Payment Successful!</Text>
                    <Text style={styles.amount}>{amount}</Text>
                    <Text style={styles.message}>
                        Your transaction has been completed successfully. A confirmation email will be sent shortly.
                    </Text>

                    <TouchableOpacity onPress={onClose}>
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Continue Shopping</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    iconBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    amount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#059669',
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        minWidth: 200,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export { PaymentLoadingModal, PaymentSuccessModal };