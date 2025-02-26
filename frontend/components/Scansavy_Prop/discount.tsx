import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DiscountBannerProps {
  discount: string;
  description: string;
  code?: string;
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({
  discount = "20% OFF",
  description = "on your first order",
  code = "WELCOME20"
}) => {
  // Animation values
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  // Floating animation for the icons
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation sequence
    Animated.sequence([
      // Slide in from left
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Scale and fade in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous floating animation for icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle rotation animation
    Animated.loop(
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const iconTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const sparkleRotation = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
          opacity: fadeAnim,
        },
      ]}
    >
      <LinearGradient
        // colors={['#4A00E0', '#8E2DE2']}
        colors={['#1E90FF', '#4682B4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative elements */}
        <Animated.View style={[styles.iconContainer, { transform: [{ translateY: iconTranslateY }] }]}>
          <MaterialIcons name="shopping-bag" size={24} color="#FFF" style={styles.icon} />
        </Animated.View>
        
        <Animated.View style={[styles.iconContainer, { transform: [{ translateY: iconTranslateY }] }]}>
          <MaterialIcons name="card-giftcard" size={24} color="#FFF" style={styles.icon} />
        </Animated.View>

        {/* Main content */}
        <View style={styles.content}>
          <Animated.View style={[styles.sparkleContainer, { transform: [{ rotate: sparkleRotation }] }]}>
            <MaterialIcons name="auto-awesome" size={20} color="#FFD700" />
          </Animated.View>
          
          <Text style={styles.discountText}>{discount}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
          
          {code && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{code}</Text>
            </View>
          )}

          {/* Additional offer details */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="access-time" size={16} color="#FFF" />
              <Text style={styles.featureText}>Limited time</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="local-offer" size={16} color="#FFF" />
              <Text style={styles.featureText}>Special offer</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    opacity: 0.5,
  },
  icon: {
    margin: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  discountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  codeText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featureText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default DiscountBanner;
