import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DocumentFilterType } from "../types/docTypes";



interface DocumentFilterProps {
  selectedFilter: DocumentFilterType;
  onFilterChange: (filter: DocumentFilterType) => void;
}

const filters: {
  label: string;
  value: DocumentFilterType;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Documents",
    value: "document",
  },
  {
    label: "Notes",
    value: "note",
  },
];

const DocumentFilter = ({
  selectedFilter,
  onFilterChange,
}: DocumentFilterProps) => {
  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.value;

        return (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              isActive && styles.activeFilterButton,
            ]}
            onPress={() => onFilterChange(filter.value)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                isActive && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DocumentFilter;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 16,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#f4f5f7",
    borderWidth: 1,
    borderColor: "#eeeeee",
  },

  activeFilterButton: {
    backgroundColor: "#2f6fed",
    borderColor: "#2f6fed",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },

  activeFilterText: {
    color: "#fff",
  },
});