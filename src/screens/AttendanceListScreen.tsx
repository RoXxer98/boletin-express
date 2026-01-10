import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useAppData, AttendanceStatus } from "../data/AppDataContext";

type Props = {
  mode: "teacher" | "parent";
  onAdd?: () => void;
};

function statusLabel(s: AttendanceStatus) {
  if (s === "present") return "Presente";
  if (s === "late") return "Tarde";
  return "Falta";
}

export default function AttendanceListScreen({ mode, onAdd }: Props) {
  const { attendance, deleteAttendance } = useAppData();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Asistencia</Text>

        {mode === "teacher" && (
          <Pressable style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>+ Marcar</Text>
          </Pressable>
        )}
      </View>

      {attendance.length === 0 ? (
        <Text style={styles.empty}>No hay registros todavía.</Text>
      ) : (
        <FlatList
          data={attendance}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.status}>{statusLabel(item.status)}</Text>
              {!!item.note && <Text style={styles.note}>{item.note}</Text>}

              {mode === "teacher" && (
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() =>
                    Alert.alert("Eliminar", "¿Eliminar este registro?", [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Eliminar", style: "destructive", onPress: () => deleteAttendance(item.id) },
                    ])
                  }
                >
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 22, fontWeight: "800" },
  addBtn: { backgroundColor: "#111", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  addBtnText: { color: "white", fontWeight: "700" },
  empty: { marginTop: 18, opacity: 0.7 },
  card: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 14, padding: 14 },
  date: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  status: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  note: { fontSize: 13, opacity: 0.8, marginBottom: 10 },
  deleteBtn: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  deleteText: { fontWeight: "700" },
});
