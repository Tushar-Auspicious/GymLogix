import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import PrimaryButton from "../../Components/PrimaryButton";
import TimerText from "../../Components/TimerText";
import { useAppSelector } from "../../Redux/store";
import { selectPlanById } from "../../Redux/slices/trainingPlansSlice";
import { Exercise } from "../../Seeds/ExerciseCatalog";
import { LogWorkoutProgramDetailsScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CoachCenterView from "./components/CoachCenterView";
import DetailsView from "./components/DetailsView";
import ExerciseDetails from "./components/ExerciseDetails";
import ExerciseView from "./components/ExerciseView";
import HistoryView from "./components/HistoryView";

// Define a type for a Superset
type Superset = {
  type: "superset";
  exercises: Exercise[];
};

// Union type to allow both individual exercises and supersets in the list
type ExerciseListItem = Exercise | Superset;

// Helper function to get exercise name
const getExerciseName = (exercise: Exercise): string => {
  return exercise.name;
};

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
  { label: "Exercises", value: 1 },
  { label: "History", value: 2 },
  { label: "Details", value: 3 },
  { label: "Coach’s Corner", value: 4 },
];

const workoutResultData = {
  overallSummary: {
    Duration: {
      current: "00:00:00",
      previous: "00:00:12",
    },
    Volume: {
      current: "5.3t",
      previous: "00:00:12", // Potential data issue in UI
    },
    Effort: {
      current: 13,
      previous: 1.4,
    },
    Distance: {
      current: 13,
      previous: 1.4,
    },
    Sets: {
      current: 13,
      previous: 1.4,
    },
    Reps: {
      current: 13,
      previous: 1.4,
    },
  },
  bestRecords: {
    Best_Total_Weight: {
      exerciseName: "Smith machine shrug",
      details: "3 Sets x 3 reps",
      weightAchieved: "120",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    Best_Reps: {
      exerciseName: "Smith machine shrug",
      details: "3 Sets x 3 reps",
      repsAchieved: "SomeRepCount",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  targetedMuscles: [],
};

const WorkoutProgramDetails: FC<LogWorkoutProgramDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { programId, day: routeDay } = route.params;

  // Get program details from Redux store
  const programDetails = useAppSelector((state) =>
    selectPlanById(state, programId)
  );

  // Get the current day data from Redux store instead of route params
  // This ensures we always have the latest data including newly added exercises
  const currentDayData = useMemo(() => {
    if (!programDetails || !routeDay || routeDay.length === 0) return routeDay;

    // Find the matching day in the Redux store based on the day name from route
    const routeDayName = routeDay[0]?.day;
    const updatedDay = programDetails.weeklyStructure.find(
      (dayStructure) => dayStructure.day === routeDayName
    );

    // Return the updated day data from Redux, or fallback to route data
    return updatedDay ? [updatedDay] : routeDay;
  }, [programDetails, routeDay]);

  // Use the live Redux data instead of static route data
  const day = currentDayData;

  const [activeTab, setActiveTab] = useState(1);
  const [isSupersetSelected, setIsSupersetSelected] = useState(false);

  // Moved state from ExerciseView to parent
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseListItem[]>([]);

  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExerciseDetails, setSelectedExerciseDetails] =
    useState<any>(null);

  const [showAddSetUi, setShowAddSetUi] = useState(false);

  // Moved exerciseList calculation to parent
  const exerciseList = useMemo(() => {
    const list: Exercise[] = [];
    day.map((day) => day.exercises.map((e) => list.push(e)));
    return list;
  }, [day]);

  // Initialize exerciseData when exerciseList changes
  useEffect(() => {
    setExerciseData(exerciseList || []);
  }, [exerciseList]);

  // Moved fadeAnim to parent since it's used in handleDeleteSelected
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Moved handlers to parent
  const handleExercisePress = (item: any) => {
    setShowExerciseDetail(true);
    setSelectedExerciseDetails(item);
  };

  const handleLongExercisePress = (title: string) => {
    setSelectedExercises((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedExercises.length === 0) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setExerciseData((prev) =>
        prev.filter((item) => {
          if (
            item &&
            typeof item === "object" &&
            "type" in item &&
            item.type === "superset"
          ) {
            return !(item as Superset).exercises.every((exercise) =>
              selectedExercises.includes(getExerciseName(exercise))
            );
          }
          return !selectedExercises.includes(getExerciseName(item as Exercise));
        })
      );
      setSelectedExercises([]);
      fadeAnim.setValue(1);
    });
  };

  const handleClickSuperSet = () => {
    if (selectedExercises.length <= 1) return;

    const selectedItems = exerciseData.filter((item) =>
      item &&
      typeof item === "object" &&
      "type" in item &&
      item.type === "superset"
        ? (item as Superset).exercises.some((exercise) =>
            selectedExercises.includes(getExerciseName(exercise))
          )
        : selectedExercises.includes(getExerciseName(item as Exercise))
    );

    const exercisesToGroup: Exercise[] = [];
    selectedItems.forEach((item) => {
      if (
        item &&
        typeof item === "object" &&
        "type" in item &&
        item.type === "superset"
      ) {
        exercisesToGroup.push(...(item as Superset).exercises);
      } else {
        exercisesToGroup.push(item as Exercise);
      }
    });

    const remainingItems = exerciseData.filter((item) =>
      item &&
      typeof item === "object" &&
      "type" in item &&
      item.type === "superset"
        ? !(item as Superset).exercises.every((exercise) =>
            selectedExercises.includes(getExerciseName(exercise))
          )
        : !selectedExercises.includes(getExerciseName(item as Exercise))
    );

    const newSuperset: Superset = {
      type: "superset",
      exercises: exercisesToGroup,
    };

    setExerciseData([newSuperset, ...remainingItems]);
    setSelectedExercises([]);
  };

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

  const renderMainView = () => {
    switch (activeTab) {
      case 1:
        return showExerciseDetail ? (
          <ExerciseDetails
            exerciseData={selectedExerciseDetails}
            showAddSetUi={showAddSetUi}
            setShowAddSetUi={setShowAddSetUi}
          />
        ) : (
          <ExerciseView
            data={day}
            isSupersetSelected={isSupersetSelected}
            onPressSuperset={() => setIsSupersetSelected(!isSupersetSelected)}
            selectedExercises={selectedExercises}
            exerciseData={exerciseData}
            setExerciseData={setExerciseData}
            handleExercisePress={handleExercisePress}
            handleLongExercisePress={handleLongExercisePress}
            handleDeleteSelected={handleDeleteSelected}
            handleClickSuperSet={handleClickSuperSet}
            fadeAnim={fadeAnim}
            programId={programId}
            currentDayIndex={0}
          />
        );
      case 2:
        return <HistoryView />;
      case 3:
        return <DetailsView />;
      case 4:
        return <CoachCenterView />;
      default:
        return null;
    }
  };

  const renderBottomSection = () => {
    return (
      <View style={{ alignItems: "center", gap: verticalScale(10) }}>
        {showExerciseDetail ? (
          showAddSetUi ? (
            <PrimaryButton
              title="FINISH EXERCISE"
              onPress={() => {
                setShowAddSetUi(false);
              }}
              backgroundColor={"#36DCC04D"}
            />
          ) : (
            <PrimaryButton
              title="FINISH EXERCISE"
              onPress={() => {
                setShowExerciseDetail(false);
              }}
              backgroundColor={COLORS.teal}
            />
          )
        ) : isSupersetSelected ? (
          <PrimaryButton
            title="FINISH SUPERSET"
            onPress={() => {
              setIsSupersetSelected(false);
            }}
            backgroundColor={COLORS.skyBlue}
          />
        ) : (
          <PrimaryButton
            title="FINISH WORKOUT"
            onPress={() => {
              navigation.navigate("workoutResult", {
                workoutData: workoutResultData,
              });
            }}
            backgroundColor={COLORS.crimson}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
            width: wp(90),
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: verticalScale(100),
              borderColor: COLORS.white,
              flex: 1,
              alignItems: "center",
              paddingVertical: verticalScale(5),
              justifyContent: "space-between",
              gap: verticalScale(10),
            }}
          >
            <CustomText fontFamily="bold">Workout</CustomText>
            <TimerText initialMinutes={43} />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: verticalScale(100),
              borderColor: COLORS.white,
              flex: 1,
              alignItems: "center",
              paddingVertical: verticalScale(5),
              justifyContent: "space-between",
              gap: verticalScale(10),
            }}
          >
            <CustomText fontFamily="bold">Exercise</CustomText>
            <CustomText fontSize={14}>43:00 | -00:59</CustomText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={{
            uri: showExerciseDetail
              ? selectedExerciseDetails.coverImage?.uri
              : programDetails?.coverImage,
          }}
          style={styles.coverImage}
          imageStyle={styles.coverImageStyle}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "#1F1A16"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.headerContainer}>
              <CustomIcon
                onPress={() => {
                  showAddSetUi
                    ? setShowAddSetUi(false)
                    : showExerciseDetail
                    ? setShowExerciseDetail(false)
                    : isSupersetSelected
                    ? setIsSupersetSelected(false)
                    : navigation.goBack();
                }}
                Icon={ICONS.BackArrow}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  gap: verticalScale(10),
                }}
              >
                {!showExerciseDetail && (
                  <CustomText fontFamily="bold">
                    {programDetails?.name}
                  </CustomText>
                )}
                {!showExerciseDetail && (
                  <>
                    <View style={styles.tagContainer}>
                      {programDetails?.tags.map(
                        (tag: string, index: number) => (
                          <CustomText
                            key={index}
                            style={styles.tag}
                            fontSize={10}
                            color={COLORS.whiteTail}
                          >
                            {tag}
                          </CustomText>
                        )
                      )}
                      <CustomText
                        style={styles.tag}
                        fontSize={10}
                        color={COLORS.whiteTail}
                      >
                        {day.length + " days"}
                      </CustomText>
                    </View>
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
        {!showExerciseDetail && renderTabs()}

        <View style={{ flex: 1, paddingBottom: verticalScale(10) }}>
          {renderMainView()}
        </View>
        {renderBottomSection()}
      </SafeAreaView>
    </View>
  );
};

export default WorkoutProgramDetails;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.darkBrown,
    flex: 1,
    paddingBottom: verticalScale(5),
  },
  safeArea: { flex: 1 },
  coverImage: {
    height: hp(13),
    justifyContent: "flex-end",
  },
  coverImageStyle: {
    borderRadius: 10,
    resizeMode: "cover",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: verticalScale(10),
    paddingTop: verticalScale(20),
    paddingHorizontal: verticalScale(10),
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
    paddingHorizontal: verticalScale(10),
  },
  tag: {
    backgroundColor: COLORS.brown,
    paddingVertical: verticalScale(3),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 5,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: verticalScale(20),
  },
  tabButton: {
    justifyContent: "center",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: 10,
  },
});
