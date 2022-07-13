import { Image, StyleSheet, Text, View } from "react-native";
import logo from "./assets/logo.png";

export default function App() {
  return (
    <View style={styles.root}>
      <Image style={styles.image} source={logo} />
      <Text style={styles.title}>Hello from React Native</Text>
      <Text>
        Edit <code>src/App.js</code> and save to reload.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  image: {
    width: 192,
    height: 192,
    marginHorizontal: "auto",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginVertical: "1em",
    textAlign: "center",
  },
});
