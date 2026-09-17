import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../api/client";

// Point this at your actual chat screen route name.
const CHAT_ROUTE = "Chat";

type Conversation = {
  id: string;
  title?: string;
  created_at: string;
  last_message?: string;
};

export default function ConversationListScreen({ navigation }: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  async function fetchConversations() {
    setLoading(true);
    try {
      const response: any = await api.get("/conversations/list");

      if (response.success) {
        setConversations(response.data);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch conversations");
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }


  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, []),
  );

  async function handleNewConversation() {
    setCreating(true);
    try {
      const response: any = await api.post("/conversations/create", {});

      if (response.success) {
        navigation.navigate(CHAT_ROUTE, { conversationId: response.data.id });
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to start a new conversation",
        );
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.5}
      onPress={() =>
        navigation.navigate(CHAT_ROUTE, { conversationId: item.id })
      }
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💬</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || "Untitled conversation"}
        </Text>

        {item.last_message ? (
          <Text style={styles.preview} numberOfLines={1}>
            {item.last_message}
          </Text>
        ) : (
          <Text style={styles.date}>Created {item.created_at}</Text>
        )}
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Conversations</Text>
          <Text style={styles.subtitle}>Chats with your assistant</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNewConversation}
          disabled={creating}
          hitSlop={8}
        >
          {creating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>+</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && conversations.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2f6fed" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchConversations}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>

              <Text style={styles.emptyTitle}>No conversations yet</Text>

              <Text style={styles.emptyText}>
                Start a new conversation to begin chatting.
              </Text>

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleNewConversation}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>New Conversation</Text>
                )}
              </TouchableOpacity>
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
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
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

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2f6fed",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "400",
    marginTop: -2,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingTop: 8,
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#f1f5ff",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 21,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  preview: {
    marginTop: 5,
    fontSize: 13,
    color: "#8a8a8e",
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#8a8a8e",
  },

  arrow: {
    fontSize: 28,
    color: "#b0b0b0",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    color: "#8a8a8e",
  },

  createButton: {
    marginTop: 24,
    backgroundColor: "#2f6fed",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
  },

  createButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
