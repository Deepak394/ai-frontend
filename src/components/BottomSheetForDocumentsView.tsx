import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hook/AuthHook";

const BottomSheetForDocumentsView = ({
  modalVisible,
  selectedDocument,
  closeDocument,
}: any) => {
  const navigation = useNavigation<any>();

  const handleChangeMode  = useAuth()?.handleChangeMode

  const handleEditDoc = (docId: string) => {
    closeDocument();

    navigation.navigate("UpdateDocScreen", {
      docId,
    });
    handleChangeMode(true)
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={closeDocument}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={closeDocument} />

        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          {selectedDocument && (
            <>
              <View style={styles.sheetHeader}>
                <View style={styles.sheetIconContainer}>
                  <Text style={styles.sheetIcon}>📄</Text>
                </View>

                <View style={styles.sheetHeaderText}>
                  <Text style={styles.sheetTitle} numberOfLines={2}>
                    {selectedDocument.title}
                  </Text>
                  <View style={styles.sheetDateRow}>
                    <Ionicons name="time-outline" size={13} color="#8a8a8e" />
                    <Text style={styles.sheetDate}>
                      {selectedDocument.created_at}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[{ ...styles.closeButton, marginRight: 6 }]}
                  onPress={() => handleEditDoc(selectedDocument?.id)}
                >
                  <Feather name="edit" size={20} color="#8a8a8e" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeDocument}
                >
                  <Ionicons name="close" size={20} color="#8a8a8e" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <ScrollView
                style={styles.sheetBody}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.sheetSectionLabel}>CONTENT</Text>
                <Text style={styles.sheetRawText}>
                  {selectedDocument.raw_text || "No content available."}
                </Text>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BottomSheetForDocumentsView;

const styles = StyleSheet.create({
  // Bottom sheet styles
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdrop: {
    // @ts-ignore
    ...StyleSheet.absoluteFillObject, // <- key fix: truly fills behind everything
  },
  sheet: {
    height: "55%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },

  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    marginBottom: 16,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sheetIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#f1f5ff",
    justifyContent: "center",
    alignItems: "center",
  },

  sheetIcon: {
    fontSize: 22,
  },

  sheetHeaderText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  sheetDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  sheetDate: {
    fontSize: 12,
    color: "#8a8a8e",
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 16,
  },

  sheetBody: {
    flex: 1,
    marginTop: 16,
  },

  sheetSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b0b0b0",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  sheetRawText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#333333",
    paddingBottom: 30,
  },
});
