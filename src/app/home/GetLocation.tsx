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

type Props = {
  onClose: () => void;
};

const GetLocation = ({ onClose }: Props) => {
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
    <View style={styles.popupContainer}>
      <View style={styles.popup}>
        <View style={styles.header}>
          <Text style={styles.heading}>Open Location</Text>

          <Pressable onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

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
    </View>
  );
};

export default GetLocation;

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  popup: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
  },

  close: {
    fontSize: 22,
    fontWeight: '700',
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
    marginBottom: 12,
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