import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const RailSelected = () => <View style={styles.root} />;

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 3,
    backgroundColor: "#2482DC",
    borderRadius: 2,
  },
});
