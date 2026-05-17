import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../styles/globalStyles";

interface HeaderProps {
    title?: string;

    showBack?: boolean;
    onBackPress?: () => void;

    showSearch?: boolean;
    onSearchPress?: () => void;

    showNotification?: boolean;
    onNotificationPress?: () => void;
    showMenu?: boolean;
    onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    onBackPress,

    showSearch = false,
    onSearchPress,

    showNotification = false,
    onNotificationPress,
    showMenu = false,
    onMenuPress,
}) => {
    return (
        <View style={styles.container}>

            {/* LEFT SECTION */}
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={24} color="#9AB17A" />
                    </TouchableOpacity>
                )}
                {showMenu && (
                    <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
                        <Ionicons name="menu" size={24} color="#9AB17A" />
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
                        <Ionicons name="notifications-outline" size={22} color="#9AB17A" />
                    </TouchableOpacity>
                )}
                {/* <View style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: "#9AB17A", alignItems: "center", justifyContent: "center" }} >
                    <Ionicons name="person" size={16} color="#000" />
                </View> */}
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
        paddingHorizontal: 0,
        top: 32,
        marginBottom: 30
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
        fontFamily: fonts.Ebold,
        color: "#FFFFFF"
    },

    iconBtn: {
        padding: 6,
    },
});