import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export function useColorScheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark" | "movieVault">("light");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const [{ theme: currentTheme }] = useTheme();

  useEffect(() => {
    if (hasHydrated) {
      if (currentTheme === "light") setTheme("light");
      else if (currentTheme === "dark" || currentTheme === "movieVault")
        setTheme("dark");
      else setTheme("light");
    }
  }, [currentTheme, hasHydrated]);

  if (theme === "light") return "light";
  if (theme === "dark" || theme === "movieVault") return "dark";
  return "light";
}
