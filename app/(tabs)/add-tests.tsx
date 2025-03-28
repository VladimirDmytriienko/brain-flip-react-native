import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionModal from '../../components/QuestionModal/QuestionModal';
import { Ionicons } from '@expo/vector-icons';
import { Quiz, Question, STORAGE_KEY } from '../types/quiz';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { toastRef } from '../../components/Toast/Toast';

const quizSchema = Yup.object().shape({
  title: Yup.string()
    .required('Quiz title is required')
    .min(1, 'Quiz title cannot be empty')
    .max(50, 'Quiz title must be less than 50 characters')
});

const initialQuestion: Question = {
  id: Date.now().toString(),
  questionText: '',
  answers: [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false }
  ],
  correctAnswer: ''
};

const AddTest: React.FC = () => {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialTitle, setInitialTitle] = useState('');

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId as string);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    try {
      const savedQuizzes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedQuizzes) {
        const quizzes: Quiz[] = JSON.parse(savedQuizzes);
        const foundQuiz = quizzes.find(q => q.id === id);
        if (foundQuiz) {
          setQuestions(foundQuiz.questions);
          setInitialTitle(foundQuiz.title);
          setIsEditing(true);
        }
      }
    } catch (error) {
      toastRef.current('Failed to load quiz');
      router.back();
    }
  };

  const handleAddQuestion = (question: Question) => {
    // Validate question before adding
    if (!question.questionText.trim()) {
      toastRef.current('Question text cannot be empty');
      return;
    }

    if (question.answers.some(answer => !answer.text.trim())) {
      toastRef.current('All answers must be filled');
      return;
    }

    if (!question.answers.some(answer => answer.isCorrect)) {
      toastRef.current('Please mark one answer as correct');
      return;
    }

    if (editingQuestionId) {
      setQuestions(questions.map(q =>
        q.id === editingQuestionId ? question : q
      ));
      setEditingQuestionId(null);
    } else {
      setQuestions([...questions, question]);
      setCurrentQuestion({
        ...initialQuestion,
        id: Date.now().toString()
      });
    }
    setIsModalVisible(false);
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setEditingQuestionId(question.id);
    setIsModalVisible(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
    if (editingQuestionId === questionId) {
      setEditingQuestionId(null);
      setCurrentQuestion({
        ...initialQuestion,
        id: Date.now().toString()
      });
    }
  };

  const handleSaveQuiz = async (values: { title: string }) => {
    try {
      if (!values.title.trim()) {
        toastRef.current('Please enter a quiz title');
        return;
      }

      if (questions.length === 0) {
        toastRef.current('Please add at least one question');
        return;
      }

      for (const question of questions) {
        if (!question.questionText.trim()) {
          toastRef.current('All questions must have text');
          return;
        }
        if (question.answers.some(answer => !answer.text.trim())) {
          toastRef.current('All answers must be filled');
          return;
        }
        if (!question.answers.some(answer => answer.isCorrect)) {
          toastRef.current('Each question must have one correct answer');
          return;
        }
      }

      const existingQuizzesJson = await AsyncStorage.getItem(STORAGE_KEY);
      const existingQuizzes: Quiz[] = existingQuizzesJson ? JSON.parse(existingQuizzesJson) : [];

      const newQuiz: Quiz = {
        id: isEditing ? quizId as string : Date.now().toString(),
        title: values.title.trim(),
        questions: questions
      };

      let updatedQuizzes: Quiz[];
      if (isEditing) {
        updatedQuizzes = existingQuizzes.map(q => q.id === quizId ? newQuiz : q);
      } else {
        updatedQuizzes = [...existingQuizzes, newQuiz];
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuizzes));

      toastRef.current(isEditing ? 'Quiz updated successfully!' : 'Quiz saved successfully!');
      router.back();
    } catch (error) {
      toastRef.current('Failed to save quiz');
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ title: initialTitle }}
        validationSchema={quizSchema}
        onSubmit={handleSaveQuiz}
        enableReinitialize
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <TextInput
              style={[
                styles.titleInput,
                touched.title && errors.title && styles.inputError
              ]}
              placeholder="Enter quiz title"
              value={values.title}
              onChangeText={handleChange('title')}
            />
            {touched.title && errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}

            <ScrollView style={styles.questionsList}>
              {questions.map((question, index) => (
                <View key={question.id} style={styles.questionItem}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionText}>
                      Question {index + 1}: {question.questionText}
                    </Text>
                    <View style={styles.questionActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditQuestion(question)}
                      >
                        <Ionicons name="pencil" size={20} color="#000000" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteQuestion(question.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.answerCount}>
                    {question.answers.length} answers
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setCurrentQuestion({
                  ...initialQuestion,
                  id: Date.now().toString()
                });
                setEditingQuestionId(null);
                setIsModalVisible(true);
              }}
            >
              <Text style={styles.addButtonText}>+ Add Question</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!values.title.trim() || questions.length === 0) && styles.disabledButton
              ]}
              onPress={() => handleSubmit()}
              disabled={!values.title.trim() || questions.length === 0}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Quiz' : 'Save Quiz'}
              </Text>
            </TouchableOpacity>

            <QuestionModal
              isVisible={isModalVisible}
              onClose={() => {
                setIsModalVisible(false);
                setEditingQuestionId(null);
              }}
              onSubmit={handleAddQuestion}
              initialValues={currentQuestion}
              isEditing={!!editingQuestionId}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  formContainer: {
    flex: 1,
    padding: 20
  },
  titleInput: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    fontSize: 16,
    color: '#000000'
  },
  questionsList: {
    flex: 1,
    marginBottom: 20
  },
  questionItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    marginBottom: 10
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 5
  },
  answerCount: {
    fontSize: 14,
    color: '#666666'
  },
  addButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000'
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  inputError: {
    borderColor: '#FF3B30'
  },
  disabledButton: {
    opacity: 0.5
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5
  },
  questionActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    padding: 8,
    marginLeft: 8
  }
});

export default AddTest;