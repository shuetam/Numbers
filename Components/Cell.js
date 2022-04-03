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
      width: '90%',
      height: '90%',
      position: 'absolute',
      backgroundColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'rgb(2, 255, 10)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  innerText: {
    fontSize: 30
}
}); 

export default Cell;























const Cell1 = (props) => {

  let content = "";
    let money;

 /*  if(props.fall)
  {
    money = <div className="cellFall">&#128181;</div>
  } 
  else
  {
    money = <div>&#128181;</div>
  } */


 /*  if(props.number == -1){
    content = <div id = {props.id} className ="emptyCell">{money}</div>
  }
  else {
   let inner =  props.number == 0? "" : props.number
   content  = <div id = {props.id} className = {props.number == 0?  "emptyCell" : "cell"}>
     {inner}</div>
  } */

if(props.cell.value != 0)
{
  content = props.cell.value;
}

if(props.cell.value == -1)
{
  content = "$$";
}


  return (
    <View nativeID={props.cell.id} style= {styles(props).innerCell}>
        <Text nativeID={props.cell.id} style= {styles(props).innerText}>{content}</Text>
      </View>
  );
}



const styles1  = (props) =>  StyleSheet.create({
    
    innerCell: {
        width: '90%',
        height: '90%',
        position: 'absolute',
        backgroundColor: props.cell.value == 0? 'rgba(0, 0, 0, 0)' : 'rgb(2, 255, 10)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerText: {
      fontSize: 30
  }
}); 