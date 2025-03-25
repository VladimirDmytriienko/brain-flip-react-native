import React, { useState, useEffect } from 'react';
import Card from '@/components/Card/Card';
import CardList from '@/components/СardList/СardList'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { toastRef } from '@/components/Toast/Toast';


export default function AboutScreen() {
  const [inputValue, setInputValue] = useState('');
  const [storedValue, setStoredValue] = useState('');
  const [question, setQuestion] = useState([]);


  const saveData = async () => {
    try {
      await AsyncStorage.setItem('myKey', inputValue);
      alert('Дані збережено!');
    } catch (error) {
      alert('Помилка збереження: ' + error.message);
    }
  };


  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('myKey');
      const questions = await AsyncStorage.getItem('questions');

      if (value !== null) {
        setStoredValue(value);
      }
      if (questions !== null) {
        setQuestion(JSON.parse(questions) || []);
      }

    } catch (error) {
      alert('Помилка завантаження: ' + error.message);
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('myKey');
      alert('Дані видалено!');
      setStoredValue('');
    } catch (error) {
      alert('Помилка видалення: ' + error.message);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      alert('Сховище очищено!');
      setStoredValue('');
    } catch (error) {
      alert('Помилка очищення: ' + error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Введіть текст"
          value={inputValue}
          onChangeText={setInputValue}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        <Button title="Зберегти" onPress={saveData} />
        <Button title="Завантажити" onPress={loadData} />
        <Button title="Видалити" onPress={removeData} />
        <Button title="Очистити все" onPress={clearAllData} />

        <Text style={{ marginTop: 20 }}>
          Збережене значення: {storedValue || 'немає'}
        </Text>
      </View> */}
      {/* <Text style={{ marginTop: 20 }}>
        question : {question.length > 0 ? question[0].question : 'немає'}
        {question.length}
      </Text> */}
      <CardList questions={question} />
      <Button title="Показати Toast" onPress={() => toastRef.current("🔔 Сповіщення!")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',

    // flex: 1,
    // backgroundColor: '#25292e',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    // color: '#fff',
  },
});
