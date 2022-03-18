import React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import './Cell.css';

const Cell = (props) => {

  let content = "";
  if(props.number == -1){
    content = <div id = {props.id} className ={"emptyCell"}>&#128181;</div>
  }
  else {

   let inner =  props.number == 0? "" : props.number
   content  = <div id = {props.id} className = {props.number == 0?  "emptyCell" : "cell"}>{inner}</div>
  }

  return (
    <View>
        {content}
      </View>
  );
}

export default Cell;