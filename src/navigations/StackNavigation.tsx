
import {
  NavigationContainer,
  DefaultTheme,
} from "@react-navigation/native";

import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../hook/AuthHook";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import MainTabNavigator from "./MainTabNavigator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

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
      <ActivityIndicator
        size="large"
        color="#2f6fed"
      />

      <Text style={styles.splashText}>
        Loading...
      </Text>
    </View>
  );
}

export function RootNavigator() {
  const {
    isLoggedIn,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#fff",
          },
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: true,
                title: "Create Account",
                headerBackTitle: "Back",
                headerShadowVisible: false,
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

