import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ViewStyle, // For styles
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assuming this will be installed
// React was already imported at the top, useEffect and useRef are used from the main React import.

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface InspectionItemCardProps {
  item: {
    id: string;
    name: string;
    category?: string; // Used for display
  };
  itemCategory: string; // Passed from parent, used for fetching options, not directly used here but good for context
  currentStatus: 'green' | 'yellow' | 'red' | null;
  currentNotes: string;
  currentSeverity: string | null;
  currentLocation: string | null;
  currentReason: string | null;
  onStatusChange: (itemId: string, status: 'green' | 'yellow' | 'red') => void;
  onNotesChange: (itemId: string, notes: string) => void;
  onSeverityChange: (itemId: string, severity: string) => void;
  onLocationChange: (itemId: string, location: string) => void;
  onReasonChange: (itemId: string, reason: string) => void;
  categoryLocationOptions: string[] | undefined; // Options for Location dropdown
  categoryReasonOptions: string[] | undefined; // Options for Reason dropdown
  isSubmitting?: boolean;
}

const SEVERITY_OPTIONS = ["Needs Monitoring", "Warning", "Critical"];

const InspectionItemCard: React.FC<InspectionItemCardProps> = ({
  item,
  // itemCategory, // Not directly used in this component's logic currently
  currentStatus,
  currentNotes,
  currentSeverity,
  currentLocation,
  currentReason,
  onStatusChange,
  onNotesChange,
  onSeverityChange,
  onLocationChange,
  onReasonChange,
  categoryLocationOptions = [], // Default to empty array
  categoryReasonOptions = [], // Default to empty array
  isSubmitting,
}) => {
  // Ref for attempting to focus Reason picker (conceptual)
  const reasonPickerRef = useRef<Picker<string>>(null);

  useEffect(() => {
    // Apply layout animation when currentStatus changes, affecting visibility of additional inputs
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [currentStatus]);

  const showAdditionalInputs = currentStatus === 'yellow' || currentStatus === 'red';

  // Handler for severity change, includes conceptual auto-focus on reason
  const handleSeverityValueChange = (severityValue: string | null) => {
    if (severityValue) {
      onSeverityChange(item.id, severityValue);
      // Auto-focus on Reason picker is complex for Picker component and platform-dependent.
      // Generally, Pickers don't have a direct .focus() like TextInput.
      // This is a placeholder for where such logic might go if feasible.
      // if (reasonPickerRef.current) { /* reasonPickerRef.current.focus(); */ }
    }
  };
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

      {showAdditionalInputs && (
        <View style={styles.additionalInputsContainer}>
          {/* Severity Picker */}
          <Text style={styles.pickerLabel}>Severity:</Text>
          <View style={[
            styles.pickerWrapper,
            currentStatus === 'yellow' ? styles.pickerWrapperYellow : {},
            currentStatus === 'red' ? styles.pickerWrapperRed : {}
          ]}>
            <Picker
              selectedValue={currentSeverity}
              onValueChange={(itemValue) => handleSeverityValueChange(itemValue as string)}
              enabled={!isSubmitting}
              style={styles.picker}
              prompt="Select Severity"
            >
              <Picker.Item label="Select Severity..." value={null} style={styles.pickerItemPlaceholder} />
              {SEVERITY_OPTIONS.map((sev) => (
                <Picker.Item key={sev} label={sev} value={sev} style={styles.pickerItem} />
              ))}
            </Picker>
          </View>

          {/* Location Picker */}
          <Text style={styles.pickerLabel}>Location (Optional):</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currentLocation}
              onValueChange={(itemValue) => itemValue && onLocationChange(item.id, itemValue as string)}
              enabled={!isSubmitting && categoryLocationOptions.length > 0}
              style={styles.picker}
              prompt="Select Location"
            >
              <Picker.Item label={categoryLocationOptions.length > 0 ? "Select Location..." : "No locations for category"} value={null} style={styles.pickerItemPlaceholder} />
              {categoryLocationOptions.map((loc) => (
                <Picker.Item key={loc} label={loc} value={loc} style={styles.pickerItem} />
              ))}
            </Picker>
          </View>

          {/* Reason Picker */}
          <Text style={styles.pickerLabel}>Reason:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              ref={reasonPickerRef}
              selectedValue={currentReason}
              onValueChange={(itemValue) => itemValue && onReasonChange(item.id, itemValue as string)}
              enabled={!isSubmitting && categoryReasonOptions.length > 0}
              style={styles.picker}
              prompt="Select Reason"
            >
              <Picker.Item label={categoryReasonOptions.length > 0 ? "Select Reason..." : "No reasons for category"} value={null} style={styles.pickerItemPlaceholder} />
              {categoryReasonOptions.map((reason) => (
                <Picker.Item key={reason} label={reason} value={reason} style={styles.pickerItem} />
              ))}
            </Picker>
          </View>
        </View>
      )}
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
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3, // Keep elevation for Android
  },
  itemName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  itemCategory: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusButtonContent: {
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  selectedStatusButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2.5,
  },
  additionalInputsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0', // Softer separator line
    paddingTop: 15,
  },
  pickerLabel: {
    fontSize: 15, // Slightly larger label
    fontWeight: '500',
    color: '#34495e', // Darker blue-gray
    marginBottom: 8, // More space below label
  },
  pickerWrapper: {
    backgroundColor: '#f8f9fa', // Light, clean background for pickers
    borderRadius: 8,
    marginBottom: 18, // More space between pickers
    borderWidth: 1,
    borderColor: '#d1d8e0', // Softer border
    overflow: 'hidden', // Ensures border radius is respected by Picker on Android
  },
  pickerWrapperYellow: { // Style for yellow status indication
    borderColor: '#f1c40f', // Yellow border
    // backgroundColor: '#fffefa', // Optional: very light yellow background
  },
  pickerWrapperRed: { // Style for red status indication
    borderColor: '#e74c3c', // Red border
    // backgroundColor: '#fff7f7', // Optional: very light red background
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 50, // iOS pickers have intrinsic height
    width: '100%',
    backgroundColor: 'transparent', // Make picker background transparent to see wrapper
    color: '#2c3e50', // Picker text color
  } as ViewStyle, // Cast to ViewStyle for common props like backgroundColor
  pickerItem: {
    // Styling for individual Picker.Item is limited and platform-specific.
    // For instance, color and fontSize might work on some platforms.
    // Ensure these are tested if specific styling is critical.
    // fontSize: 16,
    // color: '#2c3e50',
  },
  pickerItemPlaceholder: {
    // color: '#7f8c8d', // Lighter color for placeholder
  },
  notesInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#333',
    marginTop: 5, // Ensure notes input has some margin if additional inputs are shown
  },
});

export default InspectionItemCard;
