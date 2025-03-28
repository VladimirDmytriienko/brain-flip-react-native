import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEY } from './add-tests';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questionText: string;
  answers: Answer[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export default function TestCompletionScreen() {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const savedQuizzes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedQuizzes) {
        const quizzes = JSON.parse(savedQuizzes);
        const foundQuiz = quizzes.find((q: Quiz) => q.id === quizId);
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setUserAnswers(new Array(foundQuiz.questions.length).fill(''));
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswerSelected) return; // Prevent multiple selections

    setIsAnswerSelected(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerId;
    setUserAnswers(newAnswers);

    // Add delay before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswerSelected(false);
      } else {
        calculateScore(newAnswers);
        setShowResults(true);
      }
    }, 1000); // 1 second delay
  };

  const getAnswerStyle = (answerId: string) => {
    if (!isAnswerSelected) return null;

    const isSelected = userAnswers[currentQuestionIndex] === answerId;
    const isCorrect = answerId === quiz?.questions[currentQuestionIndex].correctAnswer;

    if (isSelected) {
      return isCorrect ? styles.correctAnswer : styles.wrongAnswer;
    }

    if (isCorrect) {
      return styles.correctAnswer;
    }

    return null;
  };

  const getAnswerTextStyle = (answerId: string) => {
    if (!isAnswerSelected) return null;

    const isSelected = userAnswers[currentQuestionIndex] === answerId;
    const isCorrect = answerId === quiz?.questions[currentQuestionIndex].correctAnswer;

    if (isSelected || isCorrect) {
      return styles.selectedAnswerText;
    }

    return null;
  };

  const calculateScore = (answers: string[]) => {
    if (!quiz) return;
    const correctAnswers = answers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer
    ).length;
    setScore(correctAnswers);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz?.questions.length || 0).fill(''));
    setShowResults(false);
    setScore(0);
    setIsAnswerSelected(false);
  };

  if (!quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score} out of {quiz.questions.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / quiz.questions.length) * 100)}%
          </Text>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        <View style={styles.answersContainer}>
          {currentQuestion.answers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerButton,
                getAnswerStyle(answer.id),
              ]}
              onPress={() => handleAnswerSelect(answer.id)}
              disabled={isAnswerSelected}
            >
              <Text style={[
                styles.answerText,
                getAnswerTextStyle(answer.id)
              ]}>
                {answer.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressText: {
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  correctAnswer: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  wrongAnswer: {
    borderColor: '#F44336',
    backgroundColor: '#F44336',
  },
  answerText: {
    fontSize: 16,
    color: '#000',
  },
  selectedAnswerText: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
  },
  restartButton: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 