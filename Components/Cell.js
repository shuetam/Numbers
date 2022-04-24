import React, { Component } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { connect } from 'react-redux';
import { moveCell } from '../Store/Actions';
import { BlurView } from 'expo-blur';



class Cell extends Component {
  constructor(props) {
    super(props);



    this.state = {
      dragging: false,
      initialTop: props.cell.top,
      initialLeft: props.cell.left,
      offsetTop: 0,
      offsetLeft: 0,
      /*    onRight: props.cell.j == this.props.prop.columns - 1,
            onLeft: props.cell.j == 0,
            onDown: props.cell.i == this.props.prop.rows - 1,
            onTop: props.cell.i == 0, */
      prevPosition: 0,
      prevTime: 0,

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


  /*   endTouch = () => {
      alert('end touch');
  
  const gestureState = this.state.gestureState;
  
      const d = new Date();
      let timeEnd = d.getTime();
  
      let trackTime = timeEnd - this.state.touchStartTime;
      let track = 0;
  
      if (this.state.horizontal)
        track = Math.abs(gestureState.dx);
  
      if (this.state.vertical)
        track = Math.abs(gestureState.dy);
  
      let speed = track/trackTime;
      var direct = this.getDirect(gestureState);
      
      const { initialTop, initialLeft } = this.state;
      
      this.setState({
        dragging: false,
        initialTop: initialTop,
        initialLeft: initialLeft,
        offsetTop: 0,
        offsetLeft: 0,
      });
      
      this.props.onMove(this.props.cell, direct.direct, gestureState, speed);
  
    } */

  startTouch = () => {
    let time = new Date().getTime();
    this.setState({ prevTime: time });
    //alert('touched');
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
    let glass;

    if (this.props.cell.value != 0) {
      content = this.props.cell.value;
    }

    let text = <View style={[styles(this.props).innerinCell]}>
      <Text nativeID={this.props.cell.id + ''} style={styles(this.props).innerText} >{content}</Text>
    </View>

    if (this.props.cell.value == -1) {
      content = this.props.cell.frozenValue;
      glass = <View style={[styles(this.props).glass]}><View style={[styles(this.props).glassInner]}></View></View>;
      text = <BlurView intensity={300} style={[styles(this.props).innerinCell]}>
        <Text nativeID={this.props.cell.id + ''} style={styles(this.props).innerText} >{content}</Text>
      </BlurView>
    }




    return (this.props.cell.animatedHorizontal || this.props.cell.animatedVertical) ?

      (<Animated.View nativeID={this.props.cell.id + ''} style={[styles(this.props).cell, style]} >
        <View style={[styles(this.props).innerCell]}>
          <View style={[styles(this.props).innerinCell]}>
            <Text nativeID={this.props.cell.id + ''} style={styles(this.props).innerText} >{content}</Text>
          </View>
        </View>
      </Animated.View>) :

      (<View
        onTouchStart={this.startTouch}
        nativeID={this.props.cell.id + ''} style={[styles(this.props).cell, style]}
        {...this.panResponder.panHandlers} >
        <View style={[styles(this.props).innerCell]}>
        {glass}
          {text}
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
    var sectionTrack = 0;

    if (valueX > valueY) {
      dx = gestureState.dx;
      sectionTrack = valueX// Math.abs(this.state.prevPosition - valueX);
      this.setState({ prevPosition: valueX });
      direct = dx > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT';
    }
    else {
      dy = gestureState.dy;
      sectionTrack = valueY// Math.abs(this.state.prevPosition - valueY);
      this.setState({ prevPosition: valueY });
      direct = dy > 0 ? 'SWIPE_DOWN' : 'SWIPE_UP';
    }

    var positionVerify = this.checkPosition(direct, valueX, valueY);

    if (positionVerify.stop && this.props.cell.value != -1)
      return false;


    return { manualyMoved: positionVerify.continue, dx: dx, dy: dy, valueX: valueX, valueY: valueY, direct: direct, sectionTrack: sectionTrack };
  }


  checkPosition = (direct, valueX, valueY) => {

    var widthEdge = this.props.prop.cellWidth * 0.05; // 10% is a size of cell
    var heightEdge = this.props.prop.cellHeight * 0.05;
    var widthIn = this.props.prop.cellWidth * 0.5; //0.1 - this is a  moment when cells are connected, less make delay connected
    var heightIn = this.props.prop.cellHeight * 0.5;

    switch (direct) {
      case 'SWIPE_RIGHT'://here need to add widthEdge
        if (this.props.cell.rightTrack <= 0 || valueX >= this.props.cell.rightTrack * this.props.prop.cellWidth - widthEdge) {
          this.setState({ offsetLeft: widthEdge * (this.props.cell.rightTrack + 2) });
          return { continue: false, stop: true };
        }
        else if (valueX >= this.props.cell.rightTrack * this.props.prop.cellWidth - widthIn) {
          return { continue: true, stop: false };
        }
        break;
      case 'SWIPE_LEFT':
        if (this.props.cell.leftTrack <= 0 /* || valueX >= this.props.cell.leftTrack * this.props.prop.cellWidth -  widthEdge */) {
          this.setState({ offsetLeft: -widthEdge * (this.props.cell.leftTrack + 2) });
          return { continue: false, stop: true };
        }
        else if (valueX >= this.props.cell.leftTrack * this.props.prop.cellWidth - widthIn) {
          return { continue: true, stop: false };
        }
        break;
      case 'SWIPE_UP':
        if (this.props.cell.upTrack <= 0 /* || valueY >= this.props.cell.upTrack * this.props.prop.cellHeight - heightEdge */) {
          this.setState({ offsetTop: -heightEdge * (this.props.cell.upTrack + 2) });
          return { continue: false, stop: true };
        }
        else if (valueY >= this.props.cell.upTrack * this.props.prop.cellHeight - heightIn) {
          // alert(this.props.cell.i);
          return { continue: true, stop: false };
        }
        break;
      case 'SWIPE_DOWN':
        if (this.props.cell.downTrack <= 0 /* || valueY >= this.props.cell.downTrack * this.props.prop.cellHeight - heightEdge */) {
          this.setState({ offsetTop: heightEdge * (this.props.cell.downTrack + 2) });
          return { continue: false, stop: true };
        }
        else if (valueY >= this.props.cell.downTrack * this.props.prop.cellHeight - heightIn) {
          return { continue: true, stop: false };
        }
        break;
    }

    return { continue: false, stop: false };
  }

  handlePanResponderMove = (e, gestureState) => {

    var direct = this.getDirect(gestureState);

    if (this.props.cell.value == 0 || this.props.cell.value == -1 || !direct)
      return;

    const time = new Date().getTime();
    const prevTime = this.state.prevTime

    var sectionSpeed = direct.sectionTrack / (time - prevTime);
    this.setState({ speed: sectionSpeed });

    if (direct.manualyMoved && this.state.dragging == true) {
      this.finishDragging();
      //   const { initialTop, initialLeft } = this.state;
      //  this.setState({
      //     dragging: false,
      //     initialTop: initialTop,
      //     initialLeft: initialLeft,
      //     offsetTop: 0,
      //     offsetLeft: 0,
      //   }); 
      this.props.onMove(this.props.cell, direct.direct, gestureState, 0.08);//speed from manual move
    }
    else {
      this.setState({
        offsetTop: direct.dy,
        offsetLeft: direct.dx,
      });
    }
  };

  finishDragging = () => {
    const { initialTop, initialLeft } = this.state;
    this.setState({
      dragging: false,
      initialTop: initialTop,
      initialLeft: initialLeft,
      offsetTop: 0,
      offsetLeft: 0,
      prevTime: 0,
      prevPosition: 0
    });
  }

  handlePanResponderEnd = (e, gestureState) => {

    if (this.state.dragging == false)
      return;

    var direct = this.getDirect(gestureState);

    if (this.props.cell.value == 0 || !direct) {
      this.finishDragging();
      return;
    }

    const time = new Date().getTime();
    const prevTime = this.state.prevTime

    var sectionSpeed = direct.manualyMoved ? 200 : direct.sectionTrack / (time - prevTime);

    if (sectionSpeed > 0.3 || sectionSpeed > this.state.speed && this.state.dragging == true) {
      this.props.onMove(this.props.cell, direct.direct, gestureState, sectionSpeed);
    }

    if (sectionSpeed != 0 && sectionSpeed < 0.3 && this.props.cell.value == -1)
      this.props.unfreezeCell(this.props.cell);

    this.finishDragging();

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
  },


  innerCell: {
    width: '90%',
    height: '90%',
    backgroundColor: 'rgb(' + props.cell.colors.under.join() + ')',
    borderRadius: 5,
  },

  innerinCell: {
    width: '100%',
    height: props.cell.value == -1 ? '100%' : '90%',
    backgroundColor: 'rgb(' + props.cell.colors.main.join() + ')',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderBottomColor: props.cell.value == 0 ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 0.5,
    textShadowColor: props.cell.value == -1? '' : 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },

  glass: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7 )',
    borderRadius: 2,
    zIndex: 10
  },

  glassInner: {
    width: '100%',
    height: '20%',
    borderColor:  'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0.7,
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
