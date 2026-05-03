import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
};

const GradientBackground = ({ children, style }: Props) => {
  return (
    <LinearGradient
      colors={[
        "#0A0A0A",  // pure black
        "#0A0A0A",  // keep black dominant
        "#23281c",  // subtle green fade
      ]}
      locations={[0, 0.3, 1]} // 85% black, 15% gradient
      start={{ x: 0, y: 0.4 }}
      end={{ x: 1, y: 0 }} // push toward right side
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
});