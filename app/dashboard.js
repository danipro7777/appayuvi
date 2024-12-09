import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api'; // Cliente Axios
import * as SecureStore from 'expo-secure-store'; // Manejo de token seguro

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el userId desde SecureStore
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
          setError('No se ha iniciado sesión correctamente.');
          setLoading(false);
          return;
        }

        // Hacer la petición al backend para obtener usuarios activos
        const response = await api.get('/usuarios/activos');
        console.log('Usuarios activos desde la API:', response.data); // Debug

        // Buscar el usuario logueado en los datos retornados
        const loggedUser = response.data.find(user => user.idUsuario === parseInt(userId));

        if (loggedUser) {
          setUserData(loggedUser);

          // Verificar si el usuario debe cambiar su contraseña
          if (loggedUser.changedPassword === 0) {
            Alert.alert(
              'Cambio de Contraseña',
              'Es necesario que cambies tu contraseña para continuar.',
              [{ text: 'Aceptar', onPress: () => console.log('Alerta cerrada') }]
            );
          }
        } else {
          setError('Usuario no encontrado.');
        }
      } catch (err) {
        console.error('Error al obtener los datos del usuario:', err);
        setError('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AC3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuario no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Imagen de perfil */}
      <Image source={require('../assets/icon.png')} style={styles.profileImage} />
      
      {/* Nombre y domicilio */}
      <Text style={styles.name}>{userData.persona.nombre}</Text>
      <Text style={styles.location}>
        {userData.persona.domicilio || 'Dirección no disponible'}
      </Text>

      {/* Información adicional */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Usuario: </Text>{userData.usuario}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Teléfono: </Text>{userData.persona.telefono}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Email: </Text>{userData.persona.correo}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Fecha de registro: </Text>
          {new Date(userData.persona.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
});
