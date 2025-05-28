// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6600", // your brand color
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
      {/* remove or comment out the “explore” tab */}
      {/*
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Feather name="play" size={20} color={color} />
          ),
        }}
      />
      */}
    </Tabs>
  );
}