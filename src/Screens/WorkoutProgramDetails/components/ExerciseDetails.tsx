import React, { FC, useMemo, useState, useCallback } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import PickerComponent from "../../../Components/CustomPIcker";
import { CustomText } from "../../../Components/CustomText";
import PrimaryButton from "../../../Components/PrimaryButton";
import {
  SetDetail,
  WorkoutDay,
  workoutHistory,
} from "../../../Seeds/TrainingPLans";

// Extended SetDetail interface to support drop sets
interface ExtendedSetDetail extends SetDetail {
  dropSets?: SetDetail[];
}
import COLORS from "../../../Utilities/Colors";
import {
  calculate1RM,
  extractDistance,
  extractNumericValue,
  extractReps,
  extractTime,
} from "../../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../../Utilities/Metrics";
import { MuscleData } from "./ExerciseView";
import { Exercise } from "../../../Seeds/ExerciseCatalog";
import SkeletonFront from "../../../Components/Cards/SkeletonFront";
import SkeletonBack from "../../../Components/Cards/SkeletonBack";

// Helper function to get exercise image
const getExerciseImage = (exercise: Exercise): string => {
  return exercise.coverImage?.uri || exercise.images?.[0]?.uri || "";
};

// Helper function to get target muscles
const getTargetMuscles = (exercise: Exercise): string[] => {
  return exercise.targetMuscles || [];
};

// Helper function to get exercise instruction
const getExerciseInstruction = (exercise: Exercise): string => {
  return exercise.instruction || "";
};

// Helper function to get exercise description
const getExerciseDescription = (exercise: Exercise): string => {
  return exercise.description || "";
};

const tabData = [
  { label: "Sets", value: 1 },
  { label: "Details", value: 2 },
  { label: "History", value: 3 },
];

const setsTabData = [
  { label: "Last Workout", value: 1 },
  { label: "Last Exercise", value: 2 },
  { label: "Max Weight", value: 3 },
  { label: "Max Time", value: 4 },
  { label: "1RM Max", value: 6 },
];

