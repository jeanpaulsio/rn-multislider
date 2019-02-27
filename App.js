import React from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";

import {
  coordinateToValue,
  createArrayValues,
  valueToCoordinate
} from "./converters";

function DefaultMarker() {
  return (
    <View
      style={{
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        borderRadius: MARKER_SIZE / 2,
        backgroundColor: "grey"
      }}
    />
  );
}

function createPanResponder(move, end) {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => true,
    onPanResponderMove: (_, gs) => move(gs),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: (_, gs) => end(gs),
    onPanResponderTerminate: (_, gs) => end(gs),
    onShouldBlockNativeResponder: () => true
  });
}

// TODO: write test for this
function calculateNewXPosition(changeInX, minPossibleX, maxPossibleX) {
  return changeInX < minPossibleX
    ? minPossibleX
    : changeInX > maxPossibleX
    ? maxPossibleX
    : changeInX;
}

const SLIDER_LENGTH = 290;
// const MIN = 540;
// const MAX = 1200;
// const STEP = 30;

const MIN = 1;
const MAX = 10;
const STEP = 1;
// TODO: need to make SLIDER_LENGTH not a fixed width

export default class MultiSlider extends React.Component {
  static defaultProps = {
    values: [MIN, MAX - 2]
  };

  constructor(props) {
    super(props);

    this.arrayValues = createArrayValues(MIN, MAX, STEP);
    this.stepLength = SLIDER_LENGTH / this.arrayValues.length;

    const [x1, x2] = this.props.values.map(value =>
      valueToCoordinate({
        value: value,
        axisLength: SLIDER_LENGTH,
        values: this.arrayValues
      })
    );

    this.state = {
      x1,
      x2,
      prevX1: x1,
      prevX2: x2
    };

    this.panResponderX1 = createPanResponder(this.moveX1, this.endX1);
    this.panResponderX2 = createPanResponder(this.moveX2, this.endX2);
  }

  moveX1 = gestureState => {
    const dx = gestureState.dx;
    const changeInX = dx + this.state.prevX1;

    const minPossibleX = 0;
    const maxPossibleX = this.state.x2 - this.stepLength;

    let x1 = calculateNewXPosition(changeInX, minPossibleX, maxPossibleX);

    const boundary = 0;

    if (maxPossibleX - x1 <= boundary) {
      x1 = maxPossibleX - boundary;
    }

    if (this.state.prevX1 !== x1) {
      this.setState({ x1 });
    }
  };

  moveX2 = gestureState => {
    const dx = gestureState.dx;
    const changeInX = dx + this.state.prevX2;

    const minPossibleX = this.state.x1 + this.stepLength;
    const maxPossibleX = SLIDER_LENGTH;

    let x2 = calculateNewXPosition(changeInX, minPossibleX, maxPossibleX);

    const boundary = 0;

    if (minPossibleX + boundary >= x2) {
      x2 = minPossibleX + boundary;
    }

    if (this.state.prevX2 !== x2) {
      this.setState({ x2 });
    }
  };

  endX1 = () => {
    this.setState({ prevX1: this.state.x1 });
  };

  endX2 = () => {
    this.setState({ prevX2: this.state.x2 });
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
          <Text>
            {coordinateToValue({
              coordinate: x1,
              axisLength: SLIDER_LENGTH,
              values: this.arrayValues
            })}
          </Text>
          <Text>
            {coordinateToValue({
              coordinate: x2,
              axisLength: SLIDER_LENGTH,
              values: this.arrayValues
            })}
          </Text>
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
            <View style={[styles.track, { width: trackThreeLength }]} />
            <View
              style={[styles.markerContainer, markerContainerOne]}
              {...this.panResponderX1.panHandlers}
            >
              <DefaultMarker />
            </View>
            <View
              style={[styles.markerContainer, markerContainerTwo]}
              {...this.panResponderX2.panHandlers}
            >
              <DefaultMarker />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const MARKER_CONTAINER_SIZE = 48;
const MARKER_SIZE = MARKER_CONTAINER_SIZE / 3;
const BOUNDARY = MARKER_SIZE;

const styles = StyleSheet.create({
  Root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  container: {
    position: "relative",
    height: MARKER_CONTAINER_SIZE,
    justifyContent: "center",
    borderWidth: 1
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
    borderWidth: 1
  }
});
