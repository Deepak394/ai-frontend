import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { api } from "../api/client";

export default function UpdateDocScreen({ route, navigation }: any) {
  const { document } = route.params; // passed from DocumentDetailScreen
  const [title, setTitle] = useState(document.title);
  const [rawText, setRawText] = useState(document.raw_text);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      await api.put(`/documents/${document.id}`, { title, raw_text: rawText });
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        value={rawText}
        onChangeText={setRawText}
        multiline
        style={[styles.input, styles.textArea]}
      />
      <Button title={loading ? "Saving..." : "Update"} onPress={handleUpdate} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 6 },
  textArea: { height: 200, textAlignVertical: "top" },
});