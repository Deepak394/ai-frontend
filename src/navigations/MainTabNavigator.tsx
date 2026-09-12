import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import CreateDocumentScreen from "../screens/CreateDocumentScreen";

export type MainTabParamList = {
  Home: undefined;
  Documents: undefined;
  Create: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function ProfileScreen() {
  return (
    <View style={styles.disabledContainer}>
      <Ionicons name="person-outline" size={50} color="#b0b0b0" />

      <Text style={styles.disabledTitle}>Profile</Text>

      <Text style={styles.disabledText}>Profile is coming soon.</Text>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#2f6fed",
        tabBarInactiveTintColor: "#9a9a9a",

        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: "#eeeeee",
          backgroundColor: "#fff",
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Documents") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          // Special + button
          // if (route.name === "Create") {
          //   return (
          //     <View style={styles.createIcon}>
          //       <Ionicons
          //         name="add"
          //         size={30}
          //         color="#fff"
          //       />
          //     </View>
          //   );
          // }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton: (props: BottomTabBarButtonProps) => {
          const { children, onPress, onLongPress, accessibilityState, style } =
            props;
          return (
            <Pressable
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityState={accessibilityState}
              android_ripple={null}
              style={style}
            >
              {children}
            </Pressable>
          );
        },
      })}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
        }}
      />

      {/* DOCUMENTS */}
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          title: "Documents",
        }}
      />

      {/* CREATE */}
      <Tab.Screen
        name="Create"
        component={CreateDocumentScreen}
        options={{
          title: "New",
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  createIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2f6fed",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  disabledContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  disabledTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  disabledText: {
    marginTop: 6,
    fontSize: 14,
    color: "#8a8a8e",
  },
});
