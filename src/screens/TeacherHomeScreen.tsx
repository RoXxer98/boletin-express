import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  goGrades: () => void;
};

export default function TeacherHomeScreen({ goGrades }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel del Profe</Text>

      <Pressable style={styles.button} onPress={goGrades}>
        <Text style={styles.buttonText}>Notas</Text>
      </Pressable>

      <Text style={styles.hint}>Luego aquí pondremos Asistencia.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  hint: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 10,
  },
});
