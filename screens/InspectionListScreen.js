import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InspectionListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspections Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});
