import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store'; // Importa SecureStore

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('token'); // Obtiene el token desde SecureStore
      if (token) {
        setUser({ token }); // Puedes cargar más información del usuario si lo necesitas
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync('token', token); // Guarda el token en SecureStore
    setUser({ token });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token'); // Elimina el token de SecureStore
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
