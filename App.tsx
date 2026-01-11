import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import TeacherHomeScreen from "./src/screens/TeacherHomeScreen";
import ParentHomeScreen from "./src/screens/ParentHomeScreen";

import GradesListScreen from "./src/screens/GradesListScreen";
import AddGradeScreen from "./src/screens/AddGradeScreen";

import AttendanceListScreen from "./src/screens/AttendanceListScreen";
import AddAttendanceScreen from "./src/screens/AddAttendanceScreen";

import { AppDataProvider } from "./src/data/AppDataContext";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";

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

type RootStackParamList = {
  Login: undefined;
  TeacherHome: undefined;
  ParentHome: undefined;

  GradesListTeacher: undefined;
  GradesListParent: undefined;
  AddGrade: undefined;

  AttendanceListTeacher: undefined;
  AttendanceListParent: undefined;
  AddAttendance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/* =========================
   APP ROOT
========================= */
export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppNavigator />
      </AppDataProvider>
    </AuthProvider>
  );
}

/* =========================
   NAVIGATOR CONTROLADO POR AUTH
========================= */
function AppNavigator() {
  const { role, loading, logout } = useAuth();

  if (loading) return null; // luego splash bonito 😏

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {role === null ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
        ) : role === "teacher" ? (
          <>
            <Stack.Screen
              name="TeacherHome"
              options={{
                title: "Profe",
                headerRight: () => <TextButton label="Salir" onPress={logout} />,
              }}
            >
              {({ navigation }) => (
                <TeacherHomeScreen
                  goGrades={() => navigation.navigate("GradesListTeacher")}
                  goAttendance={() =>
                    navigation.navigate("AttendanceListTeacher")
                  }
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="GradesListTeacher" options={{ title: "Notas" }}>
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

            <Stack.Screen
              name="AttendanceListTeacher"
              options={{ title: "Asistencia" }}
            >
              {({ navigation }) => (
                <AttendanceListScreen
                  mode="teacher"
                  onAdd={() => navigation.navigate("AddAttendance")}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="AddAttendance"
              options={{ title: "Marcar asistencia" }}
            >
              {({ navigation }) => (
                <AddAttendanceScreen onDone={() => navigation.goBack()} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="ParentHome"
              options={{
                title: "Padre",
                headerRight: () => <TextButton label="Salir" onPress={logout} />,
              }}
            >
              {({ navigation }) => (
                <ParentHomeScreen
                  goGrades={() => navigation.navigate("GradesListParent")}
                  goAttendance={() =>
                    navigation.navigate("AttendanceListParent")
                  }
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="GradesListParent" options={{ title: "Notas" }}>
              {() => <GradesListScreen mode="parent" />}
            </Stack.Screen>

            <Stack.Screen
              name="AttendanceListParent"
              options={{ title: "Asistencia" }}
            >
              {() => <AttendanceListScreen mode="parent" />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
