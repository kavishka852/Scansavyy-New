import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, PanResponder, PanResponderGestureState } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  const onboardingData = [
    {
      title: 'Scanning Product',
      description: 'The scan result will be automatically added if the item exists.',
      image: require('../../assets/Scanning.png'),
    },
    {
      title: 'Make Payment',
      description: 'Payments can be made in the best and most convenient ways.',
      image: require('../../assets/payment.png'),
    },
    {
      title: 'Get Your Order',
      description: 'Get your orders delivered to your doorstep.',
      image: require('../../assets/order.png'),
    },
  ];

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleGetStarted = () => {
    router.push('/(screens)/Login');
  };

  const animateContent = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSwipe = (gestureState: PanResponderGestureState) => {
    if (gestureState.dx > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (gestureState.dx < -100 && currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  React.useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(100);
    animateContent();
  }, [currentIndex]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => handleSwipe(gestureState),
    onPanResponderRelease: () => {},
  });

  return (
    <View style={styles.container}>
      {/* Background Elements (unchanged) */}
      <View style={styles.backgroundContainer}>
        <Svg style={styles.bgSVG1} width={200} height={200} viewBox="0 0 200 200" fill="none">
          <Path d="M 0 0 L 200 200 L 0 200 Z" fill="#0391FA" opacity={0.15} />
        </Svg>
        <Svg style={styles.bgSVG2} width={300} height={300} viewBox="0 0 300 300" fill="none">
          <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#ADD8E6" opacity={0.1} />
        </Svg>
        <Svg style={styles.bgSVG3} width={300} height={300} viewBox="0 0 300 300" fill="none">
          <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#87CEFA" opacity={0.2} />
        </Svg>
        <Svg style={styles.bgSVG4} width={200} height={200} viewBox="0 0 200 200" fill="none">
          <Path d="M 0 0 L 200 200 L 0 200 Z" fill="#ADD8E6" opacity={0.2} />
        </Svg>
        <Svg style={styles.bgSVG5} width={300} height={300} viewBox="0 0 300 300" fill="none">
          <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#87CEEB" opacity={0.2} />
        </Svg>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer} {...panResponder.panHandlers}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {onboardingData.map((_, index) => (
            <View key={index} style={styles.progressBarWrapper}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: currentIndex >= index ? '100%' : '0%',
                    backgroundColor: currentIndex >= index ? '#4CAF50' : '#E0E0E0'
                  }
                ]}
              />
            </View>
          ))}
        </View>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Animated.Image
            source={onboardingData[currentIndex].image}
            style={[
              styles.image,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
              }
            ]}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {onboardingData[currentIndex].title}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.description,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {onboardingData[currentIndex].description}
          </Animated.Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentIndex < onboardingData.length - 1 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
          
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgSVG1: { position: 'absolute', top: 0, left: -20, transform: [{ rotate: '20deg' }] },
  bgSVG2: { position: 'absolute', top: -150, right: 0, transform: [{ rotate: '-40deg' }] },
  bgSVG3: { position: 'absolute', top: 100, right: -200, transform: [{ rotate: '45deg' }] },
  bgSVG4: { position: 'absolute', bottom: 0, left: 40, transform: [{ rotate: '45deg' }] },
  bgSVG5: { position: 'absolute', bottom: 0, right: -30, transform: [{ rotate: '-25deg' }] },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressBarWrapper: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    // transition: 'width 0.3s ease',
  },
  imageContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  getStartedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
});

export default Onboarding;