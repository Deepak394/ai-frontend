import { useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventSource from "react-native-sse";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { api } from "../api/client";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatScreen({ route, navigation }: any) {
  const { conversationId } = route.params;
  const eventSourceRef = useRef<EventSource | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [conversationId]),
  );

  async function loadMessages() {
    try {
      const res: any = await api.get(
        `/conversations/get-details/${conversationId}/messages`,
      );
      console.log(res, "res");
      if (res?.success) {
        setMessages(res.data);
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  }

  // async function handleSend() {
  //   const content = input.trim();

  //   if (!content || sending) return;

  //   setInput("");
  //   setSending(true);

  //   try {
  //     const res:any = await api.post(
  //       `/conversations/send/${conversationId}/messages`,
  //       {
  //         role: "user",
  //         content,
  //       },
  //     );

  //     if(!res?.success) {
  //       Alert.alert(
  //         "Message not sent",
  //         res.message || "Something went wrong during message sending. Please try again.",
  //       );
  //       return;
  //     }

  //     setMessages((prev) => [
  //       ...prev,
  //       res.data.userMessage,
  //       ...(res.data.assistantMessage
  //         ? [res.data.assistantMessage]
  //         : []),
  //     ]);
  //   } catch (error:any) {
  //     setInput(content);

  //     Alert.alert(
  //       "Message not sent",
  //      error?.message || "Something went wrong. Please try again.",
  //     );
  //   } finally {
  //     setSending(false);
  //   }
  // }

  async function handleSend() {
    if (!input.trim() || sending) return;

    const content = input.trim();

    setInput("");
    setSending(true);

    const token = await SecureStore.getItemAsync("authToken");

    if (!token) {
      setSending(false);
      return;
    }

    let assistantDraft = "";

    const draftId = -Date.now();

    // Temporary assistant bubble
    setMessages((prev) => [
      ...prev,
      {
        id: draftId,
        role: "assistant",
        content: "",
      },
    ]);

    const url = `${api.defaults.baseURL}conversations/${conversationId}/messages/stream`;

    const es = new EventSource(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: "user",
        content,
      }),
    });

    eventSourceRef.current = es;

    es.addEventListener("open", () => {
      console.log("SSE CONNECTED");
    });

    es.addEventListener("user_message", (event: any) => {
      console.log("USER MESSAGE EVENT:", event.data);

      try {
        const userMessage = JSON.parse(event.data);

        setMessages((prev) => {
          // Remove temporary assistant
          const withoutDraft = prev.filter((message) => message.id !== draftId);

          return [
            ...withoutDraft,
            userMessage,
            {
              id: draftId,
              role: "assistant",
              content: "",
            },
          ];
        });
      } catch (error) {
        console.error("USER MESSAGE PARSE ERROR:", error);
      }
    });

    es.addEventListener("chunk", (event: any) => {
      console.log("CHUNK EVENT:", event.data);

      try {
        const { text } = JSON.parse(event.data);

        assistantDraft += text;

        setMessages((prev) =>
          prev.map((message) =>
            message.id === draftId
              ? {
                  ...message,
                  content: assistantDraft,
                }
              : message,
          ),
        );
      } catch (error) {
        console.error("CHUNK PARSE ERROR:", error);
      }
    });

    es.addEventListener("done", (event: any) => {
      console.log("DONE EVENT:", event.data);

      try {
        const finalAssistantMessage = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((message) =>
            message.id === draftId ? finalAssistantMessage : message,
          ),
        );
      } catch (error) {
        console.error("DONE PARSE ERROR:", error);
      }

      setSending(false);
      es.close();
      eventSourceRef.current = null;
    });

    es.addEventListener("error", (event: any) => {
      console.log("SSE ERROR:", event);

      setMessages((prev) => prev.filter((message) => message.id !== draftId));

      setSending(false);
      es.close();
      eventSourceRef.current = null;
    });
  }

  function handleStopGenerating() {
    console.log("Stopping AI generation...");

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setSending(false);
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    const isEmptyAssistantDraft = !isUser && item.content === "";

    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={item.failed ? 0.6 : 1}
          disabled={!item.failed}
          onPress={() => item.failed && handleSend(item.content)}
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            item.failed && styles.failedBubble,
          ]}
        >
          {isEmptyAssistantDraft ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.assistantMessageText,
              ]}
            >
              {item.content}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={25} color="#111827" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            </View>

            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>

              <View style={styles.onlineContainer}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={23} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.messagesContainer,
            messages.length === 0 && styles.emptyContainer,
          ]}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="sparkles" size={32} color="#FFFFFF" />
              </View>

              <Text style={styles.emptyTitle}>How can I help you?</Text>

              <Text style={styles.emptyDescription}>
                Ask me anything about your saved documents or notes.
              </Text>

              <View style={styles.suggestionContainer}>
                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => setInput("Summarize this document")}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#4F46E5"
                  />

                  <Text style={styles.suggestionText}>
                    Summarize this document
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => setInput("What are the key points?")}
                >
                  <Ionicons name="bulb-outline" size={18} color="#4F46E5" />

                  <Text style={styles.suggestionText}>
                    What are the key points?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          ListFooterComponent={
            sending ? (
              <View style={styles.typingWrapper}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                </View>

                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color="#4F46E5" />

                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              editable={!sending}
              multiline
              maxLength={2000}
            />

            {sending ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleStopGenerating}
                activeOpacity={0.8}
              >
                <Entypo name="controller-stop" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                disabled={!input.trim()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.disclaimer}>
            AI can make mistakes. Check important information.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* Header */
  header: {
    height: 68,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 5,
  },

  onlineText: {
    fontSize: 12,
    color: "#6B7280",
  },

  /* Messages */
  messagesContainer: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 12,
  },

  messageWrapper: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
  },

  userMessageWrapper: {
    justifyContent: "flex-end",
  },

  assistantMessageWrapper: {
    justifyContent: "flex-start",
  },

  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#4F46E5",
    borderBottomRightRadius: 5,
  },

  assistantBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  assistantMessageText: {
    color: "#1F2937",
  },

  /* Empty state */
  emptyContainer: {
    flexGrow: 1,
  },


  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#6B7280",
    maxWidth: 300,
  },

  suggestionContainer: {
    width: "100%",
    marginTop: 24,
    gap: 10,
  },

  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  suggestionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  /* Typing */
  typingWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  typingText: {
    fontSize: 13,
    color: "#6B7280",
  },

  /* Input */
  inputContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 12 : 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  inputBox: {
    minHeight: 48,
    maxHeight: 120,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 5,
  },

  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 15,
    color: "#111827",
    paddingTop: 8,
    paddingBottom: 8,
  },

  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#C7D2FE",
  },

  disclaimer: {
    textAlign: "center",
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 7,
  },
});
