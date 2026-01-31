import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { questions } from "../questions";

let highestScore = 0;

export default function ResultsScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams();
  const numericScore = Number(score);

  if (numericScore > highestScore) {
    highestScore = numericScore;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <Text style={styles.text}>
        Your Score: {numericScore} / {questions.length}
      </Text>

      <Text style={styles.text}>
        Highest Score: {highestScore} / {questions.length}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Restart Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
