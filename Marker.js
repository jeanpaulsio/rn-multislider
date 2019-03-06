import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

Marker.propTypes = {
  size: PropTypes.number.isRequired
};

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
