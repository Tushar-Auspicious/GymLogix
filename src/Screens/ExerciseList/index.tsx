import React, { FC, memo, useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import PrimaryButton from "../../Components/PrimaryButton";
import { useAppSelector, useAppDispatch } from "../../Redux/store";
import {
  selectExercisesByCategory,
  selectAllExercises,
} from "../../Redux/slices/exerciseCatalogSlice";
import { addExercisesToDay } from "../../Redux/slices/trainingPlansSlice";
import { Exercise } from "../../Seeds/ExerciseCatalog";
import { ExerciseListScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const tabData = [
  { label: "Category", value: 1 },
  { label: "History", value: 2 },
  { label: "List", value: 3 },
];

const ExerciseList: FC<ExerciseListScreenProps> = ({ navigation, route }) => {
  // Get exercises from Redux store
  const exerciseCategories = useAppSelector(selectExercisesByCategory);
  const allExercises = useAppSelector(selectAllExercises);
  const dispatch = useAppDispatch();

  // Get training plan context from route params
  const fromTrainingPlan = route.params?.fromTrainingPlan;

  const [searchedWord, setSearchedWord] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState(
    exerciseCategories.map((item) => item.bodyPart)
  );
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Generate random exercises only once when component mounts
  const [historyExercises] = useState(() => allExercises.slice(0, 10));

  const [listExercises] = useState(() => allExercises.slice(10, 20));

  // Toggle exercise selection in the single state
  const toggleExerciseSelection = useCallback((exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  }, []);

  // Handle adding exercises to training plan
  const handleAddExercisesToTrainingPlan = useCallback(() => {
    if (!fromTrainingPlan) {
      Alert.alert("Error", "No training plan context found");
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert("No Selection", "Please select at least one exercise to add");
      return;
    }

    const selectedExerciseObjects = allExercises.filter((exercise) =>
      selectedExercises.includes(exercise.id)
    );

    dispatch(
      addExercisesToDay({
        planId: fromTrainingPlan.programId,
        dayId: fromTrainingPlan.dayId,
        exercises: selectedExerciseObjects,
      })
    );

    setSelectedExercises([]);
    navigation.goBack();
  }, [fromTrainingPlan, selectedExercises, allExercises, dispatch, navigation]);

  const toggleCategory = useCallback((bodyPart: string) => {
    setExpandedCategories((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((category) => category !== bodyPart)
        : [...prev, bodyPart]
    );
  }, []);

  const ExerciseItem = memo(({ exercise }: { exercise: Exercise }) => {
    const isSelected = selectedExercises.includes(exercise.id);
    return (
      <View style={styles.exerciseItem}>
        <Image
          source={{
            uri: exercise.coverImage?.uri,
          }}
          style={styles.exerciseImage}
        />
        <View style={styles.exerciseContent}>
          <View style={styles.exerciseHeader}>
            <CustomText color={COLORS.yellow} fontFamily="medium" fontSize={12}>
              {exercise.name}
            </CustomText>
            {isSelected ? (
              <View style={styles.selectedActions}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("exerciseSettings", {
                      exerciseId: exercise.id,
                    });
                  }}
                  style={[styles.actionButton, styles.selectedButton]}
                >
                  <CustomIcon
                    Icon={ICONS.smallSettingIcon}
                    height={18}
                    width={18}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleExerciseSelection(exercise.id)}
                  style={[styles.actionButton, styles.selectedButton]}
                >
                  <CustomText>V</CustomText>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => toggleExerciseSelection(exercise.id)}
                style={styles.actionButton}
              >
                <CustomIcon Icon={ICONS.PlusIcon} height={12} width={12} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tagsContainer}>
            {[
              exercise.equipment,
              exercise.type,
              exercise.force,
              exercise.location,
            ].map((tag, idx) => (
              <CustomText
                key={`${exercise.id}-${idx}`}
                style={styles.tag}
                fontSize={10}
                color={COLORS.whiteTail}
              >
                {tag}
              </CustomText>
            ))}
          </View>
        </View>
      </View>
    );
  });

  const CategoryItem = memo(({ item }: { item: any }) => {
    const isExpanded = expandedCategories.includes(item.bodyPart);
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Pressable
            onPress={() => toggleCategory(item.bodyPart)}
            style={styles.categoryPressable}
          >
            <CustomIcon Icon={ICONS.ArrowDownIcon} height={7} width={18} />
            <CustomText color={COLORS.whiteTail} fontFamily="medium">
              {item.bodyPart}
            </CustomText>
          </Pressable>
          <View style={styles.categoryInfo}>
            <CustomText>{item.exercises.length}</CustomText>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
              }}
              style={styles.categoryImage}
            />
          </View>
        </View>
        {isExpanded && (
          <FlatList
            data={item.exercises}
            keyExtractor={(exercise) => exercise.name}
            renderItem={({ item: exercise }) => (
              <ExerciseItem exercise={exercise} />
            )}
          />
        )}
      </View>
    );
  });

  const renderTabs = useCallback(
    () => (
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
    ),
    [activeTab]
  );

  const renderMainView = useCallback(() => {
    switch (activeTab) {
      case 1:
        return (
          <FlatList
            data={exerciseCategories}
            keyExtractor={(item) => item.bodyPart}
            renderItem={({ item }) => <CategoryItem item={item} />}
            contentContainerStyle={styles.mainListContent}
          />
        );
      case 2:
        return (
          <FlatList
            data={historyExercises}
            keyExtractor={(exercise) => exercise.id}
            renderItem={({ item: exercise }) => (
              <ExerciseItem exercise={exercise} />
            )}
            contentContainerStyle={styles.listContent}
          />
        );
      case 3:
        return (
          <FlatList
            data={listExercises}
            keyExtractor={(exercise) => exercise.id}
            renderItem={({ item: exercise }) => (
              <ExerciseItem exercise={exercise} />
            )}
            contentContainerStyle={styles.listContent}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    expandedCategories,
    selectedExercises,
    historyExercises,
    listExercises,
    exerciseCategories,
  ]);

  return (
    <View style={styles.main}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <CustomIcon
            onPress={() => {
              navigation.goBack();
            }}
            Icon={ICONS.BackArrow}
          />
          <View style={styles.searchContainer}>
            <CustomIcon Icon={ICONS.searchIcon} height={25} width={25} />
            <TextInput
              value={searchedWord}
              onChangeText={setSearchedWord}
              placeholder="Search for an exercise"
              placeholderTextColor={COLORS.nickel}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("addNewExercise");
            }}
            style={styles.newButton}
          >
            <View style={styles.newIconContainer}>
              <CustomIcon Icon={ICONS.PlusIcon} height={26} width={26} />
            </View>
            <CustomText
              style={{ position: "absolute", bottom: verticalScale(-22) }}
            >
              New
            </CustomText>
          </TouchableOpacity>
        </View>
        {renderTabs()}
        {fromTrainingPlan && (
          <View style={styles.trainingPlanContext}>
            <CustomIcon Icon={ICONS.WorkoutIcon} height={16} width={16} />
            <CustomText color={COLORS.yellow} fontFamily="medium" fontSize={14}>
              Adding exercises to {fromTrainingPlan.dayId}
            </CustomText>
          </View>
        )}
        {selectedExercises.length > 0 && (
          <CustomText
            color={COLORS.nickel}
            fontFamily="italic"
            style={styles.selectedText}
          >
            {selectedExercises.length} Exercises selected
          </CustomText>
        )}
        {renderMainView()}
        <PrimaryButton
          title={fromTrainingPlan ? "Add to Training Plan" : "Add Exercises"}
          onPress={
            fromTrainingPlan
              ? handleAddExercisesToTrainingPlan
              : () => {
                  Alert.alert(
                    "Info",
                    "Exercise selection functionality will be implemented here"
                  );
                }
          }
          disabled={selectedExercises.length === 0}
        />
      </SafeAreaView>
    </View>
  );
};

