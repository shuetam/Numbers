import React, { Component, useEffect } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import TopPanel from './TopPanel';
import { connect } from 'react-redux';
import { moveCell } from '../Store/Actions';
import { getCellColor } from '../Common/ColorGenerator';


const prop = {
  columns: 5,
  rows: 5,
  cellWidth: 60,
  cellHeight: 60,
}

let scores = 0;

class Board extends Component {


  constructor(props) {
    super(props);

    var matrixBoard = this.generateMatrix();

    this.state = {
      matrix: matrixBoard,
      cellCount: prop.columns * prop.rows - 1,
      money: 0,
      restart: true,
      colors: [],
      scores: 0
    }
  }

  generateMatrix = () => {
    var matrixBoard = getBoardMatrix(prop.columns, prop.rows);
    this.setPosition(matrixBoard);
    return matrixBoard;
  }


  restartBoard = () => {

    this.setState({ matrix: this.generateMatrix(), points: 0, scores: 0 });

  }


  setPosition = (matrixBoard) => {
    for (var i = 0; i < matrixBoard.length; i++) {
      for (var j = 0; j < matrixBoard[i].length; j++) {

        matrixBoard[i][j].left = this.getLeft(j);
        matrixBoard[i][j].top = this.getTop(i);
        matrixBoard[i][j].moveHoriz = false;
        matrixBoard[i][j].moveVert = false;
        //test
        //matrixBoard[i][j].value = 2;
        matrixBoard[i][j].colors = getCellColor(matrixBoard[i][j].value, 0, 0);

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

    if (this.state.cellCount < 2 || !startCell || startCell == undefined)
      return;

    let endCell = null;

    switch (direct) {
      case 'SWIPE_RIGHT':
        if (startCell.j < prop.columns - 1)
          endCell = this.state.matrix[startCell.i][startCell.j + 1];
        //speed = speedFactor / Math.abs(gestureState.dx);
        break;
      case 'SWIPE_LEFT':
        if (startCell.j > 0)
          endCell = this.state.matrix[startCell.i][startCell.j - 1];
        //speed = speedFactor / Math.abs(gestureState.dx);
        break;
      case 'SWIPE_UP':
        if (startCell.i > 0)
          endCell = this.state.matrix[startCell.i - 1][startCell.j];
        //speed = speedFactor / Math.abs(gestureState.dy);
        break;
      case 'SWIPE_DOWN':
        if (startCell.i < prop.rows - 1)
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
    this.setState({ restart: !this.state.restart });
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
    let duration = speed == 0 ? 500 : track / speed;

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
      points: 0
    });

  }

  getNeighbors(updateMatrix, i, j, neighbors) {
    //var neighborsCount = 0;
    var mainValue = updateMatrix[i][j].frozenValue;
    //var neighbors = [];

    if (i > 0) {
      if (updateMatrix[i - 1][j].frozenValue == mainValue) {

        if (!updateMatrix[i - 1][j].bounce) {
          updateMatrix[i - 1][j].bounce = true;
          neighbors.push(updateMatrix[i - 1][j]);
          this.getNeighbors(updateMatrix, i - 1, j, neighbors);
        }
      }
    }

    if (j > 0) {
      if (updateMatrix[i][j - 1].frozenValue == mainValue) {

        if (!updateMatrix[i][j - 1].bounce) {
          updateMatrix[i][j - 1].bounce = true;
          neighbors.push(updateMatrix[i][j - 1]);
          this.getNeighbors(updateMatrix, i, j - 1, neighbors);
        }
      }
    }

    if (i < prop.rows - 1) {
      if (updateMatrix[i + 1][j].frozenValue == mainValue) {

        if (!updateMatrix[i + 1][j].bounce) {
          updateMatrix[i + 1][j].bounce = true;
          neighbors.push(updateMatrix[i + 1][j]);
          this.getNeighbors(updateMatrix, i + 1, j, neighbors);
        }
      }
    }

    if (j < prop.columns - 1) {
      if (updateMatrix[i][j + 1].frozenValue == mainValue) {

        if (!updateMatrix[i][j + 1].bounce) {
          updateMatrix[i][j + 1].bounce = true;
          neighbors.push(updateMatrix[i][j + 1]);
          this.getNeighbors(updateMatrix, i, j + 1, neighbors);
        }
      }
    }

    //return neighbors;
  }


  getPointSize = () => {

    var animatedPoint = new Animated.Value(35);

    Animated.timing(animatedPoint, {
      toValue: 40,
      useNativeDriver: false,
      duration: 500,
    })
      .start(() => {
        // this.updateValues(startCell, endCell);
      });

    return animatedPoint;
  }


  getAnimatedTop = (startValue, endValue, duration) => {

    var animatedPoint = new Animated.Value(startValue);

    Animated.timing(animatedPoint, {
      toValue: endValue,
      useNativeDriver: false,
      duration: duration,
    })
      .start(() => {
        // this.updateValues(startCell, endCell);
      });

    return animatedPoint;
  }


  getAnimatedLeft = (startValue, endValue, duration) => {

    var animatedPoint = new Animated.Value(startValue);

    Animated.timing(animatedPoint, {
      toValue: endValue,
      useNativeDriver: false,
      duration: duration,
    })
      .start(() => {

      });

    return animatedPoint;
  }

  getAnimatedOpacity = (startValue, endValue, duration) => {

    var animatedPoint = new Animated.Value(startValue);

    Animated.timing(animatedPoint, {
      toValue: endValue,
      useNativeDriver: false,
      duration: duration,
    })
      .start(() => {
        this.updateScores()
      });

    return animatedPoint;
  }


  getBoomStyle = (top, left, durationPosition, durationOpacity) => {

    var style = {
      opacity: this.getAnimatedOpacity(1, 0, durationOpacity),
      top: this.state.endCell ? this.getAnimatedTop(this.state.endCell.top + prop.cellHeight/2, this.state.endCell.top + prop.cellWidth/2  + top, durationPosition) : -1,
      left: this.state.endCell ? this.getAnimatedLeft(this.state.endCell.left + prop.cellWidth/2, this.state.endCell.left + prop.cellWidth/2 + left, durationPosition) : -1,
      backgroundColor: this.state.endCell ? 'rgb(' + this.state.endCell.colors.main.join() + ')' : 'white'
    }

    return style;
  }




  updateScores = () => {

    this.setState({ scores: this.state.scores + this.state.points, points: 0 });


  }

  updateValues = () => {

    var startCell = this.state.startCell;
    var endCell = this.state.endCell;
    // var valueUpdated = false;

    var updateMatrix = this.state.matrix;
    var points = 0;

    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        updateMatrix[i][j].bounce = false;
      }
    }


