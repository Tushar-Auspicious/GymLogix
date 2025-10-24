import LottieView from 'lottie-react-native';
import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchData} from '../../APIServices/api';
import ENDPOINTS from '../../APIServices/endPoints';
import ICONS from '../../Assets/Icons';
import AddLogButton from '../../Components/AddLogButton';
import CalendarList from '../../Components/CalendarList';
import CustomIcon from '../../Components/CustomIcon';
import {CustomText} from '../../Components/CustomText';
import PrimaryButton from '../../Components/PrimaryButton';
import {
  setHomeActiveIndex,
  setLogMealActiveIndex,
} from '../../Redux/slices/initialSlice';
import {setScheduleData} from '../../Redux/slices/ScheduleSlice';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {HomeTabScreenProps} from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {horizontalScale, verticalScale, wp} from '../../Utilities/Metrics';
import MealLogmenu from './LogMenus/MealLogmenu';
import MeasurementlogMenu from './LogMenus/MeasurementlogMenu';
import NotesLogMenu from './LogMenus/NotesLogMenu';
import WorkoutMenu from './LogMenus/WorkoutMenu';

const HOME: FC<HomeTabScreenProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const animationRef = useRef<LottieView>(null);
  const workoutInTime = useAppSelector(
    state => state.logWorkoutData.workoutTime,
  );
  const workoutInProgress = useAppSelector(
    state => state.logWorkoutData.workoutProgress,
  );
  const workoutInProgressName = useAppSelector(
    state => state.logWorkoutData.currentWorkout,
  );
  const {userData} = useAppSelector(state => state.userData);
  const {totalMacros} = useAppSelector(state => state.macros);
  const {scheduleData} = useAppSelector(state => state.scheduleData);
  const [selectedItem, setSelectedItem] = useState<string[]>([]);
  const {exerciseData} = useAppSelector(state => state.exerciseData);
  const {planData} = useAppSelector(state => state.planData);
  const [expandedNotes, setExpandedNotes] = useState<{[key: string]: boolean}>(
    {},
  );
  const {dates, month, homeActiveIndex, logMealActiveIndex, initialIndex} =
    useAppSelector(state => state.initial);

  const selectedDay = dates[initialIndex];

  // Filter function
  const filteredSchedule = useMemo(() => {
    if (!selectedDay || !scheduleData) return [];
    const selectedDateString = new Date(selectedDay.timestamp).toDateString(); // normalize

    return scheduleData.filter(item => {
      const itemDateString = new Date(item.schedule_at).toDateString();
      return itemDateString === selectedDateString;
    });
  }, [selectedDay, scheduleData]);

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

  const transformDayData = (dayData: any, selectedDay: string) => {
    // Find the selected workout by name
    const workout = dayData.content.workouts.find(
      (w: any) => w.name === selectedDay,
    );

    if (!workout) {
      return {
        day: selectedDay,
        type: 'Unknown Type',
        focus: ['General'],
        color: '#8A2BE2',
        exercises: [],
        planData: dayData?.content,
        coverImage: dayData?.image_url,
      };
    }

    // Flatten all workout_exercises only for this day
    const exercisesFound =
      workout.exercises?.flatMap((ex: any) => ex.workout_exercises) || [];

    const exerciseIds = exerciseData?.map((ex: any) => ex.exercise_id) || [];

    // Filter only if they exist in master exerciseData
    const validExercises = exercisesFound.filter((we: any) =>
      exerciseIds.includes(we.exercise_id),
    );

    // Map exercises to desired format
    const exercisesMapped = validExercises.map((ex: any) => {
      const fullExercise = exerciseData?.find(
        (e: any) => e.exercise_id === ex.exercise_id,
      );

      return {
        id: fullExercise?.id || ex.exercise_id,
        name: fullExercise?.name || 'Unknown Exercise',
        coverImage: {
          uri: fullExercise?.images_urls?.[0] || '',
          type: 'image/jpeg',
          fileName: fullExercise?.images_urls?.[0]
            ? fullExercise.images_urls[0].split('/').pop()
            : 'default.jpg',
        },
        images: fullExercise?.images_urls || [],
        instruction: fullExercise?.instruction || '',
        description: fullExercise?.description || '',
        mainMuscle: fullExercise?.main_muscle || '',
        secondaryMuscle: fullExercise?.secondary_muscles,
        targetMuscles: fullExercise?.secondary_muscles,
        force: fullExercise?.force,
        location: fullExercise?.mechanics,
        type: fullExercise?.type,
        equipment: fullExercise?.equipment,

        //  Add workout-specific info
        recommendedSets: ex.sets,
        recommendedReps: ex.reps,
        timing_warmup: ex.timing_warmup,
        timing_workset: ex.timing_workset,
        timing_finish: ex.timing_finish,
        is_time: ex.Is_time,
        is_weight: ex.is_weight,
        is_distance: ex.Is_distance,
        alternate_exercise_id: ex.alternate_exercise_id,
      };
    });

    return {
      day: workout.name,
      type: workout?.comments || 'Unknown Type',
      focus: [
        ...new Set(
          exercisesMapped.map((ex: any) => ex.mainMuscle || 'General'),
        ),
      ],
      color: workout?.color || '#8A2BE2',
      exercises: exercisesMapped,
      planData: dayData?.content,
      coverImage: dayData?.image_url,
    };
  };

  const progressLine = () => {
    let progress = 0;

    if (userData?.is_verified) progress += 25;
    if (userData?.first_name && userData?.last_name) progress += 25;
    if (userData?.pic_URL) progress += 25;

    const personalSettings = userData?.personal_settings;

    const hasPersonalSettings =
      personalSettings?.height &&
      personalSettings.height_measurement &&
      personalSettings.workout_exp_years;

    if (hasPersonalSettings) progress += 25;

    return `${progress}%`;
  };

  const renderCompleteProfileCard = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.lightBrown,
          paddingVertical: verticalScale(16),
          paddingHorizontal: horizontalScale(10),
          borderRadius: 10,
          gap: verticalScale(10),
        }}>
        <CustomText fontFamily="bold" fontSize={14}>
          Complete Your Profile
        </CustomText>
        <CustomText fontSize={12}>
          Adding more details will help our AI engine give better insights.
        </CustomText>

        <View
          style={{
            backgroundColor: COLORS.darkBrown,
            width: '100%',
            height: verticalScale(10),
            borderRadius: 5,
            marginVertical: verticalScale(10),
          }}>
          <View
            style={{
              backgroundColor: COLORS.green,
              width: progressLine(),
              borderRadius: 5,
              height: verticalScale(10),
            }}
          />
        </View>
        <PrimaryButton
          title="Add Details"
          onPress={() => {
            navigation.navigate('SETTINGS');
          }}
          style={{
            alignSelf: 'flex-end',
            width: 'auto',
            paddingVertical: verticalScale(5),
            paddingHorizontal: horizontalScale(10),
            borderRadius: verticalScale(5),
          }}
          textSize={14}
          isFullWidth={false}
        />
      </View>
    );
  };

  const renderWorkoutInProgress = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.lightBrown,
          paddingVertical: verticalScale(16),
          paddingHorizontal: horizontalScale(10),
          borderRadius: 10,
          gap: verticalScale(20),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: horizontalScale(10),
            paddingRight: horizontalScale(20),
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              gap: verticalScale(10),
            }}>
            <CustomText fontFamily="italic" fontSize={14}>
              Workout in progress
            </CustomText>
            <CustomText fontSize={12} fontFamily="italic">
              {`${workoutInProgressName.workoutName} ${
                workoutInProgressName.dayName
              } : ${formatTime(workoutInTime ?? 0)}`}
            </CustomText>
          </View>

          <LottieView
            ref={animationRef}
            source={require('../../Assets/animation.json')}
            autoPlay
            loop={workoutInProgress === 'inprogress' ? true : false}
            style={{
              width: verticalScale(35),
              height: verticalScale(55),
            }}
            resizeMode="cover"
          />
        </View>
        <PrimaryButton
          title="Continue"
          onPress={() => {
            if (workoutInProgress === 'inprogress' && workoutInProgressName) {
              const {planId, dayName} = workoutInProgressName;

              // Find the program
              const selectedProgram = planData?.find(
                item => item.allData?.plan_id === planId,
              );

              if (!selectedProgram) return;

              // Transform the selected day's data
              const transformedDayData: any = transformDayData(
                selectedProgram.allData,
                dayName!,
              );

              // Navigate to workout details
              navigation.navigate('workoutProgramDetails', {
                programId: planId!,
                day: [transformedDayData],
                selectedProgram: selectedProgram,
                ScheduleHistoryData: {},
                isFrom: false,
              });
            }
          }}
          style={{
            alignSelf: 'flex-end',
            width: 'auto',
            paddingVertical: verticalScale(5),
            paddingHorizontal: horizontalScale(10),
            borderRadius: verticalScale(5),
          }}
          textSize={14}
          isFullWidth={false}
        />
      </View>
    );
  };

  const REMOVE_SCHEDULE = async () => {
    const ids = selectedItem.join(',');

    try {
      const response = await fetchData<any>(
        `${ENDPOINTS.remove_Schedule}schedule_id=${ids}`,
      );

      if (response.data.data === 'Schedule successfully removed.') {
        setSelectedItem([]);
        dispatch(
          setScheduleData(
            scheduleData?.filter(
              item => !selectedItem.includes(item.id || item._id),
            ) || [],
          ),
        );
      }
      console.log('removed response', response);
    } catch (error) {
      console.log(error, 'Something went wrong');
    }
  };

  // const transformHistoryDayData = (historyItem: any, exerciseData: any) => {
  //   const loggedExercises = historyItem?.content?.Exercises?.content || [];

  //   console.log('historyItem', historyItem);
  //   console.log('exerciseData', exerciseData);

  //   // Collect only exercises that actually exist in master list
  //   const validExercises = loggedExercises
  //     .map((log: any) => {
  //       const fullExercise = exerciseData?.find(
  //         (e: any) => e.exercise_id === log.Exercise_id,
  //       );

  //       if (!fullExercise) return null;

  //       return {
  //         id: fullExercise?.id || log.Exercise_id,
  //         name: fullExercise?.name || 'Unknown Exercise',
  //         coverImage: {
  //           uri: fullExercise?.images_urls?.[0] || '',
  //           type: 'image/jpeg',
  //           fileName: fullExercise?.images_urls?.[0]
  //             ? fullExercise.images_urls[0].split('/').pop()
  //             : 'default.jpg',
  //         },
  //         images: fullExercise?.images_urls || [],
  //         instruction: fullExercise?.instruction || '',
  //         description: fullExercise?.description || '',
  //         mainMuscle: fullExercise?.main_muscle || '',
  //         secondaryMuscle: fullExercise?.secondary_muscles,
  //         targetMuscles: fullExercise?.secondary_muscles,
  //         force: fullExercise?.force,
  //         location: fullExercise?.mechanics,
  //         type: fullExercise?.type,
  //         equipment: fullExercise?.equipment,

  //         // history-specific logged info
  //         completedSets: log.Sets,
  //         completedReps: log.Reps,
  //         completedWeight: log.Weight,
  //         completedTime: log.Time,
  //       };
  //     })
  //     .filter(Boolean);

  //   return {
  //     day: historyItem.content?.Workout_name || 'Logged Workout',
  //     type: 'Completed Workout',
  //     focus: [
  //       ...new Set(validExercises.map((ex: any) => ex.mainMuscle || 'General')),
  //     ],
  //     color: '#8A2BE2',
  //     exercises: validExercises,
  //     planData: historyItem?.content,
  //     coverImage: historyItem?.image_url,
  //   };
  // };

  const renderHistory = () => {
    if (!filteredSchedule || filteredSchedule.length === 0) {
      return (
        <CustomText style={styles.NoScheduleText} fontSize={12}>
          No scheduled items. Your scheduled items will appear here.
        </CustomText>
      );
    }

    // Flatten scheduleData so that exercises & parts each become their own row
    const flattenedData = filteredSchedule
      .filter(item => item.type === 'workout' || item.type === 'note')
      .flatMap((item: any) => {
        if (item.type === 'workout') {
          return item.content?.Exercises?.content?.map((ex: any) => {
            const match = exerciseData?.find(
              (e: any) => e.exercise_id === ex.Exercise_id,
            );
            return {
              ...item,
              _parentId: item.id || item._id,
              displayName: match?.name || `Exercise ${ex.Exercise_id}`,
              type: 'workout',
            };
          });
        }

        if (item.type === 'note') {
          return {
            ...item,
            _parentId: item.id || item._id,
            displayName: item.content.notes,
            type: 'note',
          };
        }
      });

    return (
      <View
        style={{rowGap: verticalScale(10), paddingBottom: verticalScale(10)}}>
        <CustomText fontFamily="bold">History</CustomText>
        {flattenedData && flattenedData.length > 0 ? (
          <>
            {selectedItem.length > 0 && (
              <TouchableOpacity
                onPress={REMOVE_SCHEDULE}
                style={styles.actionButton}>
                <CustomIcon Icon={ICONS.DeleteIcon} height={15} width={15} />
                <CustomText fontSize={6} fontFamily="bold">
                  DELETE
                </CustomText>
              </TouchableOpacity>
            )}

            {flattenedData.map((item: any) => {
              const itemId = item._parentId;
              const isSelected = selectedItem.includes(itemId);
              const isExpanded = expandedNotes[itemId];

              return (
                <TouchableOpacity
                  delayLongPress={200}
                  // onPress={() => {
                  //   if (item.type !== 'workout') return;

                  //   const planID = item.content.plan_id;
                  //   const selectedProgram = planData?.find(
                  //     p => p.allData?.plan_id === planID,
                  //   );

                  //   // build filtered data for this logged day
                  //   const transformedDayData = transformHistoryDayData(
                  //     item,
                  //     exerciseData,
                  //   );

                  //   console.log('transsssssssss', transformedDayData);

                  //   navigation.navigate('workoutProgramDetails', {
                  //     programId: planID,
                  //     day: [transformedDayData], // same structure as transformDayData
                  //     selectedProgram: selectedProgram,
                  //     ScheduleHistoryData: item,
                  //     isFrom: true,
                  //   });
                  // }}
                  onLongPress={() => {
                    setSelectedItem(prev =>
                      prev.includes(itemId)
                        ? prev.filter(id => id !== itemId)
                        : [...prev, itemId],
                    );
                  }}
                  key={itemId}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    flexDirection: 'row',
                    gap: verticalScale(10),
                    backgroundColor: isSelected
                      ? COLORS.lighterBrown
                      : COLORS.lightBrown,
                  }}>
                  <View
                    style={{
                      backgroundColor: COLORS.whiteTail,
                      paddingVertical: verticalScale(10),
                      paddingHorizontal: horizontalScale(10),
                      borderRadius: 10,
                      alignSelf: 'flex-start',
                    }}>
                    <View
                      style={{
                        width: 35,
                        height: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:
                          item.type === 'note'
                            ? COLORS.darkPink
                            : COLORS.sharpBlue,
                        borderRadius: 100,
                      }}>
                      <CustomIcon
                        Icon={
                          item.type === 'note'
                            ? ICONS.CalendarWithDumbellIcon
                            : ICONS.DumbellWhiteIcon
                        }
                        height={18}
                        width={18}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      gap: verticalScale(5),
                      paddingVertical: verticalScale(2),
                    }}>
                    {/* Note or workout title */}
                    <CustomText fontFamily="medium" fontSize={15}>
                      {item.type === 'note' && !isExpanded
                        ? item.displayName.slice(0, 150) + '...'
                        : item.displayName}
                    </CustomText>

                    {/* Read More / Read Less for notes */}
                    {item.type === 'note' && item.displayName.length > 150 && (
                      <TouchableOpacity
                        onPress={() =>
                          setExpandedNotes(prev => ({
                            ...prev,
                            [itemId]: !prev[itemId],
                          }))
                        }>
                        <CustomText
                          fontSize={12}
                          fontFamily="bold"
                          style={{color: COLORS.sharpBlue}}>
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </CustomText>
                      </TouchableOpacity>
                    )}

                    {/* Schedule date/time */}
                    <CustomText fontFamily="italic" fontSize={14}>
                      {new Date(item.schedule_at).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <CustomText style={styles.NoScheduleText} fontSize={12}>
            No scheduled items. Your scheduled items will appear here.
          </CustomText>
        )}
      </View>
    );
  };

  // Memoize the CalendarList component to prevent unnecessary re-renders
  const MemoizedCalendarList = useCallback(
    () => <CalendarList />,
    [dates, month],
  );

  const LOGGING_MENU_ITEMS = [
    {
      icon: ICONS.WorkoutLogIcon,
      label: 'Workout',
      onPress: () => {
        dispatch(setHomeActiveIndex(1));
      },
    },
    {
      icon: ICONS.MealLogIcon,
      label: 'Meal',
      onPress: () => {
        dispatch(setHomeActiveIndex(2));
      },
    },
    {
      icon: ICONS.MeasurementLogIcon,
      label: 'Measurement',
      onPress: () => {
        dispatch(setHomeActiveIndex(3));
      },
    },
    {
      icon: ICONS.NotesLogIcon,
      label: 'Notes',
      onPress: () => {
        dispatch(setHomeActiveIndex(4));
      },
    },
  ];

  const renderView = useMemo(() => {
    switch (homeActiveIndex) {
      case 0:
        return (
          <ScrollView
            style={styles.scrollViewStyle}
            contentContainerStyle={styles.scrollViewContainer}>
            {renderCompleteProfileCard()}
            {workoutInProgress === 'inprogress' && renderWorkoutInProgress()}
            {renderHistory()}
          </ScrollView>
        );
      case 1:
        return <WorkoutMenu />;
      case 2:
        return <MealLogmenu />;
      case 3:
        return <MeasurementlogMenu />;
      case 4:
        return <NotesLogMenu />;

      default:
        return <></>;
    }
  }, [homeActiveIndex, selectedItem, workoutInTime, expandedNotes]);

  return (
    <View style={styles.main}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        {logMealActiveIndex === 3 ? (
          <View
            style={{
              backgroundColor: COLORS.darkBrown,
              alignItems: 'center',
              gap: verticalScale(32),
              paddingTop: verticalScale(20),
              paddingBottom: verticalScale(20),
            }}>
            <View
              style={{
                paddingLeft: 10,
                justifyContent: 'flex-start',
                width: '100%',
              }}>
              <CustomIcon
                onPress={() => {
                  dispatch(setHomeActiveIndex(0));
                  dispatch(setLogMealActiveIndex(1));
                }}
                Icon={ICONS.BackArrow}
              />
            </View>
            <CustomText fontFamily="bold">Total Meal Macro</CustomText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: wp(100),
              }}>
              {[
                {title: 'Calories', value: totalMacros.calories.toFixed(1)},
                {title: 'Fat', value: totalMacros.fat.toFixed(1)},
                {title: 'Protein', value: totalMacros.protein.toFixed(1)},
                {title: 'Carbs', value: totalMacros.carbs.toFixed(1)},
              ].map((item, index) => (
                <View
                  style={{alignItems: 'center', gap: verticalScale(5)}}
                  key={index.toString()}>
                  <CustomText
                    fontSize={10}
                    fontFamily="medium"
                    color={COLORS.whiteTail}>
                    {item.title}
                  </CustomText>

                  <View key={index.toString()} style={styles.mealStatItem}>
                    <CustomText fontSize={14} fontFamily="medium">
                      {item.value}
                    </CustomText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          MemoizedCalendarList()
        )}
        <View style={styles.scrollWrapper}>
          {renderView}
          {homeActiveIndex === 0 && (
            <AddLogButton menuItems={LOGGING_MENU_ITEMS} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HOME;

const styles = StyleSheet.create({
  main: {backgroundColor: COLORS.brown, flex: 1},
  safeArea: {
    flex: 1,
  },

  scrollWrapper: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
    paddingTop: verticalScale(10),
  },

  scrollViewStyle: {
    paddingHorizontal: horizontalScale(15),
  },

  scrollViewContainer: {
    rowGap: verticalScale(20),
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  mealStatItem: {
    alignItems: 'center',
    backgroundColor: COLORS.lighterBrown,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brown,
    gap: verticalScale(5),
  },
  deleteBtn: {
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: COLORS.white,
    borderWidth: 0.9,
    alignSelf: 'flex-start',
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
  NoScheduleText: {
    color: COLORS.whiteGreenish,
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
    marginTop: verticalScale(20),
  },
});
