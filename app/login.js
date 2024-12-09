import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Importa SecureStore
import api from '../api'; // Cliente Axios

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(''); // Estado para el usuario
  const [contrasenia, setContrasenia] = useState(''); // Estado para la contraseña
  const [error, setError] = useState(null); // Estado para los mensajes de error
  const [loading, setLoading] = useState(false);

  // Manejar el inicio de sesión
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/usuarios/login', { usuario, contrasenia });

      // Guardar el token y otros datos en SecureStore
      const token = response.data.token;
      const userId = response.data.usuario.idUsuario;
      const personId = response.data.usuario.idPersona;
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('userId', userId.toString());
      await SecureStore.setItemAsync('personId', personId.toString());

      Alert.alert('¡Éxito!', `Bienvenido ${response.data.usuario.usuario}`);
      router.push('/dashboard'); // Navega al dashboard
    } catch (err) {
      setError('Usuario o contraseña incorrectos. Por favor, intenta de nuevo.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Campo de usuario */}
      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su usuario"
        value={usuario}
        onChangeText={setUsuario}
      />

      {/* Campo de contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        secureTextEntry
        value={contrasenia}
        onChangeText={setContrasenia}
      />

      {/* Mensaje de error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Botón de inicio de sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '90%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AC3',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
  },
});
