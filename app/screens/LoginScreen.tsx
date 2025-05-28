import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../../config';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Email and password cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Login Success', 'Welcome!');
        console.log('Login data:', data);
        // Here you would typically navigate to another screen or store the token
      } else {
        setErrorMessage(data.message || data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#A0A0A0"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry={true}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5', // Very light gray/off-white
    alignItems: 'stretch', // Ensure children can stretch if they have width: '100%'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333333', // Dark graphite
  },
  input: {
    height: 50,
    borderColor: '#B0B0B0', // Medium gray
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White
    color: '#222222', // Very dark graphite
    // width: '100%' is implicitly handled by alignItems: 'stretch' in container for block elements like TextInput
  },
  button: {
    backgroundColor: '#222222', // Black or dark graphite
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Increased margin for separation
  },
  buttonText: {
    color: '#FFFFFF', // White
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F', // Shade of red
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
});

export default LoginScreen;
