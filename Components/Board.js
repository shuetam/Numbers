import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-web";
import { getBoardMatrix } from '../Common/MatrixGenerator';
import Cell from './Cell';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prop: {
                columns: 5,
                rows: 5,
                cellWidth: 50,
                cellHeight: 50,
            },
            matrix: null,
            ///////////
            cellCount: 0,
            money: 0
        };
    }

    componentWillMount = () => {
        var matrixBoard = getBoardMatrix(this.state.prop.columns, this.state.prop.rows);
        this.setState({ matrix: matrixBoard });
        this.setState({cellCount: this.state.prop.columns * this.state.prop.rows - 1 });
        alert("START");
    };


    getColumn = (index) => {
        var column = new Array(this.state.prop.rows);
        for (var i = 0; i < this.state.prop.rows; i++) {
            column[i] = this.state.matrix[i][index];
        }
        return column;
    }

    getCellById = (id) => {

        for (var i = 0; i < this.state.matrix.length; i++) {
            for (var j = 0; j < this.state.matrix[i].length; j++) {
                if (id == this.state.matrix[i][j].id) {
                    return this.state.matrix[i][j];
                }
            }
        }
    }

    

    touchStart = (e) => {
     
       // let startTouchX = e.nativeEvent.touches[0].clientX;
       // let startTouchY = e.nativeEvent.touches[0].clientY;

       // this.setState({ startTouchX: startTouchX });
      //  this.setState({ startTouchY: startTouchY });

        //var matrixBoard = getBoardMatrix(this.state.prop.columns, this.state.prop.rows);
        //this.setState({ matrix: matrixBoard });
        alert(e);


      //  let startCell = this.getCellById(e.currentTarget.id);

       // this.setState({ startCell: startCell });
    }

/*     onSwipe(gestureName, gestureState, id) {

        let dx = gestureState.dx;
        let dy = gestureState.dy;
        alert("dx:"+ dx + ",dy: "+ dy + ", id: "+ id);
        //const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
       
    } */


    onSwipe(gestureName, gestureState, id) {

        let startCell = this.getCellById(id);

        if (this.state.cellCount < 2 ||  !startCell )
            return;
        
        let endCell;

        let time = Math.abs(gestureState.dx);

        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {

            if (gestureState.dx > 0) {

                if (startCell.j == this.state.prop.columns - 1)
                    return;

                endCell = this.state.matrix[startCell.i][startCell.j + 1];
                this.updateBoard('SWIPE_RIGHT',startCell, endCell, time);

            }
            else if (gestureState.dx < 0) {
                if (startCell.j == 0)
                    return;

                endCell = this.state.matrix[startCell.i][startCell.j - 1];
                this.updateBoard('SWIPE_LEFT',startCell, endCell, time);
            }
        }
        else if (Math.abs(gestureState.dx) < Math.abs(gestureState.dy)) {


            if (gestureState.dy > 0) {
                if (startCell.i == this.state.prop.rows - 1)
                    return;

                endCell = this.state.matrix[startCell.i + 1][startCell.j];
                this.updateBoard('SWIPE_DOWN',startCell, endCell, time);
            }
            else if (gestureState.dy < 0) {
                if (startCell.i == 0)
                    return;

                endCell = this.state.matrix[startCell.i - 1][startCell.j];
                this.updateBoard('SWIPE_UP',startCell, endCell, time);
            }

        }

    }



    updateBoard = (direct, startCell, endCell, time) => {

        let cells;
        let prop = this.state.prop;
        let matrix = this.state.matrix;


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

        }

        let cellValue = endCell.value;

        while (cellValue == 0 && cells.length > 0) {
            let nextCell = cells.shift();

            cellValue = nextCell.value;
            if (cellValue >= 0)
                endCell = nextCell;

        }


        if (endCell.value == -1 || startCell.value == -1)
            return;

        var updateMatrix = new Array(prop.rows);

        for (var i = 0; i < prop.rows; i++) {
            updateMatrix[i] = new Array(prop.columns);
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

        //updateMatrix[startCell.i][startCell.j].move = true;
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

        /*    if (moveEffect && movedCell && (direct == "right" || direct == "left")) {
       
             time = time * 3; //time factor to tests on devices
             let distanceHorizontal = (endCell.j - startCell.j);
             movedCell.style.transitionProperty = "left";
             movedCell.style.transitionDuration = time / 1000 + "s";
             movedCell.style.left = distanceHorizontal * 40 + "px";;
       
           }
       
           if (moveEffect && movedCell && (direct == "up" || direct == "down")) {
       
             // movedCell.style.position = "absolute";
             time = time * 3; //time factor to tests on devices
             let distanceVertical = (endCell.i - startCell.i);
             movedCell.style.transitionProperty = "top";
             movedCell.style.transitionDuration = time / 1000 + "s";
             movedCell.style.top =  distanceVertical * 40 + "px"; //40px is cell
       
           } */


        this.setState({ lastCell: lastCell });
        this.setState({ cellCount: cellsCount });
        this.setState({ money: moneyCount });
        this.setState({ matrix: updateMatrix });
    }

     getLeft = (j) => {
        return (100 / this.state.prop.columns) * j + '%';
    }

     getTop = (i) => {
        return (100 / this.state.prop.rows) * i + '%';
    }




    render() {

            let data = [];
            
            for (var i = 0; i < this.state.matrix.length; i++) {
                for (var j = 0; j < this.state.matrix[i].length; j++) {
                    data.push(this.state.matrix[i][j]);
                }
            }
    
    
        let tableBody = data.map(item => {

            return <GestureRecognizer  key={item.id} nativeID={item.id} style={[styles(this.state.prop).cell, { top: this.getTop(item.i), left: this.getLeft(item.j) }]}

                    onSwipe={(direction, state) => this.onSwipe(direction, state, item.id)}
                >
                <Cell cell={item} prop={this.state.prop}></Cell></GestureRecognizer>
        });




        return (
            <View  style={styles(this.state.prop).board}>
                {tableBody}
            </View>
        );
    }
}

const styles = (prop) => StyleSheet.create({

    board: {
        backgroundColor: "#7CA1B4",
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

export default Board;