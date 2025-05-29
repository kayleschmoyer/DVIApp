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

  useEffect(() => {
    const loadInspectionData = async () => {
      if (!woId) return;

      setLoading(true);
      try {
        const items = await fetchInspectionItems(woId);

        // Ensure all items have `name` (fallback to title if needed)
        const fixedItems: InspectionItem[] = items.map((item: any) => ({
          ...item,
          name: item.name || item.title || 'Unnamed Item',
        }));

        setInspectionItems(fixedItems);

        const initialState: Record<string, ItemState> = {};
        fixedItems.forEach((item) => {
          initialState[item.id] = { status: null, notes: '' };
        });
        setItemStates(initialState);
      } catch (error) {
        console.error('Failed to fetch inspection items:', error);
        Alert.alert('Error', 'Failed to load inspection items.');
      } finally {
        setLoading(false);
      }
    };

    loadInspectionData();
  }, [woId]);

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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Inspection Items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: `Inspect WO: ${woId || 'Details'}` }}
      />
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
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submittingButton,
            ]}
            onPress={handleSubmitInspection}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Inspection'}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  listContentContainer: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  submittingButton: {
    backgroundColor: '#0056b3',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InspectionScreen;