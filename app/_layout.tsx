import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text } from 'react-native';
import { Slot } from 'expo-router';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const mech = await SecureStore.getItemAsync('mechanicNumber');
        console.log('[Auth] Loaded mechanicNumber:', mech);
        setIsLoggedIn(!!mech);
      } catch (error) {
        console.error('[Auth] SecureStore error:', error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Slot key="unauth" />;
  }

  return <Slot key="tabs" />;
}
