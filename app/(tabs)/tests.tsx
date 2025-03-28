import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Quiz, STORAGE_KEY } from '../types/quiz';
import { toastRef } from '../../components/Toast/Toast';

export default function TestsScreen() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const loadQuizzes = async () => {
    try {
      const savedQuizzes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedQuizzes) {
        const parsedQuizzes = JSON.parse(savedQuizzes);
        setQuizzes(parsedQuizzes);
      }
    } catch (error) {
      toastRef.current('Failed to load quizzes');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadQuizzes();
    }, [])
  );

  const handleAddQuestion = () => {
    router.navigate('/(tabs)/add-tests');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    router.navigate({
      pathname: '/(tabs)/add-tests',
      params: { quizId: quiz.id }
    });
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
      toastRef.current('Quiz deleted successfully');
    } catch (error) {
      toastRef.current('Failed to delete quiz');
    }
  };

  const handleQuizPress = (quiz: Quiz) => {
    router.navigate({
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
          {item.questions.length} questions
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