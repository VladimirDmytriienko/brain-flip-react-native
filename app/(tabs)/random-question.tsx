import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { questions } from '@/components/СardList/question';

interface Question {
  id: number;
  question: string;
  answer: string;
}

const RandomQuestion = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isAnswerVisible, setIsAnswerVisible] = useState<boolean>(false);

  const selectRandomQuestion = useCallback(() => {
    if (questions && questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const newQuestion = questions[randomIndex];

      if (questions.length > 1 && newQuestion.id === currentQuestion?.id) {
        selectRandomQuestion();
        return;
      }

      setCurrentQuestion(newQuestion);
      setIsAnswerVisible(false);
    } else {
      setCurrentQuestion(null);
    }
  }, [currentQuestion]);

  useEffect(() => {
    selectRandomQuestion();
  }, []);

  const toggleAnswerVisibility = () => {
    setIsAnswerVisible(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {currentQuestion ? (
        <>
          <Text style={styles.label}>Вопрос:</Text>
          <Text style={styles.text}>{currentQuestion.question}</Text>

          {isAnswerVisible && (
            <>
              <Text style={[styles.label, styles.answerLabel]}>Ответ:</Text>
              <Text style={styles.text}>{currentQuestion.answer}</Text>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={isAnswerVisible ? 'Скрыть ответ' : 'Показать ответ'}
              onPress={toggleAnswerVisibility}
              disabled={!currentQuestion}
              color="#000000"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Следующий вопрос"
              onPress={selectRandomQuestion}
              color="#000000"
            />
          </View>
        </>
      ) : (
        <Text style={styles.text}>Нет доступных вопросов.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,

    marginBottom: 8,
    color: '#000000',
  },
  answerLabel: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#000000',
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '85%',
  }
});

export default RandomQuestion;