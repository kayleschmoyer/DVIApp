import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

type WorkOrder = {
  id: number;
  woNumber: string;
  customerName: string;
  status: string;
  createdAt: string;
};

export default function WorkOrdersTab() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch('http://192.168.7.185:5043/api/workorders');
        const data = await response.json();
        console.log('💾 Fetched work orders:', data);
        setWorkOrders(data);
      } catch (error) {
        console.error('Failed to fetch work orders:', error);
      }
    };

    if (isFocused) {
      fetchWorkOrders();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Work Orders</Text>
      <FlatList
  data={workOrders}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/inspection/${item.id}`)}
    >
      <Text style={styles.title}>{item.woNumber}</Text>
      <Text>{item.customerName}</Text>
      <Text>Status: {item.status}</Text>
      <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
