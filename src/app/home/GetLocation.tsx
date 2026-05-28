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
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../../styles/globalStyles';

type MapApp = {
  id: string;
  name: string;
  icon: any;
  open: () => void;
  lat: number;
  lng: number;
};

type Props = {
  onClose: () => void;
  lat: number;
  lng: number;
  title: string;
};

const GetLocation = ({ onClose, lat, lng, title }: Props) => {
  const [availableApps, setAvailableApps] = useState<MapApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapApps();
  }, []);

  const fetchMapApps = async () => {
    try {
      const result = await getApps({
        latitude: lat,
        longitude: lng,
        address: '',
        title:title,

        googleForceLatLon: false,
        alwaysIncludeGoogle: true,
      });

      setAvailableApps(result.map((app) => ({
        ...app,
        lat,
        lng,
      })));
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
            <Ionicons name="close" size={24} color="#9AB17A" />
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
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#9AB17A',
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
    fontFamily: fonts.Ebold,
    color: '#9AB17A',
  },

  close: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: fonts.Ebold,
    color: '#9AB17A',
  },

  listContainer: {
    gap: 15,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#9AB17A',
    marginBottom: 12,
  },

  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
    tintColor: '#9AB17A',
  },

  appName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.Emedium,
  },
});