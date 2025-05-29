import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import InspectionItemCard from '../../components/InspectionItemCard';
import {
  fetchInspectionItems,
  submitInspectionResults,
} from '../../utils/inspectionApi';

type InspectionItem = {
  id: string;
  name: string; // 🔧 required by InspectionItemCard
  title: string;
  description?: string;
};

type ItemState = {
  status: string | null;
  notes: string;
};

const InspectionScreen = () => {
  const { woId: rawWoId } = useLocalSearchParams();
  const woId =
    typeof rawWoId === 'string'
      ? rawWoId
      : Array.isArray(rawWoId)
      ? rawWoId[0]
      : undefined;

  const { user } = useAuth();
  const mechanicNumber = user?.mechanicNumber ?? 'MECH_UNKNOWN';

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // Effect to save itemStates to AsyncStorage whenever it changes
  useEffect(() => {
    const saveStates = async () => {
      if (!woId || Object.keys(itemStates).length === 0) return;
      try {
        const jsonValue = JSON.stringify(itemStates);
        await AsyncStorage.setItem(`inspection_data_${woId}`, jsonValue);
        console.log(`[AsyncStorage] Saved item states for WO: ${woId}`);
      } catch (e) {
        console.error('[AsyncStorage] Failed to save item states:', e);
      }
    };
    saveStates();
  }, [itemStates, woId]);

  useEffect(() => {
    const count = Object.values(itemStates).filter(
      (state) => state.status !== null
    ).length;
    setCompletedCount(count);
  }, [itemStates]);

  useEffect(() => {
    const loadInspectionData = async () => {
      if (!woId) return;

      setLoading(true);
      try {
        const items = await fetchInspectionItems(woId);
        const fixedItems: InspectionItem[] = items.map((item: any) => ({
          ...item,
          name: item.name || item.title || 'Unnamed Item',
        }));
        setInspectionItems(fixedItems);

        // Initialize states
        const initialStates: Record<string, ItemState> = {};
        fixedItems.forEach((item) => {
          initialStates[item.id] = { status: null, notes: '' };
        });

        // Try to load saved states from AsyncStorage
        try {
          const jsonValue = await AsyncStorage.getItem(`inspection_data_${woId}`);
          if (jsonValue !== null) {
            const loadedStates = JSON.parse(jsonValue);
            console.log(`[AsyncStorage] Loaded item states for WO: ${woId}`, loadedStates);
            // Merge loadedStates with initialStates
            Object.keys(initialStates).forEach(itemId => {
              if (loadedStates[itemId]) {
                initialStates[itemId] = { ...initialStates[itemId], ...loadedStates[itemId] };
              }
            });
          } else {
            console.log(`[AsyncStorage] No saved states found for WO: ${woId}`);
          }
        } catch (e) {
          console.error('[AsyncStorage] Failed to load item states:', e);
        }
        setItemStates(initialStates);

      } catch (error) {
        console.error('Failed to fetch inspection items:', error);
        Alert.alert('Error', 'Failed to load inspection items.');
      } finally {
        setLoading(false);
      }
    };

    loadInspectionData();
  }, [woId]); // woId is the primary dependency for loading data

  // Note: The original code for initializing itemStates after fetching items
  // has been moved and integrated into the loadInspectionData effect above.
  // This ensures AsyncStorage loading happens after items are fetched and initial states are prepared.

  // useEffect(() => { // This block is now integrated into loadInspectionData
  //   const loadInspectionData = async () => {
  //     if (!woId) return;

  //     setLoading(true);
  //     try {
  //       const items = await fetchInspectionItems(woId);

        // Ensure all items have `name` (fallback to title if needed)
        // const fixedItems: InspectionItem[] = items.map((item: any) => ({
        //   ...item,
        //   name: item.name || item.title || 'Unnamed Item',
        // }));

        // setInspectionItems(fixedItems);

        // const initialState: Record<string, ItemState> = {};
        // fixedItems.forEach((item) => {
        //   initialState[item.id] = { status: null, notes: '' };
        // });
        // setItemStates(initialState); // This is now handled by the combined effect
      // } catch (error) {
      //   console.error('Failed to fetch inspection items:', error);
      //   Alert.alert('Error', 'Failed to load inspection items.');
      // } finally {
      //   setLoading(false);
      // }
    // };

    // loadInspectionData();
  // }, [woId]);

  const handleStatusChange = (itemId: string, status: string) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], status },
    }));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], notes },
    }));
  };

  const handleSubmitInspection = async () => {
    setSubmitting(true);

    const payload = {
      woId: woId ?? 'UNKNOWN_WO',
      mechanicNumber,
      items: inspectionItems.map((item) => ({
        itemId: item.id,
        status: itemStates[item.id]?.status,
        notes: itemStates[item.id]?.notes,
      })),
    };

    try {
      const result = await submitInspectionResults(payload);
      Alert.alert('Success', result.message);
      // Clear item states from AsyncStorage on successful submission
      if (woId) {
        try {
          await AsyncStorage.removeItem(`inspection_data_${woId}`);
          console.log(`[AsyncStorage] Cleared item states for WO: ${woId}`);
        } catch (e) {
          console.error('[AsyncStorage] Failed to remove item states:', e);
        }
      }
    } catch (error: any) {
      console.error('Error submitting inspection:', error);
      Alert.alert('Error', error.message || 'Failed to submit inspection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{ title: `Inspect WO: ${woId || 'Loading...'}` }}
        />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Inspection Items...</Text>
      </View>
    );
  }

  const totalItems = inspectionItems.length;
  const allItemsInspected = completedCount === totalItems;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Inspect WO: ${woId || 'Details'} (${completedCount}/${totalItems})`,
        }}
      />
      {/* Optional: Header Progress Bar - Can be added if desired */}
      {/* <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${(completedCount / totalItems) * 100}%` }]} />
      </View> */}
      <FlatList
        data={inspectionItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        renderItem={({ item }) => (
          <InspectionItemCard
            item={item}
            currentStatus={
              ['green', 'yellow', 'red'].includes(
                itemStates[item.id]?.status as string
              )
                ? (itemStates[item.id]?.status as 'green' | 'yellow' | 'red')
                : null
            }
            currentNotes={itemStates[item.id]?.notes}
            onStatusChange={handleStatusChange}
            onNotesChange={handleNotesChange}
            isSubmitting={submitting}
          />
        )}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (submitting || !allItemsInspected) && styles.disabledButton,
              ]}
              onPress={handleSubmitInspection}
              disabled={submitting || !allItemsInspected}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Inspection</Text>
              )}
            </TouchableOpacity>
            {!allItemsInspected && (
              <Text style={styles.completionHintText}>
                Please complete all items before submitting.
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8', // Slightly lighter background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  loadingText: { // Added style for loading text
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  // Optional: Styles for a visual progress bar below the header
  // progressBarContainer: {
  //   height: 8,
  //   backgroundColor: '#e0e0e0',
  //   marginHorizontal: 0, // Full width
  // },
  // progressBar: {
  //   height: '100%',
  //   backgroundColor: '#007AFF', // Brand color for progress
  // },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10, // Add some top padding
    paddingBottom: 20, // Ensure space for the submit button area
  },
  footerContainer: { // Container for the submit button and hint text
    paddingVertical: 20, // Increased padding around button
    alignItems: 'center', // Center button and text
    // Removed marginHorizontal from submitButton, handled by padding in listContentContainer or here
  },
  submitButton: {
    backgroundColor: '#007AFF', // Primary brand color
    paddingVertical: 15, // Slightly adjusted padding
    paddingHorizontal: 30,
    borderRadius: 10, // More rounded corners
    alignItems: 'center',
    justifyContent: 'center', // Center content (for ActivityIndicator)
    width: '90%', // Make button wider but not full width
    minHeight: 50, // Ensure consistent height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: { // Style for when the button is disabled
    backgroundColor: '#a0c8ff', // Lighter shade of brand color or grey
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17, // Slightly larger text
    fontWeight: '600', // Semi-bold
  },
  completionHintText: { // Style for the hint text below the button
    marginTop: 10,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});

export default InspectionScreen;