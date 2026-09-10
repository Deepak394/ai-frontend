import { View, Text, Button } from "react-native";
import { useAuth } from "../hook/AuthHook";

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome! You're logged in.</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}