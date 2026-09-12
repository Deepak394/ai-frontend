import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../api/client";

export default function CreateDocumentScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
     const response:any = await api.post("/documents/create-document", { title, raw_text: rawText });
      if (response.success) {
        navigation.navigate("Documents");
        setTitle("");
        setRawText("");
      } else {
        Alert.alert("Error", response.message || "Failed to create document");
      
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.heading}>New Document</Text>
        <Text style={styles.subtitle}>
          Add a title and paste your content below
        </Text>
      </View>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Paste or type your document text here..."
        value={rawText}
        onChangeText={setRawText}
        multiline
        style={[styles.input, styles.textArea]}
      />
      <Button title={loading ? "Saving..." : "Save Document"} onPress={handleSave} disabled={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  header: {
    paddingBottom: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#8a8a8e",
  },

  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 6 },
  textArea: { height: 200, textAlignVertical: "top" },
});