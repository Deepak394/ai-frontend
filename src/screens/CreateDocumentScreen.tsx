import { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../api/client";
import { styles } from "../styles/DocumentScreen.Style";

const MAX_TITLE_LENGTH = 100;

export default function CreateDocumentScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<"title" | "body" | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a title");
      return;
    }

    if (!rawText.trim()) {
      Alert.alert("Validation", "Please enter document content");
      return;
    }

    setLoading(true);

    try {
      const response: any = await api.post("/documents/create-document", {
        title,
        raw_text: rawText,
      });

      if (response.success) {
        Alert.alert("Success", "Document created successfully");

        setTitle("");
        setRawText("");
        navigation.navigate("Documents");
      } else {
        Alert.alert("Error", response.message || "Failed to create document");
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const wordCount = rawText.trim().length
    ? rawText.trim().split(/\s+/).length
    : 0;

  const canSave = title.trim().length > 0 && rawText.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View style={styles.header}>
            

              <Text style={styles.heading}>New Document</Text>
              <Text style={styles.subtitle}>
                Add a title and paste your content below
              </Text>
            </View>

            <View style={styles.form}>
              {/* Title field */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Title</Text>
                  <Text style={styles.counter}>
                    {title.length}/{MAX_TITLE_LENGTH}
                  </Text>
                </View>
                <TextInput
                  placeholder="Give your document a name"
                  placeholderTextColor="#a3a3ab"
                  value={title}
                  onChangeText={(t) => setTitle(t.slice(0, MAX_TITLE_LENGTH))}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  style={[
                    styles.input,
                    focusedField === "title" && styles.inputFocused,
                  ]}
                  returnKeyType="next"
                />
              </View>

              {/* Body field */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Content</Text>
                  <Text style={styles.counter}>{wordCount} words</Text>
                </View>
                <TextInput
                  placeholder="Paste or type your document text here..."
                  placeholderTextColor="#a3a3ab"
                  value={rawText}
                  onChangeText={setRawText}
                  onFocus={() => setFocusedField("body")}
                  onBlur={() => setFocusedField(null)}
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.input,
                    styles.textArea,
                    focusedField === "body" && styles.inputFocused,
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Sticky save button */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleSave}
            disabled={loading || !canSave}
            style={({ pressed }) => [
              styles.saveButton,
              (!canSave || loading) && styles.saveButtonDisabled,
              pressed && canSave && styles.saveButtonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Document</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
