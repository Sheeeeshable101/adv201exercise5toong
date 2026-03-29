import { useTheme } from "@/context/ThemeContext";
import { useColorScheme as useSystemColorScheme } from "react-native";

export function useColorScheme(): "light" | "dark" {
  const [{ theme }] = useTheme();
  if (theme === "light") return "light";
  if (theme === "dark" || theme === "movieVault") return "dark";
  const system = useSystemColorScheme();
  return system ?? "light";
}
