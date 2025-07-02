import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";

const INSIGHT = () => {
  // Track expanded state for each accordion with an object
  const [expandedAccordions, setExpandedAccordions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleAccordion = (id: string) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderAccordion = (id: string, title: string) => {
    return (
      <View
        style={{
          backgroundColor: COLORS.brown,
          paddingVertical: verticalScale(15),
          paddingHorizontal: verticalScale(15),
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleAccordion(id)}
          style={{ width: "100%" }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: horizontalScale(10),
            }}
          >
            <CustomText
              fontFamily="extraBold"
              fontSize={20}
              style={{ flex: 1 }}
            >
              {title}
            </CustomText>
            <CustomText fontFamily="extraBold" fontSize={20}>
              {expandedAccordions[id] ? "-" : "+"}{" "}
            </CustomText>
          </View>
          <CustomText
            color={COLORS.yellow}
            fontSize={12}
            fontFamily="italic"
            style={{
              paddingHorizontal: horizontalScale(20),
              marginVertical: verticalScale(10),
            }}
          >
            AI generated - Sept 03 2021
          </CustomText>
        </TouchableOpacity>
        {expandedAccordions[id] && (
          <>
            <CustomText
              fontSize={14}
              fontFamily="light"
              color={COLORS.whiteTail}
              style={{ paddingHorizontal: horizontalScale(20) }}
            >
              Considering the exercises performed, their average weights, reps,
              and the total workout time, do you think the workout structure is
              optimized for achieving muscle growth and endurance improvement?
            </CustomText>

            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1677000666741-17c3c57139a2?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={{
                width: "100%",
                height: hp(20),
                marginVertical: verticalScale(20),
              }}
            />

            <View
              style={{
                flexDirection: "row",
                paddingVertical: verticalScale(5),
                borderBottomWidth: 0.5,
                borderBottomColor: COLORS.yellow,
                width: "90%",
                alignSelf: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="medium"
                color={COLORS.yellow}
              >
                Data type
              </CustomText>
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="light"
                color={COLORS.yellow}
              >
                Single Exercise performance
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: verticalScale(5),
                borderBottomWidth: 0.5,
                borderBottomColor: COLORS.yellow,
                width: "90%",
                alignSelf: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="medium"
                color={COLORS.yellow}
              >
                Workout
              </CustomText>
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="light"
                color={COLORS.yellow}
              >
                Push Pull
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: verticalScale(5),
                borderBottomWidth: 0.5,
                borderBottomColor: COLORS.yellow,
                width: "90%",
                alignSelf: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="medium"
                color={COLORS.yellow}
              >
                Exercise
              </CustomText>
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="light"
                color={COLORS.yellow}
              >
                Squat
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: verticalScale(5),
                width: "90%",
                alignSelf: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="medium"
                color={COLORS.yellow}
              >
                Period
              </CustomText>
              <CustomText
                fontSize={12}
                style={{ flex: 1 }}
                fontFamily="light"
                color={COLORS.yellow}
              >
                Aug 03 2021 - Sep 03 2021
              </CustomText>
            </View>
            <CustomText
              fontSize={14}
              fontFamily="light"
              style={{
                paddingHorizontal: horizontalScale(20),
                marginVertical: verticalScale(10),
              }}
            >
              Based on the provided data, the Push Pull Day 1 workout appears to
              be structured for both muscle growth and endurance improvement,
              though there are a few areas that could potentially be optimized.
            </CustomText>
            <CustomText
              fontSize={14}
              fontFamily="bold"
              color={COLORS.yellow}
              style={{
                paddingHorizontal: horizontalScale(20),
                marginVertical: verticalScale(10),
              }}
            >
              Header for workout
            </CustomText>
            <CustomText
              fontSize={14}
              fontFamily="medium"
              style={{
                paddingHorizontal: horizontalScale(20),
              }}
            >
              - The average weight used is 100 kg, which is a relatively heavy
              load for this compound exercise, indicating a focus on strength
              and muscle growth.{"\n"} - The average number of reps is 10, which
              is in the hypertrophy range (8-12 reps) and supports muscle
              building.{"\n"} - The average time per set is around 45-50
              minutes, suggesting a focus on mechanical tension and time under
              tension, both important factors for muscle hypertrophy.
            </CustomText>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ gap: verticalScale(10) }}>
          {renderAccordion("accordion1", "Workout Analysis: Push Pull Day 1")}
          {renderAccordion("accordion2", "Workout Analysis: Leg Day")}
          {renderAccordion("accordion3", "Workout Analysis: Upper Body")}
          {renderAccordion("accordion4", "Workout Analysis: Core Strength")}
          {renderAccordion("accordion5", "Workout Analysis: Cardio Day")}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default INSIGHT;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.darkBrown,
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: verticalScale(20),
  },
});
