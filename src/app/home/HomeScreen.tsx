import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
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

// ─── Distance options mapped to meters ───────────────────────────────────────
const DISTANCE_OPTIONS = [
  { label: "100m", value: 100 },
  { label: "500m", value: 500 },
  { label: "1km",  value: 1000 },
  { label: "5km",  value: 5000 },
  { label: "7km",  value: 7000 },

  // { label: "10km", value: 10000 },
];

const HomeScreen = () => {
  const [selectedRadius, setSelectedRadius] = useState(500); // default 500m

  // ── Current user ─────────────────────────────────────────────────────────
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000, // 5 min
  });

  // ── User location ─────────────────────────────────────────────────────────
  const { data: location } = useQuery({
    queryKey: ["userLocation"],
    queryFn: fetchUserLocation,
    staleTime: 5 * 60_000,
  });

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

  const buildings = buildingData?.buildings ?? [];
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
          <Ionicons name="location" size={24} color="#9AB17A" />
          <Text style={styles.locationText}>
            {location?.city ?? "—"}, {location?.region ?? "—"}
          </Text>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.locationText}>
            Nearby Buildings ({buildingData?.buildingCount ?? 0})
          </Text>
          <TouchableOpacity onPress={() => refetchBuildings()}>
            <Text style={styles.viewAll}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {buildingsLoading && (
          <ActivityIndicator color="#9AB17A" style={{ marginVertical: 16 }} />
        )}
        {buildingsError && (
          <Text style={styles.errorText}>Failed to load buildings</Text>
        )}
        {!buildingsLoading && buildings.map((building: any, i: number) => (
          // Replace with your Building card component
          <Text key={i} style={{ color: "white" }}>{building.name ?? "Building"}</Text>
        ))}

        {/* Active Conversations */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.locationText}>Active Conversations</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Conversation name="John Doe" />
          <Conversation name="John Doe" />
          <Conversation name="John Doe" />
        </View>

        {/* Active Groups */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.locationText}>Active Groups</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Group name="Sunday Jog" />
          <Group name="Morning Yoga" />
          <Group name="Evening Walk" />
        </View>
      </ScrollView>
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
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    width: "100%",
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
});

export default HomeScreen;