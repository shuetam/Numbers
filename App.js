import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';
import Board from './Components/Board';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {


  };

  render() {
    return (
      <View style={styles.container}>
        <Board></Board>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 100,
    backgroundColor: '#ddd',
    alignItems: 'center',
    position: 'relative'
  }
});

export default App;
