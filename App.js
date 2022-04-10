import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';
import Board from './Components/Board';
import { createStore, applyMiddleware, combineReducers, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import reducer from './Store/index';
const store = createStore(reducer); 

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
        <Provider store={store}><Board></Board></Provider>
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
