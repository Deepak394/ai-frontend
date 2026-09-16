import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hook/AuthHook";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export default function HomeScreen({ navigation }: any) {
  const { logout, user } = useAuth();
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const userName = user?.full_name || "there";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{userName} 👋</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color="#d9534f" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>What would you like to do today?</Text>

        {/* Action Cards */}
        <TouchableOpacity
          style={[styles.card, styles.primaryCard]}
          onPress={() => navigation.navigate("Create")}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="add-circle-outline" size={26} color="#fff" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitlePrimary}>Create Document</Text>
            <Text style={styles.cardSubtitlePrimary}>
              Start a new document from scratch
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Documents")}
        >
          <View style={[styles.cardIconContainer, styles.secondaryIcon]}>
            <Ionicons name="document-text-outline" size={24} color="#2f6fed" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>View Documents</Text>
            <Text style={styles.cardSubtitle}>
              Browse your saved knowledge base
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#b0b0b0" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  greeting: {
    fontSize: 16,
    color: "#8a8a8e",
  },

  userName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 2,
  },

  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fdeeed",
    justifyContent: "center",
    alignItems: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#8a8a8e",
    marginBottom: 24,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eeeeee",
    marginBottom: 14,
  },

  primaryCard: {
    backgroundColor: "#2f6fed",
    borderWidth: 0,
  },

  cardIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryIcon: {
    backgroundColor: "#f1f5ff",
  },

  cardTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },

  cardTitlePrimary: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  cardSubtitlePrimary: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#8a8a8e",
    marginTop: 3,
  },
});