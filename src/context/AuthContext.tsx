import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../api/client";
import { AuthContextType } from "../types/authTypes";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        const storedUser = await SecureStore.getItemAsync("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setIsLoggedIn(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setIsAuthenticating(true);
    try {
      const response: any = await api.post("/auth/login", { email, password });
      const { token, success, message, user: loggedInUser } = response;

      if (success) {
        await SecureStore.setItemAsync("authToken", token);
        await SecureStore.setItemAsync("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setIsLoggedIn(true);
      } else {
        throw new Error(message || "Invalid response from server");
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function register(email: string, password: string) {
    setIsRegistering(true);
    try {
      const response: any = await api.post("/auth/register", {
        email,
        password,
      });
      const { success, message } = response;
      if (!success) {
        throw new Error(message || "Invalid response from server");
      }
    } catch (error) {
      throw new Error((error as Error).message || "Failed to register");
    } finally {
      setIsRegistering(false);
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("user");
    setUser(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        isAuthenticating,
        isRegistering,
        login,
        register,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}