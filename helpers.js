/**
 *   Given a MIN of _1_ and a MAX of _10_ with a STEP of _1_,
 *   data is represented like this:
 *
 *
 *   Data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 *
 *   The multislider UI under the hood is represented like this:
 *
 *
 *   │----│----│----│----│----│----│----│----│----│
 *   1    2    3    4    5    6    7    8    9    10
 *
 *
 *   Assume the length of the axis is _270_ units.
 *   This means that each section is exactly _30_ units since
 *   270 / 9 = 30
 *
 *
 *     30   30   etc
 *   │----│----│----│----│----│----│----│----│----│
 *   1    2    3    4    5    6    7    8    9    10
 *
 *
 *   A multislider will have 2 markers on it at any
 *   given time. They are displayed as points on a line.
 *   If our line is _270_ units wide and we want our values
 *   to land exactly where _3_ and _7_ are, our x-coordinates would
 *   be _60_ and _180_
 *
 *   x1 = 60
 *   x2 = 180
 *
 *   These x-coordinates are calculated:
 *      index in array * step length
 *
 *            _x1_                 _x2_
 *   0    30   60   90   120  150  180   etc
 *   │----│----■----│----│----│----■----│----│----│
 *   1    2    3    4    5    6    7    8    9    10
 *
 *
 *   For values to be calculated as 3 and 7, our x-coordinates do
 *   not always have to divide evenly by the step length. This is
 *   represented below:
 *
 *            ~61                 ~179
 *   │----│----│■---│----│----│---■│----│----│----│
 *   1    2    3    4    5    6    7    8    9    10
 *
 *
 */

import { PanResponder } from "react-native";
import { last } from "lodash";

/**
 * Calculates the x-coordinate based on a given value.
 *
 * @param {Object} args
 * @param {number} args.value - a value in the range of values. Given an array of [1, 2, 3], a value might be 3
 * @param {number} args.axisLength - the length of the x-axis
 * @param {array} args.values - range of values
 *
 * @return {number} - translation of the value to a coordinate within the axisLength
 */
export function valueToCoordinate({ value, axisLength, values }) {
  let index;
  const lastIndex = values.length - 1;

  if (value > last(values)) {
    index = lastIndex;
  } else if (value < 0) {
    index = 0;
  } else {
    index = values.findIndex(i => i >= value);
  }

  return (axisLength * index) / lastIndex;
}

/**
 * Calculates the nearest value in the array based on a given x coordinate.
 *
 * @param {Object} args
 * @param {number} args.coordinate - a coordinate within the axisLength. Given an axis length of 100, a coordinate might be 60
 * @param {number} args.axisLength - the length of the x-axis
 * @param {array} args.values - range of values
 *
 * @return {number} - translation of the coordinate to a value within the range of possible values
 */
export function coordinateToValue({ coordinate, axisLength, values }) {
  if (coordinate < 0 || axisLength < coordinate) {
    return null;
  }

  const arrLength = values.length - 1;
  const index = (arrLength * coordinate) / axisLength;
  return values[Math.round(index)];
}

/**
 * Create an array of values based on min, max, and step
 *
 * @param {number} min - smallest possible value
 * @param {number} max - largest possible value
 * @param {number} step - number to increment by
 *
 * @return {array}
 */
export function createArrayValues(coord1, coord2, step = 1) {
  const result = [];
  const direction = coord1 - coord2 > 0 ? -1 : 1;
  const length = Math.abs((coord1 - coord2) / step) + 1;

  for (let i = 0; i < length; i++) {
    const value = coord1 + i * Math.abs(step) * direction;

    // handle overflow
    if (
      (direction > 0 && value > coord2) ||
      (direction < 0 && value < coord2)
    ) {
      result.push(coord2);
      break;
    }

    result.push(value);
  }

  return result;
}

/**
 * Make sure that x1 doesn't overshoot x2 and
 * make sure that x2 doesn't overshoot x1
 *
 * @param {number} newX - calculated x value
 * @param {number} maxPossibleX
 * @param {number} minPossibleX
 *
 * @return {number}
 */
export function calculateNewXPosition(newX, minPossibleX, maxPossibleX) {
  if (newX < minPossibleX) {
    return minPossibleX;
  }

  if (newX > maxPossibleX) {
    return maxPossibleX;
  }

  return newX;
}

/**
 *   Four tracks make up the UI for the multislider:
 *    - trackBase(tB)
 *    - trackLeft(tL)
 *    - trackSelected(tS)
 *    - trackRight(tR)
 *
 *   tL, tS, and tR are exactly what you'd think they are:
 *
 *             x1                  x2
 *   │----│----■====│====│====│====■----│----│----│
 *   1    2    3    4    5    6    7    8    9    10
 *        tL    │        tS         │      tR
 *
 *   trackBase(tB) is beneath the entire track. The reason we do this is so that
 *   the edges of the track _will match the edges of the left-most and right-most edge
 *   of the markers_.
 *
 *   Without trackBase, the center of the markers is where the axis ends.
 *   As a result, half of each marker hangs over the edge.
 *
 */
export function calculateMultiSliderTrackLengths({
  x1,
  x2,
  axisLength,
  markerSize
}) {
  const trackBaseWidth = axisLength + markerSize;
  const trackLeftWidth = x1;
  const trackRightWidth = axisLength - x2;
  const trackSelectedWidth = axisLength - trackLeftWidth - trackRightWidth;

  return {
    trackBaseWidth,
    trackLeftWidth,
    trackRightWidth,
    trackSelectedWidth
  };
}

/**
 * Track lengths for the single slider are much simpler.
 * You only need the base track and the selected track.
 *
 *                                 x1
 *   │====│====│====│====│====│====■----│----│----│
 *   1    2    3    4    5    6    7    8    9    10
 *
 */
export function calculateSingleSliderTrackLengths({
  x1,
  axisLength,
  markerSize
}) {
  const trackBaseWidth = axisLength + markerSize;
  const trackSelectedWidth = x1;

  return {
    trackBaseWidth,
    trackSelectedWidth
  };
}
