// import React, {FC, useEffect, useState} from 'react';
// import {StyleSheet, View} from 'react-native';
// import BarChart from '../../Components/Charts/BarChart';
// import BodyChart from '../../Components/Charts/BodyChart';
// import CustomLineChart from '../../Components/Charts/LineChart';
// import COLORS from '../../Utilities/Colors';
// import {horizontalScale, verticalScale} from '../../Utilities/Metrics';
// import {useAppSelector} from '../../Redux/store';

// export interface TrainingTabProps {
//   plans?: any[];
//   exercise?: any;
//   schedulesData?: any;
// }

// const TrainingTab: FC<TrainingTabProps> = ({
//   plans = [],
//   exercise,
//   schedulesData,
// }) => {
//   const {scheduleData} = useAppSelector(state => state.scheduleData);

//   const fetchDataForTab = async (tabValue: any) => {
//     console.log('Fetching data for tab:', tabValue);
//     // Simulate API call based on tab

//     await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
//     let newData: any = [];
//     let newUnit = 'kg';

//     if (tabValue === 1) {
//       // Weight - Multiple entries per date to demonstrate Total vs Average
//       newData = [
//         {value: 50, date: '8/1'},
//         {value: 60, date: '8/2'},
//         {value: 70, date: '8/3'},
//         {value: 30, date: '8/4'},
//         {value: 80, date: '8/5'},
//         {value: 40, date: '8/6'},
//         {value: 60, date: '8/7'},
//         {value: 50, date: '8/8'},
//         {value: 70, date: '8/9'},
//         {value: 60, date: '8/10'},
//       ];
//       newUnit = 'kg';
//     } else if (tabValue === 2) {
//       // Distance - Multiple entries per date to demonstrate Total vs Average
//       newData = [
//         {value: 5, date: '8/1'},
//         {value: 10, date: '8/2'},
//         {value: 7, date: '8/3'},
//         {value: 15, date: '8/4'},
//         {value: 8, date: '8/5'},
//         {value: 12, date: '8/6'},
//         {value: 6, date: '8/7'},
//         {value: 14, date: '8/8'},
//         {value: 9, date: '8/9'},
//         {value: 18, date: '8/10'},
//       ];
//       newUnit = 'km';
//     } else if (tabValue === 3) {
//       // Time - Multiple entries per date to demonstrate Total vs Average
//       newData = [
//         {value: 30, date: '8/1'},
//         {value: 45, date: '8/2'},
//         {value: 25, date: '8/3'},
//         {value: 55, date: '8/4'},
//         {value: 35, date: '8/5'},
//         {value: 40, date: '8/6'},
//         {value: 20, date: '8/7'},
//         {value: 50, date: '8/8'},
//         {value: 45, date: '8/9'},
//         {value: 60, date: '8/10'},
//       ];
//       newUnit = 'min';
//     } else if (tabValue === 4) {
//       // Reps - Multiple entries per date to demonstrate Total vs Average
//       newData = [
//         {value: 10, date: '8/1'},
//         {value: 15, date: '8/2'},
//         {value: 12, date: '8/3'},
//         {value: 18, date: '8/4'},
//         {value: 8, date: '8/5'},
//         {value: 22, date: '8/6'},
//         {value: 14, date: '8/7'},
//         {value: 16, date: '8/8'},
//         {value: 20, date: '8/9'},
//         {value: 25, date: '8/10'},
//       ];
//       newUnit = 'reps';
//     }
//     return {data: newData, unit: newUnit};
//   };

//   const [chartData, setChartData] = useState([]);
//   const [chartUnit, setChartUnit] = useState('kg');
//   const [currentTab, setCurrentTab] = useState(1); // Default to Weight tab
//   const [selectedOption, setSelectedOption] = useState<'Total' | 'Average'>(
//     'Total',
//   );

//   const [statValue, setStatValue] = useState(0);

//   useEffect(() => {
//     // Fetch initial data or data when tab changes
//     fetchDataForTab(currentTab).then(result => {
//       setChartData(result.data);
//       setChartUnit(result.unit);

//       // Calculate initial stat value based on selected option
//       if (result.data && result.data.length > 0) {
//         const values = result.data.map((item: any) => item.value);
//         if (selectedOption === 'Total') {
//           setStatValue(
//             values.reduce((sum: number, val: number) => sum + val, 0),
//           );
//         } else {
//           setStatValue(
//             values.reduce((sum: number, val: number) => sum + val, 0) /
//               values.length,
//           );
//         }
//       }
//     });
//   }, [currentTab, selectedOption]); // Re-fetch when currentTab or selectedOption changes

//   const handleTabChange = (newTabValue: any) => {
//     setCurrentTab(newTabValue);
//     // Data fetching is handled by the useEffect hook
//   };

//   const handleOptionChange = (option: 'Total' | 'Average', value: number) => {
//     setSelectedOption(option);
//     setStatValue(value);
//   };

