import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  const [status, setStatus] = useState("Loading...");
  const [env, setEnv] = useState("Loading...");

  useEffect(() => {
    axios.get("http://192.168.1.43:3000/health")
      .then((res:any) => {
        setStatus(res.data.message);
      })
      .catch((err) =>{
         setStatus("Failed to connect to backend")
      });
  }, []);
    useEffect(() => {
    axios.get("http://192.168.1.43:3000/version")
      .then((res:any) => {
        setEnv(res.data.environment);
      })
      .catch((err) =>{
         setEnv("Failed to connect to backend")
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      <Text style={styles.text}>{env}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});