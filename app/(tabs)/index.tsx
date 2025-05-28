// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config";

interface WorkOrder {
  id: number;
  woNumber: string;
  customerName: string;
  status: string;
  createdAt: string;
}

export default function WorkOrdersTab() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkOrders() {
      try {
        const response = await axios.get<WorkOrder[]>(
          `${API_BASE_URL}/api/workorders`
        );
        console.log("💾 Fetched work orders:", response.data);
        setOrders(response.data);
      } catch (err: unknown) {
        console.error("❌ Error fetching work orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No Work Orders found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            // @ts-ignore: dynamic route
            router.push(`/workorders/${item.id}`);
          }}
        >
          <Text style={styles.woNumber}>WO #{item.woNumber}</Text>
          <Text style={styles.customer}>{item.customerName}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  woNumber: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  customer: { fontSize: 14, color: "#666", marginBottom: 2 },
  status: { fontSize: 12, color: "#999" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});