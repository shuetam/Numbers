import React, { Component, useEffect } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { createStore } from 'redux';
import reducer from '../Store/index';
const store = createStore(reducer);
import { Provider, connect } from 'react-redux';
import { moveCell } from '../Store/Actions';


const  prop = {
  columns: 5,
  rows: 5,
  cellWidth: 60,
  cellHeight: 60,
}

class Board extends Component {


  constructor(props) {
    super(props);


 /*    var matrixBoard = getBoardMatrix(this.state.prop.columns, this.state.prop.rows);
    this.setPosition(matrixBoard);
    this.setState({ matrix: matrixBoard });
    this.setState({ cellCount: this.state.prop.columns * this.state.prop.rows - 1 }); */



    this.state = {
      prop: {
        columns: 5,
        rows: 5,
        cellWidth: 60,
        cellHeight: 60,
      },
      matrix: null,
      cellCount: 0,
      money: 0,
    };
  }


  /* componentWillMount = () => {
     var matrixBoard = getBoardMatrix(this.state.prop.columns, this.state.prop.rows);
    this.setPosition(matrixBoard);
    this.setState({ matrix: matrixBoard });
    this.setState({ cellCount: this.state.prop.columns * this.state.prop.rows - 1 }); 
  }; */





    static getDerivedStateFromProps(nextProps) {
      var matrixBoard = getBoardMatrix(prop.columns, prop.rows);
      this.setPosition(matrixBoard);
      this.setState({ matrix: matrixBoard });
      this.setState({ cellCount: prop.columns * prop.rows - 1 }); 
      return null;
  } 

  static setPosition = (matrixBoard) => {
    for (var i = 0; i < matrixBoard.length; i++) {
      for (var j = 0; j < matrixBoard[i].length; j++) {

        matrixBoard[i][j].left = this.getLeft(j);
        matrixBoard[i][j].top = this.getTop(i);
        matrixBoard[i][j].moveHoriz = false;
        matrixBoard[i][j].moveVert = false;

      }
    }
  }

  getLeft = (j) => {
    return this.state.prop.cellWidth * j;
  }

  getTop = (i) => {
    return this.state.prop.cellHeight * i;
  }


  getColumn = (index) => {
    var column = new Array(this.state.prop.rows);
    for (var i = 0; i < this.state.prop.rows; i++) {
      column[i] = this.state.matrix[i][index];
    }
    return column;
  }

  onSwipeCell(movedCell) {
    if (movedCell)
      this.onSwipe(movedCell.cell, movedCell.direct, movedCell.gestureState)
  }



  onSwipe = (startCell, direct, gestureState) => {

    if (this.state.cellCount < 2 || !startCell)
      return;


    let speedFactor = 0.8; // increase to get faster cells

    let horizontalSpeed = speedFactor / Math.abs(gestureState.dx);
    let verticalSpeed = speedFactor / Math.abs(gestureState.dy);

    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {

      if (gestureState.dx > 0) {

        if (startCell.j == this.state.prop.columns - 1)
          return;

        endCell = this.state.matrix[startCell.i][startCell.j + 1];
        this.updateBoard(direct, startCell, endCell, horizontalSpeed);

      }
      else if (gestureState.dx < 0) {
        if (startCell.j == 0)
          return;

        endCell = this.state.matrix[startCell.i][startCell.j - 1];
        this.updateBoard(direct, startCell, endCell, horizontalSpeed);
      }
    }
    else if (Math.abs(gestureState.dx) < Math.abs(gestureState.dy)) {


      if (gestureState.dy > 0) {
        if (startCell.i == this.state.prop.rows - 1)
          return;


        endCell = this.state.matrix[startCell.i + 1][startCell.j];
        this.updateBoard(direct, startCell, endCell, verticalSpeed);
      }
      else if (gestureState.dy < 0) {
        if (startCell.i == 0)
          return;

        endCell = this.state.matrix[startCell.i - 1][startCell.j];
        this.updateBoard(direct, startCell, endCell, verticalSpeed);
      }

    }



  }


