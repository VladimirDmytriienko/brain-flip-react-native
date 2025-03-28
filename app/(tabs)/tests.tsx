import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEY } from './add-tests';


interface Question {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export default function TestsScreen() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    question: '',
    answers: [''],
    correctAnswer: 0,
  });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const savedQuizzes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
        console.log(JSON.parse(savedQuizzes));

      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const handleAddQuestion = () => {
    router.push('/(tabs)/add-tests');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setCurrentQuestion(quiz.questions[0]);
    setIsModalVisible(true);
  };


  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleQuizPress = (quiz: Quiz) => {
    console.log({ quizId: quiz.id });

    router.push({
      pathname: '/test-completion',
      params: { quizId: quiz.id }
    });
  };

  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => handleQuizPress(item)}
    >
      <View style={styles.quizContent}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.quizInfo}>
          {item.questions.length} questions • Created {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.quizActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditQuiz(item)}
        >
          <Ionicons name="pencil" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteQuiz(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Quizzes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddQuestion}
        >
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {quizzes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#000" />
          <Text style={styles.emptyStateText}>No quizzes yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleAddQuestion}
          >
            <Text style={styles.createButtonText}>Create Your First Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}


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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  list: {
    padding: 16,
  },
  quizItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  quizInfo: {
    fontSize: 14,
    color: '#666',
  },
  quizActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#000',
    marginTop: 12,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});