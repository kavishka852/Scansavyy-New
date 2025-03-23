import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryItem,
                        selectedCategory === 'all' && styles.selectedCategory
                    ]}
                    onPress={() => onSelectCategory('all')}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            selectedCategory === 'all' && styles.selectedCategoryText
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={`category-${index}`}
                        style={[
                            styles.categoryItem,
                            selectedCategory === category && styles.selectedCategory
                        ]}
                        onPress={() => onSelectCategory(category)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === category && styles.selectedCategoryText
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "Montserrat",
    },
    scrollViewContent: {
        paddingRight: 20, // Extra padding at the end for better UX
    },
    categoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedCategory: {
        backgroundColor: '#1e90ff',
        borderColor: '#1e90ff',
    },
    categoryText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default CategoryList;