    if (endCell.value != 0) {
      if (startCell.value == endCell.value) {

        var frozenValue = endCell.value;
        updateMatrix[endCell.i][endCell.j].frozenValue = endCell.value;

        updateMatrix[startCell.i][startCell.j].value = 0;
//updateMatrix[startCell.i][startCell.j].value = Math.floor(Math.random() * (9 - 1 + 1) + 1);

        updateMatrix[endCell.i][endCell.j].value = -1;
        var neighbors = [];
        this.getNeighbors(updateMatrix, endCell.i, endCell.j, neighbors);
        if (neighbors.length > 0) {
          updateMatrix[endCell.i][endCell.j].bounce = true;
          points = neighbors.length
        }
        else {
          points = neighbors.length + 1;
        }

      }
      else if (startCell.value != endCell.value && startCell.value != 0) {
        updateMatrix[endCell.i][endCell.j].value = startCell.value + endCell.value;
        updateMatrix[startCell.i][startCell.j].value = 0;
        //updateMatrix[startCell.i][startCell.j].value = Math.floor(Math.random() * (9 - 1 + 1) + 1);
        // valueUpdated = true;
      }
    }
    else {
      updateMatrix[endCell.i][endCell.j].value = startCell.value;
      updateMatrix[startCell.i][startCell.j].value = 0;
      //updateMatrix[startCell.i][startCell.j].value = Math.floor(Math.random() * (9 - 1 + 1) + 1);
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


    ////need to update colors at any time!!!!!

    /*     let cellsCount = 0;
        let moneyCount = 0;
        let lastCell;
        var colorSeted = false; */
    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        updateMatrix[i][j].animatedHorizontal = false;
        updateMatrix[i][j].animatedVertical = false;

        var cellValue = updateMatrix[i][j].value < 0 ? updateMatrix[i][j].frozenValue : updateMatrix[i][j].value;

        const existsColor = this.state.colors.find(x => x.value == cellValue);

        //const colorsState = this.state.colors;

        if (existsColor) {
          updateMatrix[i][j].colors = existsColor.colors;
        }
        else {
          const colors = getCellColor(cellValue, this.state.colors1, this.state.colors2);
          updateMatrix[i][j].colors = colors;

          if (colors.newColor) {
            this.setState(prevState => ({
              colors: [...prevState.colors, { value: cellValue, colors: colors }]
            }))
          }
        }


        /*    if (updateMatrix[i][j].value > 0) {
             lastCell = updateMatrix[i][j];
             cellsCount++;
           }
           if (updateMatrix[i][j].value == -1) {
             moneyCount++;
           } */

      }
    }

    this.setState({ matrix: updateMatrix, restart: !this.state.restart, points: points });
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
      if (cell.value == -1) {

        var existsCell = data.find(x => (x.i != cell.i || x.j != cell.j) && x.value == cell.frozenValue);
        data[i].canBeUnfrozen = !existsCell;
        /*   if(!existsCell)
          {
            data[i].canBeUnfrozen = true;
          } */
      }

    }


    /*  const pointStyle = {
       fontSize: this.getPointSize(),
       position: 'absolute',
       color: 'red',
       opacity: this.getPointOpacity(),
       top: this.state.endCell ? this.getPointTop() : -1,
       left: this.state.endCell ? this.getPointLeft() : -1,
       transform: [{rotate: this.getPointSpin()}]
     } */

    let tableBody = data.map(item => {

      let cells = <Cell
        key={item.id}
        restartView={this.state.restart} cell={item}
        onMove={this.onMove}
        //onAnimationEnd={this.updateValues}
        prop={prop}
        animatedMove={this.state.animatedMove}
        unfreezeCell={this.unfreezeCell}
        points={this.state.points}
      >

      </Cell>;

      return cells;

    });

    let points = this.state.points;

    let pointAnimation = <View></View>;
    let boomAnimation = <View></View>;

    if (points > 0) {

      var pointProp = {
        size: this.getPointSize(),
        opacity: this.getAnimatedOpacity(1, 0, 600),
        top: this.state.endCell ? this.getAnimatedTop(this.state.endCell.top, -70, 800) : -1,
        left: this.state.endCell ? this.getAnimatedLeft(this.state.endCell.left, 130, 800) : -1,
        color: this.state.endCell ? 'rgb(' + this.state.endCell.colors.main.join() + ')' : 'white'
      }

      pointAnimation = <Animated.Text style={[pointStyle(pointProp).pointStyle]}>+{points}</Animated.Text>;

     /*  var partItems = [
        { id: 1, top: -20, left: 50 },
        { id: 2, top: -20, left: -50 },
        { id: 3, top: 0, left: -50 },
        { id: 4, top: 0, left: 50 },
        { id: 5, top: -60, left: -30 },
         { id: 6, top: -70, left: 70 },
        { id: 7, top: 20, left: 60 },
        { id: 8, top: -10, left: -70 },
        { id: 9, top: 20, left: 80 }, 
      ];



      boomAnimation = partItems.map(item => {

        let parts = <Animated.View key={item.id} style={[boomStyle.boomStyle, this.getBoomStyle(item.top, item.left, 500, 600)]}>

        </Animated.View>;

        return parts;

      }); */


    }


    return (
      <View style={styles(prop).panel}>
        <View style={styles(prop).bar}></View>
        <TopPanel scores={this.state.scores} newGame={this.restartBoard}></TopPanel>
        <View style={styles(prop).boardPanel}>
          <View style={styles(prop).board}>
            {tableBody}
            {pointAnimation}
          </View>
        </View>
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
    backgroundColor: "rgba(146, 146, 146, 0.2)",
    width: prop.columns * prop.cellWidth,
    height: prop.rows * prop.cellHeight,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 0.3,
    borderRadius: 5
  },
  boardPanel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    alignSelf: 'stretch',
  },
  bar: {
    height: 50,
  }
});


const pointStyle = (prop) => StyleSheet.create({

  pointStyle: {
    fontSize: prop.size,// this.getPointSize(),
    position: 'absolute',
    color: prop.color,
    opacity: prop.opacity,
    top: prop.top,// this.state.endCell ? this.getPointTop() : -1,
    left: prop.left,// this.state.endCell ? this.getPointLeft() : -1,
  }
});

/* const boomStyle = StyleSheet.create({

  boomStyle: {
    width: 25,
    height: 25,
   borderBottomEndRadius: 2,
   position: 'absolute'
  }
}); */


