import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';



class TopPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    newGame = () => {
        this.props.newGame();
    }

    render() {
        return (
            <View style={styles.topPanel}>
           
                    <View style={[styles.button]} onTouchEnd={this.newGame}>
                        <Text>3:3</Text>
                    </View>
                    <View style={[styles.scores]}>
                        <Text style={styles.innerTextScores}>{this.props.scores}</Text>
                    </View>
                    <View style={[styles.button]} onTouchEnd={this.newGame}>
                        <Text>Scores</Text>
                    </View>
                </View>
             
       
    
        );
    }
}

const styles = StyleSheet.create({
    topPanel: {
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    scores: {
        width: 90,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        margin: 3,
        backgroundColor: 'rgba(146, 146, 146, 0.3)',
    },
    /* innerButton: {
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderWidth: 0.4,
        width: '95%',
        flex: 0.95,
        margin: 0
    }, */
    innerText: {
        fontSize: 27,
        color: 'rgba(255, 33, 33, 0.753)',
       // color: 'rgba(225, 225, 225, 1)',
       // fontWeight: 0.7,  
    },
    innerTextScores: {
        fontSize: 30,
        color: 'rgba(255, 33, 33, 0.753)',
       // color: 'rgba(225, 225, 225, 1)',
       // fontWeight: 0.7,  
    }
});

export default TopPanel;
