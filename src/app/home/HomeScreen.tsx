import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Card from "../../Molecules/Card";
import Hero from "./HeroSection";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { fonts } from "../../../styles/globalStyles";
import Distances from "../../Molecules/Distances";
import Conversation from "../../Molecules/Conversations";
import { fetchCurrentUser } from "../../../api/auth";

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchCurrentUser().then((user) => {
      setUser(user);
    });
  }, []);
  
  return (
    <GradientBackground>
      <Header title="Dwaar" showNotification={true} />
      <ScrollView contentContainerStyle={styles.container}>
        <Hero />
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={24} color="#9AB17A" />
          <Text style={styles.locationText}>Andheri West, Mumbai</Text>
        </View>
        <Distances distances={['100m', '500m', '1km', '5km', '10km']} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, width: '100%' }}>
          <Text style={styles.locationText}>Active Conversations</Text>
          <TouchableOpacity>
            <Text style={{ color: '#9AB17A', fontSize: 14, fontFamily: fonts.Eregular }}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 0 }}>
          <Conversation name="John Doe" />
          <Conversation name="John Doe" />
          <Conversation name="John Doe" />

        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    // paddingHorizontal: 16,
    paddingTop: 40,
    // marginTop: 24,
    backgroundColor: 'transparent'
  },
  cardWrapper: {
    width: '45%',
    marginBottom: 16,
    marginHorizontal: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationText: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'white',
    fontFamily: fonts.EsemiBold
  },
});

export default HomeScreen;