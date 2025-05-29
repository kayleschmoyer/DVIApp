import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface InspectionItemCardProps {
  item: {
    id: string;
    name: string;
    category?: string; // Optional category display
  };
  currentStatus: 'green' | 'yellow' | 'red' | null;
  currentNotes: string;
  onStatusChange: (itemId: string, status: 'green' | 'yellow' | 'red') => void;
  onNotesChange: (itemId: string, notes: string) => void;
  isSubmitting?: boolean; // To disable inputs/buttons during submission if needed
}

const InspectionItemCard: React.FC<InspectionItemCardProps> = ({
  item,
  currentStatus,
  currentNotes,
  onStatusChange,
  onNotesChange,
  isSubmitting,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      {item.category && <Text style={styles.itemCategory}>{item.category}</Text>}
      <View style={styles.statusButtonsContainer}>
        {(['green', 'yellow', 'red'] as const).map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.statusButton,
              { backgroundColor: color },
              currentStatus === color && styles.selectedStatusButton,
            ]}
            onPress={() => onStatusChange(item.id, color)}
            disabled={isSubmitting}
          >
            <Text style={styles.statusButtonText}>
              {color === 'green' ? '✅' : color === 'yellow' ? '⚠️' : '❌'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.notesInput}
        placeholderTextColor="#888"
        placeholder={`Notes for ${item.name}...`}
        value={currentNotes}
        onChangeText={(text) => onNotesChange(item.id, text)}
        multiline={true}
        editable={!isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6, // Adjusted for category
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // As per instruction
    marginBottom: 12,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedStatusButton: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  statusButtonText: {
    fontSize: 20,
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default InspectionItemCard;
