import React, { createContext, useState, useContext } from 'react';

// Define the type for the mechanic user
export type MechanicUser = {
  mechanicNumber: string;
  mechanicName: string;
  email: string;
};

// Define the context type
type AuthContextType = {
  user: MechanicUser | null;
  setUser: React.Dispatch<React.SetStateAction<MechanicUser | null>>;
};

// Create the context with undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to safely use context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MechanicUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};