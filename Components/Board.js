import React, { Component, useEffect } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import { connect } from 'react-redux';
import { moveCell } from '../Store/Actions';
import { getCellColor } from '../Common/ColorGenerator';


const prop = {
  columns: 5,
  rows: 7,
  cellWidth: 60,
  cellHeight: 60,
}

class Board extends Component {


  constructor(props) {
    super(props);


    var matrixBoard = getBoardMatrix(prop.columns, prop.rows);
    this.setPosition(matrixBoard);

    this.state = {
      matrix: matrixBoard,
      cellCount: prop.columns * prop.rows - 1,
      money: 0,
      restart: true,
      colors: []
    };
  }



  setPosition = (matrixBoard) => {
    for (var i = 0; i < matrixBoard.length; i++) {
      for (var j = 0; j < matrixBoard[i].length; j++) {

        matrixBoard[i][j].left = this.getLeft(j);
        matrixBoard[i][j].top = this.getTop(i);
        matrixBoard[i][j].moveHoriz = false;
        matrixBoard[i][j].moveVert = false;
        matrixBoard[i][j].colors = getCellColor(matrixBoard[i][j].value,0,0);

      }
    }
  }

  getLeft = (j) => {
    return prop.cellWidth * j;
  }

  getTop = (i) => {
    return prop.cellHeight * i;
  }


  getColumn = (index) => {
    var column = new Array(prop.rows);
    for (var i = 0; i < prop.rows; i++) {
      column[i] = this.state.matrix[i][index];
    }
    return column;
  }


  onMove = (startCell, direct, gestureState, speed) => {

    if (this.state.cellCount < 2 || !startCell || startCell ==  undefined)
      return;

    let endCell = null;

    switch (direct) {
      case 'SWIPE_RIGHT':
        endCell = this.state.matrix[startCell.i][startCell.j + 1];
        //speed = speedFactor / Math.abs(gestureState.dx);
        break;
      case 'SWIPE_LEFT':
        endCell = this.state.matrix[startCell.i][startCell.j - 1];
        //speed = speedFactor / Math.abs(gestureState.dx);
        break;
      case 'SWIPE_UP':
        endCell = this.state.matrix[startCell.i - 1][startCell.j];
        //speed = speedFactor / Math.abs(gestureState.dy);
        break;
      case 'SWIPE_DOWN':
        endCell = this.state.matrix[startCell.i + 1][startCell.j];
        //speed = speedFactor / Math.abs(gestureState.dy);
        break;
    }


    this.updateBoard(direct, startCell, endCell, gestureState, speed);

  }

  getTrack = (cell, direct) => {

    var cells = this.getCellsForDirection(cell, direct);

    if (cells.length == 0 || cell.value == -1)
      return -1;

    var cellValue = 0;
    var track = 0;

    while (cellValue == 0 && cells.length > 0) {
      let nextCell = cells.shift();
      cellValue = nextCell.value;
      if (cellValue >= 0)
        ++track;
    }

    return track;
  }


  getCellsForDirection = (cell, direct) => {
    var matrix = this.state.matrix;
    var cells;
    switch (direct) {
      case 'SWIPE_RIGHT':
        cells = matrix[cell.i].slice(cell.j + 1, prop.columns);
        break;
      case 'SWIPE_LEFT':
        cells = matrix[cell.i].slice(0, cell.j).reverse();
        break;
      case 'SWIPE_UP':
        cells = this.getColumn(cell.j).slice(0, cell.i).reverse();
        break;
      case 'SWIPE_DOWN':
        cells = this.getColumn(cell.j).slice(cell.i + 1, prop.rows);
        break;
    }

    return cells;

  }


  unfreezeCell = (cell) => {
    cell.value = cell.frozenValue;
    cell.canBeUnfrozen = false;
    this.setState({restart: !this.state.restart});
  }


  updateBoard = (direct, startCell, endCell, gestureState, speed) => {

    if (!endCell || endCell == null)
      return;

    var cells;
    let startValue;
    if (endCell.value == 0) {
      cells = this.getCellsForDirection(endCell, direct);
    }

    let cellValue = endCell.value;

    while (cellValue == 0 && cells.length > 0) {
      let nextCell = cells.shift();

      cellValue = nextCell.value;
      if (cellValue >= 0)
        endCell = nextCell;
    }


    if (startCell.value == -1 || endCell.value == -1)
      return;


    let endValue;

    if (direct == 'SWIPE_RIGHT' || direct == 'SWIPE_LEFT') {
      startCell.animatedHorizontal = true;
      startValue = startCell.left + gestureState.dx;
      endValue = endCell.left;
    }

    if (direct == 'SWIPE_DOWN' || direct == 'SWIPE_UP') {
      startCell.animatedVertical = true;
      startValue = startCell.top + gestureState.dy;
      endValue = endCell.top;
    }

    var animatedMove = new Animated.Value(startValue);
    let track = Math.abs(endValue - startValue);
    let duration = speed == 0 ? 1000 : track / speed;

    Animated.timing(animatedMove, {
      toValue: endValue,
      useNativeDriver: false,
      easing: Easing.out(Easing.exp),
      duration: duration,
    })
      .start(() => {
        this.updateValues(startCell, endCell);
      });

    this.setState({
      startCell: startCell,
      endCell: endCell,
      restart: !this.state.restart,
      startValue: startValue,
      endValue: endValue,
      animatedMove: animatedMove,
      colors1: startCell.colors,
      colors2: endCell.colors,
    });

  }