  updateBoard = (direct, startCell, endCell, cellSpeed) => {

    let cells;
    let prop = this.state.prop;
    let matrix = this.state.matrix;
    let track = 1;



    if (endCell.value == 0) {

      switch (direct) {
        case 'SWIPE_RIGHT':
          cells = matrix[endCell.i].slice(endCell.j, prop.columns);
          break;
        case 'SWIPE_LEFT':
          cells = matrix[endCell.i].slice(0, endCell.j).reverse();
          break;
        case 'SWIPE_UP':
          cells = this.getColumn(endCell.j).slice(0, endCell.i).reverse();
          break;
        case 'SWIPE_DOWN':
          cells = this.getColumn(endCell.j).slice(endCell.i, prop.rows);
          break;
      }
      track = cells.length;
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
    let startValue;




    if (direct == 'SWIPE_RIGHT' || direct == 'SWIPE_LEFT') {
      startCell.moveHoriz = true;
      startValue = startCell.left;
      endValue = endCell.left;
    }



    if (direct == 'SWIPE_DOWN' || direct == 'SWIPE_UP') {
      startCell.moveVert = true;
      startValue = startCell.top;
      endValue = endCell.top;
    }

    let animatedMove = new Animated.Value(startValue);

    let duration = track > 2 ? track / cellSpeed : 100;

    Animated.sequence([
      Animated.timing(animatedMove, {
        toValue: endValue,
        useNativeDriver: false,

        easing: Easing.out(Easing.exp),
        duration: duration,
      })
    ]).start(() => {
      this.updateValues(startCell, endCell);
    });

    /*      Animated.spring(animatedMove, {
          toValue: endValue,
          //friction: 1,
          useNativeDriver: false,
          speed: cellSpeed
        }).start(() => {
          this.updateValues(startCell, endCell);
        });  */

    /*     Animated.timing(animatedMove, {
          toValue: endValue,
          duration: trip/cellSpeed,
         // useNativeDriver: true,
         //easing: Easing.bounce
        }).start(() => {
          this.updateValues(startCell, endCell);
        });  */

    this.setState({ matrix: this.state.matrix, animatedMove: animatedMove });
  }



  updateValues = (startCell, endCell) => {

    var updateMatrix = this.state.matrix;

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
        updateMatrix[i][j].moveHoriz = false;
        updateMatrix[i][j].moveVert = false;
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



    // this.setPosition(updateMatrix);
    /*     this.setState({ lastCell: lastCell });
        this.setState({ cellCount: cellsCount });
        this.setState({ money: moneyCount }); */
    this.setState({ matrix: updateMatrix, anim: false });
  }


  render() {

    let data = [];

    for (var i = 0; i < this.state.matrix.length; i++) {
      for (var j = 0; j < this.state.matrix[i].length; j++) {
        let item = this.state.matrix[i][j];
        data.push(item);
      }
    }


    let tableBody = data.map(item => {

      let cell = <Provider store={store}><Cell cell={item} prop={this.state.prop}></Cell></Provider>;

      let cellBox = (item.moveHoriz == true || item.moveVert == true) ?

        <Animated.View style={[styles(this.state.prop).cell,
        {
          left: item.moveHoriz == true ? this.state.animatedMove : item.left,
          top: item.moveVert == true ? this.state.animatedMove : item.top
        }]}>
          {cell}
        </Animated.View>
        :
        <View style={[styles(this.state.prop).cell,
        {
          left: item.left,
          top: item.top
        }]}>
          {cell}
        </View>;

      /*       return <GestureRecognizer key={item.id} nativeID={item.id}
             onSwipe={(direction, state) => this.onSwipe(direction, state, item)}>
             {cellBox}
           </GestureRecognizer>   */


      return <View key={item.id} nativeID={item.id}>
        {cellBox}
      </View>

    });


    return (
      <View style={styles(this.state.prop).board}>
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
    backgroundColor: "rgba(146, 146, 146, 0.61)",
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
