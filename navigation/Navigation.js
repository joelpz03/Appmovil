import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Home from "../screens/Home";
import Cursos from "../screens/Cursos";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Cursos" component={Cursos} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  if (isAuthenticated === null) return null; // Espera hasta saber el estado del usuario

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}