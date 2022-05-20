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
    
    //const {height, width } = Dimensions.get('window');

    this.state = {
      //height: height, width: width
    };
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
    flex: 1,
    backgroundColor: 'rgb(230, 230, 230)',
    alignItems: 'center',
  }
});

export default App;
