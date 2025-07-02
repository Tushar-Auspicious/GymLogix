import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomText } from "../../../Components/CustomText";
import PrimaryButton from "../../../Components/PrimaryButton";
import { useAppSelector } from "../../../Redux/store";
import { selectAllTrainingPlans } from "../../../Redux/slices/trainingPlansSlice";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

const WorkoutMenu = () => {
  const navigation = useNavigation<any>();
  const trainingPlans = useAppSelector(selectAllTrainingPlans);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // Changed to string | null

  const toggleDaySelection = (day: string) => {
    if (selectedDay === day) {
      setSelectedDay(null); // Deselect if the same day is clicked
    } else {
      setSelectedDay(day); // Select the new day
    }
  };

  const renderNestedItem = ({ item }: any) => {
    const isSelected = selectedPlan === item.id;

    return (
      <View
        style={{
          gap: verticalScale(10),
        }}
      >
        <Pressable
          style={[
            styles.nestedItem,
            {
              backgroundColor: isSelected ? COLORS.skinColor : COLORS.brown,
            },
          ]}
          onPress={() => {
            if (isSelected) {
              setSelectedPlan(null);
              setSelectedDay(null); // Clear day when plan is deselected
            } else {
              setSelectedPlan(item.id);
              setSelectedDay(null); // Clear day when new plan is selected
            }
          }}
        >
          <Image
            source={{ uri: item.coverImage }}
            style={{ height: 98, width: 148, borderRadius: 5 }}
          />
          <View
            style={{
              flex: 1,
              padding: verticalScale(10),
              justifyContent: "space-between",
            }}
          >
            <CustomText fontFamily="bold">{item.name}</CustomText>
            <View style={styles.tagContainer}>
              {item.tags.map((tag: string, index: number) => (
                <CustomText
                  key={index}
                  style={styles.tag}
                  fontFamily="italicBold"
                  fontSize={10}
                  color={COLORS.black}
                >
                  {tag.slice(0, 8)}
                </CustomText>
              ))}
            </View>
          </View>
        </Pressable>
        {isSelected && (
          <View
            style={{
              gap: verticalScale(10),
              marginVertical: verticalScale(5),
            }}
          >
            {item?.weeklyStructure.map((section: any, sectionIndex: number) => {
              const isDaySelected = selectedDay === section.day;

              return (
                <TouchableOpacity
                  onPress={() => toggleDaySelection(section.day)}
                  key={sectionIndex.toString()}
                  style={{
                    padding: verticalScale(5),
                    backgroundColor: isDaySelected
                      ? COLORS.skinColor
                      : COLORS.brown,
                    borderRadius: 100,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: horizontalScale(10),
                    borderWidth: isDaySelected ? 1 : 0,
                    borderColor: COLORS.yellow,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 100,
                      backgroundColor: section.color,
                      height: verticalScale(30),
                      width: verticalScale(30),
                    }}
                  />
                  <View>
                    <CustomText>{section.day}</CustomText>
                    <CustomText>
                      {section.exercises.length + " exercises"}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderPlanList = () => {
    return (
      <FlatList
        data={trainingPlans}
        renderItem={renderNestedItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          gap: verticalScale(15),
        }}
      />
    );
  };

  return (
    <View style={styles.main}>
      {renderPlanList()}
      <PrimaryButton
        title="Start Workout"
        onPress={() => {
          if (selectedPlan && selectedDay) {
            const selectedProgram = trainingPlans.find(
              (item) => item.id === selectedPlan
            );
            // Get the data for the selected day
            const selectedDayData = selectedProgram?.weeklyStructure.find(
              (section: any) => section.day === selectedDay
            );

            navigation.navigate("workoutProgramDetails", {
              programId: selectedPlan,
              day: [selectedDayData], // Pass the selected day's data
            });
          }
        }}
        disabled={!selectedPlan || !selectedDay} // Disable if no plan or day is selected
        style={{
          marginVertical: verticalScale(10),
        }}
      />
    </View>
  );
};

export default WorkoutMenu;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: horizontalScale(10),
    flex: 1,
    gap: verticalScale(20),
    marginVertical: verticalScale(10),
  },
  nestedItem: {
    flexDirection: "row",
    gap: horizontalScale(10),
    borderRadius: 10,
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
  },
  tag: {
    backgroundColor: COLORS.whiteGreenish,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(8),
    borderRadius: 5,
  },
});
