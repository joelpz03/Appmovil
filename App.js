import { enableScreens } from 'react-native-screens';
// Desactiva screens para evitar problemas de layout
enableScreens(false);
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/firebaseConfig";

import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import Cursos from "./screens/Cursos";
import ForgotPassword from "./screens/ForgotPassword";
import Profile from "./screens/Profile";
import AddCarrera from "./screens/AddCarrera";
import EditCarrera from "./screens/EditCarrera";
import CarreraDetalle from "./screens/CarreraDetalle";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff" 
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Home" component={Home} screenOptions={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="Cursos" component={Cursos} screenOptions={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="Profile" component={Profile} screenOptions={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="AddCarrera" component={AddCarrera} screenOptions={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="EditCarrera" component={EditCarrera} screenOptions={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="CarreraDetalle" component={CarreraDetalle} screenOptions={{ headerShown: false, unmountOnBlur: false}} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}