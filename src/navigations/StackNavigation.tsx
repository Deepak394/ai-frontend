import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useAuth } from "../hook/AuthHook";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    primary: "#2f6fed",
  },
};

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color="#2f6fed" />
      <Text style={styles.splashText}>Loading...</Text>
    </View>
  );
}

export function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "600", color: "#1a1a1a" },
          headerTintColor: "#2f6fed",
          contentStyle: { backgroundColor: "#fff" },
          animation: "slide_from_right",
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: "Create Account",
                headerBackTitle: "Back",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 12,
  },
  splashText: {
    fontSize: 14,
    color: "#8a8a8e",
  },
});