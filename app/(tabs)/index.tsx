import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

import { featuredMovie, movies } from "../../data/movies";

export default function HomeScreen() {
  const [, dispatch] = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const profileButtonBg = useThemeColor({
    light: "rgba(0,0,0,0.1)",
    dark: "rgba(255,255,255,0.2)",
    movieVault: "rgba(255,255,255,0.15)",
  });
  const themeToggleBg = profileButtonBg;
  const featuredOverlayBg = useThemeColor({
    light: "rgba(0,0,0,0.5)",
    dark: "rgba(0,0,0,0.8)",
    movieVault: "rgba(0,0,0,0.7)",
  });
  const playButtonBg = useThemeColor({
    light: "#E50914",
    dark: "#ff453a",
    movieVault: "#bb86fc",
  });
  const posterOverlayBg = useThemeColor({
    light: "rgba(0,0,0,0.6)",
    dark: "rgba(0,0,0,0.8)",
    movieVault: "rgba(0,0,0,0.75)",
  });

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });
  const playMovie = (title: string) => {
    Alert.alert("Now Playing", `${title} started streaming!`);
  };

  const renderMoviePoster = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.posterCard}
      onPress={() => playMovie(item.title)}
    >
      <Image source={item.image} style={styles.posterImage} />
      <View
        style={[styles.posterOverlay, { backgroundColor: posterOverlayBg }]}
      >
        <ThemedText style={styles.posterTitle} numberOfLines={2}>
          {item.title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderRowHeader = (title: string) => (
    <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
  );

  const profileName = user
    ? (user.firstName || "") + " " + (user.lastName || "")
    : "Guest";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" />

      {/* Header with Profile and Theme Toggle */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={[styles.logo, { color: textColor }]}>
            MV
          </ThemedText>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <ThemedText style={styles.headerButtonText}>TV Shows</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <ThemedText style={styles.headerButtonText}>Movies</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: profileButtonBg }]}
            onPress={() => router.push("/account")}
          >
            {user?.profilePhoto ? (
              <Image
                source={{ uri: user.profilePhoto }}
                style={styles.profileImage}
              />
            ) : (
              <ThemedText style={styles.profileInitials}>
                {profileName.slice(0, 2).toUpperCase()}
              </ThemedText>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: themeToggleBg }]}
            onPress={toggleTheme}
          >
            <ThemedText style={styles.themeToggleText}>🎨</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <Image source={featuredMovie.image} style={styles.featuredImage} />
          <View
            style={[
              styles.featuredOverlay,
              { backgroundColor: featuredOverlayBg },
            ]}
          >
            <ThemedText style={styles.featuredTitle}>
              {featuredMovie.title}
            </ThemedText>
            <ThemedText style={styles.featuredDescription}>
              Watch the latest blockbuster hit. Action-packed adventure awaits!
            </ThemedText>
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: playButtonBg }]}
              onPress={() => playMovie(featuredMovie.title)}
            >
              <ThemedText style={styles.playButtonText}>▶️ Play</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Continue Watching Row */}
          <View style={styles.row}>
            {renderRowHeader(`Continue Watching for ${profileName}`)}
            <FlatList
              data={movies.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderMoviePoster}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.rowContent}
            />
          </View>

          {/* Trending Now */}
          <View style={styles.row}>
            {renderRowHeader("Trending Now")}
            <FlatList
              data={movies.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderMoviePoster}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.rowContent}
            />
          </View>

          {/* Top Picks */}
          <View style={styles.row}>
            {renderRowHeader("Top Picks For You")}
            <FlatList
              data={movies.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderMoviePoster}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.rowContent}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontSize: 14,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  profileInitials: {
    fontSize: 14,
    fontWeight: "bold",
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  themeToggleText: {
    fontSize: 18,
  },
  scrollContainer: {
    flex: 1,
  },
  featuredBanner: {
    height: 250,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 20,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  playButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignSelf: "flex-start",
    width: 120,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 16,
  },
  row: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  rowContent: {
    gap: 12,
    paddingRight: 16,
  },
  posterCard: {
    width: 160,
    height: 240,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 8,
    justifyContent: "flex-end",
  },
  posterTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
});
