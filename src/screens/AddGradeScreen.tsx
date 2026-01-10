import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useAppData } from "../data/AppDataContext";

type Props = {
  onDone: () => void;
};

export default function AddGradeScreen({ onDone }: Props) {
  const { addGrade } = useAppData();

  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");

  const save = () => {
    const trimmedSubject = subject.trim();
    const num = Number(score);

    if (!trimmedSubject) {
      Alert.alert("Falta materia", "Escribe la materia (ej: Matemáticas).");
      return;
    }

    if (!Number.isFinite(num) || num < 0 || num > 10) {
      Alert.alert("Nota inválida", "La nota debe estar entre 0 y 10.");
      return;
    }

    addGrade({
      subject: trimmedSubject,
      score: num,
      comment: comment.trim() || undefined,
    });

    onDone();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Materia</Text>
      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Ej: Matemáticas"
        style={styles.input}
      />

      <Text style={styles.label}>Nota (0 a 10)</Text>
      <TextInput
        value={score}
        onChangeText={setScore}
        placeholder="Ej: 8.5"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Comentario (opcional)</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Ej: Mejoró mucho en el parcial"
        style={[styles.input, { height: 90 }]}
        multiline
      />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Guardar</Text>
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
  saveBtn: { marginTop: 12, backgroundColor: "#111", padding: 14, borderRadius: 12 },
  saveText: { color: "white", textAlign: "center", fontWeight: "800", fontSize: 16 },
});
