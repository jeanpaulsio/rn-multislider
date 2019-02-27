import { valueToCoordinate } from "../converters";

// index -> x
describe("valueToCoordinate", () => {
  it("works", () => {
    const actual = valueToCoordinate({
      value: 3,
      axisLength: 200,
      values: [1, 2, 3, 4, 5]
    });
    expect(actual).toEqual(100);
  });
});
