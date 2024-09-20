
import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../App';
export function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthToken } = useContext(AuthContext);

  const AUTH_API_BASE_URL = 'https://api.devgui.info'
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, preencha os campos usuário e senha');
      return;
    }

    console.log(AUTH_API_BASE_URL)
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setAuthToken(result.access_token);

        navigation.navigate('Products');
        console.log('lol')
      } else {
        Alert.alert('Error', result.message || 'Autenticação falhou, tente novamente mais tarde');
      }
    } catch (error: any) {
      console.log(error)
      Alert.alert('Error', 'Aconteceu um erro, tente novamente mais tarde');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.companyBrand}>Power Vision</Text>
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        buttonColor="#4CAF50"
      >
        Login
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  companyBrand: {
    fontSize: 48,
    marginBottom: 5,
    marginTop: -25,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: "bold"
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
  },
});


