import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { questions } from "../questions";

export default function QuizScreen() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );

  const currentQuestion = questions[currentIndex];

  const selectAnswer = (key: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = key;
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // calculate score (handle single and checkbox answers)
      let score = 0;
      answers.forEach((answer, index) => {
        const correct = questions[index].answer;
        if (Array.isArray(correct)) {
          if (answer && correct.includes(answer)) score++;
        } else {
          if (answer === correct) score++;
        }
      });

      router.push({
        pathname: "/results",
        params: { score: score.toString() },
      });
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {currentIndex + 1}. {currentQuestion.question}
      </Text>

{Object.entries(currentQuestion.choices).map(([key, value]) => (
  <TouchableOpacity
    key={key}
    style={[
      styles.option,
      answers[currentIndex] === key && styles.selectedOption,
    ]}
    onPress={() => selectAnswer(key)}
  >
    <Text style={styles.optionText}>
      {key}. {value}
    </Text>
  </TouchableOpacity>
))}

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={prevQuestion}
          disabled={currentIndex === 0}
        >
          <Text>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={nextQuestion}>
          <Text>
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  question: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#C8E6C9",
  },
  optionText: {
    fontSize: 16,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
});
