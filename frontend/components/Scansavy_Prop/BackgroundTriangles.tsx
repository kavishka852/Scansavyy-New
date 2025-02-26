import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BackgroundTriangles = () => {
    return (
        <View style={styles.backgroundElements} pointerEvents="none">
            <View style={styles.topLeftTriangle}>
                <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
                    <Path d="M 0 0 L 200 200 L 0 200 Z" fill="#0391FA" opacity={0.15} />
                </Svg>
            </View>
            <View style={styles.topRightTriangle}>
                <Svg width={300} height={300} viewBox="0 0 300 300" fill="none">
                    <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#ADD8E6" opacity={0.1} />
                </Svg>
            </View>
            <View style={styles.middleRightTriangle}>
                <Svg width={300} height={300} viewBox="0 0 300 300" fill="none">
                    <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#87CEFA" opacity={0.2} />
                </Svg>
            </View>
            <View style={styles.bottomLeftTriangle}>
                <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
                    <Path d="M 0 0 L 200 200 L 0 200 Z" fill="#ADD8E6" opacity={0.2} />
                </Svg>
            </View>
            <View style={styles.bottomRightTriangle}>
                <Svg width={300} height={300} viewBox="0 0 300 300" fill="none">
                    <Path d="M 0 0 L 300 300 L 0 300 Z" fill="#87CEEB" opacity={0.2} />
                </Svg>
            </View>
            <View style={styles.floatingTopLeft}>
                <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
                    <Path d="M 0 0 L 50 50 L 0 50 Z" fill="#E6F7FF" opacity={0.4} />
                </Svg>
            </View>
            <View style={styles.floatingBottomRight}>
                <Svg width={70} height={70} viewBox="0 0 70 70" fill="none">
                    <Path d="M 0 0 L 70 70 L 0 70 Z" fill="#DFF6FF" opacity={0.6} />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundElements: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    topLeftTriangle: {
        position: 'absolute',
        top: 0,
        left: -20,
        transform: [{ rotate: '20deg' }],
    },
    topRightTriangle: {
        position: 'absolute',
        top: -150,
        right: 0,
        transform: [{ rotate: '-40deg' }],
    },
    middleRightTriangle: {
        position: 'absolute',
        top: 100,
        right: -200,
        transform: [{ rotate: '45deg' }],
    },
    bottomLeftTriangle: {
        position: 'absolute',
        bottom: 0,
        left: 40,
        transform: [{ rotate: '45deg' }],
    },
    bottomRightTriangle: {
        position: 'absolute',
        bottom: 0,
        right: -30,
        transform: [{ rotate: '-25deg' }],
    },
    floatingTopLeft: {
        position: 'absolute',
        top: 50,
        left: 30,
    },
    floatingBottomRight: {
        position: 'absolute',
        bottom: 50,
        right: 50,
    },
});

export default BackgroundTriangles;
