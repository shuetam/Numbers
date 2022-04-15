import React, { Component } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated,Easing } from 'react-native';
import { connect } from 'react-redux';
import { moveCell } from '../Store/Actions';


class Cell extends Component {
  constructor(props) {
    super(props);






    this.state = {
      dragging: false,
      initialTop: props.cell.top,
      initialLeft: props.cell.left,
      offsetTop: 0,
      offsetLeft: 0,
      onRight: props.cell.j == this.props.prop.columns - 1,
      onLeft: props.cell.j == 0,
      onDown: props.cell.i == this.props.prop.rows - 1,
      onTop: props.cell.i == 0
    };


  }


  panResponder = {};


  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }


/*   componentDidMount() {
    if(this.props.cell.animatedHorizontal || this.props.cell.animatedVertical)
    {
         var animatedMove = new Animated.Value(this.props.startValue);
    
        //let duration = track > 2 ? track / cellSpeed : 100;
    

          Animated.timing(animatedMove, {
            toValue: this.props.endValue,
            useNativeDriver: false,
            easing: Easing.out(Easing.exp),
            duration: 3000,//duration,
          })
        .start(() => {
          this.props.onAnimationEnd();
    alert('animatoin end');
         // this.updateValues(startCell, endCell);
         // this.setState({restart: !this.state.restart });
          //this.setState({matrix: upMatrix, animatedMove: animatedMove });
        });


        this.setState({animatedMove: animatedMove});
      }

  } */


  render() {

    const {
      dragging,
      initialTop,
      initialLeft,
      offsetTop,
      offsetLeft,
    } = this.state;








    const style = {
      top: this.props.cell.animatedVertical == true ? this.props.animatedMove : initialTop + offsetTop,
      left: this.props.cell.animatedHorizontal == true ? this.props.animatedMove : initialLeft + offsetLeft,
    };


    let content = "";
    if (this.props.cell.value != 0) {
      content = this.props.cell.value;
    }

    if (this.props.cell.value == -1) {
      content = "$$";
    }


    return (this.props.cell.animatedHorizontal || this.props.cell.animatedVertical)?
    
    (<Animated.View nativeID={this.props.cell.id} style={[styles(this.props).cell, style]} >
    <View style={[styles(this.props).innerCell]}>
      <Text nativeID={this.props.cell.id} style={styles(this.props).innerText} >{content}</Text>
    </View>
  </Animated.View>) :
    
    (<View nativeID={this.props.cell.id} style={[styles(this.props).cell, style]}
      {...this.panResponder.panHandlers} >
      <View style={[styles(this.props).innerCell]}>
        <Text nativeID={this.props.cell.id} style={styles(this.props).innerText} >{content}</Text>
      </View>
    </View>);
  }

  handleStartShouldSetPanResponder = () => {
    return true;
  };


  handlePanResponderGrant = () => {
    this.setState({ dragging: true });
  };


  getDirect = (gestureState) => {
    var dx = 0;
    var dy = 0;
    var valueX = Math.abs(gestureState.dx);
    var valueY = Math.abs(gestureState.dy);
    var direct = '';

    if (valueX > valueY) {
      dx = gestureState.dx;
      direct = dx > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT';
    }
    else {
      dy = gestureState.dy;
      direct = dy > 0 ? 'SWIPE_DOWN' : 'SWIPE_UP';
    }

    if (this.checkPosition(direct))
      return false;

    return { dx: dx, dy: dy, valueX: valueX, valueY: valueY, direct: direct };
  }


  checkPosition = (direct) => {

    if ((direct=='SWIPE_RIGHT' && this.state.onRight) || (direct=='SWIPE_LEFT' && this.state.onLeft) || (direct=='SWIPE_DOWN' && this.state.onDown) || (direct=='SWIPE_UP' && this.state.onTop))
      return true;

    return false;
  }

  handlePanResponderMove = (e, gestureState) => {

    var direct = this.getDirect(gestureState);

    if (this.props.cell.value == 0 || this.props.cell.value == -1 || !direct)
      return;

    if (direct.valueX > this.props.prop.cellWidth || direct.valueY > this.props.prop.cellHeight) {
      const { initialTop, initialLeft } = this.state;
      this.setState({
        dragging: false,
        initialTop: initialTop,
        initialLeft: initialLeft,
        offsetTop: 0,
        offsetLeft: 0,
      });

/*       const movedCell = {
        cell: this.props.cell,
        direct: direct.direct,
        gestureState: {
          dx: direct.valueX,
          dy: direct.valueY
        }
      } */
      this.props.onMove(this.props.cell, direct.direct, gestureState);
    }
    else {
      this.setState({
        offsetTop: direct.dy,
        offsetLeft: direct.dx,
      });
    }

  };

  handlePanResponderEnd = () => {

    const { initialTop, initialLeft } = this.state;

    this.setState({
      dragging: false,
      initialTop: initialTop,
      initialLeft: initialLeft,
      offsetTop: 0,
      offsetLeft: 0,
    });
  };
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

  cell: {
    width: props.prop.cellWidth,
    height: props.prop.cellHeight,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: props.cell.value == 0 ? 'rgba(0, 0, 0, 0)' : 'rgb(150, 0, 0)',
  },

  innerCell: {
    width: '90%',
    height: '90%',
    backgroundColor: props.cell.value == 0 ? 'rgba(0, 0, 0, 0)' : 'rgb(255, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10%',
  },


  /*   inner1Cell: {
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
    }, */
  innerText: {
    fontSize: 30,
    color: 'white',
  }
});
