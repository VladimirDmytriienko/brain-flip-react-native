import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'react-native';


export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" animated />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffd33d',
          // headerStyle: {
          //   backgroundColor: '#25292e',
          // },
          // headerShadowVisible: false,
          // headerTintColor: '#fff',

        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="random-question"
          options={{
            title: 'random-question',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'book-outline' : 'book-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-question"
          options={{
            title: 'add-question',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'add-circle-sharp' : 'add-circle-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'favorites',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'star' : 'star-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-tests"
          options={{
            title: 'add test',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'book-outline' : 'book-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="tests"
          options={{
            title: 'tests',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'book-outline' : 'book-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </>

  );
}
