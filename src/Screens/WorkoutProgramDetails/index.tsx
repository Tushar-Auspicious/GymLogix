import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import ICONS from '../../Assets/Icons';
import CustomIcon from '../../Components/CustomIcon';
import {CustomText} from '../../Components/CustomText';
import PrimaryButton from '../../Components/PrimaryButton';
import TimerText from '../../Components/TimerText';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {selectPlanById} from '../../Redux/slices/trainingPlansSlice';
import {Exercise} from '../../Seeds/ExerciseCatalog';
import {LogWorkoutProgramDetailsScreenProps} from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {horizontalScale, hp, verticalScale, wp} from '../../Utilities/Metrics';
import CoachCenterView from './components/CoachCenterView';
import DetailsView from './components/DetailsView';
import ExerciseDetails, {ExtendedSetDetail} from './components/ExerciseDetails';
import ExerciseView from './components/ExerciseView';
import HistoryView from './components/HistoryView';
import {fetchData, postData} from '../../APIServices/api';
import ENDPOINTS from '../../APIServices/endPoints';
import {ScheduleResponse} from '../../Typings/ApiResponse/ScheduleResponse';
import {addSchedule} from '../../Redux/slices/ScheduleSlice';
import {
  clearDraftWorkout,
  resetWorkout,
  setDraftWorkout,
  setWorkoutProgress,
  setWorkoutTime,
} from '../../Redux/slices/LogWorkoutSlice';
import {workoutTimer} from '../../Components/WorkoutTimer';
import Toast from 'react-native-toast-message';

// Define a type for a Superset
type Superset = {
  type: 'superset';
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
  return exercise.coverImage?.uri || exercise.images?.[0]?.uri || '';
};

// Helper function to get target muscles
const getTargetMuscles = (exercise: Exercise): string[] => {
  return exercise.targetMuscles || [];
};

// Helper function to get exercise instruction
const getExerciseInstruction = (exercise: Exercise): string => {
  return exercise.instruction || '';
};

// Helper function to get exercise description
const getExerciseDescription = (exercise: Exercise): string => {
  return exercise.description || '';
};

const tabData = [
  {label: 'Exercises', value: 1},
  {label: 'History', value: 2},
  {label: 'Details', value: 3},
  {label: 'Coach’s Corner', value: 4},
];

// const workoutResultData = {
//   overallSummary: {
//     Duration: {
//       current: '00:00:00',
//       previous: '00:00:12',
//     },
//     Volume: {
//       current: '5.3t',
//       previous: '00:00:12', // Potential data issue in UI
//     },
//     Effort: {
//       current: 13,
//       previous: 1.4,
//     },
//     Distance: {
//       current: 13,
//       previous: 1.4,
//     },
//     Sets: {
//       current: 13,
//       previous: 1.4,
//     },
//     Reps: {
//       current: 13,
//       previous: 1.4,
//     },
//   },
//   bestRecords: {
//     Best_Total_Weight: {
//       exerciseName: 'Smith machine shrug',
//       details: '3 Sets x 3 reps',
//       weightAchieved: '120',
//       image:
//         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     },
//     Best_Reps: {
//       exerciseName: 'Smith machine shrug',
//       details: '3 Sets x 3 reps',
//       repsAchieved: 'SomeRepCount',
//       image:
//         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     },
//   },
//   targetedMuscles: [],
// };

type ExerciseTime = {
  exerciseId: string;
  timeInSeconds: number;
};

