import React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import './Cell.css';

const Cell = (props) => {

  return (

    <View>
        <div id = {props.id} className = {props.number == 0?  "emptyCell" : "cell"}>{props.number == 0? "" : props.number}</div>
      </View>
  );
}

export default Cell;