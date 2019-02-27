/**
 * Calculates the x coordinate based on a given value
 *
 * @param {number} value
 * @param {number} axisLength
 * @param {array} values
 * @return {number}
 */
export function valueToPosition(value, axisLength, values) {
  const index = values.findIndex(i => i === value);
  const arrLength = values.length - 1;
  const validIndex = index === -1 ? arrLength : index;

  return (axisLength * validIndex) / arrLength;
}

/**
 * Calculates the nearest value in the array based on a
 * given x coordinate
 *
 * @param {number} coordinate
 * @param {number} axisLength
 * @param {array} values
 * @return {number}
 */
export function positionToValue(coordinate, axisLength, values) {
  if (coordinate < 0 || axisLength < coordinate) {
    return null;
  }

  const arrLength = values.length - 1;
  const index = (arrLength * coordinate) / axisLength;
  return values[Math.round(index)];
}

/**
 * Create an array based on min, max, and step values
 * For example, createArray(0, 3, 1) returns
 *    [0, 1, 2, 3]
 *
 * @param {number} min
 * @param {number} max
 * @return {array}
 */
export function createArrayValues(min, max, step = 1) {
  const result = [];
  const direction = min - max > 0 ? -1 : 1;
  const length = Math.abs((min - max) / step) + 1;

  for (let i = 0; i < length; i++) {
    result.push(min + i * Math.abs(step) * direction);
  }

  return result;
}
