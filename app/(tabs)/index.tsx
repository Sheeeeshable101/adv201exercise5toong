import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import React from "react";
import {
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

import {
  featuredMovie,
  popularMovies,
  trendingMovies,
} from "../../data/movies";

export default function HomeScreen() {
  const [, dispatch] = useTheme();
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

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
      <View style={styles.posterOverlay}>
        <ThemedText style={styles.posterTitle} numberOfLines={2}>
          {item.title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderRowHeader = (title: string) => (
    <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
  );

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
          <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
            <ThemedText style={styles.profileInitials}>
              {user
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : "G"}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <ThemedText style={styles.themeToggleText}>🎨</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <Image source={featuredMovie.image} style={styles.featuredImage} />
          <View style={styles.featuredOverlay}>
            <ThemedText style={styles.featuredTitle}>
              {featuredMovie.title}
            </ThemedText>
            <ThemedText style={styles.featuredDescription}>
              Watch the latest blockbuster hit. Action-packed adventure awaits!
            </ThemedText>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playMovie(featuredMovie.title)}
            >
              <ThemedText style={styles.playButtonText}>▶️ Play</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Continue Watching Row */}
          <View style={styles.row}>
            {renderRowHeader("Continue Watching For John Doe")}
            <FlatList
              data={trendingMovies.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderMoviePoster}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.rowContent}
            />
          </View>

          {/* Trending Now */}
          <View style={styles.row}>
            {renderRowHeader("Trending Now")}
            <FlatList
              data={popularMovies.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderMoviePoster}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.rowContent}
            />
          </View>

          {/* Top Picks */}
          <View style={styles.row}>
            {renderRowHeader("Top Picks For You")}
            <FlatList
              data={trendingMovies.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderMoviePoster}
              keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 14,
    fontWeight: "bold",
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "rgba(0,0,0,0.6)",
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
    backgroundColor: "#E50914",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignSelf: "flex-start",
    width: 120,
  },
  playButtonText: {
    color: "white",
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
    width: 120,
    height: 180,
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
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    justifyContent: "flex-end",
  },
  posterTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
});
