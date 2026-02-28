import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MOVIE_CARD_WIDTH = SCREEN_WIDTH * 0.35;
const MOVIE_CARD_HEIGHT = MOVIE_CARD_WIDTH * 1.5;

const { width } = Dimensions.get("window");

function ParallaxMovieCard({
  movie,
  onPress,
}: {
  movie: any;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.05);
    translateY.value = withSpring(-5);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.movieCard, animatedStyle]}>
        <Image source={movie.image} style={styles.movieImage} />
        <View style={styles.movieOverlay}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <View style={styles.movieMeta}>
            <Text style={styles.movieRating}>{movie.rating}</Text>
            <Text style={styles.movieDuration}>{movie.duration}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function FeaturedBanner({
  movie,
  onPress,
}: {
  movie: any;
  onPress: () => void;
}) {
  const scrollX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const parallax = scrollX.value * 0.5;
    return {
      transform: [{ translateX: -parallax }],
    };
  });

  return (
    <Pressable onPress={onPress}>
      <View style={styles.featuredContainer}>
        <Animated.Image
          source={movie.image}
          style={[styles.featuredImage, animatedStyle]}
        />
        <View style={styles.featuredGradient} />
        <View style={styles.featuredContent}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>★ Featured</Text>
          </View>
          <Text style={styles.featuredTitle}>{movie.title}</Text>
          <Text style={styles.featuredDescription} numberOfLines={2}>
            {movie.description}
          </Text>
          <View style={styles.featuredButtons}>
            <TouchableOpacity style={styles.playButton} onPress={onPress}>
              <Text style={styles.playButtonText}>▶ Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoButton} onPress={onPress}>
              <Text style={styles.infoButtonText}>ℹ More Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive" as const,
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  const showMovieDetails = (movie: any) => {
    Alert.alert(
      movie.title,
      `${movie.genre} • ${movie.year} • ${movie.rating}\n\n${movie.description}\n\nDuration: ${movie.duration}`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "Play",
          onPress: () => Alert.alert("Playing", `Now playing: ${movie.title}`),
        },
      ],
    );
  };

  const movies = require("@/data/movies").movies;
  const featuredMovie = require("@/data/movies").featuredMovie;

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#141414" }}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Movie</Text>
          <Text style={styles.logoAccent}>Vault</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/account")}
            style={styles.profileContainer}
          >
            {user?.profilePhoto ? (
              <Image
                source={{ uri: user.profilePhoto }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileFallback}>
                <Text style={styles.profileInitials}>{getUserInitials()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {user && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome back,{" "}
            <Text style={styles.userName}>{user.firstName || "User"}</Text>!
          </Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <FeaturedBanner
          movie={featuredMovie}
          onPress={() => showMovieDetails(featuredMovie)}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {movies.slice(0, 4).map((movie: any) => (
              <ParallaxMovieCard
                key={movie.id}
                movie={movie}
                onPress={() => showMovieDetails(movie)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {movies.map((movie: any) => (
              <ParallaxMovieCard
                key={movie.id}
                movie={movie}
                onPress={() => showMovieDetails(movie)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ New Releases</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {movies
              .slice()
              .reverse()
              .map((movie: any) => (
                <ParallaxMovieCard
                  key={movie.id}
                  movie={movie}
                  onPress={() => showMovieDetails(movie)}
                />
              ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 All Movies</Text>
          <View style={styles.gridContainer}>
            {movies.map((movie: any) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.gridItem}
                onPress={() => showMovieDetails(movie)}
              >
                <Image source={movie.image} style={styles.gridImage} />
                <Text style={styles.gridTitle} numberOfLines={1}>
                  {movie.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#141414",
  } as const,
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  } as const,
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E50914",
  } as const,
  logoAccent: {
    fontSize: 24,
    fontWeight: "300",
    color: "#fff",
  } as const,
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  } as const,
  searchButton: {
    padding: 8,
  } as const,
  searchIcon: {
    fontSize: 20,
  } as const,
  profileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  } as const,
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  } as const,
  profileFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
  } as const,
  profileInitials: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  } as const,
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#141414",
  } as const,
  welcomeText: {
    fontSize: 16,
    color: "#999",
  } as const,
  userName: {
    color: "#E50914",
    fontWeight: "bold",
  } as const,
  featuredContainer: {
    height: 500,
    position: "relative",
  } as const,
  featuredImage: {
    width: width,
    height: 500,
    position: "absolute",
  } as const,
  featuredGradient: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  featuredContent: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
  } as const,
  featuredBadge: {
    backgroundColor: "#E50914",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 12,
  } as const,
  featuredBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  } as const,
  featuredTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  } as const,
  featuredDescription: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 16,
    lineHeight: 20,
  } as const,
  featuredButtons: {
    flexDirection: "row",
    gap: 12,
  } as const,
  playButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
  } as const,
  playButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  } as const,
  infoButton: {
    backgroundColor: "rgba(109,109,110,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  } as const,
  infoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  } as const,
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  } as const,
  horizontalScroll: {
    paddingRight: 16,
    gap: 12,
  } as const,
  movieCard: {
    width: MOVIE_CARD_WIDTH,
    height: MOVIE_CARD_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
  } as const,
  movieImage: {
    width: "100%",
    height: "100%",
  } as const,
  movieOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
  } as const,
  movieTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  } as const,
  movieMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as const,
  movieRating: {
    fontSize: 10,
    color: "#ccc",
  } as const,
  movieDuration: {
    fontSize: 10,
    color: "#ccc",
  } as const,
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  } as const,
  gridItem: {
    width: (SCREEN_WIDTH - 56) / 2,
    marginBottom: 16,
  } as const,
  gridImage: {
    width: "100%",
    height: ((SCREEN_WIDTH - 56) / 2) * 1.3,
    borderRadius: 8,
  } as const,
  gridTitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 8,
  } as const,
};
