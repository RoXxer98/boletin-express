import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import TeacherHomeScreen from "./src/screens/TeacherHomeScreen";
import ParentHomeScreen from "./src/screens/ParentHomeScreen";
import GradesListScreen from "./src/screens/GradesListScreen";
import AddGradeScreen from "./src/screens/AddGradeScreen";
import { AppDataProvider } from "./src/data/AppDataContext";

/* =========================
   Botón de texto simple
========================= */
function TextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ paddingHorizontal: 12, paddingVertical: 6 }}
    >
      <Text style={{ fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

type Role = "teacher" | "parent" | null;

type RootStackParamList = {
  Login: undefined;
  TeacherHome: undefined;
  ParentHome: undefined;
  GradesListTeacher: undefined;
  GradesListParent: undefined;
  AddGrade: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [role, setRole] = useState<Role>(null);

  return (
    <AppDataProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {role === null ? (
            <Stack.Screen name="Login" options={{ title: "Login" }}>
              {() => <LoginScreen onSelectRole={(r) => setRole(r)} />}
            </Stack.Screen>
          ) : role === "teacher" ? (
            <>
              <Stack.Screen
                name="TeacherHome"
                options={{
                  title: "Profe",
                  headerRight: () => (
                    <TextButton
                      label="Salir"
                      onPress={() => setRole(null)}
                    />
                  ),
                }}
              >
                {({ navigation }) => (
                  <TeacherHomeScreen
                    goGrades={() => navigation.navigate("GradesListTeacher")}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="GradesListTeacher"
                options={{ title: "Notas" }}
              >
                {({ navigation }) => (
                  <GradesListScreen
                    mode="teacher"
                    onAdd={() => navigation.navigate("AddGrade")}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="AddGrade" options={{ title: "Agregar nota" }}>
                {({ navigation }) => (
                  <AddGradeScreen onDone={() => navigation.goBack()} />
                )}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="ParentHome"
                options={{
                  title: "Padre",
                  headerRight: () => (
                    <TextButton
                      label="Salir"
                      onPress={() => setRole(null)}
                    />
                  ),
                }}
              >
                {({ navigation }) => (
                  <ParentHomeScreen
                    goGrades={() => navigation.navigate("GradesListParent")}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="GradesListParent" options={{ title: "Notas" }}>
                {() => <GradesListScreen mode="parent" />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppDataProvider>
  );
}
