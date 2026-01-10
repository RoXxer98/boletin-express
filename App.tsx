import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import TeacherHomeScreen from "./src/screens/TeacherHomeScreen";
import ParentHomeScreen from "./src/screens/ParentHomeScreen";

type Role = "teacher" | "parent" | null;

type RootStackParamList = {
  Login: undefined;
  TeacherHome: undefined;
  ParentHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [role, setRole] = useState<Role>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {role === null ? (
          <Stack.Screen name="Login" options={{ title: "Login" }}>
            {() => <LoginScreen onSelectRole={(r) => setRole(r)} />}
          </Stack.Screen>
        ) : role === "teacher" ? (
          <Stack.Screen
            name="TeacherHome"
            component={TeacherHomeScreen}
            options={{ title: "Profe" }}
          />
        ) : (
          <Stack.Screen
            name="ParentHome"
            component={ParentHomeScreen}
            options={{ title: "Padre" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
