import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddQuestionScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const saveQuestion = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Помилка', 'Заповніть обидва поля!');
      return;
    }

    try {
      const newQuestion = { id: Date.now().toString(), question, answer };
      const storedData = await AsyncStorage.getItem('questions');
      const questions = storedData ? JSON.parse(storedData) : [];
      const updatedQuestions = [newQuestion, ...questions];

      await AsyncStorage.setItem('questions', JSON.stringify(updatedQuestions));

      setQuestion('');
      setAnswer('');
      Alert.alert('Успіх', 'Питання збережено!');
    } catch (error) {
      console.error('Помилка збереження:', error);
      Alert.alert('Помилка', 'Не вдалося зберегти питання');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Додати питання</Text>

      <TextInput
        style={styles.input}
        placeholder="Введіть питання"
        placeholderTextColor="#555"
        value={question}
        onChangeText={setQuestion}
      />

      <TextInput
        style={styles.input}
        placeholder="Введіть відповідь"
        placeholderTextColor="#555"
        value={answer}
        onChangeText={setAnswer}
        multiline={true}
        numberOfLines={4}
        blurOnSubmit
        editable
        returnKeyType="done"
      />

      <View style={styles.buttonContainer}>
        <Button title="Зберегти" onPress={saveQuestion} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
