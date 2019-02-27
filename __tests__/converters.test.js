import { valueToCoordinate } from "../converters";

describe("valueToCoordinate", () => {
  const axisLength = 200;
  const values = [1, 2, 3, 4, 5];

  it("works for the starting position", () => {
    const actual = valueToCoordinate({
      value: 1,
      axisLength,
      values
    });
    expect(actual).toEqual(0);
  });

  it("works for the middle position", () => {
    const actual = valueToCoordinate({
      value: 3,
      axisLength,
      values
    });
    expect(actual).toEqual(100);
  });

  it("works for the ending position", () => {
    const actual = valueToCoordinate({
      value: 5,
      axisLength,
      values
    });
    expect(actual).toEqual(200);
  });

  // TODO: test for cases where value does not exist in the array of values
});
