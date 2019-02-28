import React from "react";
import { View } from "react-native";

function Marker(props) {
  return (
    <View
      style={{
        width: props.size,
        height: props.size,
        borderRadius: props.size / 2,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#D8E3E7"
      }}
    />
  );
}

export default Marker;
