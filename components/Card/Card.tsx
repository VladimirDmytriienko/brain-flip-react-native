import React, { useState, useEffect } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Card = ({ question, onPress, answer }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      const exists = favorites.some((fav) => fav.question === question);
      let updatedFavorites;

      if (exists) {
        updatedFavorites = favorites.filter((fav) => fav.question !== question);
      } else {
        updatedFavorites = [...favorites, { question, answer }];
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!exists);
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        setIsFavorite(favorites.some((fav) => fav.question === question));
      } catch (error) {
        console.error("Error loading favorite status:", error);
      }
    };

    loadFavoriteStatus();
  }, [question]);

  return (
    <Pressable style={styles.card} onPress={() => onPress(answer)}>
      <Text style={styles.text}>{question}</Text>
      <Pressable onPress={toggleFavorite} style={styles.iconContainer}>
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={24}
          color={isFavorite ? "#facc15" : "#9ca3af"}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  iconContainer: {
    padding: 8,
  },
});

export default Card;
