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
import { useAuth } from "../hook/AuthHook";
import { styles } from "../styles/DocumentScreen.Style";

const MAX_TITLE_LENGTH = 100;

export default function EditDocumentScreen({ navigation, route }: any) {
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingDocument, setFetchingDocument] = useState(true);
  const [focusedField, setFocusedField] = useState<"title" | "body" | null>(null);

  // Retained from the shared-screen version: some other part of the app
  // reads this global flag while a document is being edited. Remove this
  // whole block (and the useAuth import) if nothing else depends on it.
  const { handleChangeMode } = useAuth();

  const docId = route?.params?.docId;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!docId) {
      Alert.alert("Error", "No document selected to edit");
      navigation.goBack();
      return;
    }

    fetchDocument();

    return () => {
      handleChangeMode(false);
    };
  }, [docId]);

  async function fetchDocument() {
    setFetchingDocument(true);

    try {
      const response: any = await api.get(`/documents/get-document/${docId}`);

      if (response.success) {
        setTitle(response.data.title);
        setRawText(response.data.raw_text);
      } else {
        Alert.alert("Error", response.message || "Failed to load document");
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setFetchingDocument(false);
    }
  }

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
      const response: any = await api.put(
        `/documents/update-document/${docId}`,
        {
          title,
          raw_text: rawText,
        },
      );

      if (response.success) {
        Alert.alert("Success", "Document updated successfully");

        handleChangeMode(false);
        setTitle("");
        setRawText("");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.message || "Failed to update document");
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
          

            {fetchingDocument ? (
              <View style={styles.loadingBlock}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text style={styles.loadingText}>Loading document…</Text>
              </View>
            ) : (
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
            )}
          </Animated.View>
        </ScrollView>

        {/* Sticky save button */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleSave}
            disabled={loading || fetchingDocument || !canSave}
            style={({ pressed }) => [
              styles.saveButton,
              (!canSave || loading || fetchingDocument) &&
                styles.saveButtonDisabled,
              pressed && canSave && styles.saveButtonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Update Document</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
