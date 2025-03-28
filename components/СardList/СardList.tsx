import { useState } from 'react';
import {
  FlatList, StyleSheet, View,
  Modal,
  Pressable,
  Text
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Card from '../Card/Card';

const CardList = ({ questions }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');

  const modalHandler = (answer) => {
    setModalVisible(true);
    setText(answer);
  };

  return (
    <View style={styles.view}>
      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{text}</Text>
          </View>
          <Pressable style={styles.hideButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.textStyle}>Закрити</Text>
          </Pressable>
        </View>
      </Modal>

      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <Card
            question={item?.question}
            onPress={modalHandler}
            answer={item?.answer}
          />
        )}
        keyExtractor={item => item?.id?.toString()}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
};

export default CardList;

const styles = StyleSheet.create({
  view: {
    padding: 8,
    paddingBottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  modalText: {
    padding: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  hideButton: {
    padding: 12,
    backgroundColor: 'black',
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});