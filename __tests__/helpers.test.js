import {
  calculateMultiSliderTrackLengths,
  calculateNewXPosition,
  calculateSingleSliderTrackLengths,
  coordinateToValue,
  createArrayValues,
  valueToCoordinate
} from "../helpers";

describe("valueToCoordinate", () => {
  const axisLength = 200;
  const values = [1, 2, 3, 4, 5];

  describe("exact values", () => {
    it("works when value is 1", () => {
      const actual = valueToCoordinate({
        value: 1,
        axisLength,
        values
      });
      expect(actual).toEqual(0);
    });

    it("works when value is 2", () => {
      const actual = valueToCoordinate({
        value: 2,
        axisLength,
        values
      });
      expect(actual).toEqual(50);
    });

    it("works when value is 3", () => {
      const actual = valueToCoordinate({
        value: 3,
        axisLength,
        values
      });
      expect(actual).toEqual(100);
    });

    it("works when value is 4", () => {
      const actual = valueToCoordinate({
        value: 4,
        axisLength,
        values
      });
      expect(actual).toEqual(150);
    });

    it("works when value is 5", () => {
      const actual = valueToCoordinate({
        value: 5,
        axisLength,
        values
      });
      expect(actual).toEqual(200);
    });
  });

  describe("non exact values", () => {
    it("works when value is below array", () => {
      const actual = valueToCoordinate({
        value: 0,
        axisLength,
        values
      });

      expect(actual).toEqual(0);
    });

    it("works when value is 2.3", () => {
      const actual = valueToCoordinate({
        value: 2.3,
        axisLength,
        values
      });

      expect(actual).toEqual(100);
    });

    it("works when value is after array", () => {
      const actual = valueToCoordinate({
        value: 10,
        axisLength,
        values
      });

      expect(actual).toEqual(200);
    });
  });
});

describe("coordinateToValue", () => {
  const axisLength = 200;
  const values = [1, 2, 3, 4, 5];

  describe("exact values", () => {
    it("works when coordinate is 0", () => {
      const actual = coordinateToValue({
        coordinate: 0,
        axisLength,
        values
      });

      expect(actual).toEqual(1);
    });

    it("works when coordinate is 50", () => {
      const actual = coordinateToValue({
        coordinate: 50,
        axisLength,
        values
      });

      expect(actual).toEqual(2);
    });

    it("works when coordinate is 100", () => {
      const actual = coordinateToValue({
        coordinate: 100,
        axisLength,
        values
      });

      expect(actual).toEqual(3);
    });

    it("works when coordinate is 150", () => {
      const actual = coordinateToValue({
        coordinate: 150,
        axisLength,
        values
      });

      expect(actual).toEqual(4);
    });

    it("works when coordinate is 200", () => {
      const actual = coordinateToValue({
        coordinate: 200,
        axisLength,
        values
      });

      expect(actual).toEqual(5);
    });
  });

  describe("approximated values", () => {
    it("works when coordinate is around 0", () => {
      const actual = coordinateToValue({
        coordinate: 24,
        axisLength,
        values
      });

      expect(actual).toEqual(1);
    });

    it("works when coordinate is around 50", () => {
      const actual1 = coordinateToValue({
        coordinate: 25,
        axisLength,
        values
      });
      const actual2 = coordinateToValue({
        coordinate: 74,
        axisLength,
        values
      });

      expect(actual1).toEqual(2);
      expect(actual2).toEqual(2);
    });

    it("works when coordinate is around 100", () => {
      const actual1 = coordinateToValue({
        coordinate: 75,
        axisLength,
        values
      });
      const actual2 = coordinateToValue({
        coordinate: 124,
        axisLength,
        values
      });

      expect(actual1).toEqual(3);
      expect(actual2).toEqual(3);
    });

    it("works when coordinate is around 150", () => {
      const actual1 = coordinateToValue({
        coordinate: 125,
        axisLength,
        values
      });
      const actual2 = coordinateToValue({
        coordinate: 174,
        axisLength,
        values
      });

      expect(actual1).toEqual(4);
      expect(actual2).toEqual(4);
    });

    it("works when coordinate is around 200", () => {
      const actual1 = coordinateToValue({
        coordinate: 175,
        axisLength,
        values
      });

      expect(actual1).toEqual(5);
    });
  });
});

describe("createArrayValues", () => {
  it("works for all positive values", () => {
    const actual = createArrayValues(1, 5);
    expect(actual).toEqual([1, 2, 3, 4, 5]);
  });

  it("works with some negative values", () => {
    const actual = createArrayValues(-3, 3);
    expect(actual).toEqual([-3, -2, -1, 0, 1, 2, 3]);
  });

  it("works with a positive step other than 1", () => {
    const actual = createArrayValues(1, 10, 3);
    expect(actual).toEqual([1, 4, 7, 10]);
  });

  it("works with a negative step", () => {
    const actual = createArrayValues(20, 10, -5);
    expect(actual).toEqual([20, 15, 10]);
  });

  describe("when final value is not a factor of step", () => {
    it("works for positive steps", () => {
      const actual = createArrayValues(1, 12, 3);
      expect(actual).not.toEqual([1, 4, 7, 10, 13]);
      expect(actual).toEqual([1, 4, 7, 10, 12]);
    });

    it("works for negative steps", () => {
      const actual = createArrayValues(12, 1, -3);
      expect(actual).not.toEqual([12, 9, 6, 3, 0]);
      expect(actual).toEqual([12, 9, 6, 3, 1]);
    });
  });
});

describe("calculateNewXPosition", () => {
  it("returns x if it is within boundaries", () => {
    const actual = calculateNewXPosition(100, 0, 200);
    expect(actual).toEqual(100);
  });

  it("returns max possible x if newX overshoots", () => {
    const actual = calculateNewXPosition(201, 0, 200);
    expect(actual).toEqual(200);
  });

  it("returns min possible x if newX undershoots", () => {
    const actual = calculateNewXPosition(-1, 0, 200);
    expect(actual).toEqual(0);
  });
});

describe("calculateMultiSliderTrackLengths", () => {
  it("correctly returns track lengths", () => {
    const actual = calculateMultiSliderTrackLengths({
      x1: 100,
      x2: 200,
      axisLength: 280,
      markerSize: 30
    });
    expect(actual).toEqual({
      trackBaseWidth: 310,
      trackLeftWidth: 100,
      trackRightWidth: 80,
      trackSelectedWidth: 100
    });
  });
});

describe("calculateSingleSliderTrackLengths", () => {
  it("correctly returns track lengths", () => {
    const actual = calculateSingleSliderTrackLengths({
      x1: 100,
      axisLength: 280,
      markerSize: 30
    });
    expect(actual).toEqual({
      trackBaseWidth: 310,
      trackSelectedWidth: 100
    });
  });
});
