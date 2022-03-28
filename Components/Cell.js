import React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import './Cell.css';

const Cell = (props) => {

  let content = "";
    let money;

  if(props.fall)
  {
    money = <div className="cellFall">&#128181;</div>
  } 
  else
  {
    money = <div>&#128181;</div>
  }


  if(props.number == -1){
    content = <div id = {props.id} className ="emptyCell">{money}</div>
  }
  else {
   let inner =  props.number == 0? "" : props.number
   content  = <div id = {props.id} className = {props.number == 0?  "emptyCell" : "cell"}>
     {inner}</div>
  }

  return (
    <View>
        {content}
      </View>
  );
}

export default Cell;