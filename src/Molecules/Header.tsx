import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
    title?: string;

    showBack?: boolean;
    onBackPress?: () => void;

    showSearch?: boolean;
    onSearchPress?: () => void;

    showNotification?: boolean;
    onNotificationPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    onBackPress,

    showSearch = false,
    onSearchPress,

    showNotification = false,
    onNotificationPress,
}) => {
    return (
        <View style={styles.container}>

            {/* LEFT SECTION */}
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                )}

                {title && <Text style={styles.title}>{title}</Text>}
            </View>

            {/* RIGHT SECTION */}
            <View style={styles.right}>
                {showSearch && (
                    <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn}>
                        <Ionicons name="search" size={22} color="#000" />
                    </TouchableOpacity>
                )}

                {showNotification && (
                    <TouchableOpacity
                        onPress={onNotificationPress}
                        style={styles.iconBtn}
                    >
                        <Ionicons name="notifications-outline" size={22} color="#000" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default Header;
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        top:32
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    right: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: "600",
    },

    iconBtn: {
        padding: 6,
    },
});