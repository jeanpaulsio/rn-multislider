import React from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

import Marker from "./Marker";

import {
  calculateMultiSliderTrackLengths,
  calculateNewXPosition,
  coordinateToValue,
  createArrayValues,
  valueToCoordinate
} from "./helpers";

const MARKER_SIZE = 24;
const TRACK_HEIGHT = 6;

// Make the touchable area a little bigger than the marker itself
const MARKER_CONTAINER_SIZE = MARKER_SIZE * 1.25;

export default class MultiSlider extends React.PureComponent {
  static propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    minStepSeparation: PropTypes.number, // Minimum number of steps x1 and x2 should be separated by
    onValuesChange: PropTypes.func,
    step: PropTypes.number,
    sliderLength: PropTypes.number,
    values: PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
    minStepSeparation: 1
  };

  static createPanResponder(start, move, end) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: start,
      onPanResponderMove: (_, gs) => move(gs),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, _gs) => end(),
      onPanResponderTerminate: (_, _gs) => end(),
      onShouldBlockNativeResponder: () => true
    });
  }

  constructor(props) {
    super(props);

    // N.B. - This is _not_ a controlled component. If these values change,
    // the component does not update. We only use these props to set some
    // initial values
    const { max, min, sliderLength, step, values } = this.props;

    this.arrayValues = createArrayValues(min, max, step);
    this.stepLength = sliderLength / (this.arrayValues.length - 1);

    this.panResponderX1 = MultiSlider.createPanResponder(
      this.startX1,
      this.moveX1,
      this.endX1
    );
    this.panResponderX2 = MultiSlider.createPanResponder(
      this.startX2,
      this.moveX2,
      this.endX2
    );

    const [x1, x2] = values.map(value =>
      valueToCoordinate({
        value,
        axisLength: sliderLength,
        values: this.arrayValues
      })
    );

    this.state = {
      x1,
      x2,
      prevX1: x1,
      prevX2: x2,
      lastSelectedMarker: "x1"
    };
  }

  // The marker that a user starts touching should be on top
  startX1 = () => {
    this.setState({ lastSelectedMarker: "x1" });
  };

  startX2 = () => {
    this.setState({ lastSelectedMarker: "x2" });
  };

  moveX1 = gestureState => {
    const dx = gestureState.dx;
    const newX = dx + this.state.prevX1;

    const minPossibleX = 0;
    const maxPossibleX =
      this.state.x2 - this.stepLength * this.props.minStepSeparation;

    const x1 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

    if (this.state.prevX1 !== x1) {
      this.setState({ x1 }, () => {
        this.props.onValuesChange(this.getSliderData());
      });
    }
  };

  moveX2 = gestureState => {
    const dx = gestureState.dx;
    const newX = dx + this.state.prevX2;

    const minPossibleX =
      this.state.x1 + this.stepLength * this.props.minStepSeparation;
    const maxPossibleX = this.props.sliderLength;

    const x2 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

    if (this.state.prevX2 !== x2) {
      this.setState({ x2 }, () => {
        this.props.onValuesChange(this.getSliderData());
      });
    }
  };

  endX1 = () => {
    this.setState({ prevX1: this.state.x1 });
  };

  endX2 = () => {
    this.setState({ prevX2: this.state.x2 });
  };

  getSliderData = () => [
    coordinateToValue({
      coordinate: this.state.x1,
      axisLength: this.props.sliderLength,
      values: this.arrayValues
    }),
    coordinateToValue({
      coordinate: this.state.x2,
      axisLength: this.props.sliderLength,
      values: this.arrayValues
    })
  ];

  render() {
    const { x1, x2 } = this.state;
    const { sliderLength } = this.props;

    const {
      trackBaseWidth,
      trackLeftWidth,
      trackRightWidth,
      trackSelectedWidth
    } = calculateMultiSliderTrackLengths({
      x1,
      x2,
      axisLength: sliderLength,
      markerSize: MARKER_SIZE
    });

    const markerContainerOne = {
      top: -MARKER_CONTAINER_SIZE / 2 + TRACK_HEIGHT / 2,
      left: trackLeftWidth - MARKER_CONTAINER_SIZE / 2,
      zIndex: this.state.lastSelectedMarker === "x1" ? 1 : 0
    };

    const markerContainerTwo = {
      top: -MARKER_CONTAINER_SIZE / 2 + TRACK_HEIGHT / 2,
      right: trackRightWidth - MARKER_CONTAINER_SIZE / 2,
      zIndex: this.state.lastSelectedMarker === "x2" ? 1 : 0
    };

    return (
      <View style={[STYLES.Root, { width: trackBaseWidth }]}>
        <View style={[STYLES.BaseTrack, { width: trackBaseWidth }]} />
        <View style={[STYLES.FullTrack, { width: sliderLength }]}>
          <View style={[STYLES.Track, { width: trackLeftWidth }]} />
          <View
            style={[
              STYLES.Track,
              STYLES.SelectedTrack,
              { width: trackSelectedWidth }
            ]}
          />
          <View style={[STYLES.Track, { width: trackRightWidth }]} />
          <View
            style={[STYLES.MarkerContainer, markerContainerOne]}
            {...this.panResponderX1.panHandlers}
          >
            <Marker size={MARKER_SIZE} />
          </View>
          <View
            style={[STYLES.MarkerContainer, markerContainerTwo]}
            {...this.panResponderX2.panHandlers}
          >
            <Marker size={MARKER_SIZE} />
          </View>
        </View>
      </View>
    );
  }
}

const STYLES = StyleSheet.create({
  Root: {
    height: MARKER_CONTAINER_SIZE,
    justifyContent: "center",
    alignItems: "center"
  },
  BaseTrack: {
    alignItems: "center",
    borderRadius: TRACK_HEIGHT,
    height: TRACK_HEIGHT,
    backgroundColor: "#eff8fd",
    position: "absolute",
    top: MARKER_CONTAINER_SIZE / 2 - TRACK_HEIGHT / 2,
    left: 0,
    right: 0
  },
  FullTrack: {
    flexDirection: "row"
  },
  Track: {
    backgroundColor: "#eff8fd",
    borderRadius: TRACK_HEIGHT,
    height: TRACK_HEIGHT
  },
  SelectedTrack: {
    backgroundColor: "#FFA5A7"
  },
  MarkerContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    height: MARKER_CONTAINER_SIZE,
    justifyContent: "center",
    position: "absolute",
    width: MARKER_CONTAINER_SIZE
  }
});