export default ExerciseList;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.darkBrown,
    flex: 1,
    paddingBottom: verticalScale(5),
  },
  safeArea: { flex: 1, gap: verticalScale(10) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    width: wp(100),
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 100,
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(5),
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    flex: 0.85,
  },
  searchInput: { width: "100%", color: COLORS.white },
  newButton: { alignItems: "center", gap: verticalScale(5) },
  newIconContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 100,
    padding: verticalScale(10),
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: horizontalScale(15),
  },
  tabButton: {
    justifyContent: "center",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  selectedText: { paddingHorizontal: horizontalScale(15) },
  trainingPlanContext: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(8),
    backgroundColor: COLORS.brown,
    marginHorizontal: horizontalScale(15),
    borderRadius: verticalScale(8),
  },
  mainListContent: {
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(20),
  },
  listContent: {
    paddingHorizontal: horizontalScale(15),
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: verticalScale(10),
    backgroundColor: COLORS.lightBrown,
    padding: verticalScale(5),
    borderWidth: 1,
    borderColor: COLORS.white,
    gap: horizontalScale(10),
    marginVertical: verticalScale(5),
  },
  exerciseImage: {
    height: "100%",
    minHeight: 71,
    width: 66,
    borderRadius: 10,
    resizeMode: "cover",
  },
  exerciseContent: {
    flex: 1,
    justifyContent: "center",
    gap: verticalScale(15),
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingRight: horizontalScale(20),
  },
  selectedActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  actionButton: {
    borderWidth: 1,
    borderColor: COLORS.whiteTail,
    borderRadius: 100,
    height: verticalScale(28),
    width: verticalScale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: COLORS.yellow,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
  },
  tag: {
    backgroundColor: "#403633",
    paddingHorizontal: horizontalScale(5),
  },
  categoryContainer: { gap: verticalScale(10) },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  categoryImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.whiteTail,
  },
});
