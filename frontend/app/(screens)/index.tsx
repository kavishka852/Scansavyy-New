import {View} from 'react-native';
import React from 'react';
import {Redirect} from 'expo-router';

const IndexScreen = () => {
    return (
        <View>
            <Redirect href="/splash"/>
        </View>
    )
}

export default IndexScreen