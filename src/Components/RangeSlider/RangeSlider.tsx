import moment, { Moment } from "moment";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import RangeSlider from "rn-range-slider";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import Label from "./Label";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";

// Define prop types
interface DateRangeSliderProps {
  minDate?: string;
  maxDate?: string;
  onDateRangeChange?: (range: { from: string; to: string }) => void;
}

// Define type for date range calculations
interface DateRange {
  startDate: Moment;
  endDate: Moment;
  totalDays: number;
}

// Define type for selected dates
interface SelectedDates {
  fromFormatted: string;
  toFormatted: string;
  fromISO: string;
  toISO: string;
}

const DateRangeSlider: React.FC<DateRangeSliderProps> = ({
  minDate = "2025-01-01",
  maxDate = "2025-12-31",
  onDateRangeChange,
}) => {
  const dateRange = useMemo<DateRange>(() => {
    const start = moment(minDate);
    const end = moment(maxDate);
    return {
      startDate: start,
      endDate: end,
      totalDays: end.diff(start, "days"),
    };
  }, [minDate, maxDate]);

  const [sliderValues, setSliderValues] = React.useState<number[]>([0, 100]);

  const calculateDate = useCallback(
    (value: number): Moment => {
      const daysToAdd = Math.round((value / 100) * dateRange.totalDays);
      return dateRange.startDate.clone().add(daysToAdd, "days");
    },
    [dateRange]
  );

  const selectedDates = useMemo<SelectedDates>(() => {
    const from = calculateDate(sliderValues[0]);
    const to = calculateDate(sliderValues[1]);
    return {
      fromFormatted: from.format("MMM D, YYYY"),
      toFormatted: to.format("MMM D, YYYY"),
      fromISO: from.format("YYYY-MM-DD"),
      toISO: to.format("YYYY-MM-DD"),
    };
  }, [sliderValues, calculateDate]);

  const handleSliderChange = useCallback(
    (low: number, high: number) => {
      setSliderValues([low, high]);
      onDateRangeChange?.({
        from: selectedDates.fromISO,
        to: selectedDates.toISO,
      });
    },
    [onDateRangeChange, selectedDates]
  );

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    (value: number) => <Label text={value} />,
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <CustomText color={COLORS.white} fontSize={12} fontFamily="medium">
          {selectedDates.fromFormatted}
        </CustomText>
        <CustomText color={COLORS.white} fontSize={12} fontFamily="medium">
          {selectedDates.toFormatted}
        </CustomText>
      </View>

      <RangeSlider
        style={styles.slider}
        min={0}
        max={100}
        step={1}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        onValueChanged={handleSliderChange}
      />
    </View>
  );
};

// Define style types
interface Styles {
  container: ViewStyle;
  dateContainer: ViewStyle;
  dateText: TextStyle;
  slider: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {},
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  dateText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
  },
});

export default React.memo(DateRangeSlider);
