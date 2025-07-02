import React, { FC } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { WorkoutResultScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const WorkoutResult: FC<WorkoutResultScreenProps> = ({ navigation, route }) => {
  const { workoutData } = route.params;

  const renderCards = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: verticalScale(10),
          paddingHorizontal: horizontalScale(10),
        }}
      >
        {Object.entries(workoutData.overallSummary).map(([key, value]: any) => {
          return (
            <View
              key={key}
              style={{
                width: "48%", // Two columns with space between
                backgroundColor: COLORS.brown,
                borderRadius: 100,
                padding: 10,
                alignItems: "center",
                gap: verticalScale(5),
              }}
            >
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color={COLORS.yellow}
              >
                {key}
              </CustomText>
              <CustomText fontFamily="italic" fontSize={22}>
                {value.current}
              </CustomText>
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color={COLORS.sparkleGreen}
              >
                {value.previous}
              </CustomText>
            </View>
          );
        })}
      </View>
    );
  };

  const renderBestResultCard = () => {
    return (
      <View
        style={{
          width: wp(95),
          backgroundColor: COLORS.brown,
          borderRadius: 20,
          padding: 10,
          alignItems: "center",
          gap: verticalScale(30),
        }}
      >
        <CustomText fontFamily="italicBold" fontSize={24} color={COLORS.yellow}>
          BEST RECORD
        </CustomText>
        {Object.entries(workoutData.bestRecords).map(([key, value]: any) => {
          return (
            <View
              key={key}
              style={{
                width: "90%",
                gap: verticalScale(10),
              }}
            >
              <CustomText
                fontFamily="italicBold"
                fontSize={14}
                color={COLORS.whiteTail}
              >
                {key.split("_").join(" ")}
              </CustomText>

              <View style={styles.ExerciseItem}>
                <Image
                  source={{
                    uri: value.image,
                  }}
                  style={styles.ExerciseImage}
                />
                <View style={styles.ExerciseDetails}>
                  <CustomText
                    color={COLORS.yellow}
                    fontFamily="medium"
                    fontSize={15}
                  >
                    {value.exerciseName}
                  </CustomText>
                  <CustomText
                    color={COLORS.whiteTail}
                    fontFamily="italic"
                    fontSize={15}
                  >
                    {value?.details}
                  </CustomText>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTargetedMuscleCard = () => {
    return (
      <View
        style={{
          width: wp(95),
          backgroundColor: COLORS.brown,
          borderRadius: 20,
          paddingHorizontal: horizontalScale(10),
          paddingVertical: verticalScale(20),
          alignItems: "center",
          gap: verticalScale(30),
        }}
      >
        <CustomText fontFamily="italicBold" fontSize={24} color={COLORS.yellow}>
          Targeted Muscles
        </CustomText>
        <CustomIcon Icon={ICONS.dummyTargetMuscle} height={300} width={300} />
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.darkBrown,
        flex: 1,
        paddingBottom: verticalScale(5),
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingVertical: verticalScale(5),
            gap: verticalScale(20),
          }}
        >
          <CustomText
            fontFamily="italicBold"
            color={COLORS.yellow}
            fontSize={24}
          >
            Workout Result
          </CustomText>
          {renderCards()}
          {renderBestResultCard()}
          {renderTargetedMuscleCard()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WorkoutResult;

const styles = StyleSheet.create({
  ExerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: verticalScale(10),
    borderColor: COLORS.whiteTail,
    backgroundColor: COLORS.lightBrown,
    padding: verticalScale(7),
  },
  selectedExerciseItem: {
    backgroundColor: COLORS.skinColor,
  },
  ExerciseImage: {
    height: "100%",
    width: 66,
    borderRadius: 10,
    resizeMode: "cover",
  },
  ExerciseDetails: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    justifyContent: "flex-start",
    flex: 1,
    gap: verticalScale(10),
  },
});
