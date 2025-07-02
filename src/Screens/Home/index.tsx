import React, { FC, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import AddLogButton from "../../Components/AddLogButton";
import CalendarList from "../../Components/CalendarList";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import PrimaryButton from "../../Components/PrimaryButton";
import {
  setHomeActiveIndex,
  setLogMealActiveIndex,
} from "../../Redux/slices/initialSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { HomeTabScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import MealLogmenu from "./LogMenus/MealLogmenu";
import NotesLogMenu from "./LogMenus/NotesLogMenu";
import MeasurementlogMenu from "./LogMenus/MeasurementlogMenu";
import WorkoutMenu from "./LogMenus/WorkoutMenu";

const HOME: FC<HomeTabScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { dates, month, homeActiveIndex, logMealActiveIndex } = useAppSelector(
    (state) => state.initial
  );

  const renderCompleteProfileCard = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.lightBrown,
          paddingVertical: verticalScale(16),
          paddingHorizontal: horizontalScale(10),
          borderRadius: 10,
          gap: verticalScale(10),
        }}
      >
        <CustomText fontFamily="bold" fontSize={14}>
          Complete Your Profile
        </CustomText>
        <CustomText fontSize={12}>
          Adding more details will help our AI engine give better insights.
        </CustomText>

        <View
          style={{
            backgroundColor: COLORS.darkBrown,
            width: "100%",
            height: verticalScale(10),
            borderRadius: 5,
            marginVertical: verticalScale(10),
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.green,
              width: "20%",
              borderRadius: 5,
              height: verticalScale(10),
            }}
          />
        </View>
        <PrimaryButton
          title="Add Details"
          onPress={() => {}}
          style={{
            alignSelf: "flex-end",
            width: "auto",
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
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: horizontalScale(10),
            paddingRight: horizontalScale(20),
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              gap: verticalScale(10),
            }}
          >
            <CustomText fontFamily="italic" fontSize={14}>
              Workout in progress
            </CustomText>
            <CustomText fontSize={12} fontFamily="italic">
              Push pull Day 1: 00:40:14
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.SandGlassIcon} height={45} width={28} />
        </View>
        <PrimaryButton
          title="Continue"
          onPress={() => {}}
          style={{
            alignSelf: "flex-end",
            width: "auto",
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

  const renderHistory = () => {
    return (
      <View
        style={{
          rowGap: verticalScale(10),
          paddingBottom: verticalScale(10),
        }}
      >
        <CustomText fontFamily="bold">History</CustomText>
        {[1, 2, 3, 4].map((item, index) => {
          return (
            <View
              key={item + index.toString()}
              style={{
                backgroundColor: COLORS.lightBrown,
                padding: 10,
                borderRadius: 10,
                flexDirection: "row",
                gap: verticalScale(10),
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.whiteTail,
                  paddingVertical: verticalScale(10),
                  paddingHorizontal: horizontalScale(10),
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: COLORS.sharpBlue,
                    borderRadius: 100,
                  }}
                >
                  <CustomIcon
                    Icon={ICONS.DumbellWhiteIcon}
                    height={18}
                    width={18}
                  />
                </View>
              </View>
              <View
                style={{
                  gap: verticalScale(5),
                  paddingVertical: verticalScale(2),
                }}
              >
                <CustomText fontFamily="medium" fontSize={15}>
                  Legs Day 1
                </CustomText>
                <CustomText fontFamily="italic" fontSize={14}>
                  Tue Aug 24, 2024 15:18
                </CustomText>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Memoize the CalendarList component to prevent unnecessary re-renders
  const MemoizedCalendarList = useCallback(
    () => <CalendarList />,
    [dates, month]
  );

  const LOGGING_MENU_ITEMS = [
    {
      icon: ICONS.WorkoutLogIcon,
      label: "Workout",
      onPress: () => {
        dispatch(setHomeActiveIndex(1));
      },
    },
    {
      icon: ICONS.MealLogIcon,
      label: "Meal",
      onPress: () => {
        dispatch(setHomeActiveIndex(2));
      },
    },
    {
      icon: ICONS.MeasurementLogIcon,
      label: "Measurement",
      onPress: () => {
        dispatch(setHomeActiveIndex(3));
      },
    },
    {
      icon: ICONS.NotesLogIcon,
      label: "Notes",
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
            contentContainerStyle={styles.scrollViewContainer}
          >
            {renderCompleteProfileCard()}
            {renderWorkoutInProgress()}
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
  }, [homeActiveIndex]);

  return (
    <View style={styles.main}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        {logMealActiveIndex === 3 ? (
          <View
            style={{
              backgroundColor: COLORS.darkBrown,
              alignItems: "center",
              gap: verticalScale(32),
              paddingTop: verticalScale(20),
              paddingBottom: verticalScale(20),
            }}
          >
            <View
              style={{
                paddingLeft: 10,
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: wp(100),
              }}
            >
              {[
                { title: "Calories", value: 1500 },
                { title: "Fat", value: 1500 },
                { title: "Protein", value: 1500 },
                { title: "Carbs", value: 1500 },
              ].map((item, index) => (
                <View
                  style={{ alignItems: "center", gap: verticalScale(5) }}
                  key={index.toString()}
                >
                  <CustomText
                    fontSize={10}
                    fontFamily="medium"
                    color={COLORS.whiteTail}
                  >
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
  main: { backgroundColor: COLORS.brown, flex: 1 },
  safeArea: {
    flex: 1,
  },

  scrollWrapper: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
    paddingTop: verticalScale(10),
  },

  scrollViewStyle: {},

  scrollViewContainer: {
    rowGap: verticalScale(20),
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  mealStatItem: {
    alignItems: "center",
    backgroundColor: COLORS.lighterBrown,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brown,
    gap: verticalScale(5),
  },
});
