import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

let highestScore = 0;

export default function ResultsScreen() {
  const router = useRouter();
  const { score, total } = useLocalSearchParams();
  const numericScore = Number(score);
  const numericTotal = Number(total);

  if (numericScore > highestScore) {
    highestScore = numericScore;
  }

  const percentage = Math.round((numericScore / numericTotal) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{percentage}%</Text>
        <Text style={styles.scoreSubtitle}>Your Performance</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          Correct Answers: {numericScore} / {numericTotal}
        </Text>

        <Text style={styles.detailText}>
          Highest Score: {highestScore}
        </Text>

        {percentage >= 80 && (
          <Text style={styles.feedbackGood}>🎉 Excellent Work!</Text>
        )}
        {percentage >= 60 && percentage < 80 && (
          <Text style={styles.feedbackOk}>👍 Good Job!</Text>
        )}
        {percentage < 60 && (
          <Text style={styles.feedbackBad}>📚 Keep Practicing!</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.restartButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreText: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#2196F3",
  },
  scoreSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
    lineHeight: 24,
  },
  feedbackGood: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  feedbackOk: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9800",
    marginTop: 10,
  },
  feedbackBad: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  restartButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  homeButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
