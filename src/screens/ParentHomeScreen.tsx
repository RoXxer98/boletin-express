import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { useAuth } from "../auth/AuthContext";

type Props = {
  goGrades: () => void;
  goAttendance: () => void;
};

export default function ParentHomeScreen({ goGrades, goAttendance }: Props) {
  const { linkedTeacherUid, linkToTeacher } = useAuth();
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  const doLink = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await linkToTeacher(code);
      Alert.alert("Listo", "Ya estás vinculado al profe ✅");
      setCode("");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo vincular");
    } finally {
      setSaving(false);
    }
  };

  // Si NO está vinculado, solo muestra el formulario de código
  if (!linkedTeacherUid) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Panel del Padre</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vincularme a un profe</Text>
          <Text style={styles.hint}>
            Pide al profesor su código y escríbelo aquí.
          </Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            placeholder="Ej: ABCD12"
            style={styles.input}
          />

          <Pressable style={[styles.button, saving && { opacity: 0.6 }]} onPress={doLink}>
            <Text style={styles.buttonText}>{saving ? "Vinculando..." : "Vincular"}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Si YA está vinculado, muestra el menú normal
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel del Padre</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vinculado ✅</Text>
        <Text style={styles.hint}>
          Ya puedes ver notas y asistencia del profe vinculado.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={goGrades}>
        <Text style={styles.buttonText}>Ver Notas</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={goAttendance}>
        <Text style={styles.buttonText}>Ver Asistencia</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 10, textAlign: "center" },

  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: { fontWeight: "800" },
  hint: { fontSize: 12, opacity: 0.7 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  button: { backgroundColor: "#111", padding: 14, borderRadius: 12 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "800", fontSize: 16 },
});
