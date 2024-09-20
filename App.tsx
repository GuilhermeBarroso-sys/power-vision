import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductScreen } from './src/screens/ProductScreen';
import { LoginScreen } from './src/screens/LoginScreen';

export const AuthContext = createContext<any>(null);

const Stack = createStackNavigator();

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Products" component={ProductScreen} options={{ title: 'Seu Estoque' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
