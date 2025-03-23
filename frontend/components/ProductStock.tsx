import React from "react";
import {StyleSheet, Text} from "react-native";

const ProductStock = ({quantity}: {quantity: number}) => {
    return (
        <Text
            style={
                quantity > 5
                    ? styles.InStockText
                    : quantity > 0
                        ? styles.LowStockText
                        : styles.OutOfStockText
            }
        >
            {quantity > 5
                ? "In Stock"
                : quantity > 0
                    ? "Low In Stock"
                    : "Out Of Stock"
            }
        </Text>
    );
};

const styles = StyleSheet.create({
    InStockText: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '500',
    },
    OutOfStockText: {
        fontSize: 14,
        color: '#ff0000',
        fontWeight: '500',
    },
    LowStockText: {
        fontSize: 14,
        color: '#e15e00',
        fontWeight: '500',
    },
});

export default ProductStock;