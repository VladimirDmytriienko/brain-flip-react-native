import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

const Card = ({ question, onPress, answer }) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress(answer)}>
      <Text style={styles.text}>{question}</Text>
    </Pressable >
  );
};

const styles = StyleSheet.create({
  card: {
    // height: "30%",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Card;
