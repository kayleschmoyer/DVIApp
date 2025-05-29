import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  TextStyle
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface InspectionItemCardProps {
  item: {
    id: string;
    name: string;
    category?: string;
  };
  itemCategory: string;
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
  categoryLocationOptions?: string[];
  categoryReasonOptions?: string[];
  isSubmitting?: boolean;
}

const SEVERITY_OPTIONS = ['Needs Monitoring', 'Warning', 'Critical'];

const InspectionItemCard: React.FC<InspectionItemCardProps> = ({
  item,
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
  categoryLocationOptions = [],
  categoryReasonOptions = [],
  isSubmitting
}) => {
  const reasonPickerRef = useRef<Picker<string | null>>(null);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [currentStatus]);

  const showExtra = currentStatus === 'yellow' || currentStatus === 'red';

  return (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      {item.category && <Text style={styles.itemCategory}>{item.category}</Text>}

      <View style={styles.statusButtonsContainer}>
        {([
          { status: 'green', label: '✓', color: '#2ecc71' },
          { status: 'yellow', label: '⚠️', color: '#f1c40f' },
          { status: 'red', label: '✕', color: '#e74c3c' }
        ] as const).map((s) => (
          <TouchableOpacity
            key={s.status}
            style={[
              styles.statusButton,
              { backgroundColor: s.color },
              currentStatus === s.status && styles.selectedStatusButton
            ]}
            onPress={() => onStatusChange(item.id, s.status)}
            disabled={isSubmitting}
          >
            <Text style={styles.statusIcon}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.notesInput}
        placeholderTextColor="#999"
        placeholder={`Notes for ${item.name}...`}
        value={currentNotes}
        onChangeText={(text) => onNotesChange(item.id, text)}
        multiline
        editable={!isSubmitting}
      />

      {showExtra && (
        <View style={styles.additionalInputsContainer}>
          <Text style={styles.pickerLabel}>Severity:</Text>
          <Picker
            selectedValue={currentSeverity}
            onValueChange={(v) => v && onSeverityChange(item.id, v)}
            enabled={!isSubmitting}
            style={styles.picker}
          >
            <Picker.Item label="Select Severity..." value={null} />
            {SEVERITY_OPTIONS.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>

          <Text style={styles.pickerLabel}>Location (Optional):</Text>
          <Picker
            selectedValue={currentLocation}
            onValueChange={(v) => v && onLocationChange(item.id, v)}
            enabled={!isSubmitting && categoryLocationOptions.length > 0}
            style={styles.picker}
          >
            <Picker.Item label="Select Location..." value={null} />
            {categoryLocationOptions.map((l) => (
              <Picker.Item key={l} label={l} value={l} />
            ))}
          </Picker>

          <Text style={styles.pickerLabel}>Reason:</Text>
          <Picker
            ref={reasonPickerRef}
            selectedValue={currentReason}
            onValueChange={(v: string | null) => v && onReasonChange(item.id, v)}
            enabled={!isSubmitting && categoryReasonOptions.length > 0}
            style={styles.picker}
          >
            <Picker.Item label="Select Reason..." value={null} />
            {categoryReasonOptions.map((r) => (
              <Picker.Item key={r} label={r} value={r} />
            ))}
          </Picker>
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
    elevation: 3
  },
  itemName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5
  },
  itemCategory: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 15
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8
  },
  selectedStatusButton: {
    borderWidth: 2,
    borderColor: '#34495e'
  },
  statusIcon: {
    fontSize: 22,
    color: '#fff'
  },
  notesInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#333',
    marginTop: 10
  },
  additionalInputsContainer: {
    marginTop: 15
  },
  pickerLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#34495e',
    marginTop: 10
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#2c3e50'
  } as TextStyle
});

export default InspectionItemCard;