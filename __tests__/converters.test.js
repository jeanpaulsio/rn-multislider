import { valueToPosition } from "../converters";

// index -> x
describe("valueToPosition", () => {
  it("works", () => {
    const actual = valueToPosition(3, 200, [1, 2, 3, 4, 5]);
    expect(actual).toEqual(100);
  });
});
