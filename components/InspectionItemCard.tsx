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
        {([
          { status: 'green', icon: '✓', label: 'Safe', color: '#2ecc71', iconColor: '#fff', selectedBorderColor: '#27ae60' },
          { status: 'yellow', icon: '⚠️', label: 'Monitor', color: '#f1c40f', iconColor: '#333', selectedBorderColor: '#f39c12' },
          { status: 'red', icon: '✕', label: 'Critical', color: '#e74c3c', iconColor: '#fff', selectedBorderColor: '#c0392b' },
        ] as const).map((statusInfo) => (
          <TouchableOpacity
            key={statusInfo.status}
            style={[
              styles.statusButton,
              { backgroundColor: statusInfo.color },
              currentStatus === statusInfo.status && {
                ...styles.selectedStatusButton,
                borderColor: statusInfo.selectedBorderColor, // Specific border color for selection
              },
            ]}
            onPress={() => onStatusChange(item.id, statusInfo.status)}
            disabled={isSubmitting}
          >
            <View style={styles.statusButtonContent}>
              <Text style={[styles.statusIcon, { color: statusInfo.iconColor }]}>
                {statusInfo.icon}
              </Text>
              <Text style={[styles.statusLabel, { color: statusInfo.iconColor }]}>
                {statusInfo.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.notesInput}
        placeholderTextColor="#999" // Slightly lighter placeholder
        placeholder={`Add notes for ${item.name}...`}
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
    shadowOpacity: 0.08, // Slightly softer shadow
    shadowRadius: 5,
    elevation: 3, // Keep elevation for Android
  },
  itemName: {
    fontSize: 19, // Slightly larger
    fontWeight: '600', // Keep semi-bold
    color: '#2c3e50', // Darker, more modern shade
    marginBottom: 5,
  },
  itemCategory: {
    fontSize: 13, // Slightly smaller
    color: '#555', // Slightly darker grey
    fontStyle: 'italic',
    marginBottom: 15, // Increased margin
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Use space-between for more defined spacing
    marginBottom: 18, // Increased margin
  },
  statusButton: {
    flex: 1, // Each button takes equal space
    alignItems: 'center',
    paddingVertical: 12, // Increased padding for tap area
    marginHorizontal: 5, // Spacing between buttons
    borderRadius: 8, // Slightly more rounded corners
    borderWidth: 1.5, // Base border width
    borderColor: 'transparent', // Default transparent border
    // Specific background colors will be applied inline or via conditional styling
  },
  statusButtonContent: { // Container for icon and label
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24, // Larger icon
    color: '#fff', // Default white, can be overridden
  },
  statusLabel: {
    fontSize: 12, // Smaller label text
    marginTop: 5, // Space between icon and label
    color: '#fff', // Default white, can be overridden
    fontWeight: '500',
  },
  selectedStatusButton: {
    //borderColor: '#007bff', // Original selection color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2.5, // Thicker border for selection
    // Note: borderColor for selected state will be specific to button color for contrast
  },
  // Removed statusButtonText as it's replaced by statusIcon and statusLabel

  notesInput: {
    backgroundColor: '#f8f9fa', // Lighter, cleaner background
    borderWidth: 1,
    borderColor: '#ced4da', // Softer border color
    borderRadius: 8, // Consistent with button rounding
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15, // Slightly larger font
    minHeight: 80, // Increased initial height
    textAlignVertical: 'top',
    color: '#333', // Text color
  },
});

export default InspectionItemCard;
