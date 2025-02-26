import React from 'react';
import {Text, View} from "react-native";

const Loading = () => {
    return (
        <View style={{width: '100%', backgroundColor: '#f1f1f1', borderRadius: 12, marginBottom: 10}}>
            <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                paddingVertical: 20,
                paddingLeft: 10,
                textTransform: 'capitalize',
                textAlign: 'center'
            }}>Loading...</Text>
        </View>
    );
};

export default Loading;