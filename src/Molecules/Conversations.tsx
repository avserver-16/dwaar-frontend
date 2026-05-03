import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts } from "../../styles/globalStyles";

type ConversationProps = {
    name: string;

};

const Conversation: React.FC<ConversationProps> = ({ name }) => {
    return (
        <View style={styles.conversation}>
            <View style={styles.iconContainer}>
                <Ionicons name="person" size={24} color="white" />
            </View>
            <Text style={styles.title}>{name}</Text>

        </View>
    );
};

export default Conversation;

const styles = StyleSheet.create({
    conversation: {
        padding: 16,
        borderRadius: 8,
        // backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 12,
        // fontWeight: "600",
        color: "#FFFFFF",
        fontFamily:fonts.Eregular
    },

    iconContainer: {
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        // left:5,
        marginBottom:4,
        borderWidth:1,
        borderColor:"#FFFFFF",
    },
});