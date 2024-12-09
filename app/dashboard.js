import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from '../api'; // Cliente Axios
import * as SecureStore from 'expo-secure-store'; // Manejo de token seguro
import { useRouter } from 'expo-router'; // Para navegar entre pantallas

export default function Dashboard() {
  const router = useRouter(); // Hook para navegación
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
          setError('No se ha iniciado sesión correctamente.');
          setLoading(false);
          return;
        }

        const response = await api.get('/usuarios/activos');
        const loggedUser = response.data.find(user => user.idUsuario === parseInt(userId));

        if (loggedUser) {
          setUserData(loggedUser);

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
      <Image source={require('../assets/icon.png')} style={styles.profileImage} />
      <Text style={styles.name}>{userData.persona.nombre}</Text>
      <Text style={styles.location}>
        {userData.persona.domicilio || 'Dirección no disponible'}
      </Text>

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

      {/* Botón para cambiar contraseña */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/change-password')} // Navegar a la pantalla de cambiar contraseña
      >
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AC3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
