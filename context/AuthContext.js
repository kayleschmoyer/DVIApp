import React, { createContext, useState } from 'react';

// Using named export for AuthContext to match existing import in InspectionScreen
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Mock user state
  const [user, setUser] = useState({
    // Simulate a logged-in user for testing the inspection screen
    mechanicNumber: 'MECH12345', // Default mock mechanic number
    name: 'John Doe',
    // other user details
  });

  // Mock login/logout functions
  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null); // Clear user on logout
    // In a real app, also clear token from AsyncStorage/SecureStore
  };

  // The previous context provided `token` and `setToken`. 
  // Adding a dummy `setToken` and including `user` (which now contains mechanicNumber)
  // in the context value to better align with the new structure while minimizing breakage.
  // A more thorough refactor would update all consumers of AuthContext.
  const [token, setToken] = useState(null); 

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      token, // Keep token for compatibility if other parts use it
      setToken // Keep setToken for compatibility
    }}>
      {children}
    </AuthContext.Provider>
  );
};
