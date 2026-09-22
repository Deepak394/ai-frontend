import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
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
  const [showTitleModal, setShowTitleModal] = useState(false);
const [conversationTitle, setConversationTitle] = useState("");

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

  async function handleNewConversation(title:string) {
    setCreating(true);
    try {
      const response: any = await api.post("/conversations/create", {title});

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
         onPress={() => setShowTitleModal(true)}
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
                onPress={() => setShowTitleModal(true)}
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
      <Modal
  visible={showTitleModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowTitleModal(false)}
>
  <TouchableWithoutFeedback
    onPress={() => setShowTitleModal(false)}
  >
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            New Conversation
          </Text>

          <Text style={styles.modalSubtitle}>
            Give your conversation a short title
          </Text>

          <TextInput
            value={conversationTitle}
            onChangeText={setConversationTitle}
            placeholder="e.g. React Hooks"
            placeholderTextColor="#9CA3AF"
            maxLength={40}
            autoFocus
            style={styles.titleInput}
          />

          <Text style={styles.characterCount}>
            {conversationTitle.length}/40
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setConversationTitle("");
                setShowTitleModal(false);
              }}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createButton,
                !conversationTitle.trim() &&
                  styles.createButtonDisabled,
              ]}
              disabled={!conversationTitle.trim() || creating}
              onPress={() => {
                handleNewConversation(conversationTitle.trim());
                setConversationTitle("");
                setShowTitleModal(false);
              }}
            >
              {creating ? (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                />
              ) : (
                <Text style={styles.createButtonText}>
                  Create
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

modalContainer: {
  width: "100%",
  maxWidth: 400,
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 22,
},

modalTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#111827",
},

modalSubtitle: {
  fontSize: 13,
  color: "#6B7280",
  marginTop: 5,
  marginBottom: 18,
},

titleInput: {
  height: 48,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 12,
  paddingHorizontal: 14,
  fontSize: 15,
  color: "#111827",
  backgroundColor: "#F9FAFB",
},

characterCount: {
  textAlign: "right",
  fontSize: 11,
  color: "#9CA3AF",
  marginTop: 5,
},

modalButtons: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  marginTop: 20,
},

cancelButton: {
  flex: 1,
  height: 46,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  alignItems: "center",
  justifyContent: "center",
},

cancelButtonText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#374151",
},

// createButton: {
//   flex: 1,
//   height: 46,
//   borderRadius: 12,
//   backgroundColor: "#4F46E5",
//   alignItems: "center",
//   justifyContent: "center",
// },

createButtonDisabled: {
  backgroundColor: "#C7D2FE",
},

createButtonText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#FFFFFF",
},
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
    marginTop: 0,
    backgroundColor: "#2f6fed",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
  },

  // createButtonText: {
  //   color: "#fff",
  //   fontSize: 15,
  //   fontWeight: "600",
  // },
  
});
