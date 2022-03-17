import React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import './Board.css';
import { Dimensions } from 'react-native';




const Board = (props) => {

  //both must be odd
  const rows = 3;
  const columns = 3;

  var matrixBoard = getBoardMatrix(columns, rows);

  let startTouchX = 0
  let startTouchY = 0

  let startCell;
  let endCell;

  function updateBoard() {

    var updateMatrix = new Array(rows);

    for (var i = 0; i < rows; i++) {
      updateMatrix[i] = new Array(columns);
    }


    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        updateMatrix[i][j] = matrix[i][j];
      }
    }


    if (endCell.value != 0) {
      if (startCell.value == endCell.value) {
        updateMatrix[startCell.i][startCell.j].value = 0;
        updateMatrix[endCell.i][endCell.j].value = 0;
      }
      else if (startCell.value != endCell.value) {
        updateMatrix[endCell.i][endCell.j].value = startCell.value + endCell.value;
        updateMatrix[startCell.i][startCell.j].value = 0;
      }
    }
    else {
      updateMatrix[endCell.i][endCell.j].value = startCell.value;
      updateMatrix[startCell.i][startCell.j].value = 0;
    }

    let cellsCount = 0;
    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        if (updateMatrix[i][j].value != 0)
          cellsCount++;
      }
    }

    setCellCount(cellsCount);
    setMatrix(updateMatrix);

  }



  function getCellById(id) {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (id == matrix[i][j].id)
          return matrix[i][j];
      }
    }
  }


  function touchStart(e) {
    startTouchX = e.nativeEvent.touches[0].clientX;
    startTouchY = e.nativeEvent.touches[0].clientY;
    startCell = getCellById(e.target.id);
  }

  function touchEnd(e) {

    const endTouchX = e.nativeEvent.changedTouches[0].clientX;
    const endTouchY = e.nativeEvent.changedTouches[0].clientY;

    const offsetRange = 10;

    if (Math.abs(endTouchX - startTouchX) > offsetRange) {

      if (endTouchX > startTouchX) {

        if (startCell.j == columns - 1)
          return;

        endCell = matrix[startCell.i][startCell.j + 1];
        updateBoard();
        //right

      }
      else if (endTouchX < startTouchX) {
        if (startCell.j == 0)
          return;

        endCell = matrix[startCell.i][startCell.j - 1];
        updateBoard();
        //left
      }
    }
    else if (Math.abs(endTouchY - startTouchY) > offsetRange) {

      if (endTouchY > startTouchY) {
        if (startCell.i == rows - 1)
          return;

        endCell = matrix[startCell.i + 1][startCell.j];
        updateBoard();
        //down
      }
      else if (endTouchY < startTouchY) {
        if (startCell.i == 0)
          return;

        endCell = matrix[startCell.i - 1][startCell.j];
        updateBoard();
        //up
      }

    }

  }


  /*   function touchEnd(e) {
      setMatrix([[9,9,8], [1,9,8],[4,4,2]]);
    } */


  const [matrix, setMatrix] = useState(matrixBoard);
  const [cellCount, setCellCount] = useState(rows * columns - 1);

  let tableBody = matrix.map(row => {
    return <tr>{row.map(obj => { return <td><Cell number={obj.value} id={obj.id} /></td> })} </tr>
  });

  let info = "";

  if (cellCount == 1)
    info = "GAME OVER!"

  if (cellCount == 0)
    info = "GREAT JOB!!! :)"

  return (
    <View
      onTouchStart={e => touchStart(e)}
      onTouchEnd={e => touchEnd(e)}>
      <div className="board">
        <table>
          <tbody>
            {tableBody}
          </tbody>
        </table>
      </div>
      <div> {info} </div>
    </View>
  );
}
export default Board;