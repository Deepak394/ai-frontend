import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8fb",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    paddingBottom: 24,
  },



  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#8a8a93",
  },

  loadingBlock: {
    paddingTop: 60,
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: "#8a8a93",
  },

  form: {
    gap: 20,
  },

  fieldGroup: {
    gap: 8,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3f3f46",
  },

  counter: {
    fontSize: 12,
    color: "#a1a1aa",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e4e4e9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#18181b",
  },

  inputFocused: {
    borderColor: "#4f46e5",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  textArea: {
    height: 260,
    lineHeight: 22,
  },

  footer: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: "#f8f8fb",
    borderTopWidth: 1,
    borderTopColor: "#ececf0",
  },

  saveButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  saveButtonPressed: {
    opacity: 0.85,
  },

  saveButtonDisabled: {
    backgroundColor: "#c7c7d1",
    shadowOpacity: 0,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});