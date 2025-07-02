import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomLineChart from "../../Components/Charts/LineChart";
import MacronutrientChart, {
  NutrientData,
} from "../../Components/Charts/PieChart";
import { verticalScale } from "../../Utilities/Metrics";

const NutritionTab = () => {
  const fetchDataForTab = async (tabValue: any) => {
    console.log("Fetching data for tab:", tabValue);
    // Simulate API call based on tab
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    let newData: any = [];
    let newUnit = "kg";

    if (tabValue === 1) {
      // Weight
      newData = [
        { value: 0, date: "8/1" },
        { value: 60, date: "8/2" },
        { value: 50, date: "8/3" },
        { value: 80, date: "8/4" },
        { value: 75, date: "8/5" },
        { value: 90, date: "8/6" },
        { value: 85, date: "8/7" },
        { value: 100, date: "8/8" },
        { value: 95, date: "8/9" },
        { value: 104, date: "8/10" },
      ];
      newUnit = "kg";
    } else if (tabValue === 2) {
      // Distance
      newData = [
        { value: 0, date: "8/1" },
        { value: 60, date: "8/2" },
        { value: 50, date: "8/3" },
        { value: 80, date: "8/4" },
        { value: 75, date: "8/5" },
        { value: 90, date: "8/6" },
        { value: 85, date: "8/7" },
        { value: 100, date: "8/8" },
        { value: 95, date: "8/9" },
        { value: 104, date: "8/10" },
      ];
      newUnit = "km";
    } else if (tabValue === 3) {
      // Time
      newData = [
        { value: 0, date: "8/1" },
        { value: 60, date: "8/2" },
        { value: 50, date: "8/3" },
        { value: 80, date: "8/4" },
        { value: 75, date: "8/5" },
        { value: 90, date: "8/6" },
        { value: 85, date: "8/7" },
        { value: 100, date: "8/8" },
        { value: 95, date: "8/9" },
        { value: 104, date: "8/10" },
      ];
      newUnit = "min";
    } else if (tabValue === 4) {
      // Reps (e.g., total reps for an exercise)
      newData = [
        { value: 0, date: "8/1" },
        { value: 60, date: "8/2" },
        { value: 50, date: "8/3" },
        { value: 80, date: "8/4" },
        { value: 75, date: "8/5" },
        { value: 90, date: "8/6" },
        { value: 85, date: "8/7" },
        { value: 100, date: "8/8" },
        { value: 95, date: "8/9" },
        { value: 104, date: "8/10" },
      ];
      newUnit = "reps";
    }
    return { data: newData, unit: newUnit };
  };

  const macroData: NutrientData[] = [
    // Note: Percentages should ideally add up to 100 for a standard pie chart
    {
      id: "calories",
      name: "Calories",
      percentage: 0,
      value: 200,
      unit: "kcal",
      color: "#D9D9D9",
    }, // Grey (for legend only)
    {
      id: "carbs",
      name: "Carbs",
      percentage: 40,
      value: 200,
      unit: "g",
      color: "#FFD966",
    }, // Blueish (like image)
    {
      id: "protein",
      name: "Proteins",
      percentage: 33,
      value: 165,
      unit: "g",
      color: "#85E0A3",
    }, // Light Green (like image)
    {
      id: "fat",
      name: "Fat",
      percentage: 27,
      value: 60,
      unit: "g",
      color: "#80CAFF",
    }, // Yellowish (like image)
  ];

  const [chartData, setChartData] = useState([]);
  const [chartUnit, setChartUnit] = useState("kg");
  const [currentTab, setCurrentTab] = useState(1); // Default to Weight tab

  useEffect(() => {
    // Fetch initial data or data when tab changes
    fetchDataForTab(currentTab).then((result) => {
      setChartData(result.data);
      setChartUnit(result.unit);
    });
  }, [currentTab]); // Re-fetch when currentTab changes

  const handleTabChange = (newTabValue: any) => {
    setCurrentTab(newTabValue);
    // Data fetching is handled by the useEffect hook
  };
  return (
    <View
      style={{
        borderRadius: 10,
        paddingVertical: verticalScale(10),
        gap: verticalScale(10),
      }}
    >
      <CustomLineChart
        data={chartData}
        unit={chartUnit}
        onTabChange={handleTabChange}
        tabs={[
          { label: "Calories", value: 1 },
          { label: "Fat", value: 2 },
          { label: "Protein", value: 3 },
          { label: "Carbs", value: 4 },
        ]}
        initialTabValue={currentTab} // Keep chart synced with parent state if needed
        // Optional: Customize further
        // lineColor={COLORS.green}
        // yAxisMaxValue={100} // Set a fixed max Y if needed
      />
      <MacronutrientChart data={macroData} />
    </View>
  );
};

export default NutritionTab;

const styles = StyleSheet.create({});
