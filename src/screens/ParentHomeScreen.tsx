import { View, Text, StyleSheet } from "react-native";

export default function ParentHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel del Padre</Text>
      <Text>Luego: ver notas y asistencia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
});