//   return (
//     <View
//       style={{
//         borderRadius: 10,
//         paddingBottom: verticalScale(10),
//         gap: verticalScale(10),
//       }}>
//       <CustomLineChart
//         data={chartData}
//         unit={chartUnit}
//         onTabChange={handleTabChange}
//         onOptionChange={handleOptionChange}
//         initialTabValue={currentTab} // Keep chart synced with parent state if needed
//         initialSelectedOption={selectedOption}
//       />
//       <BodyChart primary_muscle={() => {}} />
//       <BarChart durationData={() => {}} />
//     </View>
//   );
// };

// export default TrainingTab;

import React, {FC, useEffect, useState} from 'react';
import {View} from 'react-native';
import BarChart from '../../Components/Charts/BarChart';
import BodyChart from '../../Components/Charts/BodyChart';
import CustomLineChart from '../../Components/Charts/LineChart';
import {verticalScale} from '../../Utilities/Metrics';

export interface TrainingTabProps {
  exercises?: any;
}

const TrainingTab: FC<TrainingTabProps> = ({exercises}) => {
  const fetchDataForTab = async (tabValue: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    let newUnit = '';
    if (tabValue === 1) newUnit = 'kg';
    else if (tabValue === 2) newUnit = 'm';
    else if (tabValue === 3) newUnit = 'sec';
    else if (tabValue === 4) newUnit = 'reps';

    // Flatten setsData from single/multiple exercises
    const setsData = exercises.flatMap((ex: any) => ex.Set || []);

    // Group by date
    const daily: Record<string, {total: number; reps: number}> = {};

    setsData.forEach((c: any) => {
      const date = new Date(c.log_time).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
      });

      if (!daily[date]) daily[date] = {total: 0, reps: 0};

      if (tabValue === 1 && c.weight) {
        daily[date].total += c.weight;
        daily[date].reps += c.reps || 0; // reps with weight
      } else if (tabValue === 2 && c.distance) {
        daily[date].total += c.distance;
        daily[date].reps += c.reps || 0; // reps with distance
      } else if (tabValue === 3 && c.time) {
        daily[date].total += c.time;
        daily[date].reps += c.reps || 0; // reps with time
      } else if (tabValue === 4) {
        daily[date].total += c.reps || 0; // total reps
        // no avg for reps
      }
    });

    // Prepare array
    const filtered = Object.entries(daily).map(([date, {total, reps}]) => {
      let avg = null;
      if (tabValue !== 4 && reps > 0) {
        avg = total / reps;
      }
      return {date, total, avg};
    });

    return {data: filtered, unit: newUnit};
  };

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartUnit, setChartUnit] = useState('kg');
  const [currentTab, setCurrentTab] = useState(1); // Default to Weight tab
  const [selectedOption, setSelectedOption] = useState<'Total' | 'Average'>(
    'Total',
  );
  const [statValue, setStatValue] = useState(0);
  const [maxValue, setMaxValue] = useState<{
    date: string;
    value: number;
  } | null>(null);
  const [minValue, setMinValue] = useState<{
    date: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    fetchDataForTab(currentTab).then(result => {
      let chart: {date: string; value: number}[] = [];

      if (selectedOption === 'Total') {
        chart = result.data.map((d: any) => ({
          date: d.date,
          value: d.total,
        }));
      } else {
        chart = result.data
          .filter((d: any) => d.avg !== null)
          .map((d: any) => ({
            date: d.date,
            value: d.avg,
          }));
      }

      setChartData(chart);
      setChartUnit(result.unit);

      if (chart.length > 0) {
        if (selectedOption === 'Total') {
          // sum all totals
          setStatValue(chart.reduce((sum, d) => sum + d.value, 0));
        } else {
          //  For Average, use mean of daily averages
          const avgValue =
            chart.reduce((sum, d) => sum + d.value, 0) / chart.length;
          setStatValue(avgValue);
        }

        // Max/Min calculation (same)
        const maxEntry = chart.reduce(
          (prev, curr) => (curr.value > prev.value ? curr : prev),
          chart[0],
        );
        const minEntry = chart.reduce(
          (prev, curr) => (curr.value < prev.value ? curr : prev),
          chart[0],
        );

        setMaxValue(maxEntry);
        setMinValue(minEntry);
      } else {
        setStatValue(0);
        setMaxValue(null);
        setMinValue(null);
      }
    });
  }, [currentTab, selectedOption, exercises]);

  const handleTabChange = (newTabValue: number) => {
    setCurrentTab(newTabValue);
  };

  const handleOptionChange = (option: 'Total' | 'Average') => {
    setSelectedOption(option);
  };

  return (
    <View
      style={{
        borderRadius: 10,
        paddingBottom: verticalScale(10),
        gap: verticalScale(10),
      }}>
      <CustomLineChart
        data={chartData}
        unit={chartUnit}
        onTabChange={handleTabChange}
        onOptionChange={handleOptionChange}
        initialTabValue={currentTab}
        initialSelectedOption={selectedOption}
        maxValue={maxValue}
        minValue={minValue}
        setStoreMuscle={() => {}}
        storeMuscle={() => {}}
      />
      <BodyChart primary_muscle={exercises} />
      <BarChart durationData={exercises} />
    </View>
  );
};

export default TrainingTab;
