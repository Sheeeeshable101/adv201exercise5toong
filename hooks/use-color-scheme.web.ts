import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export function useColorScheme(): "light" | "dark" {
  const [{ theme }] = useTheme();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) return "light";

  if (theme === "light") return "light";
  if (theme === "dark" || theme === "movieVault") return "dark";
  return "light";
}
