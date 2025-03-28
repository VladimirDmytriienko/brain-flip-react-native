import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Quiz, Question, Answer } from '../types/quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { nanoid } from 'nanoid/non-secure';



interface QuestionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  currentQuestion: Question | null;
  onQuestionChange: (text: string) => void;
  onAnswerChange: (text: string, answerId: string) => void;
  onCorrectAnswerSelect: (answerId: string) => void;
  onAddVariant: () => void;
  onDeleteVariant: (answerId: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isVisible,
  onClose,
  onSave,
  currentQuestion,
  onQuestionChange,
  onAnswerChange,
  onCorrectAnswerSelect,
  onAddVariant,
  onDeleteVariant
}) => (
  <Modal
    animationType="slide"
    presentationStyle="formSheet"
    visible={isVisible}
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add New Question</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalContent}>
        <TextInput
          style={styles.questionInput}
          placeholder="Enter question"
          value={currentQuestion?.questionText || ''}
          onChangeText={onQuestionChange}
        />

        {currentQuestion?.answers.map((answer) => (
          <View key={`${currentQuestion.id}_${answer.id}`} style={styles.answerContainer}>
            <Text style={styles.answerLabel}>{answer.id}</Text>
            <TextInput
              style={styles.answerInput}
              placeholder={`Option ${answer.id}`}
              value={answer.text}
              onChangeText={(text) => onAnswerChange(text, answer.id)}
            />
            <TouchableOpacity
              style={[styles.correctButton, answer.isCorrect && styles.correctButtonActive]}
              onPress={() => onCorrectAnswerSelect(answer.id)}
            >
              <Text style={[styles.correctButtonText, answer.isCorrect && styles.correctButtonTextActive]}>✓</Text>
            </TouchableOpacity>
            {currentQuestion.answers.length > 2 && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteVariant(answer.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addVariantButton}
          onPress={onAddVariant}
        >
          <Text style={styles.addVariantButtonText}>+ Add Variant</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={styles.modalSaveButton}
          onPress={onSave}
        >
          <Text style={styles.modalSaveButtonText}>Save Question</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </Modal>
);

export const STORAGE_KEY = 'brain_flip_quizzes';

const AddTest = () => {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const createNewQuestion = (): Question => ({
    id: nanoid(),
    questionText: '',
    answers: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
    ],
    correctAnswer: null
  });

  const handleAddQuestion = () => {
    setCurrentQuestion(createNewQuestion());
    setIsModalVisible(true);
  };

  const handleAddAnswerVariant = () => {
    if (currentQuestion) {
      const nextId = String(currentQuestion.answers.length + 1);
      const newAnswer: Answer = {
        id: nextId,
        text: '',
        isCorrect: false
      };
      setCurrentQuestion({
        ...currentQuestion,
        answers: [...currentQuestion.answers, newAnswer]
      });
    }
  };

  const handleQuestionChange = (text: string) => {
    if (currentQuestion) {
      setCurrentQuestion({ ...currentQuestion, questionText: text });
    }
  };

  const handleAnswerChange = (text: string, answerId: string) => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        answers: currentQuestion.answers.map(a =>
          a.id === answerId ? { ...a, text } : a
        )
      });
    }
  };

  const handleCorrectAnswerSelect = (answerId: string) => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        answers: currentQuestion.answers.map(a => ({
          ...a,
          isCorrect: a.id === answerId
        })),
        correctAnswer: answerId
      });
    }
  };

  const handleDeleteVariant = (answerId: string) => {
    if (currentQuestion) {
      const updatedAnswers = currentQuestion.answers
        .filter(a => a.id !== answerId)
        .map((answer, index) => ({
          ...answer,
          id: String(index + 1)
        }));

      setCurrentQuestion({
        ...currentQuestion,
        answers: updatedAnswers,
        correctAnswer: currentQuestion.correctAnswer === answerId ? null : currentQuestion.correctAnswer
      });
    }
  };

  const handleSaveQuestion = () => {
    if (currentQuestion) {
      setQuestions([...questions, currentQuestion]);
      setIsModalVisible(false);
      setCurrentQuestion(null);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      const quiz: Quiz = {
        id: nanoid(),
        title: quizTitle,
        questions: questions,
        createdAt: new Date().toISOString()
      };
      console.log(quiz);

      // Get existing quizzes
      const existingQuizzesJson = await AsyncStorage.getItem(STORAGE_KEY);
      const existingQuizzes = existingQuizzesJson ? JSON.parse(existingQuizzesJson) : [];

      // Add new quiz to the list
      const updatedQuizzes = [...existingQuizzes, quiz];
      console.log(updatedQuizzes);

      // Save updated quizzes list
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuizzes));

      // Navigate to home or quiz list

    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.titleInput}
          placeholder="Quiz Title"
          value={quizTitle}
          onChangeText={setQuizTitle}
        />

        <TouchableOpacity style={styles.addQuestionButton} onPress={handleAddQuestion}>
          <Text style={styles.addQuestionButtonText}>+ Add Question</Text>
        </TouchableOpacity>

        <ScrollView style={styles.questionsList}>
          {questions.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{question.questionText}</Text>
              {question.answers.map((answer) => (
                <View key={`${question.id}_${answer.id}`} style={styles.answerPreview}>
                  <Text style={styles.answerLabel}>{answer.id}</Text>
                  <Text style={styles.answerText}>{answer.text}</Text>
                  {answer.isCorrect && <Text style={styles.correctIndicator}>✓</Text>}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        {questions.length > 0 && (
          <TouchableOpacity style={styles.saveQuizButton} onPress={handleSaveQuiz}>
            <Text style={styles.saveQuizButtonText}>Save Quiz</Text>
          </TouchableOpacity>
        )}

        <QuestionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveQuestion}
          currentQuestion={currentQuestion}
          onQuestionChange={handleQuestionChange}
          onAnswerChange={handleAnswerChange}
          onCorrectAnswerSelect={handleCorrectAnswerSelect}
          onAddVariant={handleAddAnswerVariant}
          onDeleteVariant={handleDeleteVariant}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  titleInput: {
    fontSize: 24,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000'
  },
  addQuestionButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  addQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  questionsList: {
    flex: 1
  },
  questionCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000'
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000'
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000000'
  },
  answerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#000000'
  },
  answerLabel: {
    width: 30,
    fontWeight: 'bold',
    color: '#000000'
  },
  answerText: {
    flex: 1,
    color: '#000000'
  },
  correctIndicator: {
    color: '#000000',
    marginLeft: 10
  },
  saveQuizButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  saveQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000'
  },
  closeButton: {
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold'
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#000000'
  },
  modalSaveButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000'
  },
  modalSaveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  questionInput: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    fontSize: 16,
    color: '#000000'
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8
  },
  answerInput: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    color: '#000000'
  },
  correctButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  correctButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000'
  },
  correctButtonText: {
    fontSize: 20,
    color: '#000000'
  },
  correctButtonTextActive: {
    color: '#FFFFFF'
  },
  addVariantButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10
  },
  addVariantButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  deleteButtonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24
  }
});

export default AddTest;