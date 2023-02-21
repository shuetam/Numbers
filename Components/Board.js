import React, { Component, useEffect } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import TopPanel from './TopPanel';
import { connect } from 'react-redux';
import { moveCell } from '../Store/Actions';
import { getCellColor } from '../Common/ColorGenerator';



const prop = {
  columns: 4,
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
      scores: 0,
      nextValue: Math.floor(Math.random() * (9 - 1 + 1) + 1)
    }
  }

  generateMatrix = () => {
    var matrixBoard = getBoardMatrix(prop.columns, prop.rows);
    this.setPosition(matrixBoard);
    return matrixBoard;
  }


  restartBoard = () => {

    this.setState({blockMove: false, matrix: this.generateMatrix(), points: 0, scores: 0, nextValue: Math.floor(Math.random() * (9 - 1 + 1) + 1) });

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

    if (cells.length == 0)// || cell.value == -1)
      return -1;

    var cellValue = 0;
    var track = 0;

    while (cellValue == 0 && cells.length > 0) {
      let nextCell = cells.shift();
      cellValue = nextCell.value;

      if (cellValue >= 0 && cell.value > 0)
        ++track;

      if (cellValue == 0 && cell.value == -1)
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


  /*  unfreezeCell = (cell) => {
     cell.value = cell.frozenValue;
     cell.canBeUnfrozen = false;
     this.setState({ restart: !this.state.restart });
   } */


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

      if (cellValue >= 0 && startCell.value > 0)
        endCell = nextCell;


      if (cellValue == 0 && startCell.value == -1)
        endCell = nextCell;
    }

    if (endCell.value == -1)
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

  /*   getNeighbors(updateMatrix, i, j, neighbors) {
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
    } */


  getPointSize = () => {

    var animatedPoint = new Animated.Value(35);

    Animated.timing(animatedPoint, {
      toValue: 40,
      useNativeDriver: false,
      duration: 500,
    })
      .start(() => {
        
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

      });

    return animatedPoint;
  }

  getAnimatedRotateStyle = (endValue, duration) => {

    var rotateAnimation = new Animated.Value(0);

    Animated.timing(rotateAnimation, {
      toValue: 1,
      useNativeDriver: false,
      duration: duration,
    })
      .start(() => {

      });

    const interpolateRotating = rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', endValue + 'deg'],
    });

    const animatedStyle = {
      transform: [
        {
          rotate: interpolateRotating,
        },
      ],
    };


    return animatedStyle;
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


  getBoomStyle = (part, durationPosition, durationOpacity, endCell) => {

    var leftBoard = prop.cellWidth;
    var topBoard = prop.cellHeight;
    var startTop = endCell.top + this.getExplodeRandom(0, topBoard);
    var startLeft = endCell.left + this.getExplodeRandom(0, leftBoard)

    var style = {
      opacity: this.getAnimatedOpacity(1, 0, durationOpacity),
      top: endCell ? this.getAnimatedTop(startTop, startTop + this.getExplodeRandom(-60, 60), durationPosition) : -1,
      left: endCell ? this.getAnimatedLeft(startLeft, startLeft + this.getExplodeRandom(-60, 60), durationPosition) : -1,
      backgroundColor: part.color ? part.color  : 'rgb(123, 123, 123)',
      width: this.getExplodeRandom(5, 15),
      height: this.getExplodeRandom(5, 15),
    
    }

    return style;
  }




  updateScores = () => {

    //this function is update after move (second render)
    var updateMatrix = this.state.matrix;

    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        updateMatrix[i][j].bounce = false; 
        
        if(updateMatrix[i][j].value == 0) {
          updateMatrix[i][j].colors = getCellColor(0, 0, 0);
        }
      }
    }
    this.setState({blockMove: false, restart: !this.state.restart, boomCells: false, scores: this.state.scores + this.state.points, points: 0, matrix: updateMatrix });
  }

  afterApear = () => {

    //this function is update after apear new cell. When restart state is created another render comes
    var updateMatrix = this.state.matrix;

    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        updateMatrix[i][j].appear = false;
        //updateMatrix[i][j].value = 2;
      }
    }
    this.setState({ blockMove: false, matrix: updateMatrix, restart: !this.state.restart });
  }

  updateValues = () => {

    var startCell = this.state.startCell;
    var endCell = this.state.endCell;

    if (!endCell) {
      return;
    }
    var anyCellAnimation = false;
    var updateMatrix = this.state.matrix;
    var points = 0;


    if (endCell.value > 0) {
      var updateRandom = false;
      if (startCell.value == endCell.value) {

        var frozenValue = endCell.value;

        updateMatrix[endCell.i][endCell.j].bounce = true;
        anyCellAnimation = true;
   
        updateMatrix[endCell.i][endCell.j].frozenValue = frozenValue;

        updateMatrix[endCell.i][endCell.j].value = -1;

        updateMatrix[startCell.i][startCell.j].value = 0;
       
        points = 1;

      }
      else if (startCell.value != endCell.value && startCell.value != 0) {
        updateMatrix[endCell.i][endCell.j].value = startCell.value + endCell.value;
        updateMatrix[startCell.i][startCell.j].value = 0;
      }
    }
    else {
      updateMatrix[endCell.i][endCell.j].value = startCell.value;
      updateMatrix[endCell.i][endCell.j].frozenValue = startCell.frozenValue;
      updateMatrix[startCell.i][startCell.j].value = 0;

      if (updateMatrix[endCell.i][endCell.j].value == -1) {
        const nextValue = this.state.nextValue;
        updateMatrix[startCell.i][startCell.j].value = nextValue;

        updateMatrix[startCell.i][startCell.j].appear = true;
        anyCellAnimation = true;

        updateRandom = true;
      }
    }


    for (var i = 0; i < updateMatrix.length; i++) {
      for (var j = 0; j < updateMatrix[i].length; j++) {
        updateMatrix[i][j].animatedHorizontal = false;
        updateMatrix[i][j].animatedVertical = false;

        var cellValue = updateMatrix[i][j].value < 0 ? updateMatrix[i][j].frozenValue : updateMatrix[i][j].value;

        const existsColor = this.state.colors.find(x => x.value == cellValue);

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

      }
    }

    var boomCells = this.checkRowAndColumn(updateMatrix);

    this.setState({blockMove: anyCellAnimation, boomCells: boomCells, matrix: updateMatrix, restart: !this.state.restart, points: points, nextValue: updateRandom ? Math.floor(Math.random() * (9 - 1 + 1) + 1) : this.state.nextValue });

  }

  checkRowAndColumn(updateMatrix) {

    var boomCells = [];

    for (var i = 0; i < updateMatrix.length; i++) {

      if (updateMatrix[i].every((x) => x.value < 0)) {

        var frozenValues = updateMatrix[i].map((x) => x.frozenValue);

        if (frozenValues.every((v) => frozenValues[0] == v)) {
          for (var j = 0; j < updateMatrix[i].length; j++) {
            updateMatrix[i][j].value = 0;
            updateMatrix[i][j].frozenValue = 0;

            boomCells.push(updateMatrix[i][j]);
          }
        }
      }
    }

    for (var i = 0; i < updateMatrix[0].length; i++) {

      const column = [];

      for (var j = 0; j < updateMatrix.length; j++) {
        column.push(updateMatrix[j][i]);
      }

      if (column.every((x) => x.value < 0)) {

        var frozenValues = column.map((x) => x.frozenValue);

        if (frozenValues.every((v) => frozenValues[0] == v)) {
          for (var k = 0; k < column.length; k++) {
            column[k].value = 0;
            column[k].frozenValue = 0;
            boomCells.push(column[k]);
          }
        }
      }
    }
    return boomCells.length>0? boomCells : false;
  }

  getExplodeRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

        data[i].canBeUnfrozen = true;//!existsCell;
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
        restartView={this.state.restart}
        cell={item}
        onMove={this.onMove}
        prop={prop}
        animatedMove={this.state.animatedMove}
        afterApear={this.afterApear}
        //unfreezeCell={this.unfreezeCell}
        points={this.state.points}
        blockMove={this.state.blockMove}
      >

      </Cell>;

      return cells;

    });

    let points = this.state.points;

    let pointAnimation = <View></View>;
    let boomAnimations = <View></View>;


    if (this.state.boomCells) {

      var partItems = [
        /* { id: 1, top: -20, left: 50 },
        { id: 2, top: -20, left: -50 },
        { id: 3, top: 0, left: -50 },
        { id: 4, top: 0, left: 50 },
        { id: 5, top: -60, left: -30 },
        { id: 6, top: -70, left: 70 },
        { id: 7, top: 20, left: 60 },
        { id: 8, top: -10, left: -70 },
        { id: 9, top: 20, left: 80 }, 
        { id: 10, top: 20, left: 30 },
        { id: 11, top: 30, left: -70 },
        { id: 12, top: -8, left: 20 } */
      ];

      for (let i = 1; i < 8; i++) {
        partItems.push({ id: i });
      }

      boomAnimations = this.state.boomCells.map(cell => {

        var colorCell = 'rgb(' + cell.colors.main.join() + ')'
        partItems[0].color = colorCell;
        partItems[1].color = colorCell;
        partItems[2].color = colorCell;
        partItems[3].color = 'white';

        var boomCellAnimation = partItems.map(item => {
          let parts = <Animated.View key={item.id} style={[boomStyle.boomStyle, this.getBoomStyle(item, 600, 700, cell), this.getAnimatedRotateStyle(this.getExplodeRandom(100, 450), 2000)]}>
          </Animated.View>;

          return parts;
        });

        return boomCellAnimation;


      });

    }

    if (points > 0) {

      var pointProp = {
        size: this.getPointSize(),
        opacity: this.getAnimatedOpacity(1, 0, 750),
        top: this.state.endCell ? this.getAnimatedTop(this.state.endCell.top, -70, 800) : -1,
        left: this.state.endCell ? this.getAnimatedLeft(this.state.endCell.left, 130, 800) : -1,
        color: this.state.endCell ? 'rgb(' + this.state.endCell.colors.main.join() + ')' : 'white'
      }

      pointAnimation = <Animated.Text style={[pointStyle(pointProp).pointStyle]}>+{points}</Animated.Text>;

    }


    return (
      <View style={styles(prop).panel}>
        <View style={styles(prop).bar}></View>
        <TopPanel scores={this.state.scores} nextValue={this.state.nextValue} newGame={this.restartBoard}></TopPanel>
        <View style={styles(prop).boardPanel}>
          <View style={styles(prop).board}>
            {tableBody}
            {pointAnimation}
            {boomAnimations}
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

const boomStyle = StyleSheet.create({

  boomStyle: {
    backgroundColor: "transparent",
    position: "absolute",
    borderStyle: "solid"
  }
});


