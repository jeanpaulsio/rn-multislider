import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

import Marker from "./Marker";

import {
  calculateNewXPosition,
  coordinateToValue,
  createArrayValues,
  createPanResponder,
  valueToCoordinate
} from "./helpers";

const MARKER_SIZE = 24;
const MARKER_CONTAINER_SIZE = MARKER_SIZE * 2; // Make the touchable area twice the size of the marker
const TRACK_HEIGHT = 6;

export default class MultiSlider extends React.PureComponent {
  static propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    minStepRange: PropTypes.number, // Minimum number of steps x1 and x2 should be separated by
    onValuesChange: PropTypes.func,
    step: PropTypes.number,
    sliderLength: PropTypes.number,
    initialCoordinates: PropTypes.arrayOf(PropTypes.number)
  };

  constructor(props) {
    super(props);

    const { max, min, sliderLength, step, values } = this.props;

    this.arrayValues = createArrayValues(min, max, step);
    this.stepLength = sliderLength / (this.arrayValues.length - 1);

    this.panResponderX1 = createPanResponder(this.moveX1, this.endX1);
    this.panResponderX2 = createPanResponder(this.moveX2, this.endX2);

    const [x1, x2] = values.map(value =>
      valueToCoordinate({
        value: value,
        axisLength: sliderLength,
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
    const maxPossibleX =
      this.state.x2 - this.stepLength * this.props.minStepRange;

    const x1 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

    if (this.state.prevX1 !== x1) {
      this.setState({ x1 }, () => {
        this.props.onValuesChange({
          x1: coordinateToValue({
            coordinate: this.state.x1,
            axisLength: this.props.sliderLength,
            values: this.arrayValues
          }),
          x2: coordinateToValue({
            coordinate: this.state.x2,
            axisLength: this.props.sliderLength,
            values: this.arrayValues
          })
        });
      });
    }
  };

  moveX2 = gestureState => {
    const dx = gestureState.dx;
    const newX = dx + this.state.prevX2;

    const minPossibleX =
      this.state.x1 + this.stepLength * this.props.minStepRange;
    const maxPossibleX = this.props.sliderLength;

    const x2 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

    if (this.state.prevX2 !== x2) {
      this.setState({ x2 }, () => {
        this.props.onValuesChange({
          x1: coordinateToValue({
            coordinate: this.state.x1,
            axisLength: this.props.sliderLength,
            values: this.arrayValues
          }),
          x2: coordinateToValue({
            coordinate: this.state.x2,
            axisLength: this.props.sliderLength,
            values: this.arrayValues
          })
        });
      });
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
    const { sliderLength } = this.props;

    const trackLeftWidth = x1;
    const trackRightWidth = sliderLength - x2;
    const trackSelectedWidth = sliderLength - trackLeftWidth - trackRightWidth;

    const markerContainerOne = {
      top: -MARKER_CONTAINER_SIZE / 2 + TRACK_HEIGHT / 2,
      left: trackLeftWidth - MARKER_CONTAINER_SIZE / 2
    };

    const markerContainerTwo = {
      top: -MARKER_CONTAINER_SIZE / 2 + TRACK_HEIGHT / 2,
      right: trackRightWidth - MARKER_CONTAINER_SIZE / 2
    };

    return (
      <View style={STYLES.Root}>
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
    position: "relative"
  },
  FullTrack: {
    flexDirection: "row"
  },
  Track: {
    backgroundColor: "#D8E3E7",
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
