import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {HomeTabScreenProps} from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {horizontalScale, verticalScale, wp} from '../../Utilities/Metrics';
import MealLogmenu from './LogMenus/MealLogmenu';
import NotesLogMenu from './LogMenus/NotesLogMenu';
import MeasurementlogMenu from './LogMenus/MeasurementlogMenu';
import WorkoutMenu from './LogMenus/WorkoutMenu';
import {fetchData} from '../../APIServices/api';
import ENDPOINTS from '../../APIServices/endPoints';
import {setScheduleData} from '../../Redux/slices/ScheduleSlice';
import LottieView from 'lottie-react-native';

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
            dispatch(setHomeActiveIndex(1));
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

  const renderHistory = () => {
    if (!filteredSchedule || filteredSchedule.length === 0) {
      return (
        <CustomText style={styles.NoScheduleText} fontSize={12}>
          No scheduled items. Your scheduled items will appear here.
        </CustomText>
      );
    }
    // Flatten scheduleData so that exercises & parts each become their own row
    const flattenedData = filteredSchedule.flatMap((item: any) => {
      if (item.type === 'workout') {
        return item.content?.Exercises?.content?.map((ex: any) => {
          const match = exerciseData?.find(
            (e: any) => e.exercise_id === ex.Exercise_id,
          );
          return {
            ...item,
            _parentId: item.id || item._id,
            displayName: match?.name || `Exercise ${ex.Exercise_id}`,
          };
        });
      }

      if (item.type === 'measurement') {
        return item.content?.list?.map((p: any) => ({
          ...item,
          _parentId: item.id || item._id,
          displayName: p.part,
        }));
      }

      return [
        {
          ...item,
          _parentId: item.id || item._id,
          displayName: item.content?.name,
        },
      ];
    });
    return (
      <View
        style={{
          rowGap: verticalScale(10),
          paddingBottom: verticalScale(10),
        }}>
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
              const itemId = item._parentId; // always use parent id for selection
              const isSelected = selectedItem.includes(itemId);

              return (
                <TouchableOpacity
                  delayLongPress={200} // optional: makes long press feel snappier
                  onLongPress={() => {
                    setSelectedItem(
                      prev =>
                        prev.includes(itemId)
                          ? prev.filter(id => id !== itemId) // unselect
                          : [...prev, itemId], // select
                    );
                  }}
                  onPress={() => {}}
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
                    }}>
                    <View
                      style={{
                        width: 35,
                        height: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:
                          item.type === 'food'
                            ? COLORS.darkPink
                            : COLORS.sharpBlue,
                        borderRadius: 100,
                      }}>
                      <CustomIcon
                        Icon={
                          item.type === 'food'
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
                      gap: verticalScale(5),
                      paddingVertical: verticalScale(2),
                      flex: 1,
                    }}>
                    <CustomText
                      fontFamily="medium"
                      fontSize={15}
                      numberOfLines={2}>
                      {item.displayName}
                    </CustomText>
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
  }, [homeActiveIndex, selectedItem, workoutInTime]);

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
