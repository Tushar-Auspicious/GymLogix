import React, { FC, useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import COLORS from "../Utilities/Colors";
import { verticalScale, wp } from "../Utilities/Metrics";
import { CustomText } from "./CustomText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ITEM_HEIGHT = verticalScale(40);

interface PickerComponentProps {
  difficulty: string;
  onValuesChange?: (values: {
    reps: string;
    distance: string;
    weight: string;
    time: string;
  }) => void;
}

const PickerComponent: FC<PickerComponentProps> = ({
  difficulty,
  onValuesChange,
}) => {
  // Data for each column
  const repsData = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const distanceData = Array.from({ length: 30 }, (_, i) => `${50 + i * 10}m`);
  const weightData = Array.from({ length: 30 }, (_, i) => `${1 + i}kg`);
  const timeData = Array.from({ length: 30 }, (_, i) => `${1 + i}m`);

  // State to track selected index for each column
  const [selectedRepsIndex, setSelectedRepsIndex] = useState(5);
  const [selectedDistanceIndex, setSelectedDistanceIndex] = useState(5);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(5);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(5);

  // Refs for FlatLists to programmatically scroll
  const repsRef = useRef(null);
  const distanceRef = useRef(null);
  const weightRef = useRef(null);
  const timeRef = useRef(null);

  // Call onValuesChange when any value changes
  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        reps: repsData[selectedRepsIndex],
        distance: distanceData[selectedDistanceIndex],
        weight: weightData[selectedWeightIndex],
        time: timeData[selectedTimeIndex],
      });
    }
  }, [
    selectedRepsIndex,
    selectedDistanceIndex,
    selectedWeightIndex,
    selectedTimeIndex,
    onValuesChange,
  ]);

  // Item height for snapping

  // Function to handle snapping and update selected index
  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    setIndex: (arg0: number) => void,
    ref: any,
    dataLength: number
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < dataLength) {
      setIndex(index);
      ref.current?.scrollToIndex({ index, animated: true });
    }
  };

  // Render item for each FlatList
  const renderItem = (
    item: string,
    index: number,
    selectedIndex: any,
    setIndex: any
  ) => {
    const isSelected = index === selectedIndex;
    return (
      <View style={[styles.item, { height: ITEM_HEIGHT }]}>
        <CustomText fontSize={20} color={isSelected ? COLORS.white : "#908E8E"}>
          {item}
        </CustomText>
      </View>
    );
  };

  // Render each column
  const renderColumn = (
    data: string | ArrayLike<any> | null | undefined,
    selectedIndex: number | null | undefined,
    setIndex: {
      (value: React.SetStateAction<number>): void;
      (value: React.SetStateAction<number>): void;
      (value: React.SetStateAction<number>): void;
      (value: React.SetStateAction<number>): void;
    },
    ref: React.LegacyRef<FlatList<any>> | undefined
  ) => (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, index }) =>
        renderItem(item, index, selectedIndex, setIndex)
      }
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      initialScrollIndex={selectedIndex}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      onMomentumScrollEnd={(event) =>
        handleScroll(event, setIndex, ref, data!.length)
      }
      style={styles.column}
      contentContainerStyle={{
        paddingVertical:
          (SCREEN_HEIGHT * verticalScale(0.14) - ITEM_HEIGHT) / 2, // Center the items
      }}
    />
  );

  const difficultyColor = difficulty
    ? difficulty === "Warmup"
      ? "#777777"
      : difficulty === "Easy"
      ? "#28A745"
      : difficulty === "Medium"
      ? "#FFC107"
      : "#DC3545"
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText fontFamily="semiBold" color={COLORS.whiteTail}>
          Reps
        </CustomText>
        <CustomText fontFamily="semiBold" color={COLORS.whiteTail}>
          Distance
        </CustomText>
        <CustomText fontFamily="semiBold" color={COLORS.whiteTail}>
          Weight(kg)
        </CustomText>
        <CustomText fontFamily="semiBold" color={COLORS.whiteTail}>
          Time
        </CustomText>
      </View>
      <View style={styles.divider} />
      <View style={styles.pickerContainer}>
        {renderColumn(
          repsData,
          selectedRepsIndex,
          setSelectedRepsIndex,
          repsRef
        )}
        {renderColumn(
          distanceData,
          selectedDistanceIndex,
          setSelectedDistanceIndex,
          distanceRef
        )}
        {renderColumn(
          weightData,
          selectedWeightIndex,
          setSelectedWeightIndex,
          weightRef
        )}
        {renderColumn(
          timeData,
          selectedTimeIndex,
          setSelectedTimeIndex,
          timeRef
        )}
        <View style={styles.highlightOverlay}>
          <View
            style={{
              width: 30,
              height: ITEM_HEIGHT,
              backgroundColor: difficultyColor,
              left: -30,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    width: wp(100),
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    width: wp(80),
  },
  headerText: {},
  divider: {
    height: 0.4,
    backgroundColor: "#FFFFFF",
    marginVertical: 5,
    width: wp(80),
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: wp(80),
    height: SCREEN_HEIGHT * verticalScale(0.14), // Adjust height to show 3 items (1 above, 1 selected, 1 below)
  },
  column: {
    zIndex: 2,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  highlightOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: (SCREEN_HEIGHT * verticalScale(0.14) - ITEM_HEIGHT) / 2,
    height: ITEM_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 5,
    zIndex: 1,
  },
});

export default PickerComponent;
