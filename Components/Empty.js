import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';


class Empty extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {

  };

  render() {
    return (
      <View style={styles.component}>
        <Text>Empty Board</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    component: {
    backgroundColor: '#ddd',
    alignItems: 'center',
  }
});

export default Empty;
