import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator, Modal, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Hero from "./HeroSection";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../styles/globalStyles";
import Distances from "../../Molecules/Distances";
import Conversation from "../../Molecules/Conversations";
import { fetchCurrentUser, fetchUserLocation, fetchNearbyBuildings } from "../../../api/auth";
import Group from "../../Molecules/ActiveGroups";
import GetLocation from "./GetLocation";
import { useLocationGeoJSON } from "../../../hooks/useLocationGEOJSON";
import JoinRoomModal from "../../Molecules/JoinModal";
import { useNavigation } from "@react-navigation/native";

// ─── Distance options mapped to meters ───────────────────────────────────────
const DISTANCE_OPTIONS = [
  { label: "100m", value: 100 },
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "5km", value: 5000 },
  { label: "7km", value: 7000 },

  // { label: "10km", value: 10000 },
];

const HomeScreen = () => {
  const [selectedRadius, setSelectedRadius] = useState(100); // default 100m
  const [visible, setVisible] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  // ── Current user ─────────────────────────────────────────────────────────
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000, // 5 min
  });
  const {
    data: geojsonData,
    isLoading,
    error,
  } = useLocationGeoJSON("maharashtra");

  console.log("geojsonData", geojsonData);

  // ── User location ─────────────────────────────────────────────────────────
  const { data: location } = useQuery({
    queryKey: ["userLocation"],
    queryFn: fetchUserLocation,
    staleTime: 5 * 60_000,
  });
  console.log("location", location);
  // ── Nearby buildings — re-fetches when radius changes ─────────────────────
  const {
    data: buildingData,
    isLoading: buildingsLoading,
    isError: buildingsError,
    refetch: refetchBuildings,
  } = useQuery({
    queryKey: ["nearbyBuildings", selectedRadius],
    queryFn: () => fetchNearbyBuildings(selectedRadius),
    staleTime: 60_000, // 1 min
  });
  const truncateText = (text: string, limit: number = 15) => {
    if (text.length <= limit) {
      return text;
    }

    return text.substring(0, limit) + '...';
  };
  const buildings = buildingData?.buildings ?? [];
  const navigation = useNavigation<any>();
  // console.log("Building data:", buildingData);
  return (
    <GradientBackground>
      <Header title="Dwaar" showNotification={true} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Hero />

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationContent}>
            <Ionicons name="location" size={24} color="#9AB17A" />
            <Text style={styles.locationText}>
              {truncateText(location?.city ?? "—")}
            </Text>
          </View>
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.button}
              onPress={() => setVisible(true)}
            >
              <Ionicons name="location" size={24} color="#000" />
              <Text style={styles.buttonText}>
                My Location
              </Text>
            </Pressable>

            <Modal
              visible={visible}
              transparent
              animationType="fade"
            >
              <GetLocation onClose={() => setVisible(false)} lat={location?.latitude ?? 0} lng={location?.longitude ?? 0} title={location?.city ?? ""} />
            </Modal>
          </View>
        </View>

        {/* Distance selector — tapping changes the radius and auto-refetches */}
        <Distances
          distances={DISTANCE_OPTIONS.map((d) => d.label)}
          selected={DISTANCE_OPTIONS.find((d) => d.value === selectedRadius)?.label}
          onSelect={(label) => {
            const match = DISTANCE_OPTIONS.find((d) => d.label === label);
            if (match) setSelectedRadius(match.value);
          }}
        />

        {/* Buildings result */}
        <View style={[styles.sectionHeader, { marginBottom: 32 }]}>
          <Text style={styles.locationText}>
            Nearby Buildings ({buildingData?.buildingCount ?? 0})
          </Text>
          <TouchableOpacity onPress={() => refetchBuildings()}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
          <Text style={{ color: "#656565", position: "absolute", top: 40, fontSize: 12 }}>Select a region to join a room</Text>
        </View>
        {buildingsLoading && (
          <ActivityIndicator color="#9AB17A" style={{ marginVertical: 16 }} />
        )}
        {buildingsError && (
          <Text style={styles.errorText}>Failed to load buildings</Text>
        )}
        {!buildingsLoading &&
          buildings.slice(0, 15).map((item: any, index: number) => {
            const isSelected = selectedRegion === index;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // Toggle selection
                  setSelectedRegion(isSelected ? null : index);
                }}
                style={{
                  height: 40,
                  width: 50,
                  borderRadius: 12,
                  marginBottom: 12,
                  marginHorizontal: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderColor: "#9AB17A",
                  backgroundColor: isSelected ? "#9AB17A" : "transparent",
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#fff" : "#9AB17A",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {`B-${index + 1}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        <TouchableOpacity
          onPress={() => setIsJoin(true)}
          disabled={!selectedRegion}
          style={{
            height: 60, width: "100%", justifyContent: "center", alignItems: "center",
            backgroundColor: selectedRegion ? "#9AB17A" : "#9ab17a51", borderRadius: 100, marginBottom: 24, marginTop: 12
          }}>
          <Text style={{ color: "#000", fontSize: 16, fontFamily: fonts.EsemiBold }}>{selectedRegion ? "Join this region" : "Select a region first"}</Text>
        </TouchableOpacity>
        {/* Active Conversations */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.locationText}>Active Conversations</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Conversation name="Dhruv" />
          <Conversation name="Samiksha" />
          <Conversation name="Sri" />
        </View>

        {/* Active Groups */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.locationText}>Active Groups</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Group name="Building Committee" />
        </View>
      </ScrollView>
      <JoinRoomModal
        visible={isJoin}
        username={userData?.name || ""}
        categories={[
          { label: "General", value: "general" },
          { label: "Sports", value: "sports" },
          { label: "Technology", value: "tech" },
        ]}
        rooms={[
          { label: "React Native", value: "rn" },
          { label: "MongoDB", value: "mongo" },
          { label: "Node.js", value: "node" },
          { label: "DSA", value: "dsa" },
        ]}
        onClose={() => setIsJoin(false)}
        onJoin={(category: string, room: string) => {
          console.log(category, room);
          setIsJoin(false);
          navigation.navigate("ChatOnboarding");
        }}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 40,
    backgroundColor: "transparent",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    justifyContent: "space-between",
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    width: "100%",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 20,
    color: "white",
    fontFamily: fonts.EsemiBold,
  },
  viewAll: {
    color: "#9AB17A",
    fontSize: 14,
    fontFamily: fonts.Eregular,
  },
  errorText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    fontFamily: fonts.Eregular,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },
  modalContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#9AB17A",
    padding: 10,
    borderRadius: 100,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: fonts.EsemiBold,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default HomeScreen;