const WorkoutProgramDetails: FC<LogWorkoutProgramDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const {programId, day: routeDay, selectedProgram} = route.params;
  // Moved state from ExerciseView to parent
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseListItem[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [isSupersetSelected, setIsSupersetSelected] = useState(false);
  const exercisesData = useAppSelector(state => state.exerciseData);
  const {planData} = useAppSelector(state => state.planData);
  const {userData} = useAppSelector(state => state.userData);
  const {scheduleData} = useAppSelector(state => state.scheduleData);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExerciseDetails, setSelectedExerciseDetails] =
    useState<any>(null);
  const [showAddSetUi, setShowAddSetUi] = useState(false);
  const [exerciseLog, setExerciseLog] = useState<any>([]);
  const [scheduleMap, setScheduleMap] = useState<{[key: string]: string}>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  // Access isFinish from Redux
  const isFinish = useAppSelector(state => state.workoutData.isFinish);

  const [exerciseTimeInSeconds, setExerciseTimeInSeconds] = useState<
    ExerciseTime[]
  >([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [exerciseWithSetData, setexerciseWithSetData] = useState<
    | {
        exerciseId: string;
        setsData: ExtendedSetDetail[];
        isDropSet: boolean;
        logTime: any;
      }[]
    | null
  >(null);

  const {draftWorkout, workoutTime} = useAppSelector(
    state => state.logWorkoutData,
  );

  const programDetails = planData
    ?.filter(it => it.type === 'workout')
    .find(item => item.allData?.plan_id === programId);

  // Get program details from Redux store
  // const programDetails = useAppSelector(state =>
  //   selectPlanById(state, programId),
  // );

  // Get the current day data from Redux store instead of route params
  // This ensures we always have the latest data including newly added exercises
  const currentDayData = useMemo(() => {
    if (!programDetails || !routeDay || routeDay.length === 0) return routeDay;

    // Find the matching day in the Redux store based on the day name from route
    const routeDayName = routeDay[0]?.day;

    const updatedDay = programDetails.allData?.content.workouts?.find(
      workout => workout.name === routeDayName,
    );

    // Return the updated day data from Redux, or fallback to route data
    return updatedDay ? [updatedDay] : routeDay;
  }, [programDetails, routeDay]);

  // Use the live Redux data instead of static route data
  const day = currentDayData;

  console.log('dayyyy', day[0]);

  // // Start timer on mount

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     setElapsedSeconds(prev => {
  //       const next = prev + 1;
  //       dispatch(setWorkoutTime(next)); // number only
  //       return next;
  //     });
  //   }, 1000);
  // }, []);

  // Moved exerciseList calculation to parent111
  const exerciseList = useMemo(() => {
    const list: Exercise[] = [];
    day.map(day => day.exercises.map((e: any) => list.push(e)));
    return list;
  }, [day, programDetails]);

  // Initialize exerciseData when exerciseList changes
  useEffect(() => {
    setExerciseData(exerciseList || []);
  }, [exerciseList, programDetails]);

  // Moved fadeAnim to parent since it's used in handleDeleteSelected
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Moved handlers to parent
  const handleExercisePress = (item: any) => {
    setShowExerciseDetail(true);
    setSelectedExerciseDetails(item);
  };

  const handleLongExercisePress = (title: string) => {
    setSelectedExercises(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title],
    );
  };

  const handleDeleteSelected = () => {
    if (selectedExercises.length === 0) return;

    const dayExercisesNames = day[0]?.exercises || [];

    const getExerciseIDS = dayExercisesNames
      .flatMap((item: any) => item.workout_exercises)
      .map((ex: any) => ex.exercise_id);

    const findExercisesNames = exercisesData.exerciseData?.filter(item =>
      getExerciseIDS.includes(item.exercise_id),
    );

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setExerciseData(prev =>
        prev.filter(item => {
          if (
            item &&
            typeof item === 'object' &&
            'type' in item &&
            item.type === 'superset'
          ) {
            return !findExercisesNames?.every(exercise =>
              selectedExercises.includes(exercise.name),
            );
          }

          const itemName = getExerciseName(item as Exercise);
          const matched = findExercisesNames?.some(ex =>
            selectedExercises.includes(ex.name),
          );

          //  make sure to return
          return !(selectedExercises.includes(itemName) || matched);
        }),
      );
      setSelectedExercises([]);
      fadeAnim.setValue(1);
    });
  };

  const handleClickSuperSet = () => {
    if (selectedExercises.length <= 1) return;

    const selectedItems = exerciseData.filter(item =>
      item &&
      typeof item === 'object' &&
      'type' in item &&
      item.type === 'superset'
        ? (item as Superset).exercises.some(exercise =>
            selectedExercises.includes(getExerciseName(exercise)),
          )
        : selectedExercises.includes(getExerciseName(item as Exercise)),
    );

    const exercisesToGroup: Exercise[] = [];
    selectedItems.forEach(item => {
      if (
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'superset'
      ) {
        exercisesToGroup.push(...(item as Superset).exercises);
      } else {
        exercisesToGroup.push(item as Exercise);
      }
    });

    const remainingItems = exerciseData.filter(item =>
      item &&
      typeof item === 'object' &&
      'type' in item &&
      item.type === 'superset'
        ? !(item as Superset).exercises.every(exercise =>
            selectedExercises.includes(getExerciseName(exercise)),
          )
        : !selectedExercises.includes(getExerciseName(item as Exercise)),
    );

    const newSuperset: Superset = {
      type: 'superset',
      exercises: exercisesToGroup,
    };

    setExerciseData([newSuperset, ...remainingItems]);
    setSelectedExercises([]);
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        {tabData.map(tab => (
          <Pressable
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  activeTab === tab.value ? COLORS.yellow : 'transparent',
              },
            ]}>
            <CustomText fontSize={14} fontFamily="medium">
              {tab.label}
            </CustomText>
          </Pressable>
        ))}
      </View>
    );
  };

  // Convert timing like 5.08 -> 5 minutes, 8 seconds
  const parseTiming = (value: number | string | null | undefined): number => {
    if (!value) return 0;

    const str = value.toString();
    const [minutesStr, secondsStr] = str.split('.');
    const minutes = parseInt(minutesStr, 10) || 0;
    const seconds = parseInt(secondsStr || '0', 10) || 0;

    return minutes * 60 + seconds; // total seconds
  };

  const calculateTotalWorkoutTime = (day: any[]) => {
    if (!day || day.length === 0) return 0;

    const totalSeconds = day.reduce((dayAcc, dayItem) => {
      const exerciseTotal = dayItem.exercises?.reduce(
        (acc: number, ex: any) => {
          const innerTotal = ex.workout_exercises?.reduce(
            (innerAcc: number, wEx: any) => {
              const warmup = parseTiming(wEx.timing_warmup);
              const workset = parseTiming(wEx.timing_workset);
              const finish = parseTiming(wEx.timing_finish);

              return innerAcc + warmup + workset + finish;
            },
            0,
          );

          return acc + innerTotal;
        },
        0,
      );

      return dayAcc + exerciseTotal;
    }, 0);

    return totalSeconds;
  };

  // Format seconds into hh:mm:ss
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // If you want always hh:mm:ss
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  const {totalSeconds, formatted} = useMemo(() => {
    const total = calculateTotalWorkoutTime(day);
    return {totalSeconds: total, formatted: formatTime(total)};
  }, [day]);

  const exercises = day.flatMap(d =>
    d.exercises.flatMap((e: any) => e.workout_exercises),
  );

  const renderMainView = () => {
    switch (activeTab) {
      case 1:
        return showExerciseDetail ? (
          <ExerciseDetails
            exerciseData={selectedExerciseDetails}
            showAddSetUi={showAddSetUi}
            setShowAddSetUi={setShowAddSetUi}
            exerciseWithSetData={exerciseWithSetData}
            setexerciseWithSetData={setexerciseWithSetData}
            dayData={day}
            planDayData={programDetails}
            draftWorkoutData={draftWorkout}
            exerciseTimeInSeconds={exerciseTimeInSeconds}
            setExerciseTimeInSeconds={setExerciseTimeInSeconds}
            isFinish={isFinish}
          />
        ) : (
          <ExerciseView
            data={exercises}
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
            dayData={day}
            completedExercises={completedExercises}
          />
        );
      case 2:
        return (
          <HistoryView planDayData={programDetails} dayWorkoutData={day} />
        );
      case 3:
        return <DetailsView data={programDetails} />;
      case 4:
        return <CoachCenterView planId={programId} />;
      default:
        return null;
    }
  };

  const renderBottomSection = () => {
    // compute exists here
    const exists =
      selectedExerciseDetails && isFinish[0]?.exercises
        ? isFinish[0].exercises.some(
            (ex: any) => ex.exercise_id === selectedExerciseDetails.id,
          )
        : false;

    return (
      <View style={{alignItems: 'center', gap: verticalScale(10)}}>
        {showExerciseDetail ? (
          showAddSetUi ? (
            <PrimaryButton
              title="FINISH EXERCISE"
              onPress={() => {
                setShowAddSetUi(false);
              }}
              backgroundColor={'#36DCC04D'}
            />
          ) : (
            <PrimaryButton
              title="FINISH EXERCISE"
              onPress={() => {
                if (selectedExerciseDetails) {
                  // Add the exercise name or ID to completedExercises
                  setCompletedExercises(prev => [
                    ...prev,
                    selectedExerciseDetails.name || selectedExerciseDetails.id,
                  ]);
                  setShowExerciseDetail(false);
                }
              }}
              backgroundColor={COLORS.teal}
              disabled={!exists}
            />
          )
        ) : isSupersetSelected ? (
          <PrimaryButton
            title="FINISH SUPERSET"
            onPress={() => {
              if (selectedExerciseDetails) {
                setExerciseData(prev =>
                  prev.map(item =>
                    item.exercise_id === selectedExerciseDetails.exercise_id
                      ? {...item, isCompleted: true}
                      : item,
                  ),
                );
              }

              setShowExerciseDetail(false);
            }}
            backgroundColor={COLORS.skyBlue}
          />
        ) : (
          <PrimaryButton
            title="FINISH WORKOUT"
            onPress={LOG_WORKOUT}
            backgroundColor={COLORS.crimson}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: horizontalScale(10),
            width: wp(90),
          }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: verticalScale(100),
              borderColor: COLORS.white,
              flex: 1,
              alignItems: 'center',
              paddingVertical: verticalScale(5),
              justifyContent: 'space-between',
              gap: verticalScale(10),
            }}>
            <CustomText fontFamily="bold">Workout</CustomText>
            {/* <TimerText initialMinutes={Math.floor(totalSeconds / 60)} /> */}
            <CustomText fontSize={15} color={COLORS.white}>
              {formatTime(elapsedSeconds)}
            </CustomText>
          </View>
          {exerciseTimeInSeconds.length && (
            <View
              style={{
                borderWidth: 1,
                borderRadius: verticalScale(100),
                borderColor: COLORS.white,
                flex: 1,
                alignItems: 'center',
                paddingVertical: verticalScale(5),
                justifyContent: 'space-between',
                gap: verticalScale(10),
                overflow: 'hidden',
              }}>
              <CustomText fontFamily="bold">Exercise</CustomText>

              <FlatList
                data={exerciseTimeInSeconds}
                keyExtractor={item => item.exerciseId}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={wp(70)}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <View
                    style={{
                      width:
                        exerciseTimeInSeconds.length === 1 ? wp(45) : wp(70),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CustomText fontSize={15} color={COLORS.white}>
                      {formatTime(item.timeInSeconds)}
                    </CustomText>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const getTagsData = programDetails?.allData?.content.tags;

  const mapWorkoutResponseToDay = (response: any) => {
    const exercises = response.content.Exercises.content.map((ex: any) => {
      const totalSets = ex.Set.length;
      const totalReps = ex.Set.reduce(
        (acc: number, s: any) => acc + (s.reps || 0),
        0,
      );
      const totalWeight = ex.Set.reduce(
        (acc: number, s: any) => acc + (s.weight || 0) * (s.reps || 0),
        0,
      );
      const totalDistance = ex.Set.reduce(
        (acc: number, s: any) => acc + (s.distance || 0),
        0,
      );

      return {
        exercise_id: ex.Exercise_id,
        sets: ex.Set,
        recommendedSets: totalSets,
        recommendedReps: totalReps,
        name: `Exercise ${ex.Exercise_id}`, // fallback if no name
        is_weight: totalWeight > 0,
        totalWeight,
        totalDistance,
        images: [],
      };
    });

    return [
      {
        exercises,
        focus: [], // fill with muscles if available
        duration: response.content.duration,
      },
    ];
  };

  //  Find Last Schedule Data
  const lastSchedule = scheduleData
    ?.filter(
      item =>
        item.type === 'workout' &&
        item.content.plan_id === programDetails?.allData?.plan_id &&
        item.content.Workout_id === day[0]?.workout_id,
    )
    .sort(
      (a, b) =>
        new Date(b.schedule_at).getTime() - new Date(a.schedule_at).getTime(),
    )[0];

  // BuildWorkoutResultData
  const buildWorkoutResultData = (day: any) => {
    const totalSeconds = day[0]?.duration || 0;
    const exercises = day[0]?.exercises || [];

    // console.log('Last schedule (same plan + workout):', lastSchedule);

    // Filter exercises to ensure they match the current workout_id
    const currentWorkoutId = day[0]?.workout_id;
    const filteredExercises = exercises.filter(
      (ex: any) => ex.workout_id === currentWorkoutId,
    );

    // --- Previous Schedule Data (if exists) ---
    const prevExercises = lastSchedule?.content?.Exercises?.content || [];
    const prevDuration = lastSchedule?.content?.duration || 0;

    // Collect exercise IDs from the workout day
    const getExerciseIDS = filteredExercises.map(
      (item: any) => item.exercise_id,
    );

    // Match them with exercise metadata (for names, muscles, etc.)
    const findTargetedMuscle = exercisesData.exerciseData?.filter(item =>
      getExerciseIDS.includes(item.exercise_id),
    );

    console.log('GFGFHGF', findTargetedMuscle);

    // --- Overall Summary ---
    const overallSummary = {
      Duration: {
        current: formatTime(totalSeconds),
        previous: formatTime(prevDuration),
      },
      Volume: {
        current: `${filteredExercises.length} exercises`,
        previous: `${prevExercises.length} exercises`,
      },
      Effort: {
        current: filteredExercises.length,
        previous: prevExercises.length,
      },
      Distance: {
        current:
          filteredExercises.reduce(
            (acc: any, ex: any) =>
              acc +
              ex.sets.reduce(
                (sAcc: number, s: any) => sAcc + (s.distance || 0),
                0,
              ),
            0,
          ) + ' m',
        previous:
          prevExercises.reduce(
            (acc: any, ex: any) =>
              acc +
              ex.Set.reduce(
                (sAcc: number, s: any) => sAcc + (s.distance || 0),
                0,
              ),
            0,
          ) + ' m',
      },
      Sets: {
        current: filteredExercises.reduce(
          (acc: any, ex: any) => acc + (ex.recommendedSets || 0),
          0,
        ),
        previous: prevExercises.reduce(
          (acc: any, ex: any) => acc + (ex.Set?.length || 0),
          0,
        ),
      },
      Reps: {
        current: filteredExercises.reduce(
          (acc: any, ex: any) => acc + (ex.recommendedReps || 0),
          0,
        ),
        previous: prevExercises.reduce(
          (acc: any, ex: any) =>
            acc +
            ex.Set.reduce((sAcc: number, s: any) => sAcc + (s.reps || 0), 0),
          0,
        ),
      },
    };

    // --- Best Records (dynamic) ---
    // Find exercise with max total weight lifted
    const bestWeightExercise = filteredExercises.reduce(
      (best: any, ex: any) => {
        const totalWeight = ex.sets.reduce(
          (acc: number, s: any) => acc + (s.weight || 0) * (s.reps || 0),
          0,
        );
        return totalWeight > (best.totalWeight || 0)
          ? {...ex, totalWeight}
          : best;
      },
      {},
    );

    // Find exercise with max reps achieved
    const bestRepsExercise = filteredExercises.reduce((best: any, ex: any) => {
      const totalReps = ex.sets.reduce(
        (acc: number, s: any) => acc + (s.reps || 0),
        0,
      );
      return totalReps > (best.totalReps || 0) ? {...ex, totalReps} : best;
    }, {});

    console.log('BEST WIEGHT', bestWeightExercise);
    console.log('BEST REPS', bestRepsExercise);

    const bestRecords = {
      Best_Total_Weight: {
        exerciseName:
          findTargetedMuscle?.find(
            item => item.exercise_id === bestWeightExercise.exercise_id,
          )?.name || 'N/A',
        details: `${bestWeightExercise?.recommendedSets || 0} Sets × ${
          bestWeightExercise?.recommendedReps || ''
        } Reps`,
        weightAchieved: bestWeightExercise.totalWeight
          ? `${bestWeightExercise.totalWeight} kg`
          : '-',
        image: findTargetedMuscle?.find(
          item => item.exercise_id === bestWeightExercise.exercise_id,
        )?.images_urls[0],
      },
      Best_Reps: {
        exerciseName:
          findTargetedMuscle?.find(
            item => item.exercise_id === bestRepsExercise.exercise_id,
          )?.name || 'N/A',
        details: `${bestRepsExercise?.recommendedSets || 0} Sets × ${
          bestRepsExercise?.recommendedReps || 0
        } Reps`,
        repsAchieved: bestRepsExercise.totalReps || 0,
        image: findTargetedMuscle?.find(
          item => item.exercise_id === bestWeightExercise.exercise_id,
        )?.images_urls[0],
      },
    };

    // --- Targeted Muscles ---
    const targetedMuscles =
      findTargetedMuscle?.flatMap(item => [
        item.main_muscle,
        ...(item.secondary_muscles || []),
      ]) || [];

    return {
      overallSummary,
      bestRecords,
      targetedMuscles,
    };
  };

  const LOG_WORKOUT = async () => {
    if (draftWorkout.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please add at least one set',
      });
      return;
    }

    const now = new Date(); // current date
    const scheduleDate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds(),
      ),
    );

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDateTime = (date: Date): string => {
      const pad = (num: number) => num.toString().padStart(2, '0');
      return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())} ` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}:` +
        `${pad(date.getSeconds())}`
      );
    };

    const getDate = new Date();

    if (timerRef.current) clearInterval(timerRef.current);

    const remainingDuration = Math.max(totalSeconds - elapsedSeconds, 0);

    const data = {
      type: 'workout',
      status: 'done',
      schedule_at: scheduleDate.toISOString(),
      user_id: userData?.user_id,
      finish_date_time: scheduleDate.toISOString(),
      content: {
        plan_id: programId,
        Workout_id: day[0]?.workout_id,
        // duration: remainingDuration,
        duration: elapsedSeconds,
        comments: day[0]?.comments || null,
        Exercises: {
          finish_time: formatDateTime(getDate),
          type: 'regular',
          content: draftWorkout.flatMap(workoutItem =>
            workoutItem.exercises.map(exerciseItem => {
              const exerciseObj = exercisesData.exerciseData?.find(
                ex => ex.id === exerciseItem.exercise_id,
              );

              const getExerciseTime = exerciseTimeInSeconds.find(
                ex => ex.exerciseId === exerciseItem.exercise_id,
              );

              return {
                Exercise_id:
                  exerciseObj?.exercise_id || exerciseItem.exercise_id,
                duration: getExerciseTime?.timeInSeconds,
                comments: '',
                Set: exerciseItem.setsData.map(setItem => ({
                  set_id: setItem.count,
                  weight: Number(setItem.weight?.replace('kg', '')) || 0,
                  reps: Number(setItem.reps) || 0,
                  distance: Number(setItem.distance?.replace('m', '')) || 0,
                  time: Number(setItem.time?.replace('s', '')) || 0,
                  weight_type: 'kg',
                  difficulty: setItem.difficulty,
                  rest_time: 12,
                  log_time: setItem.logTime,
                  type:
                    exerciseItem.isDropSet === false ? 'regular' : 'dropset',
                })),
              };
            }),
          ),
        },
      },
    };

    try {
      const response = await postData<any>(ENDPOINTS.createSchedule, {data});
      console.log('workout sent response ---->', response);
      if (response.data.data) {
        dispatch(addSchedule(response.data.data));

        workoutTimer.stop();

        // Mark workout as done
        dispatch(setWorkoutProgress('done'));

        // Optionally, reset after navigation

        dispatch(resetWorkout());
        dispatch(clearDraftWorkout());
        setexerciseWithSetData([]);

        const day = mapWorkoutResponseToDay(response.data.data);
        const workoutResultData = buildWorkoutResultData(day);

        navigation.navigate('workoutResult', {
          workoutData: workoutResultData,
        });
      }
    } catch (error) {
      console.log(error, 'Something went wrong');
    }
  };

  return (
    <View style={styles.main}>
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={{
            uri: programDetails?.allData?.image_url,
          }}
          style={styles.coverImage}
          imageStyle={styles.coverImageStyle}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', '#1F1A16']}
            style={styles.gradient}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
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
                  justifyContent: 'flex-end',
                  gap: verticalScale(10),
                }}>
                {!showExerciseDetail && (
                  <CustomText fontFamily="bold">
                    {day[0].name || 'unkfnown'}
                  </CustomText>
                )}
                {!showExerciseDetail && (
                  <>
                    <View style={styles.tagContainer}>
                      {getTagsData &&
                        getTagsData.map((tag: string, index: number) => (
                          <CustomText
                            key={index}
                            style={styles.tag}
                            fontSize={10}
                            color={COLORS.whiteTail}>
                            {tag}
                          </CustomText>
                        ))}
                      <CustomText
                        style={styles.tag}
                        fontSize={10}
                        color={COLORS.whiteTail}>
                        {programDetails?.allData?.content.location}
                      </CustomText>
                      <CustomText
                        style={styles.tag}
                        fontSize={10}
                        color={COLORS.whiteTail}>
                        {`${programDetails?.allData?.content?.days_per_week} days`}
                      </CustomText>
                      <CustomText
                        style={styles.tag}
                        fontSize={10}
                        color={COLORS.whiteTail}>
                        {programDetails?.allData?.content?.difficulty}
                      </CustomText>
                    </View>
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
        {!showExerciseDetail && renderTabs()}
        <View style={{flex: 1, paddingBottom: verticalScale(10)}}>
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
  safeArea: {flex: 1},
  coverImage: {
    height: hp(13),
    justifyContent: 'flex-end',
  },
  coverImageStyle: {
    borderRadius: 10,
    resizeMode: 'cover',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: verticalScale(10),
    paddingTop: verticalScale(20),
    paddingHorizontal: verticalScale(10),
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tagContainer: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: verticalScale(20),
  },
  tabButton: {
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: 10,
  },
});
