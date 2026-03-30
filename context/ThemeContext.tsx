import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type Theme = "light" | "dark" | "movieVault";

type ThemeState = {
  theme: Theme;
};

type ThemeAction =
  | { type: "TOGGLE_THEME" }
  | { type: "SET_THEME"; payload: Theme };

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case "TOGGLE_THEME":
      const nextTheme =
        state.theme === "light"
          ? "dark"
          : state.theme === "dark"
            ? "movieVault"
            : "light";
      return { theme: nextTheme };
    case "SET_THEME":
      return { theme: action.payload };
    default:
      return state;
  }
};

const ThemeContext = createContext<
  [ThemeState, React.Dispatch<ThemeAction>] | null
>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSystemColorScheme();
  const [state, dispatch] = useReducer(themeReducer, {
    theme: "movieVault" as Theme,
  });

  useEffect(() => {
    AsyncStorage.getItem("@theme").then((savedTheme) => {
      if (
        savedTheme &&
        (["light", "dark", "movieVault"] as Theme[]).includes(
          savedTheme as Theme,
        )
      ) {
        dispatch({ type: "SET_THEME", payload: savedTheme as Theme });
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@theme", state.theme);
  }, [state.theme]);

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });
  const setTheme = (theme: Theme) =>
    dispatch({ type: "SET_THEME", payload: theme });

  return (
    <ThemeContext.Provider value={[state, dispatch]}>
      {children}
    </ThemeContext.Provider>
  );
}
