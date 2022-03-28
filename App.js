import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Board from './Components/Board';

export default function App() {
  return ( 
    <View style={styles.container}>
      <Text>Clear this Board and collect money:</Text>
      <Board></Board>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10',
  },
});
