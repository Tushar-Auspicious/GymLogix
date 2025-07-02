import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../../Components/CustomText";
import CustomDropdown from "../../Components/Modals/DropDownModal";
import RangeSlider from "../../Components/RangeSlider/RangeSlider";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import MeasurementTab from "./MeasurementTab";
import NutritionTab from "./NutritionTab";
import TrainingTab from "./TrainingTab";

const STATS = () => {
  const [statsTab, setStatsTab] = useState(1);
  const [plan, setPlan] = useState<any>("Select");
  const [workout, setWorkout] = useState<any>("Select");
  const [exercise, setExercise] = useState<any>("Select");
  const [dateRange, setDateRange] = useState([0, 100]);

  const plans = [
    { label: "Plan 1", value: "Plan 1" },
    { label: "Plan 2", value: "Plan 2" },
    { label: "Plan 3", value: "Plan 3" },
  ];

  const workouts = [
    { label: "Workout 1", value: "Workout 1" },
    { label: "Workout 2", value: "Workout 2" },
    { label: "Workout 3", value: "Workout 3" },
  ];

  const exercises = [
    { label: "Exercise 1", value: "Exercise 1" },
    { label: "Exercise 2", value: "Exercise 2" },
    { label: "Exercise 3", value: "Exercise 3" },
  ];

  const topTabsData = [
    { label: "Training", value: 1, onClick: () => setStatsTab(1) },
    { label: "Nutrition", value: 2, onClick: () => setStatsTab(2) },
    { label: "Measurements", value: 3, onClick: () => setStatsTab(3) },
  ];

  const renderTopTabs = () => {
    return (
      <View style={styles.topTabsContainer}>
        {topTabsData.map((tab) => (
          <Pressable
            key={tab.value}
            style={[styles.tab, statsTab === tab.value && styles.activeTab]}
            onPress={tab.onClick}
          >
            <CustomText
              fontSize={13}
              fontFamily="medium"
              color={COLORS.whiteTail}
            >
              {tab.label}
            </CustomText>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderDropDowns = () => {
    return (
      <View style={styles.dropdownContainer}>
        <CustomDropdown
          label="Plan"
          modalTitle="Select Plan"
          placeholder="Select"
          items={plans}
          selectedValue={plan}
          onValueChange={setPlan}
        />
        <CustomDropdown
          label="Workout"
          modalTitle="Select Workout"
          placeholder="Select"
          items={workouts}
          selectedValue={workout}
          onValueChange={setWorkout}
        />
        <CustomDropdown
          label="Exercise"
          modalTitle="Select Exercise"
          placeholder="Select"
          items={exercises}
          selectedValue={exercise}
          onValueChange={setExercise}
        />
      </View>
    );
  };

  const renderMainView = () => {
    switch (statsTab) {
      case 1:
        return <TrainingTab />;
      case 2:
        return <NutritionTab />;
      case 3:
        return <MeasurementTab />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.main}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <View
          style={{
            width: wp(100),
            backgroundColor: COLORS.brown,
            paddingHorizontal: horizontalScale(20),
            paddingVertical: verticalScale(10),
            gap: verticalScale(20),
          }}
        >
          {renderTopTabs()}
          {renderDropDowns()}
          <RangeSlider />
        </View>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}
        >
          {renderMainView()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default STATS;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.darkBrown,
    flex: 1,
  },
  safeArea: {
    flex: 1,
    gap: verticalScale(10),
  },
  topTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    paddingVertical: verticalScale(8),
    borderRadius: 10,
    width: wp(30),
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: COLORS.yellow,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.darkBrown,
  },
  scrollView: {
    flex: 1,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(5),
  },
  dropdownWrapper: {
    flex: 1,
    gap: verticalScale(5),
  },
  dropdown: {
    backgroundColor: COLORS.whiteTail,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#CECECE",
    overflow: "hidden",
  },
  sliderContainer: {
    backgroundColor: COLORS.brown,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(10),
  },
});
