import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <LinearGradient colors={['#1e90ff', '#87cefa']} style={styles.header}>
        <Image
          source={require('../../assets/Applogo.png')} // Replace with your app's logo
          style={styles.logo}
        />
        <Text style={styles.appName}>ScanSavvy 1.0.0</Text>
      </LinearGradient>

      {/* About the App */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.sectionContent}>
          My Amazing App is designed to make your life easier by offering seamless solutions for 
          [brief purpose, e.g., managing your daily tasks, tracking fitness goals, or connecting with friends]. 
          Our goal is to provide a user-friendly experience with innovative features.
        </Text>
      </View>

      {/* Key Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featureItem}>
          <Feather name="check-circle" size={20} color="#1e90ff" />
          <Text style={styles.featureText}>Feature 1: [Brief Description]</Text>
        </View>
        <View style={styles.featureItem}>
          <Feather name="check-circle" size={20} color="#1e90ff" />
          <Text style={styles.featureText}>Feature 2: [Brief Description]</Text>
        </View>
        <View style={styles.featureItem}>
          <Feather name="check-circle" size={20} color="#1e90ff" />
          <Text style={styles.featureText}>Feature 3: [Brief Description]</Text>
        </View>
      </View>

      {/* Acknowledgements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acknowledgements</Text>
        <Text style={styles.sectionContent}>
          We would like to thank all our developers, designers, and testers who contributed to making this app possible. Special thanks to 
          [specific libraries, frameworks, or tools, e.g., React Native, Expo, Firebase, etc.].
        </Text>
      </View>

      {/* Version and Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Version</Text>
        <Text style={styles.sectionContent}>Version 1.0.0</Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionContent}>
          If you have any questions or feedback, feel free to reach out to us at:
        </Text>
        <TouchableOpacity>
          <Text style={styles.contactText}>support@myamazingapp.com</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#1e90ff',
    marginTop: 5,
  },
});

export default AboutScreen;
