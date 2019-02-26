import React from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";

import { debounce } from "lodash";

import { createArray, valueToPosition, positionToValue } from "./converters";

function DefaultMarker() {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
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
const MIN = 540;
const MAX = 1200;
const STEP = 30;

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
      prevX1: initialValues[0],
      prevX2: initialValues[1],
      x1: initialValues[0],
      x2: initialValues[1]
    };

    this._panResponderOne = customPanResponder(this.moveX1, this.endX1);
    this._panResponderTwo = customPanResponder(this.moveX2, this.endX2);
  }

  moveX1 = gestureState => {
    const dx = gestureState.dx;
    const changeInX = dx + this.state.prevX1;

    const minPossibleX = 0;
    const maxPossibleX = this.state.x2 - this.stepLength;

    let x1 =
      changeInX < minPossibleX
        ? minPossibleX
        : changeInX > maxPossibleX
        ? maxPossibleX
        : changeInX;

    const BOUNDARY = 20;
    if (maxPossibleX - x1 <= BOUNDARY) {
      console.log("x1 needs adjustment", maxPossibleX, x1);
      x1 = maxPossibleX - BOUNDARY;
    }

    this.setState({ x1 });
  };

  moveX2 = gestureState => {
    const dx = gestureState.dx;
    const changeInX = dx + this.state.prevX2;

    const minPossibleX = this.state.x1 + this.stepLength;
    const maxPossibleX = SLIDER_LENGTH;

    let x2 =
      changeInX < minPossibleX
        ? minPossibleX
        : changeInX > maxPossibleX
        ? maxPossibleX
        : changeInX;

    const BOUNDARY = 20;
    if (minPossibleX + BOUNDARY >= x2) {
      x2 = minPossibleX + BOUNDARY;
    }

    this.setState({ x2 });
  };

  endX1 = () => {
    this.setState({ prevX1: this.state.x1 }, this.logstate);
  };

  endX2 = () => {
    this.setState({ prevX2: this.state.x2 }, this.logstate);
  };

  logstate = () => {
    // console.log(this.state);
  };

  render() {
    const { x1, x2 } = this.state;

    const trackOneLength = x1;
    const trackThreeLength = SLIDER_LENGTH - x2;
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
        <View
          style={{
            width: SLIDER_LENGTH,
            padding: 30,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text>{positionToValue(x1, this.optionsArray, SLIDER_LENGTH)}</Text>
          <Text>{positionToValue(x2, this.optionsArray, SLIDER_LENGTH)}</Text>
        </View>
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
            <View
              style={[
                styles.track,
                { width: trackThreeLength, backgroundColor: "green" }
              ]}
            />
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
    alignItems: "center"
  },
  touch: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1
  }
});
