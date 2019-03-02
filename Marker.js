import React from "react";
import { StyleSheet, View } from "react-native";

function Marker(props) {
  return (
    <View
      style={[
        STYLES.Root,
        {
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2
        }
      ]}
    />
  );
}

export default Marker;

const STYLES = StyleSheet.create({
  Root: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D8E3E7"
  }
});
