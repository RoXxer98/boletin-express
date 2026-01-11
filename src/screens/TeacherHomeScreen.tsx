import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../auth/AuthContext";

type Props = {
  goGrades: () => void;
  goAttendance: () => void;
};

export default function TeacherHomeScreen({ goGrades, goAttendance }: Props) {
  const { teacherCode, refreshTeacherCode } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel del Profe</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Código para padres</Text>
        <Text style={styles.code}>{teacherCode ?? "Generando..."}</Text>

        <Pressable style={styles.smallBtn} onPress={refreshTeacherCode}>
          <Text style={styles.smallBtnText}>Generar / Actualizar</Text>
        </Pressable>

        <Text style={styles.hint}>
          El padre ingresa este código una sola vez para ver tus registros.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={goGrades}>
        <Text style={styles.buttonText}>Notas</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={goAttendance}>
        <Text style={styles.buttonText}>Asistencia</Text>
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
  },
  cardTitle: { fontWeight: "800", marginBottom: 6 },
  code: { fontSize: 28, fontWeight: "900", letterSpacing: 2, marginBottom: 10 },
  smallBtn: { alignSelf: "flex-start", backgroundColor: "#111", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  smallBtnText: { color: "white", fontWeight: "800" },
  hint: { marginTop: 10, fontSize: 12, opacity: 0.7 },

  button: { backgroundColor: "#111", padding: 14, borderRadius: 12 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "800", fontSize: 16 },
});
