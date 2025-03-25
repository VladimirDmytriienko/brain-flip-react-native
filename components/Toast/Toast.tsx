import React, { useState, useRef } from "react";
import { Animated, Text, View, StyleSheet, PanResponder } from "react-native";

type ToastItem = { id: number; message: string; fadeAnim: Animated.Value; translateX: Animated.Value };

export const toastRef = { current: (message: string) => { } };

const Toast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  const showToast = (message: string, duration = 3000) => {
    const id = idCounter.current++;
    const fadeAnim = new Animated.Value(0);
    const translateX = new Animated.Value(0);

    const newToast = { id, message, fadeAnim, translateX };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      return updated.slice(-3);
    });

    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => hideToast(id), duration);
  };

  const hideToast = (id: number) => {
    Animated.timing(toasts.find((t) => t.id === id)?.fadeAnim || new Animated.Value(1), {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    });
  };

  toastRef.current = showToast;

  return (
    <View style={styles.container}>
      {toasts.map((toast, index) => {
        const panResponder = PanResponder.create({
          onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
          onPanResponderMove: (_, gestureState) => toast.translateX.setValue(gestureState.dx),
          onPanResponderRelease: (_, gestureState) => {
            if (Math.abs(gestureState.dx) > 80) {
              hideToast(toast.id);
            } else {
              Animated.spring(toast.translateX, { toValue: 0, useNativeDriver: true }).start();
            }
          },
        });

        const isNewest = index === toasts.length - 1;
        const distanceFromNewest = toasts.length - 1 - index;


        const opacity = isNewest ? 1 : 0.6 - (distanceFromNewest * 0.2)
        const scale = isNewest ? 1 : 0.95 - (distanceFromNewest * 0.05)
        const translateY = isNewest ? 0 : -15 * (toasts.length - index - 1)

        return (
          <Animated.View
            key={toast.id}
            style={[
              styles.toast,
              {
                opacity: Animated.multiply(toast.fadeAnim, opacity),
                transform: [
                  { translateX: toast.translateX },
                  { scale },
                  { translateY }
                ],
                zIndex: index + 1,
                backgroundColor: isNewest ? '#000' : '#333',
              },
            ]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
  },
  toast: {
    backgroundColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    position: "absolute",
    minWidth: "80%",
    maxWidth: "90%",
  },
  toastText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Toast;
