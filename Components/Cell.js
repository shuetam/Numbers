import React, { Component } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { Provider, connect } from 'react-redux';
import { moveCell } from '../Store/Actions';


var horizontal= false; var vertical= false;
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
      X: 0,
      Y: 0
    };
  }

  /*  componentDidMount = () => {
 
   };
 
   componentWillMount = () => {
 
   } */

  onTouchMove = (e) => {
    //console.log(e.changedTouches[0].clientX);
  }

  onMoveEnd = (e) => {

  /*  if (this.state.valueX < this.props.prop.cellWidth / 2 || this.state.valueY < this.props.prop.cellHeight / 2) */
  horizontal = false; vertical = false;
      this.setState({ horizontal: false, vertical: false });  

  }

  onMoveStart = (e) => {

    /*  if (this.state.valueX < this.props.prop.cellWidth / 2 || this.state.valueY < this.props.prop.cellHeight / 2) */
        //this.setState({ horizontal: false, vertical: false });  
  //move = false;
       // horizontal = false; vertical = false;
       // this.setState({ horizontal: false, vertical: false }); 
    }


  onMove = (e) => {

    const valueX = Math.abs(this.state.panX._value);
    const valueY = Math.abs(this.state.panY._value);

    if(valueX == valueY)
    {
      return;
    }


    console.log('valueX:' + valueX + ', valueY: ' +  valueY);

    const onRight = this.props.cell.j == this.props.prop.columns - 1;
    const onLeft = this.props.cell.j == 0;
    const onDown = this.props.cell.i == this.props.prop.rows - 1;
    const onTop = this.props.cell.i == 0;


    if ((this.state.panX._value > 0 && onRight) || (this.state.panX._value < 0 && onLeft))
    {
      this.setState({ valueX: valueX, valueY: valueY });
      return;
    }


    if ((this.state.panY._value > 0 && onDown) || (this.state.panY._value < 0 && onTop))
    {
      this.setState({ valueX: valueX, valueY: valueY });
      return;
    }


      if (valueX > valueY) {
        //console.log('move!!');
        horizontal= true; vertical= false;
        this.setState({ horizontal: true, vertical: false });
        if (valueX >= this.props.prop.cellWidth / 1.5) {
          const movedCell = {
            cell: this.props.cell,
            direct: this.state.panX._value > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT',
            gestureState: {
              dx: valueX,
              dy: valueY
            }
          }
          horizontal = false; vertical = false;
          this.setState({ horizontal: false, vertical: false });
         // console.log('stop move!!');
          this.props.moveCell(movedCell);
          //return;
        }
      }
      if (valueX < valueY) {
     // console.log('move!!');
      horizontal = false; vertical = true;
      this.setState({ horizontal: false, vertical: true });
      if (valueY >= this.props.prop.cellHeight / 1.5) {
        const movedCell = {
          cell: this.props.cell,
          direct: this.state.panY._value < 0 ? 'SWIPE_UP' : 'SWIPE_DOWN',
          gestureState: {
            dx: valueX,
            dy: valueY
          }
        }
        horizontal = false; vertical = false;
        this.setState({ horizontal: false, vertical: false });
       // console.log('stop move!!');
        this.props.moveCell(movedCell);
        //return;
      }
    }

    //horizontal = false; vertical = false;
   // this.setState({ valueX: valueX, valueY: valueY });
    //this.setState({ horizontal: false, vertical: false });

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

    if(this.props.cell.i == 0 && this.props.cell.j == 0 )
    {
      //console.log(this.props.cell.value);
    }

    //console.log(horizontal);
    //console.log(vertical);
    const panX = this.state.panX._value;
     const panY = this.state.panY._value;

    return (<Animated.View /* onTouchStart={(e) => this.onMoveStart(e)}  */
       onTouchEnd={(e) => this.onMoveEnd(e)} onTouchMove={(e) => this.onMove(e)} 
     nativeID={this.props.cell.id} style={[styles(this.props).innerCell,
    {
      transform: 
      [{ translateX: horizontal ? panX : 0 }, 
         { translateY: vertical ? panY : 0 } ],
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
