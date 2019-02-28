import React from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";

import {
  calculateNewXPosition,
  coordinateToValue,
  createArrayValues,
  valueToCoordinate
} from "./converters";

/**
 * Default marker
 */
function DefaultMarker() {
  return (
    <View
      style={{
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        borderRadius: MARKER_SIZE / 2,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#D8E3E7"
      }}
    />
  );
}

/**
 * Create a panResponder that customizes:
 * onPanResponderMove
 * onPanResponderRelease
 * onPanResponderTerminate
 */
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

// TODO: need to make SLIDER_LENGTH not a fixed width
const SLIDER_LENGTH = 270;
const MIN = 540;
const MAX = 1200;
const STEP = 30;
const MIN_STEP_RANGE = 2;

export default class MultiSlider extends React.Component {
  static defaultProps = {
    values: [MIN, MAX]
  };

  constructor(props) {
    super(props);

    this.arrayValues = createArrayValues(MIN, MAX, STEP);
    this.stepLength = SLIDER_LENGTH / (this.arrayValues.length - 1);
    this.panResponderX1 = createPanResponder(this.moveX1, this.endX1);
    this.panResponderX2 = createPanResponder(this.moveX2, this.endX2);

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
  }

  moveX1 = gestureState => {
    const dx = gestureState.dx;
    const newX = dx + this.state.prevX1;

    const minPossibleX = 0;
    const maxPossibleX = this.state.x2 - this.stepLength * MIN_STEP_RANGE;

    const x1 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

    if (this.state.prevX1 !== x1) {
      this.setState({ x1 });
    }
  };

  moveX2 = gestureState => {
    const dx = gestureState.dx;
    const newX = dx + this.state.prevX2;

    const minPossibleX = this.state.x1 + this.stepLength * MIN_STEP_RANGE;
    const maxPossibleX = SLIDER_LENGTH;

    const x2 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

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

    const trackLeftWidth = x1;
    const trackRightWidth = SLIDER_LENGTH - x2;
    const trackSelectedWidth = SLIDER_LENGTH - trackLeftWidth - trackRightWidth;

    const markerContainerOne = {
      top: -MARKER_CONTAINER_SIZE / 2 + TRACK_HEIGHT / 2,
      left: trackLeftWidth - MARKER_CONTAINER_SIZE / 2
    };

    const markerContainerTwo = {
      top: -MARKER_CONTAINER_SIZE / 2 + TRACK_HEIGHT / 2,
      right: trackRightWidth - MARKER_CONTAINER_SIZE / 2
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
            <View style={[styles.track, { width: trackLeftWidth }]} />
            <View
              style={[
                styles.track,
                styles.selectedTrack,
                { width: trackSelectedWidth }
              ]}
            />
            <View style={[styles.track, { width: trackRightWidth }]} />
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

const MARKER_SIZE = 24;
const MARKER_CONTAINER_SIZE = MARKER_SIZE * 2;
const TRACK_HEIGHT = 6;

const styles = StyleSheet.create({
  Root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  container: {
    position: "relative",
    height: MARKER_CONTAINER_SIZE,
    justifyContent: "center"
  },
  fullTrack: {
    flexDirection: "row"
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT,
    backgroundColor: "#D8E3E7"
  },
  selectedTrack: {
    backgroundColor: "#FFA5A7"
  },
  markerContainer: {
    position: "absolute",
    width: MARKER_CONTAINER_SIZE,
    height: MARKER_CONTAINER_SIZE,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  }
});
