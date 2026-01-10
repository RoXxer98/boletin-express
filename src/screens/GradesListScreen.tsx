import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useAppData } from "../data/AppDataContext";

type Props = {
  mode: "teacher" | "parent";
  onAdd?: () => void;
};

export default function GradesListScreen({ mode, onAdd }: Props) {
  const { grades, deleteGrade } = useAppData();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notas</Text>

        {mode === "teacher" && (
          <Pressable style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>+ Agregar</Text>
          </Pressable>
        )}
      </View>

      {grades.length === 0 ? (
        <Text style={styles.empty}>No hay notas todavía.</Text>
      ) : (
        <FlatList
          data={grades}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.score}>Nota: {item.score}/10</Text>
              {!!item.comment && <Text style={styles.comment}>{item.comment}</Text>}

              {mode === "teacher" && (
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => {
                    Alert.alert(
                      "Eliminar nota",
                      "¿Seguro que deseas eliminar esta nota?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Eliminar", style: "destructive", onPress: () => deleteGrade(item.id) },
                      ]
                    );
                  }}
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
  subject: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  score: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  comment: { fontSize: 13, opacity: 0.8, marginBottom: 10 },
  deleteBtn: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  deleteText: { fontWeight: "700" },
});
