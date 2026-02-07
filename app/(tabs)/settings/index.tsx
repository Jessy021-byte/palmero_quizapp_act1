import { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useQuizContext } from "../../context/_layout";

interface QuizQuestion {
  id: number;
  type: string;
  question: string;
  choices: Record<string, string>;
  answer: string | string[];
}

export default function SettingsScreen() {
  const { quizQuestions, setQuizQuestions, timerDuration, setTimerDuration, defaultQuestions } =
    useQuizContext();

  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [formData, setFormData] = useState<Partial<QuizQuestion>>({});

  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
    setEditingQuestion(null);
    setFormData({
      id: Math.max(...quizQuestions.map((q: QuizQuestion) => q.id), 0) + 1,
      type: "multiple",
      question: "",
      choices: { A: "", B: "", C: "", D: "" },
      answer: "A",
    });
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setIsAddingQuestion(false);
    setFormData({ ...question });
  };

  const handleSaveQuestion = () => {
    if (
      !formData.question ||
      !formData.choices ||
      Object.values(formData.choices).some((c: any) => !c)
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (editingQuestion) {
      setQuizQuestions(
        quizQuestions.map((q: QuizQuestion) =>
          q.id === editingQuestion.id ? (formData as QuizQuestion) : q
        )
      );
    } else {
      setQuizQuestions([...quizQuestions, formData as QuizQuestion]);
    }

    setEditingQuestion(null);
    setIsAddingQuestion(false);
    setFormData({});
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = quizQuestions.filter((q: QuizQuestion) => q.id !== id);
    setQuizQuestions(updatedQuestions);
  };

  const handleRestoreQuestions = () => {
    Alert.alert(
      "Restore Questions",
      "Are you sure you want to restore the default questions?",
      [
        { text: "Cancel" },
        {
          text: "Restore",
          onPress: () => {
            setQuizQuestions(defaultQuestions);
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsAddingQuestion(false);
    setFormData({});
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timer Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ Quiz Timer</Text>
          <View style={styles.timerSettingContainer}>
            <Text style={styles.label}>Duration (seconds):</Text>
            <TextInput
              style={styles.timerInput}
              placeholder="300"
              keyboardType="number-pad"
              value={timerDuration.toString()}
              onChangeText={(text: string) => {
                const val = parseInt(text) || 300;
                setTimerDuration(val);
              }}
            />
            <Text style={styles.timerDisplay}>
              ({Math.floor(timerDuration / 60)}m {timerDuration % 60}s)
            </Text>
          </View>
        </View>

        {/* Questions Management Section */}
        <View style={styles.section}>
          <View style={styles.questionsHeader}>
            <Text style={styles.sectionTitle}>📝 Quiz Questions</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddQuestion}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {quizQuestions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No questions yet. Create one!</Text>
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestoreQuestions}
              >
                <Text style={styles.restoreButtonText}>🔄 Restore Default Questions</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={quizQuestions}
              keyExtractor={(item: QuizQuestion) => item.id.toString()}
              renderItem={({ item, index }: { item: QuizQuestion; index: number }) => (
                <View style={styles.questionItem}>
                  <View style={styles.questionItemContent}>
                    <Text style={styles.questionNumber}>{index + 1}.</Text>
                    <View style={styles.questionTextContainer}>
                      <Text style={styles.questionItemText}>{item.question}</Text>
                      <Text style={styles.questionType}>Type: {item.type}</Text>
                    </View>
                  </View>
                  <View style={styles.itemButtonContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditQuestion(item)}
                    >
                      <Text style={styles.editButtonText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteQuestion(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Question Modal */}
      <Modal
        visible={isAddingQuestion || editingQuestion !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formTitle}>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </Text>

              <Text style={styles.label}>Question Text *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter question"
                value={formData.question || ""}
                onChangeText={(text: string) =>
                  setFormData({ ...formData, question: text })
                }
                multiline
              />

              <Text style={styles.label}>Question Type *</Text>
              <View style={styles.typeContainer}>
                {["multiple", "truefalse", "checkbox"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && styles.typeButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, type })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === type && styles.typeButtonSelectedText,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Answer Choices *</Text>
              {formData.choices &&
                Object.entries(formData.choices).map(([key, value]) => (
                  <View key={key} style={styles.choiceInput}>
                    <Text style={styles.choiceLabel}>{key}:</Text>
                    <TextInput
                      style={styles.choiceTextInput}
                      placeholder={`Choice ${key}`}
                      value={value || ""}
                      onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          choices: { ...formData.choices, [key]: text },
                        })
                      }
                    />
                  </View>
                ))}

              <Text style={styles.label}>Correct Answer *</Text>
              <TextInput
                style={styles.input}
                placeholder="A, B, C, or D"
                value={
                  typeof formData.answer === "string"
                    ? formData.answer.toUpperCase()
                    : ""
                }
                onChangeText={(text: string) =>
                  setFormData({ ...formData, answer: text.toUpperCase() })
                }
                maxLength={1}
              />

              <View style={styles.formButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveQuestion}
                >
                  <Text style={styles.saveButtonText}>Save Question</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  timerSettingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  timerInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    width: 80,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  timerDisplay: {
    fontSize: 12,
    color: "#666",
  },
  questionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  restoreButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 16,
  },
  restoreButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  questionItem: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  questionItemContent: {
    flexDirection: "row",
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#2196F3",
  },
  questionTextContainer: {
    flex: 1,
  },
  questionItemText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  questionType: {
    fontSize: 11,
    color: "#999",
    fontStyle: "italic",
  },
  itemButtonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typeButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  typeButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  typeButtonSelectedText: {
    color: "#fff",
  },
  choiceInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  choiceLabel: {
    fontWeight: "bold",
    width: 30,
    fontSize: 14,
    color: "#333",
  },
  choiceTextInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  formButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
