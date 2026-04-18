import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OptionsProps {
  title: string;
  subtitle?: string;

  iconName: keyof typeof Ionicons.glyphMap;

  subTag?: string;

  onPress?: () => void;

  // 🎨 Custom styles
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  iconColor?: string;
  subTagStyle?: TextStyle;
}

const Options: React.FC<OptionsProps> = ({
  title,
  subtitle,
  iconName,
  subTag,
  onPress,

  containerStyle,
  titleStyle,
  subtitleStyle,
  iconColor = "#000",
  subTagStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* LEFT */}
      <View style={styles.left}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>

        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        {subTag && (
          <Text style={[styles.subTag, subTagStyle]}>
            {subTag}
          </Text>
        )}

        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default Options;
const styles = StyleSheet.create({
    container: {
      width: "100%",
      paddingVertical: 16,
    //   paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 0.3,
      borderBottomColor: "#000000",
      marginBottom: 24,
      borderRadius:2
    },
  
    left: {
      flexDirection: "column",
      gap: 4,
      flex: 1,
    },
  
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  
    title: {
      fontSize: 18,
      fontWeight: "500",
      color: "#000",
    },
  
    subtitle: {
      fontSize: 13,
      color: "#666",
    },
  
    subTag: {
      fontSize: 12,
      color: "#888",
    },
  });