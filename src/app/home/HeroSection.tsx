import React from "react";
import { View, Text, StyleSheet } from "react-native";



const Hero = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Dwaar</Text>
            <Text style={styles.subtitle}>Place where you meet people to be Knowingly Unknown</Text>

        </View>
    );
};

export default Hero;

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 24,
        backgroundColor: "#ffffff",
        marginTop: 40,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 48,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: 12,
        marginTop: 4,
        color: "#555",
        textAlign:'center'
    },
});