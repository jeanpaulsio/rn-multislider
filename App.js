import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Multislider from "./Multislider";

export default class App extends React.PureComponent {
  state = { x1: 540, x2: 1200 };

  onValuesChange = ({ x1, x2 }) => {
    this.setState({ x1, x2 });
  };

  render() {
    return (
      <View style={STYLES.Root}>
        <View
          style={{
            width: 200,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text>{this.state.x1}</Text>
          <Text>{this.state.x2}</Text>
        </View>
        <Multislider
          max={1200}
          min={540}
          minStepRange={2}
          onValuesChange={this.onValuesChange}
          sliderLength={270}
          step={30}
          values={[this.state.x1, this.state.x2]}
        />
      </View>
    );
  }
}

const STYLES = StyleSheet.create({
  Root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});
