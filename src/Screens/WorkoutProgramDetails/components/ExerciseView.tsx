import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import ICONS from '../../../Assets/Icons';
import CustomIcon from '../../../Components/CustomIcon';
import {CustomText} from '../../../Components/CustomText';
import PrimaryButton from '../../../Components/PrimaryButton';
import {selectAllExercises} from '../../../Redux/slices/exerciseCatalogSlice';
import {useAppDispatch, useAppSelector} from '../../../Redux/store';
import {Exercise} from '../../../Seeds/ExerciseCatalog';
import {WeeklyStructure} from '../../../Seeds/TrainingPLans';
import COLORS from '../../../Utilities/Colors';
import {horizontalScale, verticalScale, wp} from '../../../Utilities/Metrics';
import {reorderExercises} from '../../../Redux/slices/PlanDataSlice';
import IMAGES from '../../../Assets/Images';

// Define a type for a Superset
type Superset = {
  type: 'superset';
  exercises: Exercise[];
};

// Union type to allow both individual exercises and supersets in the list
type ExerciseListItem = Exercise | Superset;

// Type for muscle data with percentage
export type MuscleData = {
  name: string;
  percentage: number;
};

// Update the props to include the states and handlers passed from parent
type ExerciseData = {
  data: WeeklyStructure[];
  isSupersetSelected: boolean;
  onPressSuperset: () => void;
  selectedExercises: string[];
  exerciseData: ExerciseListItem[];
  setExerciseData: React.Dispatch<React.SetStateAction<ExerciseListItem[]>>;
  handleExercisePress: (title: string) => void;
  handleLongExercisePress: (item: any) => void;
  handleDeleteSelected: () => void;
  handleClickSuperSet: () => void;
  fadeAnim: Animated.Value;
  programId: string | number;
  currentDayIndex: number;
  dayData: any;
  completedExercises: string[];
  hideButton: boolean;
};

// Helper function to get exercise name
const getExerciseName = (exercise: Exercise): string => {
  return exercise.name;
};

// Helper function to get exercise image
const getExerciseImage = (exercise: Exercise): string => {
  return exercise.coverImage?.uri || exercise.images?.[0]?.uri || '';
};

// Helper function to get target muscles
const getTargetMuscles = (exercise: Exercise): string[] => {
  return exercise.targetMuscles || [];
};

// Helper function to get exercise sets (with default)
const getExerciseSets = (exercise: Exercise): number => {
  return exercise.recommendedSets || 3;
};

// Helper function to get exercise reps (with default)
const getExerciseReps = (exercise: Exercise): string => {
  return exercise.recommendedReps?.toString() || '10';
};

// Helper function to get exercise rest (with default)
const getExerciseRest = (exercise: Exercise): string => {
  return '60 seconds'; // Default rest time
};

// Helper function to get exercise weight (with default)
const getExerciseWeight = (exercise: Exercise): string => {
  return 'Bodyweight'; // Default weight
};

