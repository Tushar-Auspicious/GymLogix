import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {horizontalScale, verticalScale} from '../../../Utilities/Metrics';
import {CustomText} from '../../../Components/CustomText';
import COLORS from '../../../Utilities/Colors';
import CustomIcon from '../../../Components/CustomIcon';
import ICONS from '../../../Assets/Icons';
import {useAppSelector} from '../../../Redux/store';

interface HistoryViewProps {
  planDayData: any;
  dayWorkoutData: any;
  ScheduleHistoryData: string;
}

const HistoryView: FC<HistoryViewProps> = ({
  planDayData,
  dayWorkoutData,
  ScheduleHistoryData,
}) => {
  const {scheduleData} = useAppSelector(state => state.scheduleData);
  const {exerciseData} = useAppSelector(state => state.exerciseData);

  // Filter history by plan, workout, AND matching date
  const getScheduleHistory = scheduleData
    ?.filter(item => {
      if (
        item.type !== 'workout' ||
        item.content.plan_id !== planDayData.allData.plan_id ||
        dayWorkoutData[0].workout_id !== item.content.Workout_id
      ) {
        return false;
      }

      if (!ScheduleHistoryData || typeof ScheduleHistoryData !== 'string')
        return true;

      const targetDate = ScheduleHistoryData.split('T')[0];
      const itemDate = (item.schedule_at || item.updated_at)?.split('T')[0];

      return itemDate === targetDate;
    })
    ?.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

  return (
    <ScrollView
      style={{
        paddingBottom: verticalScale(10),
        paddingHorizontal: horizontalScale(10),
      }}
      contentContainerStyle={{
        rowGap: verticalScale(10),
      }}>
      {getScheduleHistory && getScheduleHistory?.length > 0 ? (
        getScheduleHistory.map((item, index) => {
          const getScheduleExerciseId =
            item?.content?.Exercises?.content?.[0]?.Exercise_id;

          const findScheduleExercise = exerciseData?.find(
            ex => ex.exercise_id === getScheduleExerciseId,
          );

          return (
            <View
              key={item + index.toString()}
              style={{
                backgroundColor: COLORS.lightBrown,
                padding: 10,
                borderRadius: 10,
                flexDirection: 'row',
                gap: verticalScale(10),
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
                      item.type === 'food' ? COLORS.darkPink : COLORS.sharpBlue,
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
                }}>
                <CustomText fontFamily="medium" fontSize={15}>
                  {findScheduleExercise?.name || 'Unknown'}
                </CustomText>
                <CustomText fontFamily="italic" fontSize={14}>
                  {(() => {
                    const date = new Date(item.updated_at);
                    const weekday = date.toLocaleDateString('en-US', {
                      weekday: 'short',
                    });
                    const day = date.getDate();
                    const month = date.toLocaleDateString('en-US', {
                      month: 'short',
                    });
                    const year = date.getFullYear();
                    return `${weekday} ${day} ${month} ${year}`;
                  })()}
                </CustomText>
              </View>
            </View>
          );
        })
      ) : (
        <CustomText
          style={styles.noHistoryText}
          fontSize={16}
          fontFamily="bold"
          color={COLORS.yellow}>
          No history available for now{' '}
        </CustomText>
      )}
    </ScrollView>
  );
};

export default HistoryView;

const styles = StyleSheet.create({
  noHistoryText: {
    flex: 1,
    textAlign: 'center',
  },
});
