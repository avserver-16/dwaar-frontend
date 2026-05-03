import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { fonts } from "../../styles/globalStyles";
export default function Distances({ distances }: { distances: string[] }) {
    const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
    return (
        <View style={{ width: '100%',backgroundColor: '#171717', paddingVertical: 24, paddingHorizontal: 16, borderRadius: 12,borderWidth:1,borderColor:"rgba(255,255,255,0.1)",marginBottom:48 }}>
            <Text style={{ color: '#BCCBB9', fontSize: 12, fontFamily:fonts.Eregular,marginBottom:12 }}>Discovery Radius</Text>
            <View style={{ flexDirection: 'row', gap: 10, width: '100%',  }}>
            {distances.map((distance) => (
                <TouchableOpacity key={distance} onPress={() => setSelectedDistance(distance)} style={{ padding: 10, backgroundColor: selectedDistance === distance ? '#9AB17A' : 'transparent', borderRadius: 100,paddingHorizontal:14 ,borderWidth:selectedDistance === distance ? 0 : 0.2,borderColor:selectedDistance === distance ? 'transparent' : '#BCCBB9'}}>
                    <Text style={{ color: selectedDistance === distance ? '#171717' : '#BCCBB9', fontSize: 14, fontFamily:selectedDistance === distance ? fonts.Ebold : fonts.Eregular }}>{distance}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>
    );
}