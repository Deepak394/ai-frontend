import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../api/client";

type Message = {
  id: string;
  role: "user" | "assistant" | string;
  content: string;
  created_at: string;
};

export default function ChatScreen({ route }: any) {
  const conversationId = route?.params?.conversationId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      Alert.alert("Error", "No conversation selected");
      return;
    }

    fetchMessages();
  }, [conversationId]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const response: any = await api.get(
        `/conversations/get-details/${conversationId}/messages`,
      );

      if (response.success) {
        setMessages(response.data);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch messages");
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.bubbleRow,
          isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
          ]}
        >
          <Text style={isUser ? styles.textUser : styles.textAssistant}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2f6fed" />
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyText}>
                No messages yet. This is a new conversation.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },

  bubbleRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  bubbleRowUser: {
    justifyContent: "flex-end",
  },

  bubbleRowAssistant: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },

  bubbleUser: {
    backgroundColor: "#2f6fed",
    borderBottomRightRadius: 4,
  },

  bubbleAssistant: {
    backgroundColor: "#f1f1f4",
    borderBottomLeftRadius: 4,
  },

  textUser: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },

  textAssistant: {
    color: "#1a1a1a",
    fontSize: 15,
    lineHeight: 20,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },

  emptyIcon: {
    fontSize: 44,
    marginBottom: 16,
  },

  emptyText: {
    textAlign: "center",
    lineHeight: 20,
    color: "#8a8a8e",
  },
});
