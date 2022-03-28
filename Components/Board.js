import React from 'react';
import { useState, useEffect } from 'react';
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import './Board.css';
import { StyleSheet, View } from 'react-native';

const Board = (props) => {

  //both must be odd
  const rows = 3;
  const columns = 3;

  var matrixBoard = getBoardMatrix(columns, rows);

  let startTouchX = 0
  let startTouchY = 0

  let startCell;
  let endCell;


  function getColumn(index) {
    var column = new Array(rows);
    for (var i = 0; i < rows; i++) {
      column[i] = matrix[i][index];
    }
    return column;
  }

  const [matrix, setMatrix] = useState(matrixBoard);
  const [cellCount, setCellCount] = useState(rows * columns - 1);
  const [money, setMoney] = useState(0);
  const [lastCell, setLastCell] = useState(matrixBoard[0][0]);


  let tableBody = matrix.map(row => {
    return <tr>{row.map(obj => { return <td><Cell cells={cellCount} number={obj.value} id={obj.id} fall={obj.fall} /></td> })} </tr>
  });

  let info = ""


  /*   function Animation() {
 
      useEffect(() => {
       setTimeout(() => {
         losingMoney()
       }, 1000);
      // return () => clearInterval(interval);
 
     }, []); 
 
     console.log("Rendering money");
    
     return tableBody;
   }  */


  function updateBoard(direct) {

    if (endCell.value == 0) {

      let cells;
      switch (direct) {
        case 'right':
          cells = matrix[endCell.i].slice(endCell.j, columns);
          break;
        case 'left':
          cells = matrix[endCell.i].slice(0, endCell.j).reverse();
          break;
        case 'up':
          cells = getColumn(endCell.j).slice(0, endCell.i).reverse();
          break;
        case 'down':
          cells = getColumn(endCell.j).slice(endCell.i, rows);
          break;
      }

      let cellValue = endCell.value;

      while (cellValue == 0 && cells.length > 0) {
        let nextCell = cells.shift();

        cellValue = nextCell.value;
        if (cellValue >= 0)
          endCell = nextCell;

      }

    }

    if (endCell.value == -1 || startCell.value == -1)
      return;

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
        updateMatrix[endCell.i][endCell.j].value = -1;
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


    ///test
    ///////////////////////////////////////////////////
/*     for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        updateMatrix[i][j].value = -1;
      }
    }

    updateMatrix[0][0].value = 8; */
    ///////////////////////////////////////////////////


    let cellsCount = 0;
    let moneyCount = 0;
    let lastCell;
    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        if (updateMatrix[i][j].value > 0) {
          lastCell = updateMatrix[i][j];
          cellsCount++;
        }
        if (updateMatrix[i][j].value == -1) {
          moneyCount++;
        }
      }
    }

    if (cellsCount == 1) {
      for (var i = 0; i < updateMatrix.length; i++) {
        for (var j = 0; j < updateMatrix[i].length; j++) {
          if (updateMatrix[i][j].value == -1 && (lastCell.i == i || lastCell.j == j)) {
            updateMatrix[i][j].fall = true;
          }
        }
      }
    }

    setLastCell(lastCell);
    setCellCount(cellsCount);
    setMoney(moneyCount);
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

    /*     if(cellCount<2)
          return; */

    const endTouchX = e.nativeEvent.changedTouches[0].clientX;
    const endTouchY = e.nativeEvent.changedTouches[0].clientY;

    const offsetRange = 10;

    if (Math.abs(endTouchX - startTouchX) > offsetRange) {

      if (endTouchX > startTouchX) {

        if (startCell.j == columns - 1)
          return;

        endCell = matrix[startCell.i][startCell.j + 1];
        updateBoard('right');
        //right

      }
      else if (endTouchX < startTouchX) {
        if (startCell.j == 0)
          return;

        endCell = matrix[startCell.i][startCell.j - 1];
        updateBoard('left');
        //left
      }
    }
    else if (Math.abs(endTouchY - startTouchY) > offsetRange) {

      if (endTouchY > startTouchY) {
        if (startCell.i == rows - 1)
          return;

        endCell = matrix[startCell.i + 1][startCell.j];
        updateBoard('down');
        //down
      }
      else if (endTouchY < startTouchY) {
        if (startCell.i == 0)
          return;

        endCell = matrix[startCell.i - 1][startCell.j];
        updateBoard('up');
        //up
      }

    }

  }


  /*  if (cellCount == 1) {
     info = "GAME OVER! Tracisz " + lastCell.value + "banknotów";
     if (lastCell.value >= money)
       info = "GAME OVER! Tracisz wszystkie uzbierane banknoty";
   } */

  /* if (cellCount == 0) {
    info = "Super! Uzbierałeś " + money + " banknotów."
    if (money == 0)
      info = "Nie uzbierałeś żadnych pieniędzy, dostajesz premię za wyczyszczenie całej tablicy."
  } */


  let mainBoard = tableBody;

  let leftContainer;
  let rightContainer;
  let upContainer;
  let downContainer;

  if (cellCount == 1) {

    let containerHeight = 100 / rows + "%";
    let containerWidth = 100 / columns + "%";
    let topHorizontal = (lastCell.i / rows) * 100 + "%";
    let leftVertical = (lastCell.j / columns) * 100 + "%";
    let widthLeft = (lastCell.j / columns) * 100 + "%";
    let widthRight = (((columns - 1) - (lastCell.j)) / columns) * 100 + "%";
    let heightUp = (lastCell.i / rows) * 100 + "%";
    let heightDown = (((rows - 1) - (lastCell.i)) / rows) * 100 + "%";

    const styles = StyleSheet.create({
      leftContainer: {
        position: 'absolute',
        top: topHorizontal,
        left: "0%",
        width: widthLeft,
        height: containerHeight,
        zIndex: "200"
      },
      rightContainer: {
        position: 'absolute',
        top: topHorizontal,
        right: "0%",
        width: widthRight,
        height: containerHeight,
        zIndex: "200"
      },
      upContainer: {
        position: 'absolute',
        top: "0%",
        left: leftVertical,
        width: containerWidth,
        height: heightUp,
        zIndex: "200"
      },
      downContainer: {
        position: 'absolute',
        bottom: "0%",
        left: leftVertical,
        width: containerWidth,
        height: heightDown,
        zIndex: "200"
      },
    });

    if (lastCell.j > 0)
      leftContainer = <View style={styles.leftContainer}><div className='blink blinkLeft'></div></View>

    if (lastCell.j  < columns-1)
      rightContainer = <View style={styles.rightContainer}><div className='blink blinkRight'></div></View>

    if (lastCell.i > 0)
      upContainer = <View style={styles.upContainer}><div className='blink blinkUp'></div></View>

    if (lastCell.i  < rows-1)
      downContainer = <View style={styles.downContainer}><div className='blink blinkDown'></div></View>

  }

  return (
    <View
      onTouchStart={e => touchStart(e)}
      onTouchEnd={e => touchEnd(e)}>
      <div className="field">
        <div className="board">
          {leftContainer}
          {rightContainer}
          {upContainer}
          {downContainer}
          <table>
            <tbody>
              {mainBoard}
            </tbody>
          </table>
        </div>
        <div className="info">{info}</div>
      </div>
    </View>
  );
}
export default Board;