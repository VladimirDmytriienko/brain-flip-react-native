import { useState } from 'react';
import {
  FlatList, StyleSheet, View,
  Modal,
  Pressable,
  Text
} from 'react-native'
import Card from '../Card/Card';

const СardList = ({ questions }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('')
  const modalHandler = (answer: text) => {
    setModalVisible(prev => !prev)
    setText(answer)
  }
  console.log(questions);

  return (
    <View style={styles.view}>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>

        <View style={styles.viewModal}>
          <Text style={styles.modalText}>{text}</Text>
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>

      </Modal>
      <FlatList
        data={questions}
        renderItem={({ item }) =>
          <Card
            question={item?.question}
            onPress={modalHandler}
            answer={item?.answer}
          />
        }
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ gap: 16 }}
      />

    </View>
  )
}

export default СardList

const styles = StyleSheet.create({
  view: {
    padding: 8
  },
  modalContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  viewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    padding: 24,
  }
});
