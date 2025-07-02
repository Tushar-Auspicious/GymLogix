import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  BarChart as GiftedBarChart,
  yAxisSides,
} from "react-native-gifted-charts";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, wp } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";

const BarChart = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    {
      label: "Workout Duration",
      value: 1,
      data: [
        { value: 50, label: "8/1", frontColor: "#D9D9D9" },
        { value: 80, label: "8/2", frontColor: "#D9D9D9" },
        { value: 90, label: "8/3", frontColor: "#D9D9D9" },
        { value: 70, label: "8/4", frontColor: "#D9D9D9" },
        { value: 85, label: "8/5", frontColor: "#D9D9D9" },
        { value: 45, label: "8/6", frontColor: "#D9D9D9" },
        { value: 65, label: "8/7", frontColor: "#D9D9D9" },
        { value: 65, label: "8/8", frontColor: "#D9D9D9" },
        { value: 78, label: "8/9", frontColor: "#D9D9D9" },
        { value: 72, label: "8/10", frontColor: "#D9D9D9" },
        { value: 60, label: "8/11", frontColor: "#D9D9D9" },
      ],
    },
    {
      label: "Exercise",
      value: 2,
      data: [
        { value: 10, label: "8/1", frontColor: "#D9D9D9" },
        { value: 15, label: "8/2", frontColor: "#D9D9D9" },
        { value: 12, label: "8/3", frontColor: "#D9D9D9" },
        { value: 18, label: "8/4", frontColor: "#D9D9D9" },
        { value: 14, label: "8/5", frontColor: "#D9D9D9" },
        { value: 8, label: "8/6", frontColor: "#D9D9D9" },
        { value: 16, label: "8/7", frontColor: "#D9D9D9" },
        { value: 18, label: "8/8", frontColor: "#D9D9D9" },
        { value: 11, label: "8/9", frontColor: "#D9D9D9" },
        { value: 12, label: "8/10", frontColor: "#D9D9D9" },
      ],
    },
    {
      label: "Reps",
      value: 3,
      data: [
        { value: 200, label: "8/1", frontColor: "#D9D9D9" },
        { value: 350, label: "8/2", frontColor: "#D9D9D9" },
        { value: 220, label: "8/3", frontColor: "#D9D9D9" },
        { value: 380, label: "8/4", frontColor: "#D9D9D9" },
        { value: 240, label: "8/5", frontColor: "#D9D9D9" },
        { value: 180, label: "8/6", frontColor: "#D9D9D9" },
        { value: 160, label: "8/7", frontColor: "#D9D9D9" },
        { value: 180, label: "8/8", frontColor: "#D9D9D9" },
        { value: 110, label: "8/9", frontColor: "#D9D9D9" },
        { value: 120, label: "8/10", frontColor: "#D9D9D9" },
      ],
    },
  ];

  const activeData = tabs.find((tab) => tab.value === activeTab)?.data || [];

  return (
    <View style={styles.container}>
      <View style={styles.topTabsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            style={[styles.tab, activeTab === tab.value && styles.activeTab]}
          >
            <CustomText
              fontSize={13}
              fontFamily="medium"
              color={activeTab === tab.value ? COLORS.black : COLORS.white}
            >
              {tab.label}
            </CustomText>
          </Pressable>
        ))}
      </View>

      <View style={styles.chartContainer}>
        <GiftedBarChart
          data={activeData}
          yAxisSide={yAxisSides.RIGHT}
          barWidth={25}
          spacing={horizontalScale(15)}
          hideRules
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{ color: COLORS.white }}
          xAxisLabelTextStyle={{ color: COLORS.white, textAlign: "center" }}
          noOfSections={4}
          xAxisColor={COLORS.white}
          yAxisColor={"transparent"}
          maxValue={activeTab === 3 ? 400 : activeTab === 2 ? 20 : 100}
          yAxisLabelWidth={30}
          backgroundColor="transparent"
          adjustToWidth
          initialSpacing={20}
          endSpacing={6}
          yAxisOffset={0}
          width={wp(85)}
        />
      </View>
    </View>
  );
};

export default BarChart;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.brown,
    borderRadius: 16,
    overflow: "hidden",
  },
  topTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  chartContainer: {
    alignItems: "center",
  },
});
