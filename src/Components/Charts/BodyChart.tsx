import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import SkeletonFront from "../Cards/SkeletonFront";
import { CustomText } from "../CustomText";
import SkeletonBack from "../Cards/SkeletonBack";

const BodyChart = () => {
  const [bodyChartTabs, setBodyChartTabs] = useState(1);

  const [isFront, setIsFront] = useState(true);

  const bodyChartTabsData = [
    {
      label: "Weight",
      value: 1,
      onClick: () => {
        setBodyChartTabs(1);
      },
    },
    {
      label: "Reps",
      value: 2,
      onClick: () => {
        setBodyChartTabs(2);
      },
    },
    {
      label: "1RM",
      value: 3,
      onClick: () => {
        setBodyChartTabs(3);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topTabsContainer}>
        {bodyChartTabsData.map((tab) => (
          <Pressable key={tab.value} style={styles.tab} onPress={tab.onClick}>
            <CustomText
              fontSize={13}
              fontFamily="medium"
              color={
                bodyChartTabs === tab.value ? COLORS.black : COLORS.whiteTail
              }
              style={[
                styles.tab,
                bodyChartTabs === tab.value && styles.activeTab,
              ]}
            >
              {tab.label}
            </CustomText>
          </Pressable>
        ))}
      </View>

      <View style={styles.bodyCont}>
        {isFront ? <SkeletonFront /> : <SkeletonBack />}

        <View style={styles.statsContainer}>
          <TouchableOpacity
            onPress={() => setIsFront(true)}
            style={styles.statItem}
          >
            <CustomText fontFamily="bold">Front</CustomText>
            {isFront ? (
              <View
                style={{
                  borderRadius: 100,
                  height: 20,
                  width: 20,
                  backgroundColor: COLORS.yellow,
                }}
              />
            ) : (
              <View
                style={{
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  height: 20,
                  width: 20,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFront(false)}
            style={styles.statItem}
          >
            <CustomText fontFamily="bold">Back</CustomText>
            {!isFront ? (
              <View
                style={{
                  borderRadius: 100,
                  height: 20,
                  width: 20,
                  backgroundColor: COLORS.yellow,
                }}
              />
            ) : (
              <View
                style={{
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  height: 20,
                  width: 20,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BodyChart;

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40),
    backgroundColor: COLORS.brown || "#333", // Match the background color of the chart
    borderRadius: 10,
  },

  topTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    marginHorizontal: horizontalScale(10),
  },
  tab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 5,
    textAlign: "center",
  },
  activeTab: {
    backgroundColor: COLORS.whiteTail,
  },

  bodyCont: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  muscleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  muscleItem: {
    margin: 10,
    alignItems: "center",
  },
  muscleContainer: {
    alignItems: "center",
  },
  muscleLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
  },
  bodyContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: horizontalScale(10),
  },
  statItem: {
    gap: verticalScale(10),
    alignItems: "center",
  },
  statLabel: {
    color: COLORS.white || "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  statValue: {
    color: COLORS.white || "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
