import { View, Text, Image, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/Login');
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);
  
  
  return (
    <View style={{ backgroundColor: '#1E90FF', flex: 1 }}>
      {/* Center Content */}
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <View style={{ marginBottom: 20 }}>
          <Image
            source={require('../../assets/Applogo.png')} // Replace with the path to your logo
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </View>

        {/* Main Title and Subtitle */}
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Text style={{
              textAlign: 'center',
              fontSize: 50,
              fontWeight: 'bold',
              color: 'white',
              textShadowColor: '#000',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}>
              ScanSavvy
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
              <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', marginTop: 5, fontStyle: 'italic' }}>
                Where Virtual Meets Real Shopping.
              </Text>
              <FontAwesome5 name="qrcode" size={20} color="white" />
            </View>
          </View>
        </View>

        {/* Animated Background Elements */}
        <View style={{ position: 'absolute', top: 0, left: -20, transform: [{ rotate: '20deg' }] }}>
          <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
            <Path d="M 0 0 L 200 200 L 0 200 Z" fill="#0391FA" opacity={0.15} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', top: -150, right: 0, transform: [{ rotate: '-40deg' }] }}>
          <Svg width={300} height={300} viewBox="0 0 300 300" fill="none">
            <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#ADD8E6" opacity={0.1} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', top: 100, right: -200, transform: [{ rotate: '45deg' }] }}>
          <Svg width={300} height={300} viewBox="0 0 300 300" fill="none">
            <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#87CEFA" opacity={0.2} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', bottom: 0, left: 40, transform: [{ rotate: '45deg' }] }}>
          <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
            <Path d="M 0 0 L 200 200 L 0 200 Z" fill="#ADD8E6" opacity={0.2} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', bottom: 0, right: -30, transform: [{ rotate: '-25deg' }] }}>
          <Svg width={300} height={300} viewBox="0 0 300 300" fill="none">
            <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#87CEEB" opacity={0.2} />
          </Svg>
        </View>

        {/* Loading Indicator */}
        <View style={{ position: 'absolute', bottom: 80 }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 10, fontSize: 18 }}>Loading...</Text>
        </View>

        {/* Floating Design Elements */}
        <View style={{ position: 'absolute', top: 50, left: 30 }}>
          <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
            <Circle cx={25} cy={25} r={25} fill="#E6F7FF" opacity={0.4} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', bottom: 50, right: 50 }}>
          <Svg width={70} height={70} viewBox="0 0 70 70" fill="none">
            <Circle cx={35} cy={35} r={35} fill="#DFF6FF" opacity={0.6} />
          </Svg>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;