const ExerciseView: FC<ExerciseData> = ({
  data,
  isSupersetSelected,
  onPressSuperset,
  selectedExercises,
  exerciseData,
  setExerciseData,
  handleExercisePress,
  handleLongExercisePress,
  handleDeleteSelected,
  handleClickSuperSet,
  programId,
  currentDayIndex = 0,
  dayData,
  completedExercises,
  hideButton,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  // Calculate targeted muscles and their percentages based on superset or all exercises
  const prevExercisesRef = useRef<string[]>([]);
  const exercisesRef = useRef<any[]>([]);
  const allExercises = useAppSelector(selectAllExercises);
  const exercisesData = useAppSelector(state => state.exerciseData);

  const findExercises = useCallback(
    (dataArray: any[]) => {
      if (!Array.isArray(dataArray)) return [];
      const result: any[] = [];

      const exerciseList =
        Array.isArray(allExercises) && allExercises.length > 0
          ? allExercises
          : Array.isArray(exercisesData?.exerciseData)
          ? exercisesData.exerciseData
          : [];

      dataArray.forEach((dayItem: any) => {
        const exercise = exerciseList.find(
          ex => Number(ex.exercise_id ?? ex.id) === Number(dayItem.exercise_id),
        );

        if (exercise) {
          result.push({
            ...exercise,
            exerciseSettings: dayItem,
          });
        } else {
          result.push({
            name: '',
            description: '',
            images_urls: [],
            main_muscle: '',
            secondary_muscles: [],
            mechanics: '',
            difficulty: '',
            type: '',
            equipment: '',
            id: dayItem.exercise_id,
            exercise_id: dayItem.exercise_id,
            exerciseSettings: dayItem,
          });
        }
      });

      return result;
    },
    [allExercises, exercisesData],
  );

  const muscleData = useMemo(() => {
    const currentIds = exerciseData
      .map((ex: any) => ex.id || ex.exercise_id)
      .sort();
    const prevIds = prevExercisesRef.current;

    const muscleCount: {[key: string]: number} = {};
    let totalMuscleMentions = 0;

    if (isSupersetSelected) {
      const superset = exerciseData.find(
        item =>
          item &&
          typeof item === 'object' &&
          'type' in item &&
          item.type === 'superset',
      ) as Superset | undefined;
      if (superset) {
        superset.exercises.forEach(exercise => {
          exercise.targetMuscles?.forEach(muscle => {
            muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
            totalMuscleMentions++;
          });
        });
      }
    } else {
      exerciseData.forEach((item: any) => {
        if (
          item &&
          typeof item === 'object' &&
          'type' in item &&
          item.type === 'superset'
        ) {
          item.exercises.forEach((exercise: any) => {
            exercise.targetMuscles?.forEach((muscle: any) => {
              muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
              totalMuscleMentions++;
            });
          });
        } else {
          item.targetMuscles?.forEach((muscle: any) => {
            muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
            totalMuscleMentions++;
          });
        }
      });
      const computed = Object.keys(muscleCount)
        .map(muscle => ({
          name: muscle,
          percentage: totalMuscleMentions
            ? Math.round((muscleCount[muscle] / totalMuscleMentions) * 100)
            : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      // Cache both ids and computed data
      prevExercisesRef.current = currentIds;
      (prevExercisesRef as any).currentMuscleData = computed;
      return computed;
    }

    const muscles: MuscleData[] = Object.keys(muscleCount).map(muscle => ({
      name: muscle,
      percentage: totalMuscleMentions
        ? Math.round((muscleCount[muscle] / totalMuscleMentions) * 100)
        : 0,
    }));

    return muscles.sort((a, b) => b.percentage - a.percentage);
  }, [isSupersetSelected]);

  const normalizeMuscleKey = (name: string) => {
    return name
      .toLowerCase() // make all lowercase first
      .split(' ') // split on spaces
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      ) // capitalize subsequent words
      .join(''); // join without spaces
  };

  const MuscleImages: {[key: string]: any} = {
    adductors: IMAGES.adductors,
    back: IMAGES.back,
    biceps: IMAGES.biceps,
    calf: IMAGES.calf,
    forearms: IMAGES.foreArms,
    glutes: IMAGES.glutes,
    hamstrings: IMAGES.hamstrings,
    quads: IMAGES.quads,
    shoulders: IMAGES.shouder,
    traps: IMAGES.traps,
    tricpes: IMAGES.tricpes,
    twins: IMAGES.twins,
  };

  //  Memoize data & cache it in ref to prevent blinking
  const stableExercises = useMemo(
    () => findExercises(data),
    [data, findExercises],
  );

  exercisesRef.current = stableExercises;

  const planData = useAppSelector(state => state.planData.planData);

  const currentPlan = planData?.find(
    p => p.allData?.plan_id === Number(programId),
  );

  const currentWorkout = currentPlan?.allData?.content?.workouts?.find(
    w =>
      w.name === (dayData[currentDayIndex]?.name || `day-${currentDayIndex}`),
  );

  const exercises = currentWorkout?.exercises?.[0]?.workout_exercises || [];

  const renderExerciseList = () => {
    const renderItem = useCallback(
      ({item, drag, isActive}: RenderItemParams<any>) => {
        const alternateExerciseId = item.exerciseSettings?.alternateExercise;
        const alternateExercise: any = allExercises.find(
          exercise => exercise.id === alternateExerciseId,
        );

        const getExerciseImage = (exerciseData: any) => {
          if (!exerciseData)
            return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop';

          // 1️ Prefer images_urls
          if (
            Array.isArray(exerciseData.images_urls) &&
            exerciseData.images_urls.length > 0
          ) {
            return exerciseData.images_urls[0];
          }

          // 2️ Then check images (string or object with .uri)
          if (
            Array.isArray(exerciseData.images) &&
            exerciseData.images.length > 0
          ) {
            const firstImage = exerciseData.images[0];
            if (typeof firstImage === 'string') return firstImage;
            if (firstImage?.uri) return firstImage.uri;
          }

          // 3️ Default fallback
          return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop';
        };

        // -------------------- Superset Block --------------------
        if (
          item &&
          typeof item === 'object' &&
          'type' in item &&
          item.type === 'superset'
        ) {
          return (
            <ScaleDecorator>
              <TouchableOpacity
                onPress={() => {
                  if (!hideButton) {
                    onPressSuperset();
                  }
                }}
                activeOpacity={1}
                disabled={isActive}
                style={{
                  padding: verticalScale(4),
                  gap: verticalScale(5),
                  borderColor: COLORS.whiteTail,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: wp(95),
                  alignSelf: 'center',
                  backgroundColor: isActive ? COLORS.nickel : undefined,
                }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.brown,
                    paddingHorizontal: horizontalScale(10),
                    paddingVertical: verticalScale(2),
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <CustomText fontFamily="italic" fontSize={14}>
                    SUPERSET
                  </CustomText>

                  {/* Drag handle for superset */}
                  <TouchableOpacity onLongPress={drag} disabled={isActive}>
                    <CustomIcon
                      Icon={ICONS.SidMultiDotView}
                      height={verticalScale(27)}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '98%',
                    gap: verticalScale(5),
                    alignSelf: 'center',
                  }}>
                  {item.exercises.map((exercise: any, index: number) => {
                    const isSelected = (item as Superset).exercises.some(
                      exercise =>
                        selectedExercises.includes(
                          exercise.exercise_id ?? exercise.id,
                        ),
                    );
                    const isCompleted = completedExercises.includes(
                      getExerciseName(exercise),
                    );
                    return (
                      <View
                        key={exercise.exercise_id || exercise.id || index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          borderRadius: verticalScale(10),
                          backgroundColor: COLORS.lightBrown,
                          padding: verticalScale(5),
                        }}>
                        <Image
                          source={{
                            uri:
                              getExerciseImage(exercise) ||
                              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop',
                          }}
                          style={styles.ExerciseImage}
                        />
                        <View style={styles.ExerciseDetails}>
                          <CustomText
                            color={COLORS.yellow}
                            fontFamily="medium"
                            fontSize={12}>
                            {getExerciseName(exercise)}
                          </CustomText>
                          <CustomText
                            color={COLORS.white}
                            fontFamily="medium"
                            fontSize={12}>
                            {`${getExerciseSets(
                              exercise,
                            )} sets x ${getExerciseReps(exercise)} reps`}
                          </CustomText>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>
            </ScaleDecorator>
          );
        }

        // -------------------- Normal Exercise --------------------
        const isSelected = selectedExercises.includes(
          item.exercise_id ?? item.id,
        );
        const isCompleted = completedExercises.includes(item.id);
        const isAlternateSelected =
          alternateExercise && selectedExercises.includes(item.name);
        const isAlternateCompleted =
          alternateExercise && completedExercises.includes(item.name);

        return (
          <>
            <TouchableOpacity
              onPress={() => {
                handleExercisePress(item);
              }}
              onLongPress={
                !hideButton
                  ? () => {
                      const idToSelect = item.exercise_id || item.id;
                      handleLongExercisePress(idToSelect);
                    }
                  : undefined //  no long-press when hideButton is true
              }
              activeOpacity={0.9}
              style={[
                styles.ExerciseItem,
                {alignSelf: 'center'},
                isSelected && styles.selectedExerciseItem,
                isCompleted && styles.completedExerciseItem,
                isActive && {backgroundColor: COLORS.nickel},
              ]}>
              <Image
                source={{uri: getExerciseImage(item)}}
                style={styles.ExerciseImage}
              />

              <View style={styles.ExerciseDetails}>
                <CustomText
                  color={COLORS.yellow}
                  fontFamily="medium"
                  fontSize={12}>
                  {item.name}
                </CustomText>
                <CustomText
                  color={COLORS.white}
                  fontFamily="medium"
                  fontSize={12}>
                  {`${item.exerciseSettings.sets} Sets x ${item.exerciseSettings.reps}`}
                </CustomText>
              </View>

              {/* Right side actions */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: horizontalScale(8),
                }}>
                {/* Delete/Copy */}

                {/* Drag handle */}
                <TouchableOpacity
                  disabled={isActive}
                  activeOpacity={0.8}
                  onLongPress={drag}>
                  <CustomIcon
                    Icon={ICONS.SidMultiDotView}
                    height={verticalScale(27)}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Alternate Exercise */}
            {alternateExercise && (
              <View style={{marginVertical: verticalScale(5)}}>
                <CustomText
                  fontFamily="italic"
                  fontSize={14}
                  color={COLORS.whiteTail}
                  style={{marginVertical: horizontalScale(5)}}>
                  Alternate
                </CustomText>

                <View style={{width: '100%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!hideButton) {
                        handleExercisePress(alternateExercise);
                      }
                    }}
                    activeOpacity={0.7}
                    style={[
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderWidth: 1,
                        borderRadius: verticalScale(10),
                        borderColor: COLORS.whiteTail,
                        backgroundColor: COLORS.lightBrown,
                        width: wp(90),
                        padding: verticalScale(5),
                        alignSelf: 'flex-end',
                      },
                      isAlternateSelected && styles.selectedExerciseItem,
                    ]}>
                    <Image
                      source={{uri: getExerciseImage(alternateExercise)}}
                      style={styles.ExerciseImage}
                    />
                    <View style={styles.ExerciseDetails}>
                      <CustomText
                        color={COLORS.yellow}
                        fontFamily="medium"
                        fontSize={12}>
                        {getExerciseName(alternateExercise)}
                      </CustomText>
                      <CustomText
                        color={COLORS.white}
                        fontFamily="medium"
                        fontSize={12}>
                        {`${getExerciseSets(
                          alternateExercise,
                        )} sets x ${getExerciseReps(alternateExercise)} reps`}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        );
      },
      [
        selectedExercises,
        completedExercises,
        hideButton,
        allExercises,
        handleExercisePress,
        handleLongExercisePress,
        onPressSuperset,
      ],
    );

    return (
      <View style={{width: '100%', flex: 1}}>
        <DraggableFlatList
          data={findExercises(exercises) as any}
          bounces={false}
          onDragEnd={({data: newData}) => {
            exercisesRef.current = newData;
            // derive identifiers from props/context
            const currentDay = dayData[currentDayIndex];
            const dayId = currentDay?.name || `day-${currentDayIndex}`;
            const planId = Number(programId);
            const groupIndex = 0; // adjust if needed

            // map reordered data into clean payload
            const mappedOrder = newData.map(item => ({
              exercise_id:
                item?.exerciseSettings?.exercise_id ??
                item?.exercise_id ??
                item?.id ??
                item?.exercise?.id ??
                null,
              sets: item?.exerciseSettings?.sets,
              reps: item?.exerciseSettings?.reps,
              timing_warmup: item?.exerciseSettings?.timing_warmup,
              timing_workset: item?.exerciseSettings?.timing_workset,
              timing_finish: item?.exerciseSettings?.timing_finish,
              Is_time: item?.exerciseSettings?.Is_time,
              is_weight: item?.exerciseSettings?.is_weight,
              Is_distance: item?.exerciseSettings?.Is_distance,
              alternate_exercise_id:
                item?.exerciseSettings?.alternate_exercise_id || [],
            }));

            // persist reordered data to Redux
            dispatch(
              reorderExercises({
                planId,
                dayId,
                groupIndex,
                newOrder: mappedOrder,
              }),
            );

            setTimeout(() => {
              setExerciseData(newData);
            }, 150);
          }}
          keyExtractor={(item: any, index) => {
            if (item.type === 'superset') {
              return `superset-${item.exercises
                .map((e: any) => e.exercise_id || e.id)
                .join('-')}-`;
            }
            return item.exercise_id || item.id || `fallback-${index}`;
          }}
          renderItem={renderItem}
          style={{width: '100%'}}
          contentContainerStyle={{
            gap: verticalScale(10),
            paddingHorizontal: horizontalScale(10),
          }}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          ListFooterComponent={() =>
            !hideButton ? (
              <View
                style={{alignItems: 'flex-end', marginTop: verticalScale(10)}}>
                <PrimaryButton
                  onPress={() => {
                    const currentDay = dayData[currentDayIndex];
                    const dayId = currentDay?.name || `day-${currentDayIndex}`;
                    const exerciseIds = findExercises(exercises).map(
                      ex => ex.id,
                    );

                    navigation.navigate('exerciseList', {
                      fromTrainingPlan: programId
                        ? {
                            programId,
                            dayIndex: currentDayIndex,
                            dayId,
                            exerciseIds,
                          }
                        : undefined,
                    });
                  }}
                  isFullWidth={false}
                  style={{
                    width: 'auto',
                    paddingVertical: verticalScale(8),
                    paddingHorizontal: horizontalScale(12),
                    borderRadius: verticalScale(5),
                  }}
                  textSize={10}
                  title="Add Exercise"
                />
              </View>
            ) : null
          }
        />
      </View>
    );
  };

  const renderSupersetDetails = () => {
    const superset = exerciseData.find(
      item =>
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'superset',
    ) as Superset | undefined;

    if (!superset) return null;

    const warmUpTimeSeconds = 180; // 3 minutes static warm-up
    const coolDownTimeSeconds = 180; // 3 minutes static cool-down
    let workingTimeSeconds = 0;

    const timePerRep = 3; // 3 seconds per rep (controlled lifting)

    superset.exercises.forEach(exercise => {
      const repsRange = getExerciseReps(exercise).split('-');
      const reps =
        repsRange.length > 1
          ? Math.round((parseInt(repsRange[0]) + parseInt(repsRange[1])) / 2)
          : parseInt(repsRange[0]) || 0;

      const restSeconds =
        parseInt(getExerciseRest(exercise).replace(/\D/g, '')) || 60;

      const exerciseTime =
        getExerciseSets(exercise) * reps * timePerRep +
        restSeconds * (getExerciseSets(exercise) - 1);

      workingTimeSeconds += exerciseTime;
    });

    const fullCompletionTimeSeconds =
      warmUpTimeSeconds + workingTimeSeconds + coolDownTimeSeconds;

    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    };

    return (
      <View
        style={{
          gap: verticalScale(10),
          width: wp(95),
          flex: 1,
        }}>
        <View
          style={{
            padding: verticalScale(4),
            gap: verticalScale(20),
            borderRadius: 10,
          }}>
          <CustomText fontFamily="bold" fontSize={14}>
            Superset
          </CustomText>
          <View
            style={{
              width: '98%',
              gap: verticalScale(5),
              alignSelf: 'center',
            }}>
            {superset.exercises.map((exercise, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderRadius: verticalScale(10),
                  backgroundColor: COLORS.lightBrown,
                  padding: verticalScale(5),
                  borderWidth: 1,
                  borderColor: COLORS.white,
                }}>
                <Image
                  source={{
                    uri:
                      getExerciseImage(exercise) ||
                      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  }}
                  style={styles.ExerciseImage}
                />
                <View style={styles.ExerciseDetails}>
                  <CustomText
                    color={COLORS.yellow}
                    fontFamily="medium"
                    fontSize={12}>
                    {getExerciseName(exercise)}
                  </CustomText>
                  <CustomText
                    color={COLORS.white}
                    fontFamily="medium"
                    fontSize={12}>
                    {`${getExerciseSets(exercise)} sets x ${getExerciseReps(
                      exercise,
                    )} reps`}
                  </CustomText>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <CustomIcon
                    Icon={ICONS.SidMultiDotView}
                    height={verticalScale(27)}
                  />
                </View>
              </View>
            ))}
          </View>
          <CustomText fontFamily="bold" fontSize={14}>
            Rest Time
          </CustomText>
          <View style={{gap: verticalScale(10)}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <CustomText fontSize={14}>Warm-up Time</CustomText>
              <CustomText fontSize={14}>
                {formatTime(warmUpTimeSeconds)}
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <CustomText fontSize={14}>Working Time</CustomText>
              <CustomText fontSize={14}>
                {formatTime(workingTimeSeconds)}
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <CustomText fontSize={14}>Full Completion Time</CustomText>
              <CustomText fontSize={14}>
                {formatTime(fullCompletionTimeSeconds)}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        gap: verticalScale(10),
        alignItems: 'center',
        flex: 1,
      }}>
      {isSupersetSelected ? (
        <ScrollView
          style={{
            width: wp(100),
            paddingHorizontal: horizontalScale(10),
            flex: 1,
          }}>
          <FlatList
            horizontal
            data={muscleData}
            renderItem={({item}) => {
              const normalizedKey = normalizeMuscleKey(item.name);
              const imageSource = MuscleImages[normalizedKey] || {
                uri: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              };
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: horizontalScale(5),
                    borderRadius: verticalScale(10),
                    padding: verticalScale(5),
                  }}>
                  <Image
                    source={imageSource}
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
                      alignItems: 'flex-start',
                    }}>
                    <CustomText fontFamily="medium">{item.name}</CustomText>
                    <View
                      style={{
                        backgroundColor: COLORS.nickel,
                        paddingVertical: verticalScale(4),
                        paddingHorizontal: horizontalScale(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                      }}>
                      <CustomText
                        color={COLORS.white}
                        fontFamily="medium"
                        fontSize={10}>
                        {`${item.percentage}%`}
                      </CustomText>
                    </View>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => item.name + index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: horizontalScale(10),
              paddingHorizontal: horizontalScale(5),
              marginVertical: verticalScale(20),
            }}
          />
          <View style={{flex: 1}}>{renderSupersetDetails()}</View>
        </ScrollView>
      ) : (
        <>
          {selectedExercises.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: wp(100),
                paddingHorizontal: horizontalScale(10),
                paddingBottom: verticalScale(10),
              }}>
              <View style={{flexDirection: 'row', gap: horizontalScale(20)}}>
                <TouchableOpacity
                  onPress={handleDeleteSelected}
                  style={styles.actionButton}>
                  <CustomIcon Icon={ICONS.DeleteIcon} height={15} width={15} />
                  <CustomText fontSize={6} fontFamily="bold">
                    DELETE
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <CustomIcon Icon={ICONS.CopyIcon} height={15} width={15} />
                  <CustomText fontSize={6} fontFamily="bold">
                    COPY
                  </CustomText>
                </TouchableOpacity>
              </View>
              {selectedExercises.length > 1 && (
                <TouchableOpacity
                  onPress={handleClickSuperSet}
                  style={styles.actionButton}>
                  <CustomIcon
                    Icon={ICONS.SuperSetIcon}
                    height={15}
                    width={15}
                  />
                  <CustomText fontSize={6} fontFamily="bold">
                    SUPERSET
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View
              style={{width: wp(100), paddingHorizontal: horizontalScale(10)}}>
              <FlatList
                horizontal
                data={muscleData}
                renderItem={({item}) => {
                  const normalizedKey = normalizeMuscleKey(item.name);
                  const imageSource = MuscleImages[normalizedKey] || {
                    uri: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  };
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: horizontalScale(5),
                      }}>
                      <Image
                        source={imageSource}
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
                          alignItems: 'flex-start',
                        }}>
                        <CustomText fontFamily="medium">{item.name}</CustomText>
                        <View
                          style={{
                            backgroundColor: COLORS.nickel,
                            paddingVertical: verticalScale(4),
                            paddingHorizontal: horizontalScale(20),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                          }}>
                          <CustomText
                            color={COLORS.white}
                            fontFamily="medium"
                            fontSize={10}>
                            {`${item.percentage}%`}
                          </CustomText>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => item.name + index.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: horizontalScale(10),
                  paddingHorizontal: horizontalScale(5),
                }}
              />
            </View>
          )}
          {renderExerciseList()}
        </>
      )}
    </View>
  );
};

export default ExerciseView;

const styles = StyleSheet.create({
  ExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: verticalScale(10),
    borderColor: COLORS.whiteTail,
    backgroundColor: COLORS.lightBrown,
    width: wp(95),
    padding: verticalScale(5),
  },
  completedExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: verticalScale(10),
    borderColor: COLORS.whiteTail,
    backgroundColor: COLORS.black,
    width: wp(95),
    padding: verticalScale(5),
  },

  selectedExerciseItem: {
    backgroundColor: COLORS.skinColor,
  },
  ExerciseImage: {
    height: '100%',
    minHeight: 71,
    width: 66,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  ExerciseDetails: {
    paddingHorizontal: horizontalScale(10),
    justifyContent: 'flex-start',
    gap: verticalScale(5),
    paddingVertical: verticalScale(4),
    flex: 1,
  },
  TargetMusclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(5),
  },
  TargetMuscleItem: {
    backgroundColor: COLORS.brown,
    borderRadius: 5,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
  },
  actionButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.whiteTail,
    borderRadius: 100,
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
});
