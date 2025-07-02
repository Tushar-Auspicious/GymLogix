import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import ICONS from "../Assets/Icons";
import {
  setDates,
  setHomeActiveIndex,
  setInitialIndex,
} from "../Redux/slices/initialSlice";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import COLORS from "../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../Utilities/Metrics";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";

export interface DayItem {
  day: string;
  date: number;
  month: string;
  isToday: boolean;
  timestamp: number;
}

const ITEM_WIDTH = horizontalScale(50);
const ITEM_MARGIN = horizontalScale(4);
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;

const DayCard = React.memo(
  ({
    item,
    onPressDate,
    selectedDate,
  }: {
    item: DayItem;
    onPressDate: (item: DayItem) => void;
    selectedDate: DayItem | null;
  }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(item.isToday ? 1.05 : 1) }],
    }));

    const dayCardBackgroundColor = useMemo(() => {
      if (selectedDate) {
        if (selectedDate.timestamp === item.timestamp) {
          return COLORS.yellow;
        } else {
          return COLORS.whiteTail;
        }
      } else {
        if (item.isToday) {
          return COLORS.yellow;
        } else {
          return COLORS.whiteTail;
        }
      }
    }, [item.isToday, item.timestamp, selectedDate?.timestamp]);

    const textColor = useMemo(() => {
      if (selectedDate) {
        if (selectedDate.timestamp === item.timestamp) {
          return COLORS.white;
        } else {
          return COLORS.nickel;
        }
      } else {
        if (item.isToday) {
          return COLORS.white;
        } else {
          return COLORS.nickel;
        }
      }
    }, [item.isToday, item.timestamp, selectedDate?.timestamp]);

    return (
      <TouchableOpacity onPress={() => onPressDate(item)} activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.dayCard,
            animatedStyle,
            {
              backgroundColor: dayCardBackgroundColor,
            },
          ]}
        >
          <CustomText fontFamily="italic" fontSize={12} color={textColor}>
            {item.day}
          </CustomText>
          <CustomText fontFamily="bold" fontSize={12} color={textColor}>
            {item.date}
          </CustomText>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

const CalendarList = () => {
  const flatListRef = useRef<FlatList<DayItem>>(null);
  const dispatch = useAppDispatch();
  const { dates, initialIndex, homeActiveIndex } = useAppSelector(
    (state) => state.initial
  );

  const [month, setMonth] = useState("");
  const [selectedDtae, setSelectedDtae] = useState<DayItem | null>(null);

  const onPressDate = (item: DayItem) => {
    setSelectedDtae(item);
  };

  const generateDates = useCallback(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const initialMonthName = today.toLocaleString("en-US", {
      month: "long",
    });
    setMonth(initialMonthName);

    const datesArray: DayItem[] = [];
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    let todayIndex = -1;

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const date = new Date(d);
      const dayName = date
        .toLocaleString("en-US", { weekday: "short" })
        .toUpperCase();
      const dayDate = date.getDate();
      const monthName = date.toLocaleString("en-US", { month: "long" });
      const isToday = date.toDateString() === today.toDateString();

      datesArray.push({
        day: dayName,
        date: dayDate,
        month: monthName,
        isToday,
        timestamp: date.getTime(),
      });

      if (isToday) {
        todayIndex = datesArray.length - 1;
      }
    }

    dispatch(setInitialIndex(todayIndex));
    dispatch(setDates(datesArray));
    if (todayIndex !== -1) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
          viewPosition: 0.5,
        });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (dates.length === 0) {
      generateDates();
    }
  }, [dates, generateDates]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: DayItem }> }) => {
      if (viewableItems.length > 0) {
        setMonth(viewableItems[0].item.month);
      }
    },
    []
  );

  const getItemLayout = useCallback(
    (data: DayItem[] | null | any, index: number) => ({
      length: TOTAL_ITEM_WIDTH,
      offset: TOTAL_ITEM_WIDTH * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: DayItem) => `${item.timestamp}`, []);

  const renderDay = useCallback(
    ({ item }: { item: DayItem }) => (
      <DayCard
        item={item}
        onPressDate={onPressDate}
        selectedDate={selectedDtae}
      />
    ),
    [onPressDate, selectedDtae]
  );

  const onScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      const offset = info.averageItemLength * info.index;
      flatListRef.current?.scrollToOffset({ offset, animated: false });

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: false,
          viewPosition: 0.5,
        });
      });
    },
    []
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 10,
    }),
    []
  );

  return (
    <View style={styles.container}>
      {homeActiveIndex !== 0 && (
        <View style={{ marginLeft: 10 }}>
          <CustomIcon
            onPress={() => {
              dispatch(setHomeActiveIndex(0));
            }}
            Icon={ICONS.BackArrow}
          />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity style={styles.monthButton}>
          <CustomText fontSize={17} fontFamily="bold">
            {month.toUpperCase()}
          </CustomText>
        </TouchableOpacity>
        <CustomText fontSize={14} fontFamily="regular">
          Keep track on your calendar
        </CustomText>
      </View>

      {dates.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={dates}
          renderItem={renderDay}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex !== -1 ? initialIndex : 0}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScrollToIndexFailed={onScrollToIndexFailed}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={7}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.brown,
    paddingVertical: verticalScale(20),
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: horizontalScale(10),
  },
  monthButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
  },
  dayCard: {
    borderRadius: 5,
    padding: 8,
    width: ITEM_WIDTH,
    height: hp(8),
    alignItems: "center",
    marginHorizontal: ITEM_MARGIN,
    gap: verticalScale(5),
  },
});

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(CalendarList);
