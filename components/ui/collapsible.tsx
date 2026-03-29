import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface CollapsibleProps {
  children: React.ReactNode;
  title: string;
}

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={[styles.chevron, { color: iconColor }]}>
          {isOpen ? "▲" : "▼"}
        </ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView
          lightColor="rgba(0,0,0,0.02)"
          darkColor="rgba(255,255,255,0.05)"
          style={styles.content}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});
