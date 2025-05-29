// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6600",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Work Orders",
          tabBarIcon: ({ color }) => (
            <Feather name="file-text" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}