import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts } from "../../../styles/globalStyles";



const Hero = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Your doorway to
                what's happening
                nearby.</Text>
            <Text style={styles.subtitle}>Opening the door to your neighborhood.</Text>

        </View>
    );
};

export default Hero;

const styles = StyleSheet.create({
    card: {
        // padding: 16,
        borderRadius: 24,
        // backgroundColor: "#ffffff",
        // marginTop: 60,
        // height: 200,
        // alignItems: 'center',
        // justifyContent: 'center',
        marginBottom:48
    },
    title: {
        fontSize: 32,
        fontWeight: "600",
        textAlign: 'left',
        fontFamily: fonts.Ebold,
        color: "#FFFFFF",
        marginBottom: 12
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
        color: "#BCCBB9",
        textAlign: 'left',
        fontFamily: fonts.Eregular
    },
});