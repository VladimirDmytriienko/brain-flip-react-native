import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

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

interface QuestionFormProps {
  onSubmit: (values: Question) => void;
  initialValues: Question;
  onClose: () => void;
  isEditing: boolean;
}

interface AnswerError {
  text?: string;
}

const answerSchema = Yup.object().shape({
  id: Yup.string(),
  text: Yup.string().required('Answer text is required').min(1, 'Answer cannot be empty'),
  isCorrect: Yup.boolean()
});

const questionSchema = Yup.object().shape({
  questionText: Yup.string().required('Question is required').min(1, 'Question cannot be empty'),
  answers: Yup.array().of(answerSchema)
    .min(2, 'At least 2 answers are required')
    .max(6, 'Maximum 6 answers allowed')
    .test('has-correct-answer', 'Please select a correct answer', (answers) => {
      return answers?.some(answer => answer.isCorrect);
    }),
  correctAnswer: Yup.string().required('Please select a correct answer')
});

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, initialValues, onClose, isEditing }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={questionSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit, errors, touched }: FormikProps<Question>) => (
        <View style={styles.formContainer}>
          <TextInput
            style={[
              styles.questionInput,
              touched.questionText && errors.questionText && styles.inputError
            ]}
            placeholder="Enter question"
            value={values.questionText}
            onChangeText={(text: string) => setFieldValue('questionText', text)}
          />
          {touched.questionText && errors.questionText && (
            <Text style={styles.errorText}>{errors.questionText}</Text>
          )}

          {values.answers.map((answer, index) => (
            <View key={answer.id} style={styles.answerContainer}>
              <TextInput
                style={[
                  styles.answerInput,
                  touched.answers?.[index]?.text &&
                  (errors.answers as AnswerError[])?.[index]?.text &&
                  styles.inputError
                ]}
                placeholder={`Option ${index + 1}`}
                value={answer.text}
                onChangeText={(text: string) => {
                  const newAnswers = [...values.answers];
                  newAnswers[index] = { ...answer, text };
                  setFieldValue('answers', newAnswers);
                }}
              />
              {touched.answers?.[index]?.text &&
                (errors.answers as AnswerError[])?.[index]?.text && (
                  <Text style={styles.errorText}>
                    {(errors.answers as AnswerError[])[index].text}
                  </Text>
                )}
              <TouchableOpacity
                style={[
                  styles.correctButton,
                  answer.isCorrect && styles.correctButtonActive
                ]}
                onPress={() => {
                  const newAnswers = values.answers.map(a => ({
                    ...a,
                    isCorrect: a.id === answer.id
                  }));
                  setFieldValue('answers', newAnswers);
                  setFieldValue('correctAnswer', answer.id);
                }}
              >
                <Text style={[
                  styles.correctButtonText,
                  answer.isCorrect && styles.correctButtonTextActive
                ]}>✓</Text>
              </TouchableOpacity>
              {values.answers.length > 2 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    const newAnswers = values.answers.filter(a => a.id !== answer.id);
                    setFieldValue('answers', newAnswers);
                    if (values.correctAnswer === answer.id) {
                      setFieldValue('correctAnswer', '');
                    }
                  }}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {touched.answers && errors.answers &&
            typeof errors.answers === 'string' && (
              <Text style={styles.errorText}>{errors.answers}</Text>
            )}

          <TouchableOpacity
            style={styles.addVariantButton}
            onPress={() => {
              if (values.answers.length < 6) {
                const newAnswer = {
                  id: String(values.answers.length + 1),
                  text: '',
                  isCorrect: false
                };
                setFieldValue('answers', [...values.answers, newAnswer]);
              }
            }}
            disabled={values.answers.length >= 6}
          >
            <Text style={[
              styles.addVariantButtonText,
              values.answers.length >= 6 && styles.disabledButton
            ]}>+ Add Variant</Text>
          </TouchableOpacity>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.modalSaveButtonText}>
                {isEditing ? 'Update Question' : 'Save Question'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

interface QuestionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (question: Question) => void;
  initialValues: Question;
  isEditing: boolean;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialValues,
  isEditing
}) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <QuestionForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          onClose={onClose}
          isEditing={isEditing}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000'
  },
  closeButton: {
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  formContainer: {
    flex: 1,
    padding: 20
  },
  questionInput: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    fontSize: 16,
    color: '#000000'
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8
  },
  answerInput: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    color: '#000000'
  },
  correctButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  correctButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000'
  },
  correctButtonText: {
    fontSize: 20,
    color: '#000000'
  },
  correctButtonTextActive: {
    color: '#FFFFFF'
  },
  addVariantButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10
  },
  addVariantButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  deleteButtonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#000000'
  },
  modalSaveButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000'
  },
  modalSaveButtonText: {
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
  }
});

export default QuestionModal; 