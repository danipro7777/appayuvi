import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Para obtener el token de forma segura
import api from '../api'; // Cliente Axios

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [mensaje, setMensaje] = useState('');

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    // Verificar que las contraseñas nuevas coincidan
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    try {
      // Obtener el userId y el token desde SecureStore
      const userId = await SecureStore.getItemAsync('userId');
      const token = await SecureStore.getItemAsync('token');

      if (!userId || !token) {
        Alert.alert(
          'Error',
          'No se encontró el ID del usuario o el token en el almacenamiento seguro.'
        );
        return;
      }

      // Enviar la solicitud al backend
      const response = await api.put(`/usuarios/${userId}/contrasenia`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'La contraseña ha sido actualizada correctamente.');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Limpiar el formulario
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Ocurrió un error al intentar actualizar la contraseña.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Contraseña</Text>

      {/* Antigua Contraseña */}
      <Text style={styles.label}>Antigua Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="********"
        value={formData.currentPassword}
        onChangeText={(value) => handleInputChange('currentPassword', value)}
      />

      {/* Nueva Contraseña */}
      <Text style={styles.label}>Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="********"
        value={formData.newPassword}
        onChangeText={(value) => handleInputChange('newPassword', value)}
      />

      {/* Confirmar Contraseña */}
      <Text style={styles.label}>Confirmar Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="********"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
      />

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() =>
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
          }
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Mensaje */}
      {mensaje !== '' && <Text style={styles.message}>{mensaje}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#007AC3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
  },
});
