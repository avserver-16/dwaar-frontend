import React from "react";
import { View, Text, StyleSheet } from "react-native";

type CardProps = {
  title: string;
  subtitle: string;
};

const Card: React.FC<CardProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
});