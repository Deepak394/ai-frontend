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
import BottomSheetForDocumentsView from "../components/BottomSheetForDocumentsView";
import { DocumentFilterType } from "../types/docTypes";
import DocumentFilter from "../components/DocumentFilter";


const CREATE_DOCUMENT_ROUTE = "Create";

type DocumentItem = {
  id: string;
  title: string;
  created_at: string;
};

// What the detail endpoint actually returns — separate from the list-item
// shape above, since selectedDocument holds the full record, not a string.
type DocumentDetail = {
  id: string;
  title: string;
  raw_text: string;
  created_at: string;
};

export default function DocumentsScreen({ navigation }: any) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState<DocumentFilterType>("all");

  async function fetchDocumentsDetails(itemId: string) {
    setLoading(true);
    try {
      const response: any = await api.get(`/documents/get-document/${itemId}`);

      if (response.success) {
        setSelectedDocument(response.data);
        setModalVisible(true);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch document");
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function closeDocument() {
    setModalVisible(false);
    setSelectedDocument(null);
  }

  async function fetchDocuments(filter: DocumentFilterType) {
    setLoading(true);
      
    try {
      const response: any = await api.get(
        `/documents/list-documents?type=${filter || "all"}`,
      );
      if (response.success) {
        setDocuments(response.data);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch documents");
      }
    } catch (err) {
     
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

const handleSelect = (value:DocumentFilterType) => {
 
  setSelectedFilter(value)
}


  useFocusEffect(
    useCallback(() => {
      fetchDocuments(selectedFilter);
    }, [selectedFilter]),
  );



  const renderDocument = ({ item }: { item: DocumentItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.5}
        onPress={() => fetchDocumentsDetails(item.id)}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📄</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.date}>Created {item.created_at}</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header: title + add button only */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Documents</Text>
          <Text style={styles.subtitle}>Your saved knowledge</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(CREATE_DOCUMENT_ROUTE)}
          hitSlop={8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filters: own row, full width, doesn't compete with the header */}
      <DocumentFilter
        selectedFilter={selectedFilter}
        onFilterChange={handleSelect}
      />

      {/* Loading indicator */}
      {loading && documents.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2f6fed" />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderDocument}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={() => fetchDocuments(selectedFilter)}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📄</Text>

              <Text style={styles.emptyTitle}>No documents yet</Text>

              <Text style={styles.emptyText}>
                Create your first document to start building your knowledge
                base.
              </Text>

              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate(CREATE_DOCUMENT_ROUTE)}
              >
                <Text style={styles.createButtonText}>Create Document</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <BottomSheetForDocumentsView
        modalVisible={modalVisible}
        selectedDocument={selectedDocument}
        closeDocument={closeDocument}
      />
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
    paddingBottom: 4,
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
  },

  createButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
