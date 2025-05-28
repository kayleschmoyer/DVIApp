import * as SecureStore from 'expo-secure-store';
import SHA256 from 'crypto-js/sha256';

/** Hash the password like the backend expects (SHA256) */
export function hashPassword(password: string): string {
    return SHA256(password).toString();
  }

export async function saveSession(mechanic: {
  mechanicNumber: string;
  mechanicName: string;
  email: string;
}) {
  await SecureStore.setItemAsync('mechanicNumber', mechanic.mechanicNumber);
  await SecureStore.setItemAsync('mechanicName', mechanic.mechanicName);
  await SecureStore.setItemAsync('email', mechanic.email);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync('mechanicNumber');
  await SecureStore.deleteItemAsync('mechanicName');
  await SecureStore.deleteItemAsync('email');
}

export async function getMechanic() {
  const mechanicNumber = await SecureStore.getItemAsync('mechanicNumber');
  const mechanicName = await SecureStore.getItemAsync('mechanicName');
  const email = await SecureStore.getItemAsync('email');

  if (!mechanicNumber || !mechanicName) return null;

  return { mechanicNumber, mechanicName, email };
}
