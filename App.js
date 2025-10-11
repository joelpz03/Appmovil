import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/firebaseConfig";

import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import Cursos from "./screens/Cursos";
import ForgotPassword from "./screens/ForgotPassword";
import Profile from "./screens/Profile";
import CarrerasList from "./screens/CarrerasList";
import AddCarrera from "./screens/AddCarrera";
import EditCarrera from "./screens/EditCarrera";

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Cursos" component={Cursos} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="CarrerasList" component={CarrerasList} />
            <Stack.Screen name="AddCarrera" component={AddCarrera} />
            <Stack.Screen name="EditCarrera" component={EditCarrera} />
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
  );
}