const ExerciseDetails: FC<{
  exerciseData: any;
  showAddSetUi: boolean;
  setShowAddSetUi: any;
}> = ({ exerciseData, showAddSetUi, setShowAddSetUi }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);

  const [setsTab, setSetsTab] = useState(1);

  // State for managing newly added sets that should appear at the top of all tabs
  const [addedSets, setAddedSets] = useState<ExtendedSetDetail[]>([]);

  // State to store current picker values
  const [currentPickerValues, setCurrentPickerValues] = useState({
    reps: "6",
    distance: "100m",
    weight: "6kg",
    time: "6m",
  });

  const muscleData = useMemo(() => {
    const muscleCount: { [key: string]: number } = {};
    let totalMuscleMentions = 0;

    getTargetMuscles(exerciseData)?.forEach((muscle: any) => {
      muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
      totalMuscleMentions++;
    });

    const muscles: MuscleData[] = Object.keys(muscleCount).map((muscle) => ({
      name: muscle,
      percentage: totalMuscleMentions
        ? Math.round((muscleCount[muscle] / totalMuscleMentions) * 100)
        : 0,
    }));

    return muscles.sort((a, b) => b.percentage - a.percentage);
  }, [exerciseData]);

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        {tabData.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  activeTab === tab.value ? COLORS.yellow : "transparent",
              },
            ]}
          >
            <CustomText fontSize={14} fontFamily="medium">
              {tab.label}
            </CustomText>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderDetailsTab = () => {
    return (
      <ScrollView
        contentContainerStyle={{ alignItems: "center", gap: verticalScale(20) }}
        style={{
          paddingHorizontal: horizontalScale(10),
          gap: verticalScale(20),
          flex: 1,
        }}
      >
        <View style={styles.tagContainer}>
          <CustomText
            style={styles.tag}
            fontFamily="italicBold"
            fontSize={14}
            color={COLORS.whiteTail}
          >
            {exerciseData?.location}
          </CustomText>
          <CustomText
            style={styles.tag}
            fontFamily="italicBold"
            fontSize={14}
            color={COLORS.whiteTail}
          >
            {exerciseData?.type}
          </CustomText>
          <CustomText
            style={styles.tag}
            fontFamily="italicBold"
            fontSize={14}
            color={COLORS.whiteTail}
          >
            {exerciseData?.equipment}
          </CustomText>
          <CustomText
            style={styles.tag}
            fontFamily="italicBold"
            fontSize={14}
            color={COLORS.whiteTail}
          >
            {exerciseData?.force}
          </CustomText>
        </View>
        <FlatList
          data={exerciseData?.images}
          horizontal
          contentContainerStyle={{ gap: horizontalScale(10) }}
          renderItem={() => {
            return (
              <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
                <Image
                  source={{
                    uri: getExerciseImage(exerciseData),
                  }}
                  style={{
                    height: 120,
                    width: 120,
                    resizeMode: "cover",
                    borderRadius: 10,
                  }}
                />
              </View>
            );
          }}
        />
        <Image
          source={{ uri: getExerciseImage(exerciseData) }}
          style={{ height: hp(40), width: wp(90), borderRadius: 20 }}
        />

        <View
          style={{
            paddingVertical: verticalScale(15),
            borderRadius: 10,
            width: wp(90),
            gap: verticalScale(20),
          }}
        >
          <TouchableOpacity
            onPress={() => setShowInstructions(!showInstructions)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: horizontalScale(10),
              width: "100%",
            }}
          >
            <CustomText
              fontFamily="extraBold"
              fontSize={24}
              style={{ flex: 1 }}
            >
              Instructions
            </CustomText>
            <CustomText fontFamily="extraBold" fontSize={20}>
              {showInstructions ? "-" : "+"}{" "}
            </CustomText>
          </TouchableOpacity>
          {showInstructions && (
            <View style={{ gap: verticalScale(3) }}>
              <CustomText
                fontSize={14}
                fontFamily="medium"
                color={COLORS.whiteTail}
              >
                {getExerciseInstruction(exerciseData)}
              </CustomText>
            </View>
          )}
        </View>

        <View
          style={{
            width: wp(95),
            borderRadius: 20,
            paddingHorizontal: horizontalScale(10),
            paddingVertical: verticalScale(20),
            alignItems: "center",
            gap: verticalScale(30),
          }}
        >
          <View style={{ width: "100%" }}>
            <CustomText
              fontFamily="bold"
              fontSize={24}
              style={{ textAlign: "left" }}
            >
              Main Muscle
            </CustomText>
          </View>
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonWrapper}>
              <View style={styles.skeletonHeader}>
                <CustomText color={COLORS.white} style={styles.skeletonLabel}>
                  Front
                </CustomText>
              </View>
              <SkeletonFront
                showLabel={false}
                width={wp(45)}
                height={verticalScale(230)}
                containerWidth={wp(45)}
                selectedMuscles={[exerciseData.mainMuscle]}
                viewBox="0 30 369 70"
              />
            </View>

            <View style={styles.skeletonWrapper}>
              <View style={styles.skeletonHeader}>
                <CustomText color={COLORS.white} style={styles.skeletonLabel}>
                  Back
                </CustomText>
              </View>
              <SkeletonBack
                showLabel={false}
                width={wp(45)}
                height={verticalScale(230)}
                containerWidth={wp(45)}
                selectedMuscles={[exerciseData.mainMuscle]}
                viewBox="0 30 369 70"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: wp(95),
            borderRadius: 20,
            paddingHorizontal: horizontalScale(10),
            paddingVertical: verticalScale(20),
            alignItems: "center",
            gap: verticalScale(30),
          }}
        >
          <View style={{ width: "100%" }}>
            <CustomText
              fontFamily="bold"
              fontSize={24}
              style={{ textAlign: "left" }}
            >
              Secondary Muscle
            </CustomText>
          </View>
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonWrapper}>
              <View style={styles.skeletonHeader}>
                <CustomText color={COLORS.white} style={styles.skeletonLabel}>
                  Front
                </CustomText>
              </View>
              <SkeletonFront
                showLabel={false}
                width={wp(45)}
                height={verticalScale(230)}
                containerWidth={wp(45)}
                selectedMuscles={exerciseData.secondaryMuscle}
                viewBox="0 30 369 70"
              />
            </View>

            <View style={styles.skeletonWrapper}>
              <View style={styles.skeletonHeader}>
                <CustomText color={COLORS.white} style={styles.skeletonLabel}>
                  Back
                </CustomText>
              </View>
              <SkeletonBack
                showLabel={false}
                width={wp(45)}
                height={verticalScale(230)}
                containerWidth={wp(45)}
                selectedMuscles={exerciseData.secondaryMuscle}
                viewBox="0 30 369 70"
                selectionColor={"#C3FF00"}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderHistory = () => {
    // Function to extract all exercises with their dates and details
    const getAllExercisesHistory = (
      workoutHistory: WorkoutDay[]
    ): { name: string; date: string; details: SetDetail[] }[] => {
      const result: { name: string; date: string; details: SetDetail[] }[] = [];

      workoutHistory.forEach((day) => {
        day.exercises.forEach((exercise) => {
          result.push({
            name: exercise.name,
            date: day.date,
            details: exercise.details,
          });
        });
      });

      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return result;
    };

    const allExercisesHistory = getAllExercisesHistory(workoutHistory);

    return (
      <View
        style={{
          rowGap: verticalScale(10),
          flex: 1,
        }}
      >
        <FlatList
          data={allExercisesHistory}
          contentContainerStyle={{ gap: verticalScale(10) }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: COLORS.lightBrown,
                  padding: verticalScale(10),
                  borderRadius: 10,
                  gap: verticalScale(10),
                  borderWidth: 1,
                  borderColor: COLORS.white,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: horizontalScale(10),
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: COLORS.darkPink,
                      borderRadius: 100,
                    }}
                  >
                    <CustomIcon
                      Icon={ICONS.CalendarWithDumbellIcon}
                      height={27}
                      width={27}
                    />
                  </View>
                  <View
                    style={{
                      gap: verticalScale(5),
                    }}
                  >
                    <CustomText
                      fontFamily="semiBold"
                      fontSize={14}
                      color={COLORS.yellow}
                    >
                      {item.name}
                    </CustomText>
                    <CustomText fontFamily="italic" fontSize={12}>
                      {item.date}
                    </CustomText>
                  </View>
                </View>

                <View
                  style={{
                    gap: verticalScale(6),
                    paddingHorizontal: horizontalScale(10),
                  }}
                >
                  {item.details.map((exercise, index) => (
                    <View
                      key={exercise.time + index.toString()}
                      style={{
                        flexDirection: "row",
                        gap: horizontalScale(5),
                      }}
                    >
                      <CustomText
                        fontFamily="medium"
                        fontSize={13}
                        color={COLORS.whiteTail}
                      >
                        {`${index + 1}. ${exercise.weight} ${exercise.reps} ${
                          exercise.time
                        } x${exercise.count}`}
                      </CustomText>
                    </View>
                  ))}
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  // State for managing the selected difficulty for new sets
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "Warmup" | "Easy" | "Medium" | "Hard"
  >("Medium");

  // Function to handle picker value changes
  const handlePickerValuesChange = useCallback(
    (values: {
      reps: string;
      distance: string;
      weight: string;
      time: string;
    }) => {
      setCurrentPickerValues(values);
    },
    []
  );

  // Function to convert time to seconds
  const convertTimeToSeconds = (timeString: string): string => {
    // Handle different time formats: "1m", "30s", "1m 30s", "90s", etc.
    const timeStr = timeString.toLowerCase().trim();

    // If it's already in seconds format (just numbers), return as is
    if (/^\d+$/.test(timeStr)) {
      return `${timeStr}s`;
    }

    // If it already ends with 's', return as is
    if (timeStr.endsWith("s")) {
      return timeStr;
    }

    let totalSeconds = 0;

    // Extract minutes and seconds
    const minuteMatch = timeStr.match(/(\d+)m/);
    const secondMatch = timeStr.match(/(\d+)s/);

    if (minuteMatch) {
      totalSeconds += parseInt(minuteMatch[1]) * 60;
    }

    if (secondMatch) {
      totalSeconds += parseInt(secondMatch[1]);
    }

    // If no matches found, assume it's minutes and convert
    if (!minuteMatch && !secondMatch) {
      const numericValue = parseInt(timeStr.replace(/[^\d]/g, ""));
      if (!isNaN(numericValue)) {
        totalSeconds = numericValue * 60; // Convert minutes to seconds
      }
    }

    return `${totalSeconds}s`;
  };

  // Function to convert seconds to MM:SS format for display
  const formatTimeForDisplay = (timeString: string): string => {
    // Extract numeric value from time string (remove 's' suffix if present)
    const timeStr = timeString.toLowerCase().trim();
    let totalSeconds = 0;

    if (timeStr.endsWith("s")) {
      totalSeconds = parseInt(timeStr.replace("s", ""));
    } else if (timeStr.includes(":")) {
      // Already in MM:SS format, return as is
      return timeString;
    } else {
      // Try to parse as number
      totalSeconds = parseInt(timeStr);
    }

    if (isNaN(totalSeconds)) {
      return timeString; // Return original if can't parse
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format as MM:SS
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to handle adding a new set
  const handleAddSet = (
    usePickerValues: boolean = false,
    isDropSet: boolean = false
  ) => {
    // Use picker values if requested, otherwise use default values
    const defaultData = {
      reps: "10",
      distance: "100m",
      weight: "10kg",
      time: "1m",
    };

    const finalData = usePickerValues ? currentPickerValues : defaultData;

    const newSet: SetDetail = {
      reps: finalData.reps, // Save reps as reps
      weight: finalData.weight,
      time: convertTimeToSeconds(finalData.time), // Convert time to seconds
      count: 1, // Default count
      difficulty: selectedDifficulty,
      distance: finalData.distance, // Save distance as distance
    };

    if (isDropSet && addedSets.length > 0) {
      // Add drop set to the last created set
      setAddedSets((prevSets) => {
        const updatedSets = [...prevSets];
        const lastSetIndex = 0; // Last created set is at index 0

        // Check if the last set already has drop sets
        if (updatedSets[lastSetIndex].dropSets) {
          updatedSets[lastSetIndex].dropSets!.push(newSet);
        } else {
          updatedSets[lastSetIndex].dropSets = [newSet];
        }

        return updatedSets;
      });
    } else {
      // Add as a new regular set
      setAddedSets((prevSets) => [newSet, ...prevSets]);
    }

    // Close the AddSetUI
    setShowAddSetUi(false);
  };

  // Get history sets based on the selected tab
  const getHistorySets = (): SetDetail[] | null => {
    // If no exercise data is provided, return null
    if (!exerciseData || !exerciseData.name) return null;

    const exerciseName = exerciseData.name;

    // Helper function to check if exercise names match (more flexible matching)
    const isExerciseMatch = (historyName: string, currentName: string) => {
      // Convert both names to lowercase for case-insensitive comparison
      const historyLower = historyName.toLowerCase();
      const currentLower = currentName.toLowerCase();

      // Direct match
      if (historyLower === currentLower) return true;

      // Check if one contains the other
      if (
        historyLower.includes(currentLower) ||
        currentLower.includes(historyLower)
      )
        return true;

      // Check for common variations (e.g., "Squat" vs "Squats")
      if (historyLower.replace(/s$/, "") === currentLower.replace(/s$/, ""))
        return true;

      return false;
    };

    // Filter workout history to find exercises with matching names
    const exerciseHistory = workoutHistory.flatMap((day) => {
      return day.exercises
        .filter((exercise) => isExerciseMatch(exercise.name, exerciseName))
        .map((exercise) => ({
          date: day.date,
          workoutId: day.date, // Using date as workoutId for simplicity
          exercise,
        }));
    });

    // Sort by date (newest first)
    exerciseHistory.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Get historical sets based on the selected tab
    let historicalSets: SetDetail[] = [];

    switch (setsTab) {
      case 1: // Last Workout
        // Return the sets from the most recent workout
        historicalSets = exerciseHistory[0]?.exercise.details || [];
        break;

      case 2: // Last Exercise
        // Return the sets from the most recent exercise (already sorted)
        historicalSets = exerciseHistory[0]?.exercise.details || [];
        break;

      case 3: // Max Weight
        // Calculate total weight for each exercise (sum of weight * reps for all sets)
        const exercisesByTotalWeight = exerciseHistory.map((item) => {
          const totalWeight = item.exercise.details.reduce((sum, set) => {
            return (
              sum +
              extractNumericValue(set.weight) *
                extractReps(set.reps) *
                set.count
            );
          }, 0);
          return { ...item, totalWeight };
        });

        // Sort by total weight (highest first)
        exercisesByTotalWeight.sort((a, b) => b.totalWeight - a.totalWeight);

        // Get the sets from the exercise with the highest total weight
        historicalSets = exercisesByTotalWeight[0]?.exercise.details || [];
        break;

      case 4: // Max Time
        // Calculate total time for each exercise
        const exercisesByTotalTime = exerciseHistory.map((item) => {
          const totalTime = item.exercise.details.reduce((sum, set) => {
            return sum + extractTime(set.time) * set.count;
          }, 0);
          return { ...item, totalTime };
        });

        // Sort by total time (highest first)
        exercisesByTotalTime.sort((a, b) => b.totalTime - a.totalTime);

        // Get the sets from the exercise with the highest total time
        historicalSets = exercisesByTotalTime[0]?.exercise.details || [];
        break;

      case 5: // Max Distance (not in the tabs but mentioned in requirements)
        // Calculate total distance for each exercise
        const exercisesByTotalDistance = exerciseHistory.map((item) => {
          const totalDistance = item.exercise.details.reduce((sum, set) => {
            // Assuming distance is stored in the reps field with a format like "123m"
            return sum + extractDistance(set.reps) * set.count;
          }, 0);
          return { ...item, totalDistance };
        });

        // Sort by total distance (highest first)
        exercisesByTotalDistance.sort(
          (a, b) => b.totalDistance - a.totalDistance
        );

        // Get the sets from the exercise with the highest total distance
        historicalSets = exercisesByTotalDistance[0]?.exercise.details || [];
        break;

      case 6: // 1RM (not in the tabs but mentioned in requirements)
        // Calculate 1RM for each set in each exercise
        const exercisesWith1RM = exerciseHistory.flatMap((item) => {
          return item.exercise.details.map((set) => {
            const oneRM = calculate1RM(set.weight, set.reps);
            return { ...item, set, oneRM };
          });
        });

        // Sort by 1RM (highest first)
        exercisesWith1RM.sort((a, b) => b.oneRM - a.oneRM);

        // Get the set with the highest 1RM
        historicalSets =
          exercisesWith1RM.length > 0 ? [exercisesWith1RM[0].set] : [];
        break;

      default:
        historicalSets = [];
        break;
    }

    // Combine added sets (at the top) with historical sets
    const combinedSets = [...addedSets, ...historicalSets];

    // Return combined sets, or null if no sets exist
    return combinedSets.length > 0 ? combinedSets : null;
  };

  const renderSets = () => {
    // Get history sets based on the selected tab
    const historySets = getHistorySets();

    return showAddSetUi ? (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: verticalScale(40),
        }}
      >
        <PickerComponent
          difficulty={selectedDifficulty}
          onValuesChange={handlePickerValuesChange}
        />
        {/* Difficulty selector */}
        <View style={styles.difficultyContainer}>
          {["Warmup", "Easy", "Medium", "Hard"].map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.difficultyButton,
                {
                  backgroundColor:
                    selectedDifficulty === difficulty
                      ? difficulty === "Warmup"
                        ? "#777777"
                        : difficulty === "Easy"
                        ? "#28A745"
                        : difficulty === "Medium"
                        ? "#FFC107"
                        : "#DC3545"
                      : "transparent",
                  borderColor:
                    difficulty === "Warmup"
                      ? "#777777"
                      : difficulty === "Easy"
                      ? "#28A745"
                      : difficulty === "Medium"
                      ? "#FFC107"
                      : "#DC3545",
                },
              ]}
              onPress={() =>
                setSelectedDifficulty(
                  difficulty as "Warmup" | "Easy" | "Medium" | "Hard"
                )
              }
            >
              <CustomText
                fontSize={12}
                fontFamily="medium"
                color={
                  selectedDifficulty === difficulty
                    ? COLORS.black
                    : difficulty === "Warmup"
                    ? "#777777"
                    : COLORS.white
                }
              >
                {difficulty}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            width: wp(80),
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: horizontalScale(10),
            alignSelf: "center",
          }}
        >
          <PrimaryButton
            title="Add Drop Set"
            onPress={() => handleAddSet(true, true)} // Use picker values and mark as drop set
            isFullWidth={false}
            style={{
              alignSelf: "flex-end",
              paddingVertical: verticalScale(7),
              paddingHorizontal: horizontalScale(15),
              borderRadius: verticalScale(10),
            }}
            backgroundColor="#3683DC"
          />
          <PrimaryButton
            title="Add Set"
            onPress={() => handleAddSet(true)} // Use picker values
            isFullWidth={false}
            style={{
              alignSelf: "flex-end",
              paddingVertical: verticalScale(7),
              paddingHorizontal: horizontalScale(22),
              borderRadius: verticalScale(10),
            }}
          />
        </View>
      </View>
    ) : (
      <View style={{ flex: 1, gap: verticalScale(10) }}>
        {/* <View
          style={{ width: wp(100), paddingHorizontal: horizontalScale(10) }}
        >
          <FlatList
            horizontal
            data={muscleData}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(5),
                }}
              >
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: COLORS.whiteTail,
                  }}
                />
                <View
                  style={{
                    gap: verticalScale(5),
                    alignItems: "flex-start",
                  }}
                >
                  <CustomText fontFamily="medium">{item.name}</CustomText>
                  <View
                    style={{
                      backgroundColor: COLORS.nickel,
                      paddingVertical: verticalScale(4),
                      paddingHorizontal: horizontalScale(20),
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <CustomText
                      color={COLORS.white}
                      fontFamily="medium"
                      fontSize={10}
                    >
                      {`${item.percentage}%`}
                    </CustomText>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.name + index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: horizontalScale(10),
              paddingHorizontal: horizontalScale(5),
            }}
          />
        </View> */}
        <View>
          <FlatList
            horizontal
            contentContainerStyle={{
              gap: horizontalScale(5),
              marginVertical: verticalScale(20),
              paddingHorizontal: horizontalScale(10),
            }}
            data={setsTabData}
            renderItem={({ item }) => {
              return (
                <Pressable
                  key={item.value}
                  onPress={() => setSetsTab(item.value)}
                  style={[
                    styles.setsTabButton,
                    {
                      backgroundColor:
                        setsTab === item?.value
                          ? COLORS.whiteTail
                          : "transparent",
                    },
                  ]}
                >
                  <CustomText
                    fontSize={12}
                    fontFamily="semiBold"
                    color={
                      setsTab === item?.value ? COLORS.black : COLORS.whiteTail
                    }
                  >
                    {item?.label}
                  </CustomText>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          {historySets && historySets?.length > 0 && (
            <View style={{ width: wp(100), flexDirection: "row" }}>
              <View
                style={{
                  width: wp(10),
                  alignItems: "flex-start",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: verticalScale(10),
                  width: wp(85),
                  justifyContent: "space-evenly",
                  marginBottom: verticalScale(5),
                }}
              >
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  style={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  Reps
                </CustomText>
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  style={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  Distance
                </CustomText>
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  style={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  Weight(kg)
                </CustomText>
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  style={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  Time
                </CustomText>
              </View>
            </View>
          )}
          <FlatList
            data={
              historySets!?.map((set, index) => ({
                Set: index + 1,
                Reps: set.reps,
                Distance:
                  set.distance || (set.reps.includes("m") ? set.reps : "123m"), // Use distance field if available, otherwise fallback to reps if it contains 'm', otherwise use default
                Weight: set.weight,
                Time:
                  index < addedSets.length
                    ? formatTimeForDisplay(set.time)
                    : set.time, // Format time as MM:SS for newly added sets, keep original format for historical sets
                difficulty:
                  set.difficulty ||
                  (index === 0
                    ? "Warmup"
                    : index === 1
                    ? "Easy"
                    : index === 2
                    ? "Medium"
                    : "Hard"), // Add default difficulty if not present
                isNewlyAdded: index < addedSets.length, // Mark if this is a newly added set
                dropSets: set.dropSets?.map((dropSet) => ({
                  ...dropSet,
                  time: formatTimeForDisplay(dropSet.time), // Format drop set time as MM:SS
                })),
              })) ?? []
            }
            renderItem={({ item }) => {
              // Define colors based on difficulty
              const difficultyColors = {
                Warmup: "#6C757D", // Gray
                Easy: "#28A745", // Green
                Medium: "#FFC107", // Yellow
                Hard: "#DC3545", // Red
              };

              // Use difficulty color or fallback to index-based color
              const setColor =
                difficultyColors[
                  item.difficulty as keyof typeof difficultyColors
                ];

              // Determine text color based on whether it's newly added
              const textColor = item.isNewlyAdded
                ? COLORS.white
                : COLORS.nickel;

              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: wp(100),
                  }}
                >
                  <View
                    style={{
                      width: wp(10),
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: setColor,
                        borderTopEndRadius: 5,
                        borderBottomEndRadius: 5,
                        paddingHorizontal: horizontalScale(5),
                        paddingVertical: verticalScale(5),
                        width: horizontalScale(25),
                        height:
                          verticalScale(38) * (item.dropSets?.length! + 1),
                        justifyContent: "center",
                      }}
                    >
                      <CustomText
                        style={{
                          textAlign: "center",
                        }}
                        fontSize={20}
                        fontFamily="medium"
                        color={COLORS.white}
                      >
                        {item.Set}
                      </CustomText>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        width: wp(85),
                        flexDirection: "row",
                        gap: horizontalScale(10),
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        borderTopWidth: 0.5,
                        borderTopColor: COLORS.whiteTail,
                        paddingVertical: verticalScale(7),
                      }}
                    >
                      <CustomText
                        fontSize={20}
                        fontFamily="medium"
                        color={textColor}
                        style={{
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.Reps}
                      </CustomText>
                      <CustomText
                        fontSize={20}
                        fontFamily="medium"
                        color={textColor}
                        style={{
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.Distance}
                      </CustomText>
                      <CustomText
                        fontSize={20}
                        fontFamily="medium"
                        color={textColor}
                        style={{
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.Weight}
                      </CustomText>
                      <CustomText
                        fontSize={20}
                        fontFamily="medium"
                        color={textColor}
                        style={{
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        {item.Time}
                      </CustomText>
                    </View>
                    {item.dropSets &&
                      item.dropSets.map((dropSet, index) => (
                        <View
                          key={`dropset-${item.Set}-${index}`}
                          style={{
                            width: wp(85),
                            flexDirection: "row",
                            gap: horizontalScale(10),
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            borderTopWidth: 0.5,
                            borderTopColor: COLORS.whiteTail,
                            paddingVertical: verticalScale(7),
                          }}
                        >
                          <CustomText
                            fontSize={20}
                            fontFamily="medium"
                            color={textColor}
                            style={{
                              flex: 1,
                              textAlign: "center",
                            }}
                          >
                            {dropSet.reps}
                          </CustomText>
                          <CustomText
                            fontSize={20}
                            fontFamily="medium"
                            color={textColor}
                            style={{
                              flex: 1,
                              textAlign: "center",
                            }}
                          >
                            {dropSet.distance ||
                              (dropSet.reps.includes("m")
                                ? dropSet.reps
                                : "123m")}
                          </CustomText>
                          <CustomText
                            fontSize={20}
                            fontFamily="medium"
                            color={textColor}
                            style={{
                              flex: 1,
                              textAlign: "center",
                            }}
                          >
                            {dropSet.weight}
                          </CustomText>
                          <CustomText
                            fontSize={20}
                            fontFamily="medium"
                            color={textColor}
                            style={{
                              flex: 1,
                              textAlign: "center",
                            }}
                          >
                            {dropSet.time}
                          </CustomText>
                        </View>
                      ))}
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={({}) => {
              return (
                <View style={styles.noHistoryContainer}>
                  <CustomText
                    fontSize={16}
                    fontFamily="medium"
                    color={COLORS.whiteTail}
                    style={{ textAlign: "center" }}
                  >
                    No history found.{"\n"} Click "Add" to create a new set.
                  </CustomText>
                </View>
              );
            }}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    width: wp(100),
                    paddingHorizontal: horizontalScale(10),
                    gap: verticalScale(15),
                  }}
                >
                  {/* Add buttons */}
                  <View style={styles.addButtonsContainer}>
                    <PrimaryButton
                      title="Add"
                      onPress={() => {
                        setShowAddSetUi(true);
                      }}
                      isFullWidth={false}
                      style={{
                        alignSelf: "flex-end",
                        paddingVertical: verticalScale(3),
                        paddingHorizontal: horizontalScale(15),
                        borderRadius: verticalScale(5),
                      }}
                      backgroundColor="#FF9500"
                    />
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };

  const renderMainView = () => {
    switch (activeTab) {
      case 1:
        return renderSets();
      case 2:
        return renderDetailsTab();
      case 3:
        return renderHistory();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: verticalScale(10),
        gap: verticalScale(20),
      }}
    >
      <CustomText
        style={{ paddingHorizontal: horizontalScale(12) }}
        fontFamily="medium"
      >
        {exerciseData.name +
          " " +
          exerciseData.recommendedSets +
          "x" +
          exerciseData.recommendedReps}
      </CustomText>
      {!showAddSetUi && renderTabs()}
      {renderMainView()}
    </View>
  );
};

export default ExerciseDetails;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  tabButton: {
    justifyContent: "center",
    paddingHorizontal: horizontalScale(30),
    paddingVertical: verticalScale(5),
    borderRadius: 10,
  },
  setsTabButton: {
    justifyContent: "center",
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 100,
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(8),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(10),
  },
  tag: {
    backgroundColor: COLORS.brown,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(8),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.brown,
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
    paddingHorizontal: horizontalScale(20),
  },
  // New styles for the sets table
  setsHeaderRow: {
    flexDirection: "row",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    width: "100%",
  },
  setRow: {
    flexDirection: "row",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    alignItems: "center",
  },
  setNumberContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  setNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    lineHeight: 30,
  },
  setCellText: {
    flex: 1,
    textAlign: "center",
  },
  // Difficulty selector styles
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  difficultyButton: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: horizontalScale(70),
  },
  // Add buttons styles
  addButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: verticalScale(10),
  },
  addDropSetButton: {
    backgroundColor: "#007BFF",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: horizontalScale(10),
  },
  addSetButton: {
    backgroundColor: "#FF9500",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  skeletonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(10),
  },
  skeletonWrapper: {
    backgroundColor: COLORS.brown,
    padding: verticalScale(15),
    borderRadius: 20,
    width: wp(45),
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  skeletonHeader: {
    width: "100%",
    alignItems: "center",
    paddingVertical: verticalScale(5),
  },
  skeletonLabel: {
    marginBottom: verticalScale(10),
    fontFamily: "medium",
  },
  selectedMusclesContainer: {
    marginTop: verticalScale(20),
    padding: verticalScale(15),
    backgroundColor: COLORS.lightBrown,
    borderRadius: 10,
  },
});
