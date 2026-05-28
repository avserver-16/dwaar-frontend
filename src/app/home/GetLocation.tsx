// GetLocation.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { getApps } from 'react-native-map-link';
type MapApp = {
  id: string;
  name: string;
  icon: any;
  open: () => void;
};
const GetLocation = () => {
  const [availableApps, setAvailableApps] = useState<MapApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapApps();
  }, []);

  const fetchMapApps = async () => {
    try {
      const result = await getApps({
        latitude: 38.8976763,
        longitude: -77.0387185,
        address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        title: 'The White House',

        googleForceLatLon: false,
        alwaysIncludeGoogle: true,

        appsWhiteList: ['google-maps'],
        appsBlackList: ['uber'],
      });

      setAvailableApps(result);
    } catch (error) {
      console.log('Error fetching map apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: MapApp }) => {
    return (
      <Pressable style={styles.card} onPress={item.open}>
        <Image source={item.icon} style={styles.icon} />

        <Text style={styles.appName}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Map Apps</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={availableApps}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default GetLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  listContainer: {
    gap: 15,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },

  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
  },

  appName: {
    fontSize: 16,
    fontWeight: '600',
  },
});