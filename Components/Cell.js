import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';


class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {

  };

  
  render() {

    let content = "";
    if(this.props.cell.value != 0)
    {
      content = this.props.cell.value;
    }
    
    if(this.props.cell.value == -1)
    {
      content = "$$";
    }


    return (
      <View nativeID={this.props.cell.id} style= {styles(this.props).innerCell}>
          <Text nativeID={this.props.cell.id} style= {styles(this.props).innerText}>{content}</Text>
        </View>
    );
  }
}

const styles  = (props) =>  StyleSheet.create({
    
  innerCell: {
      width: '92%',
      height: '92%',
      position: 'absolute',
      backgroundColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5%',

      borderWidth: props.cell.value == 0? 0 : 0.4,
      borderColor: 'white',

      borderTopWidth: props.cell.value == 0? 0 : 0.0,
      borderBottomWidth: props.cell.value == 0? 0 : 1,
  

      shadowColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'grey',
      shadowOffset: {
        width: 0,
        height: 0,
        
      },
      shadowOpacity: 0.7,
      shadowRadius: 0,

      
  },
  innerText: {
    fontSize: 30
}
}); 

export default Cell;
