import React from "react";
import { PanResponder, StyleSheet, View } from "react-native";

import { createArray, valueToPosition, positionToValue } from "./converters";

function DefaultMarker() {
  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "grey"
      }}
    />
  );
}

function customPanResponder(move, end) {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => true,
    onPanResponderMove: (_, gestureState) => move(gestureState),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: (_, gestureState) => end(gestureState),
    onPanResponderTerminate: (_, gestureState) => end(gestureState),
    onShouldBlockNativeResponder: () => true
  });
}

const SLIDER_LENGTH = 280;
const MIN = 0;
const MAX = 10;
const STEP = 1;
const SLIP_DISPLACEMENT = 200;

export default class MultiSlider extends React.Component {
  static defaultProps = {
    values: [MIN, MAX]
  };

  constructor(props) {
    super(props);

    this.optionsArray = createArray(MIN, MAX, STEP);
    this.stepLength = SLIDER_LENGTH / this.optionsArray.length;

    var initialValues = this.props.values.map(value =>
      valueToPosition(value, this.optionsArray, SLIDER_LENGTH)
    );

    this.state = {
      valueOne: this.props.values[0],
      valueTwo: this.props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1]
    };

    this._panResponderOne = customPanResponder(this.moveOne, this.endOne);
    this._panResponderTwo = customPanResponder(this.moveTwo, this.endTwo);
  }

  moveOne = gestureState => {
    const accumDistance = gestureState.dx;
    const accumDistanceDisplacement = gestureState.dy;

    const unconfined = accumDistance + this.state.pastOne;
    var bottom = 0;
    var trueTop = this.state.positionTwo - this.stepLength;
    var top = trueTop === 0 ? 0 : trueTop || SLIDER_LENGTH;
    var confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    var slipDisplacement = SLIP_DISPLACEMENT;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      var value = positionToValue(confined, this.optionsArray, SLIDER_LENGTH);
      this.setState({ positionOne: confined, valueOne: value });
    }
  };

  moveTwo = gestureState => {
    const accumDistance = gestureState.dx;
    const accumDistanceDisplacement = gestureState.dy;

    const unconfined = accumDistance + this.state.pastTwo;
    var bottom = this.state.positionOne + this.stepLength;
    var top = SLIDER_LENGTH;
    var confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    var slipDisplacement = SLIP_DISPLACEMENT;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      var value = positionToValue(confined, this.optionsArray, SLIDER_LENGTH);
      this.setState({ positionTwo: confined, valueTwo: value });
    }
  };

  endOne = () => {
    this.setState({ pastOne: this.state.positionOne }, this.logstate);
  };

  endTwo = () => {
    this.setState({ pastTwo: this.state.positionTwo }, this.logstate);
  };

  logstate = () => {
    //
    // console.log(this.state)
  };

  render() {
    const { positionOne, positionTwo } = this.state;

    const trackOneLength = positionOne;
    const trackThreeLength = SLIDER_LENGTH - positionTwo;
    const trackTwoLength = SLIDER_LENGTH - trackOneLength - trackThreeLength;

    const markerContainerOne = {
      top: -MARKER_CONTAINER_SIZE / 2,
      left: trackOneLength - MARKER_CONTAINER_SIZE / 2
    };

    const markerContainerTwo = {
      top: -MARKER_CONTAINER_SIZE / 2,
      right: trackThreeLength - MARKER_CONTAINER_SIZE / 2
    };

    return (
      <View style={styles.Root}>
        <View style={styles.container}>
          <View style={[styles.fullTrack, { width: SLIDER_LENGTH }]}>
            <View style={[styles.track, { width: trackOneLength }]} />
            <View
              style={[
                styles.track,
                styles.selectedTrack,
                { width: trackTwoLength }
              ]}
            />
            <View style={[styles.track, { width: trackThreeLength }]} />
            <View style={[styles.markerContainer, markerContainerOne]}>
              <View style={styles.touch} {...this._panResponderOne.panHandlers}>
                <DefaultMarker />
              </View>
            </View>
            <View style={[styles.markerContainer, markerContainerTwo]}>
              <View style={styles.touch} {...this._panResponderTwo.panHandlers}>
                <DefaultMarker />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const MARKER_CONTAINER_SIZE = 48;

const styles = StyleSheet.create({
  Root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  container: {
    position: "relative",
    height: 50,
    justifyContent: "center"
  },
  fullTrack: {
    flexDirection: "row"
  },
  track: {
    height: 2,
    borderRadius: 2,
    backgroundColor: "#A7A7A7"
  },
  selectedTrack: {
    backgroundColor: "red"
  },
  markerContainer: {
    position: "absolute",
    width: MARKER_CONTAINER_SIZE,
    height: MARKER_CONTAINER_SIZE,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey"
  },
  touch: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderWidth: 1
  }
});
