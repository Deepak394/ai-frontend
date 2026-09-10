
import { AuthProvider } from "./src/context/AuthContext";
import { RootNavigator } from "./src/navigations/StackNavigation";

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
  