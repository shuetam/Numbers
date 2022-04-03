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
        <View nativeID={this.props.cell.id} style= {[styles(this.props).innerCell,styles(this.props).inner1Cell]}> 
          <Text nativeID={this.props.cell.id} style= {styles(this.props).innerText}>{content}</Text>
         </View> 
        </View>
  
    );
  }
}

const styles  = (props) =>  StyleSheet.create({

  
    
  innerCell: {
      width: '90%',
      height: '85%',
      position: 'absolute',
      backgroundColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'rgb(255, 0, 0)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10%',

      
      shadowColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'rgb(150, 0, 0)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0, 
  },
  inner1Cell: {
    width: '100%',
    height: '98%',
    position: 'absolute',
    shadowColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1, 
},
  innerText: {
    fontSize: 30,
    color: 'white'
}
}); 

export default Cell;
