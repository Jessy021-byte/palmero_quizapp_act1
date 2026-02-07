import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useQuizContext } from "../context/_layout";

export default function PreviewQuizScreen() {
  const router = useRouter();
  const { quizQuestions, timerDuration } = useQuizContext();

  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [quizStarted, setQuizStarted] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(quizQuestions.length).fill(null)
  );

  const currentQuestion = quizQuestions[currentIndex];

  const handleFinishQuiz = useCallback(() => {
    let score = 0;
    answers.forEach((answer: string | null, index: number) => {
      const correct = quizQuestions[index].answer;
      if (Array.isArray(correct)) {
        if (answer && (correct as string[]).includes(answer)) score++;
      } else {
        if (answer === correct) score++;
      }
    });

    router.push({
      pathname: "/results",
      params: { score: score.toString(), total: quizQuestions.length.toString() },
    });
  }, [quizQuestions, answers, router]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted]);

  // Handle quiz finish when time runs out
  useEffect(() => {
    if (timeLeft === 0 && quizStarted) {
      handleFinishQuiz();
    }
  }, [timeLeft, quizStarted, handleFinishQuiz]);

  // Update answers array when questions change
  useEffect(() => {
    setAnswers(Array(quizQuestions.length).fill(null));
  }, [quizQuestions.length]);

  // Reset currentIndex if it's out of bounds when questions change
  useEffect(() => {
    if (currentIndex >= quizQuestions.length && quizQuestions.length > 0) {
      setCurrentIndex(quizQuestions.length - 1);
    } else if (quizQuestions.length === 0 && currentIndex !== 0) {
      setCurrentIndex(0);
    }
  }, [quizQuestions.length, currentIndex]);

  // Update timer when duration changes
  useEffect(() => {
    if (!quizStarted) {
      setTimeLeft(timerDuration);
    }
  }, [timerDuration, quizStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectAnswer = (key: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = key;
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setAnswers(Array(quizQuestions.length).fill(null));
    setTimeLeft(timerDuration);
  };

  if (quizQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <Text style={styles.emptyTitle}>No Quiz Available</Text>
          <Text style={styles.emptyText}>
            Please add questions in Quiz Settings tab to start
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {!quizStarted ? (
          <View style={styles.startContainer}>
            <Text style={styles.title}>Ready to Start?</Text>
            <Text style={styles.timerLabel}>
              Quiz Duration: {formatTime(timerDuration)}
            </Text>
            <Text style={styles.questionCountLabel}>
              Total Questions: {quizQuestions.length}
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Time Left: {formatTime(timeLeft)}
              </Text>
            </View>

            <Text style={styles.questionCounter}>
              Question {currentIndex + 1} of {quizQuestions.length}
            </Text>

            <Text style={styles.question}>{currentQuestion.question}</Text>

            {Object.entries(currentQuestion.choices).map(([key, value]: [string, any]) => (
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
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.disabledButton,
                ]}
                onPress={prevQuestion}
                disabled={currentIndex === 0}
              >
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  if (currentIndex === quizQuestions.length - 1) {
                    handleFinishQuiz();
                  } else {
                    nextQuestion();
                  }
                }}
              >
                <Text style={styles.navButtonText}>
                  {currentIndex === quizQuestions.length - 1 ? "Finish" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  startContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  questionCountLabel: {
    fontSize: 14,
    marginBottom: 30,
    color: "#999",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  timerContainer: {
    backgroundColor: "#FFE082",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57F17",
  },
  questionCounter: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selectedOption: {
    backgroundColor: "#C8E6C9",
    borderColor: "#4CAF50",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 40,
  },
  navButton: {
    padding: 12,
    backgroundColor: "#2196F3",
    borderRadius: 6,
    flex: 0.45,
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
