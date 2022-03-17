import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Board from './Components/Board';

export default function App() {
  return ( 
    <View style={styles.container}>
      <Text>Clear this Board:</Text>
      <Board w="3" h="3"></Board>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
