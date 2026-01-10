import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  onSelectRole: (role: "teacher" | "parent") => void;
};

export default function LoginScreen({ onSelectRole }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletín Express</Text>
      <Text style={styles.subtitle}>MVP (modo laboratorio)</Text>

      <Pressable style={styles.button} onPress={() => onSelectRole("teacher")}>
        <Text style={styles.buttonText}>Entrar como Profe</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => onSelectRole("parent")}>
        <Text style={styles.buttonText}>Entrar como Padre</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, opacity: 0.7, marginBottom: 24 },
  button: { width: "100%", padding: 14, borderRadius: 12, backgroundColor: "#111", marginBottom: 12 },
  buttonText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
