// import React from 'react';
// import {
//   PanResponder,
//   PanResponderGestureState,
//   PanResponderInstance,
//   StyleSheet,
//   View,
// } from 'react-native';

// import { COLORS } from '@utils/constants/Colors';
// import { COLORSBX } from '@utils/constants/ColorsBX';

// import Marker from '@ui/slider/ODSliderMarker';

// import {
//   calculateNewXPosition,
//   calculateSingleSliderTrackLengths,
//   coordinateToValue,
//   createArrayValues,
//   valueToCoordinate,
// } from './sliderHelpers';

// const MARKER_SIZE = 24;
// const TRACK_HEIGHT = 6;

// // Make the touchable area a little bigger than the marker itself
// const MARKER_CONTAINER_SIZE = MARKER_SIZE * 1.25;

// type Props = {
//   max: number;
//   min: number;
//   onValueChange: (arg: number | null) => void;
//   stepSize: number;
//   sliderLength: number;
//   initialValue: number;
// };

// type State = {
//   x1: number;
//   prevX1: number;
// };

// export default class ODMultiSlider extends React.PureComponent<Props, State> {
//   static createPanResponder(move, end) {
//     return PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onStartShouldSetPanResponderCapture: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponderCapture: () => true,
//       onPanResponderGrant: () => true,
//       onPanResponderMove: (_, gs) => move(gs),
//       onPanResponderTerminationRequest: () => false,
//       onPanResponderRelease: (_, gs) => end(gs),
//       onPanResponderTerminate: (_, gs) => end(gs),
//       onShouldBlockNativeResponder: () => true,
//     });
//   }

//   valueRange: Array<number>;
//   stepLength: number;
//   panResponderX1: PanResponderInstance;

//   constructor(props) {
//     super(props);

//     // N.B. - This is _not_ a controlled component. If these values change,
//     // the component does not update. We only use these props to set some
//     // initial values
//     const { max, min, sliderLength, stepSize, initialValue } = this.props;

//     this.valueRange = createArrayValues(min, max, stepSize);
//     this.stepLength = sliderLength / (this.valueRange.length - 1);

//     this.panResponderX1 = ODMultiSlider.createPanResponder(this.moveX1, this.endX1);

//     const x1 = valueToCoordinate({
//       value: initialValue,
//       axisLength: sliderLength,
//       values: this.valueRange,
//     });

//     this.state = { x1, prevX1: x1 };
//   }

//   moveX1 = (gestureState: PanResponderGestureState) => {
//     const { dx } = gestureState;

//     // since newX is accumulated, we need to store the previous value of x
//     const newX = dx + this.state.prevX1;

//     const minPossibleX = 0;
//     const maxPossibleX = this.props.sliderLength;

//     const x1 = calculateNewXPosition(newX, minPossibleX, maxPossibleX);

//     if (this.state.prevX1 !== x1) {
//       this.setState({ x1 }, () => {
//         this.props.onValueChange(
//           coordinateToValue({
//             coordinate: this.state.x1,
//             axisLength: this.props.sliderLength,
//             values: this.valueRange,
//           }),
//         );
//       });
//     }
//   };

//   endX1 = () => {
//     this.setState(prevState => ({ prevX1: prevState.x1 }));
//   };

//   render() {
//     const { sliderLength } = this.props;

//     const { trackBaseWidth, trackSelectedWidth } = calculateSingleSliderTrackLengths({
//       x1: this.state.x1,
//       axisLength: sliderLength,
//       markerSize: MARKER_SIZE,
//     });

//     // Position the markerContainers so that they're vertically centered on the track
//     const markerContainerOne = {
//       top: (-MARKER_CONTAINER_SIZE + TRACK_HEIGHT) / 2,
//       left: trackSelectedWidth - MARKER_CONTAINER_SIZE / 2,
//     };

//     return (
//       <View style={STYLES.Root}>
//         <View style={[STYLES.BaseTrack, { width: trackBaseWidth }]}>
//           <View style={[STYLES.FullTrack, { width: sliderLength }]}>
//             <View style={[STYLES.Track, { width: trackSelectedWidth }]} />
//             <View
//               style={[STYLES.MarkerContainer, markerContainerOne]}
//               {...this.panResponderX1.panHandlers}
//             >
//               <Marker size={MARKER_SIZE} />
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }
// }

// const STYLES = StyleSheet.create({
//   Root: {
//     height: MARKER_CONTAINER_SIZE,
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   BaseTrack: {
//     alignItems: 'center',
//     borderRadius: TRACK_HEIGHT,
//     backgroundColor: COLORSBX.iceBlue,
//   },
//   FullTrack: {
//     flexDirection: 'row',
//   },
//   Track: {
//     height: TRACK_HEIGHT,
//     left: -MARKER_SIZE / 2,
//     borderTopLeftRadius: TRACK_HEIGHT,
//     borderBottomLeftRadius: TRACK_HEIGHT,
//     backgroundColor: COLORSBX.mutedRuby,
//   },
//   MarkerContainer: {
//     alignItems: 'center',
//     backgroundColor: COLORS.Transparent,
//     height: MARKER_CONTAINER_SIZE,
//     justifyContent: 'center',
//     position: 'absolute',
//     width: MARKER_CONTAINER_SIZE,
//   },
// });
