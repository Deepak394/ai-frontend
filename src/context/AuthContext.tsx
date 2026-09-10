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

  useEffect(() => {
    checkExistingToken();
  }, []);

  async function checkExistingToken() {
    const token = await SecureStore.getItemAsync("authToken");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    setIsAuthenticating(true);
    try {
      const response: any = await api.post("/auth/login", { email, password });
      const { token, success, message } = response;

      if (success) {
        await SecureStore.setItemAsync("authToken", token);
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
      console.log(response, "response");
      const { success, message } = response;
      if (success) {
        setIsRegistering(false);
      } else {

        throw new Error(message || "Invalid response from server");
      }
    } catch (error) {
        console.log(error, "error");
      throw new Error((error as Error).message || "Failed to register");
    } finally {
      setIsRegistering(false);
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync("authToken");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