  updateValues = () => {

    var startCell = this.state.startCell;
    var endCell = this.state.endCell;
    var valueUpdated = false;

    var updateMatrix = this.state.matrix;

    if (endCell.value != 0) {
      if (startCell.value == endCell.value) {

        updateMatrix[endCell.i][endCell.j].frozenValue = endCell.value;
        updateMatrix[startCell.i][startCell.j].value = 0;
        updateMatrix[endCell.i][endCell.j].value = -1;
      }
      else if (startCell.value != endCell.value && startCell.value != 0) {
        updateMatrix[endCell.i][endCell.j].value = startCell.value + endCell.value;
        updateMatrix[startCell.i][startCell.j].value = 0;
        valueUpdated = true;
      }
    }
    else {
      updateMatrix[endCell.i][endCell.j].value = startCell.value;
      updateMatrix[startCell.i][startCell.j].value = 0;
    }

    // if(updateMatrix[startCell.i][startCell.j].value == 0)
    //   updateMatrix[startCell.i][startCell.j].colors = getCellColor(0, this.state.colors1, this.state.colors2);

    // var newCell = updateMatrix[endCell.i][endCell.j];
    // var newValue = newCell.value < 0? newCell.frozenValue : newCell.value;
   

    ///test
    ///////////////////////////////////////////////////
    /*     for (var i = 0; i < matrix.length; i++) {
          for (var j = 0; j < matrix[i].length; j++) {
            updateMatrix[i][j].value = -1;
          }
        }
    
        updateMatrix[0][0].value = 8; */
    ///////////////////////////////////////////////////


////need to update colors at any time!!!!!

    let cellsCount = 0;
    let moneyCount = 0;
    let lastCell;
    var colorSeted = false;
    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        updateMatrix[i][j].animatedHorizontal = false;
        updateMatrix[i][j].animatedVertical = false;

        var cellValue = updateMatrix[i][j].value < 0? updateMatrix[i][j].frozenValue : updateMatrix[i][j].value;
        //var cellValue =  updateMatrix[i][j].value;

        const existsColor = this.state.colors.find(x => x.value == cellValue);

        const colorsState = this.state.colors;

        if(existsColor)
        {
          updateMatrix[i][j].colors = existsColor.colors;
        }
        else {
          const colors =  getCellColor(cellValue, this.state.colors1, this.state.colors2);
          updateMatrix[i][j].colors = colors;

          if(colors.newColor)
          {
            this.setState(prevState => ({
              colors: [...prevState.colors, {value: cellValue, colors: colors }]
            }))
          }
        }



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

    // if(!colorSeted && endCell.value != 0 && valueUpdated) {
    //   newCell.colors = getCellColor(newValue, this.state.colors1, this.state.colors2);
    // }


    //this.setPosition(updateMatrix);
    /*     this.setState({ lastCell: lastCell });
    this.setState({ cellCount: cellsCount });
    this.setState({ money: moneyCount }); */
    this.setState({ matrix: updateMatrix, restart: !this.state.restart });
    //  this.setState({ restart: !this.state.restart });
    //return updateMatrix;
  }


  render() {

    let data = [];

    for (var i = 0; i < this.state.matrix.length; i++) {
      for (var j = 0; j < this.state.matrix[i].length; j++) {
        let item = this.state.matrix[i][j];
        item.leftTrack = this.getTrack(item, 'SWIPE_LEFT');
        item.rightTrack = this.getTrack(item, 'SWIPE_RIGHT');
        item.upTrack = this.getTrack(item, 'SWIPE_UP');
        item.downTrack = this.getTrack(item, 'SWIPE_DOWN');
        data.push(item);
      }
    }

    for (var i = 0; i < data.length; i++) {
      var cell = data[i];
      if(cell.value == -1)
      {

        var existsCell = data.find(x => (x.i != cell.i || x.j != cell.j) && x.value == cell.frozenValue);
        data[i].canBeUnfrozen = !existsCell;
      /*   if(!existsCell)
        {
          data[i].canBeUnfrozen = true;
        } */
      }

    }

    let tableBody = data.map(item => {

      let cell = <Cell
        key={item.id}
        restartView={this.state.restart} cell={item}
        onMove={this.onMove}
        onAnimationEnd={this.updateValues}
        prop={prop}
        animatedMove={this.state.animatedMove}
        unfreezeCell = {this.unfreezeCell}
      >

      </Cell>;

      /*  let animatedCell = <Animated.View key={item.id} style={[styles(prop).cell,
       {
         left: item.animatedHorizontal == true ? this.state.animatedMove : item.left,
         top: item.animatedVertical == true ? this.state.animatedMove : item.top
       }
       ]}>
         {cell}
       </Animated.View> */

      /*         :
              <View key={item.id} style={[styles(prop).cell,
              {
                left: item.left,
                top: item.top
              }]}>
                {cell}
              </View>; */

      /*  return <GestureRecognizer key={item.id} nativeID={item.id}
       onSwipe={(direction, state) => this.onSwipe(direction, state, item)}>
       {cellBox}
     </GestureRecognizer>  */


      /* return <View key={item.id} nativeID={item.id}>
        {cellBox}
      </View> */
      return cell;

    });


    return (
      <View style={styles(prop).board}>
        {tableBody}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    movedCell: state.reducer.movedCell,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    moveCell: (cell) => dispatch(moveCell(cell))
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(Board);


const styles = (prop) => StyleSheet.create({

  board: {
    backgroundColor: "rgba(146, 146, 146, 0.5)",
    flex: 1,
    position: 'absolute',
    width: prop.columns * prop.cellWidth,
    height: prop.rows * prop.cellHeight
  },
  cell: {
    width: prop.cellWidth,
    height: prop.cellHeight,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
