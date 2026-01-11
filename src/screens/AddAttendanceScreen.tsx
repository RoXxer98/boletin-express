import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useAppData, AttendanceStatus } from "../data/AppDataContext";

type Props = {
  onDone: () => void;
};

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddAttendanceScreen({ onDone }: Props) {
  const { addAttendance } = useAppData();

  const [date, setDate] = useState(todayYYYYMMDD());
  const [status, setStatus] = useState<AttendanceStatus>("present");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;

    const trimmedDate = date.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
      Alert.alert("Fecha inválida", "Usa el formato YYYY-MM-DD (ej: 2026-01-10).");
      return;
    }

    const cleanNote = note?.trim();
    const payload = {
      date: trimmedDate,
      status,
      note: cleanNote && cleanNote.length > 0 ? cleanNote : undefined,
    };

    try {
      setSaving(true);
      await addAttendance(payload);
      onDone();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo guardar la asistencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <TextInput value={date} onChangeText={setDate} style={styles.input} />

      <Text style={styles.label}>Estado</Text>

      <View style={styles.row}>
        <Pressable
          style={[styles.chip, status === "present" && styles.chipActive]}
          onPress={() => setStatus("present")}
        >
          <Text style={[styles.chipText, status === "present" && styles.chipTextActive]}>
            Presente
          </Text>
        </Pressable>

        <Pressable
          style={[styles.chip, status === "late" && styles.chipActive]}
          onPress={() => setStatus("late")}
        >
          <Text style={[styles.chipText, status === "late" && styles.chipTextActive]}>
            Tarde
          </Text>
        </Pressable>

        <Pressable
          style={[styles.chip, status === "absent" && styles.chipActive]}
          onPress={() => setStatus("absent")}
        >
          <Text style={[styles.chipText, status === "absent" && styles.chipTextActive]}>
            Falta
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Nota (opcional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Ej: Llegó 10 minutos tarde"
        style={[styles.input, { height: 90 }]}
        multiline
      />

      <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={save}>
        <Text style={styles.saveText}>{saving ? "Guardando..." : "Guardar"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  label: { fontWeight: "700", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 6 },
  chip: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: "#111", borderColor: "#111" },
  chipText: { fontWeight: "700" },
  chipTextActive: { color: "white" },
  saveBtn: { marginTop: 12, backgroundColor: "#111", padding: 14, borderRadius: 12 },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: "white", textAlign: "center", fontWeight: "800", fontSize: 16 },
});
