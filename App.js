import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Board from './Components/Board';

export default function App() {
  return ( 
    <View style={styles.container}>
      <Text><p>Collect money by connecting the same tiles.</p><p>If one tile left, the money from its row and column will be taken.</p><p>If you collect money in one row or column you will get great bonuses. Good luck!</p></Text>
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
