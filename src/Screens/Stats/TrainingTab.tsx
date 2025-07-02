import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import BarChart from "../../Components/Charts/BarChart";
import BodyChart from "../../Components/Charts/BodyChart";
import CustomLineChart from "../../Components/Charts/LineChart";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const TrainingTab = () => {
  const fetchDataForTab = async (tabValue: any) => {
    console.log("Fetching data for tab:", tabValue);
    // Simulate API call based on tab
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    let newData: any = [];
    let newUnit = "kg";

    if (tabValue === 1) {
      // Weight - Multiple entries per date to demonstrate Total vs Average
      newData = [
        { value: 50, date: "8/1" },
        { value: 60, date: "8/2" },
        { value: 70, date: "8/3" },
        { value: 30, date: "8/4" },
        { value: 80, date: "8/5" },
        { value: 40, date: "8/6" },
        { value: 60, date: "8/7" },
        { value: 50, date: "8/8" },
        { value: 70, date: "8/9" },
        { value: 60, date: "8/10" },
      ];
      newUnit = "kg";
    } else if (tabValue === 2) {
      // Distance - Multiple entries per date to demonstrate Total vs Average
      newData = [
        { value: 5, date: "8/1" },
        { value: 10, date: "8/2" },
        { value: 7, date: "8/3" },
        { value: 15, date: "8/4" },
        { value: 8, date: "8/5" },
        { value: 12, date: "8/6" },
        { value: 6, date: "8/7" },
        { value: 14, date: "8/8" },
        { value: 9, date: "8/9" },
        { value: 18, date: "8/10" },
      ];
      newUnit = "km";
    } else if (tabValue === 3) {
      // Time - Multiple entries per date to demonstrate Total vs Average
      newData = [
        { value: 30, date: "8/1" },
        { value: 45, date: "8/2" },
        { value: 25, date: "8/3" },
        { value: 55, date: "8/4" },
        { value: 35, date: "8/5" },
        { value: 40, date: "8/6" },
        { value: 20, date: "8/7" },
        { value: 50, date: "8/8" },
        { value: 45, date: "8/9" },
        { value: 60, date: "8/10" },
      ];
      newUnit = "min";
    } else if (tabValue === 4) {
      // Reps - Multiple entries per date to demonstrate Total vs Average
      newData = [
        { value: 10, date: "8/1" },
        { value: 15, date: "8/2" },
        { value: 12, date: "8/3" },
        { value: 18, date: "8/4" },
        { value: 8, date: "8/5" },
        { value: 22, date: "8/6" },
        { value: 14, date: "8/7" },
        { value: 16, date: "8/8" },
        { value: 20, date: "8/9" },
        { value: 25, date: "8/10" },
      ];
      newUnit = "reps";
    }
    return { data: newData, unit: newUnit };
  };

  const [chartData, setChartData] = useState([]);
  const [chartUnit, setChartUnit] = useState("kg");
  const [currentTab, setCurrentTab] = useState(1); // Default to Weight tab
  const [selectedOption, setSelectedOption] = useState<"Total" | "Average">(
    "Total"
  );

  const [statValue, setStatValue] = useState(0);

  useEffect(() => {
    // Fetch initial data or data when tab changes
    fetchDataForTab(currentTab).then((result) => {
      setChartData(result.data);
      setChartUnit(result.unit);

      // Calculate initial stat value based on selected option
      if (result.data && result.data.length > 0) {
        const values = result.data.map((item: any) => item.value);
        if (selectedOption === "Total") {
          setStatValue(
            values.reduce((sum: number, val: number) => sum + val, 0)
          );
        } else {
          setStatValue(
            values.reduce((sum: number, val: number) => sum + val, 0) /
              values.length
          );
        }
      }
    });
  }, [currentTab, selectedOption]); // Re-fetch when currentTab or selectedOption changes

  const handleTabChange = (newTabValue: any) => {
    setCurrentTab(newTabValue);
    // Data fetching is handled by the useEffect hook
  };

  const handleOptionChange = (option: "Total" | "Average", value: number) => {
    setSelectedOption(option);
    setStatValue(value);
  };

  return (
    <View
      style={{
        borderRadius: 10,
        paddingBottom: verticalScale(10),
        gap: verticalScale(10),
      }}
    >
      <CustomLineChart
        data={chartData}
        unit={chartUnit}
        onTabChange={handleTabChange}
        onOptionChange={handleOptionChange}
        initialTabValue={currentTab} // Keep chart synced with parent state if needed
        initialSelectedOption={selectedOption}
      />
      <BodyChart />
      <BarChart />
    </View>
  );
};

export default TrainingTab;
