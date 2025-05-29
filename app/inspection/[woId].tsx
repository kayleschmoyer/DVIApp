import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '../../context/AuthContext'; // Assuming path is correct
import InspectionItemCard from '../../components/InspectionItemCard';
import { fetchInspectionItems, submitInspectionResults } from '../../utils/inspectionApi';

const InspectionScreen = () => {
  const { woId: rawWoId } = useLocalSearchParams();
  const woId = typeof rawWoId === 'string' ? rawWoId : Array.isArray(rawWoId) ? rawWoId[0] : undefined;

  const authContext = useContext(AuthContext);
  const mechanicNumber = authContext?.user?.mechanicNumber;

  const [inspectionItems, setInspectionItems] = useState<any[]>([]);
  const [itemStates, setItemStates] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!woId) return;

    const loadInspectionData = async () => {
      setLoading(true);
      try {
        if (!woId) { // Ensure woId is defined before fetching
          throw new Error("Work Order ID is undefined.");
        }
        const items = await fetchInspectionItems(woId);
        setInspectionItems(items);
        const initialItemStates: any = {};
        items.forEach(item => {
          initialItemStates[item.id] = { status: null, notes: '' };
        });
        setItemStates(initialItemStates);
      } catch (error) {
        console.error('Failed to fetch inspection items:', error);
        Alert.alert('Error', 'Failed to load inspection items.');
        // Optionally set an error state to display a message to the user
      } finally {
        setLoading(false);
      }
    };

    loadInspectionData();
  }, [woId]);

  const handleStatusChange = (itemId: string, newStatus: string) => {
    setItemStates((prev: any) => ({
      ...prev,
      [itemId]: { ...prev[itemId], status: newStatus },
    }));
  };

  const handleNotesChange = (itemId: string, text: string) => {
    setItemStates((prev: any) => ({
      ...prev,
      [itemId]: { ...prev[itemId], notes: text },
    }));
  };

  const handleSubmitInspection = async () => {
    setSubmitting(true);
    const resultsForSubmission = inspectionItems.map(item => ({
      itemId: item.id,
      status: itemStates[item.id]?.status,
      notes: itemStates[item.id]?.notes,
    }));

    const payload = {
      woId: typeof woId === 'string' ? woId : 'INVALID_WOID', // Ensure woId is a string
      mechanicNumber: mechanicNumber || 'MECH_UNKNOWN',
      items: resultsForSubmission,
    };

    try {
      const response = await submitInspectionResults(payload);
      Alert.alert('Submission Successful', response.message);
      // Potentially navigate back or reset screen state
    } catch (error: any) { // Added :any to error to access message property
      console.error('Submission error:', error);
      Alert.alert('Submission Failed', error.message || 'Could not submit inspection data.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: `Inspect WO: ${woId || 'Loading...'}` }} />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Inspection Items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Inspect WO: ${woId || 'Details'}` }} />
      <FlatList
        data={inspectionItems}
        contentContainerStyle={styles.listContentContainer}
        renderItem={({ item }) => (
          <InspectionItemCard
            item={item}
            currentStatus={itemStates[item.id]?.status}
            currentNotes={itemStates[item.id]?.notes}
            onStatusChange={handleStatusChange}
            onNotesChange={handleNotesChange}
            isSubmitting={submitting}
          />
        )}
        keyExtractor={item => item.id}
        ListFooterComponent={
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submittingButton]}
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
    marginHorizontal: 16, // Ensure it matches list padding or is considered separately
    marginBottom: 16, // Add some space at the bottom
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
