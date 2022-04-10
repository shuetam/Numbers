import React, { Component } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { Provider, connect } from 'react-redux';
import { moveCell } from '../Store/Actions';



class Cell extends Component {
  constructor(props) {
    super(props);

    let pan = new Animated.ValueXY();
    let panResponder =
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value
          });
        },
        onPanResponderMove: Animated.event(
          [
            null,
            { dx: pan.x, dy: pan.y }
          ]
        ),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        }
      });


    this.state = {
      panX: pan.x,
      panY: pan.y,
      panResponder: panResponder,
      vertical: false,
      horizontal: false
    };
  }

  /*  componentDidMount = () => {
 
   };
 
   componentWillMount = () => {
 
   } */

  onTouchMove = (e) => {
    console.log(e.changedTouches[0].clientX);
  }

  onMoveEnd = (e) => {

   if (this.state.valueX < this.props.prop.cellWidth / 2 || this.state.valueY < this.props.prop.cellHeight / 2)
      this.setState({ horizontal: false, vertical: false }); 
  }


  onMove = (e) => {

    let valueX = Math.abs(this.state.panX._value);
    let valueY = Math.abs(this.state.panY._value);


    let onRight = this.props.cell.j == this.props.prop.columns - 1;
    let onLeft = this.props.cell.j == 0;
    let onDown = this.props.cell.i == this.props.prop.rows - 1;
    let onTop = this.props.cell.i == 0;


    if ((this.state.panX._value > 0 && onRight) || (this.state.panX._value < 0 && onLeft))
    {
      return;
    }


    if ((this.state.panY._value > 0 && onDown) || (this.state.panY._value < 0 && onTop))
    {
      return;
    }


      if (valueX > valueY) {
        console.log('move!!');
        this.setState({ horizontal: true, vertical: false });
        if (valueX >= this.props.prop.cellWidth / 2) {
          const movedCell = {
            cell: this.props.cell,
            direct: this.state.panX._value > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT',
            gestureState: {
              dx: valueX,
              dy: valueY
            }
          }
          this.setState({ horizontal: false, vertical: false });
          console.log('stop move!!');
          this.props.moveCell(movedCell);
        }
      }
    if (valueX < valueY) {
      console.log('move!!');
      this.setState({ horizontal: false, vertical: true });
      if (valueY >= this.props.prop.cellHeight / 2) {
        const movedCell = {
          cell: this.props.cell,
          direct: this.state.panY._value < 0 ? 'SWIPE_UP' : 'SWIPE_DOWN',
          gestureState: {
            dx: valueX,
            dy: valueY
          }
        }
        this.setState({ horizontal: false, vertical: false });
        console.log('stop move!!');
        this.props.moveCell(movedCell);
      }
    }

    this.setState({ valueX: valueX, valueY: valueY });


    /*     if (valueX < this.props.prop.cellWidth && this.state.horizontal)
          this.setState({ horizontal: false });
    
    
        if (valueY < this.props.prop.cellHeight && this.state.vertical)
          this.setState({ vertical: false }); */



    //this.props.moveCell({id: this.props.cell.id, direct: 'LEFT'})

    //this.props.onMove({id: this.props.cell.id, direct: 'LEFT'});

  }

  render() {

    let content = "";
    if (this.props.cell.value != 0) {
      content = this.props.cell.value;
    }

    if (this.props.cell.value == -1) {
      content = "$$";
    }


    return (<Animated.View onTouchEnd={(e) => this.onMoveEnd(e)} onTouchMove={(e) => this.onMove(e)} nativeID={this.props.cell.id} style={[styles(this.props).innerCell,
    {
      transform: [{ translateX: this.state.horizontal ? this.state.panX : 0 }, { translateY: this.state.vertical ? this.state.panY : 0 }],
    }]}
      {...this.state.panResponder.panHandlers}>
      {/*     <View nativeID={this.props.cell.id} style={[styles(this.props).innerCell],
        {
          transform: [{ translateX: this.state.horizontal ? this.state.panX : 0 }, { translateY: this.state.vertical ? this.state.panY : 0 }],
        }
      
    }
      {...this.state.panResponder.panHandlers}
      > */}
      <Text nativeID={this.props.cell.id} style={styles(this.props).innerText} >{content}</Text>
      {/*   </View> */}
    </Animated.View>);


    /*       return (
          <View 
          onTouchMove={(e) => this.onSwipe(e)}
          nativeID={this.props.cell.id} style= {styles(this.props).innerCell}>
            <View nativeID={this.props.cell.id} style= {[styles(this.props).innerCell,styles(this.props).inner1Cell]}> 
              <Text nativeID={this.props.cell.id} style= {styles(this.props).innerText}>{content}</Text>
             </View> 
            </View> 
        ) ; */
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



export default connect(mapStateToProps, mapDispatchToProps)(Cell);


const styles = (props) => StyleSheet.create({

  innerCell: {
    width: '90%',
    height: '85%',
    position: 'absolute',
    backgroundColor: props.cell.value == 0 ? 'rgba(0, 0, 0, 0)' : 'rgb(255, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10%',


    shadowColor: props.cell.value == 0 ? 'rgba(0, 0, 0, 0)' : 'rgb(150, 0, 0)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  inner1Cell: {
    width: '100%',
    height: '98%',
    position: 'absolute',
    shadowColor: props.cell.value == 0 ? 'rgba(0, 0, 0, 0)' : 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  innerText: {
    fontSize: 30,
    color: 'white'
  }
});
