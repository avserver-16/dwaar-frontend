import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Card from "../../Molecules/Card";
import Hero from "./HeroSection";

const HomeScreen = () => {
const d=[
  {title:"Sigma",subtitle:"250m"},
  {title:"Sigma-Plus",subtitle:"500m"},
  {title:"Delta",subtitle:"750m"},
  {title:"Delta-Plus",subtitle:"1km"},
  {title:"Zeta",subtitle:"2km"},
  {title:"Enigma",subtitle:"10km"},

]

  return (
    <GradientBackground>
      <Header title="Home" showNotification={true} />
      <Hero />
      <ScrollView contentContainerStyle={styles.container}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.cardWrapper}>
            <Card title={d[i].title} subtitle={d[i].subtitle} />
          </View>
        ))}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    // paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: 24
  },
  cardWrapper: { 
    width:'45%',
    marginBottom: 16,
    marginHorizontal: 6,
  },
});

export default HomeScreen;