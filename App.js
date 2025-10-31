import { enableScreens } from 'react-native-screens';
enableScreens(false);
import React, { useEffect, useState, useRef } from "react";
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
  const [initializing, setInitializing] = useState(true);
  // Estado para indicar que SignUp/Login está realizando una navegación manual (evita el re-render a Home)
  const [isNavigatingAway, setIsNavigatingAway] = useState(false); 

  const isNavigatingAwayRef = useRef(isNavigatingAway); 

  useEffect(() => {
    isNavigatingAwayRef.current = isNavigatingAway;
  }, [isNavigatingAway]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      
      if (isNavigatingAwayRef.current) {
        console.log("onAuthStateChanged: Evento ignorado debido a isNavigatingAway.");
        return; 
      }
      
      if (currentUser && !initializing) {
        setTimeout(() => {
          setUser(currentUser);
        }, 1500);
      } else {
        setUser(currentUser);
      }
      
      if (initializing) setInitializing(false);
    });
    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff" 
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user && !isNavigatingAway ? (
            <>
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="Cursos" component={Cursos} options={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="AddCarrera" component={AddCarrera} options={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="EditCarrera" component={EditCarrera} options={{ headerShown: false, unmountOnBlur: false}} />
              <Stack.Screen name="CarreraDetalle" component={CarreraDetalle} options={{ headerShown: false, unmountOnBlur: false}} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp">
                {(props) => (
                  <SignUp 
                    {...props} 
                    setIsNavigatingAway={setIsNavigatingAway}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}