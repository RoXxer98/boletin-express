import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../auth/AuthContext";

export default function LoginScreen() {
  const { setRoleForUser } = useAuth();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo iniciar sesión");
    }
  };

  const registerTeacher = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await setRoleForUser("teacher");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo registrar");
    }
  };

  const registerParent = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await setRoleForUser("parent");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo registrar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletín Express</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>

      <View style={{ height: 10 }} />

      <Pressable style={styles.outline} onPress={registerTeacher}>
        <Text style={styles.outlineText}>Registrarme como Profe</Text>
      </Pressable>

      <Pressable style={styles.outline} onPress={registerParent}>
        <Text style={styles.outlineText}>Registrarme como Padre</Text>
      </Pressable>

      <Text style={styles.note}>
        (MVP) Usa un email tipo test@roxxer.com y una contraseña de mínimo 6
        caracteres.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  outline: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111",
  },
  outlineText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});
