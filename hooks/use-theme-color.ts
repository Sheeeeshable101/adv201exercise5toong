import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeType = "light" | "dark" | "movieVault";

export function useThemeColor(
  props: {
    light?: string;
    dark?: string;
    movieVault?: string;
  } = {},
  colorName?: keyof typeof Colors.light,
): string {
  const systemTheme = useColorScheme();
  const [themeState] = useTheme();
  const effectiveTheme = themeState.theme as ThemeType;

  const colorFromProps = props[effectiveTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (colorName) {
    const themeColors = Colors[effectiveTheme as keyof typeof Colors];
    return (
      (themeColors as any)?.[colorName] ??
      Colors.movieVault[colorName] ??
      "#000000"
    );
  }

  return (
    Colors[effectiveTheme as keyof typeof Colors]?.background ??
    Colors.movieVault.background ??
    "#1a0d2e"
  );
}
