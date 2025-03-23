import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import СardList from '@/components/СardList/СardList';

import { questions } from '../../components/СardList/question';

export default function Index() {
  const [storedValue, setStoredValue] = useState('');
  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('myKey');
      if (value !== null) {
        setStoredValue(value);
      }
    } catch (error) {
      alert('Помилка завантаження: ' + error.message);
    }
  };
  useEffect(() => {
    loadData();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" animated />

      <СardList questions={questions} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    // color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    // color: '#fff',
  },
});
