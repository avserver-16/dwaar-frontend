import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AccountSettingsProps {
  username: string;
  email: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  username,
  email,
}) => {
  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{username}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    // backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  card: {
    // padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
    height:100
  },
  label: {
    fontSize: 14,
    color: '#9AB17A',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9AB17A',
  },
});