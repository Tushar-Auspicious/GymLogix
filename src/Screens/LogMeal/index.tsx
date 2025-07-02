import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import PrimaryButton from "../../Components/PrimaryButton";
import { Ingredients } from "../../Seeds/MealPlansData";
import { LogMealScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

// --- New IngredientItem Component ---
interface IngredientItemProps {
  item: any; // Define a more specific type for your ingredient item if available
  isSelected: boolean;
  onPress: (title: string) => void;
  onPercentageChange: (id: string, direction: "increase" | "decrease") => void;
  setScrollEnabled: (enabled: boolean) => void;
}

// Helper function to get the percentage display values
const getPercentageValues = (percentage: number) => {
  const step = 10;
  const currentDisplay = Math.round(percentage / step) * step;

  return {
    lower: Math.max(0, currentDisplay - step),
    current: currentDisplay,
    upper: Math.min(200, currentDisplay + step),
  };
};

const IngredientItem: FC<IngredientItemProps> = ({
  item,
  isSelected,
  onPress,
  onPercentageChange,
  setScrollEnabled,
}) => {
  const { lower, current, upper } = getPercentageValues(item.percentage);

  // PanResponder for swipe gestures on the percentage display itself
  const panResponder = useRef(
    PanResponder.create({
      // We want to become the responder if the user starts a move,
      // but primarily if it's a vertical swipe on the percentage display area.
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only activate if the gesture is primarily vertical and significant enough
        // and we are NOT just tapping (i.e., we are actually moving)
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 5
        );
      },
      onPanResponderGrant: () => {
        // Disable parent FlatList scroll when a swipe gesture starts on our percentage control
        setScrollEnabled(false);
      },
      onPanResponderMove: (evt, gestureState) => {
        // You can add visual feedback here if desired during the swipe
      },
      onPanResponderRelease: (evt, gestureState) => {
        const swipeThreshold = 20; // Pixels
        if (gestureState.dy < -swipeThreshold) {
          // Swiping up to increase
          onPercentageChange(item.id, "increase");
        } else if (gestureState.dy > swipeThreshold) {
          // Swiping down to decrease
          onPercentageChange(item.id, "decrease");
        }
        // Re-enable parent FlatList scroll when the swipe gesture ends
        setScrollEnabled(true);
      },
      onPanResponderTerminate: () => {
        // Re-enable in case of interruption (e.g., call, notification)
        setScrollEnabled(true);
      },
      // Ensure our PanResponder can become active
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Crucial: Capture the touch if it's a potential vertical swipe *before* the FlatList gets it
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 5
        );
      },
    })
  ).current;

  return (
    <TouchableOpacity
      onLongPress={() => onPress(item.title)}
      activeOpacity={0.7}
      style={[
        styles.ingredientItem,
        isSelected && styles.selectedIngredientItem,
      ]}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.ingredientImage}
      />
      <View style={styles.ingredientDetails}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <CustomText color={COLORS.yellow} fontFamily="medium" fontSize={12}>
              {item.title}
            </CustomText>
            <CustomText color={COLORS.white} fontFamily="medium" fontSize={12}>
              {item.quantity}
            </CustomText>
          </View>
          <View style={styles.percentageControlHorizontal}>
            {/* Decrease Button (-) */}
            <TouchableOpacity
              onPress={() => onPercentageChange(item.id, "decrease")}
              style={styles.percentageButton}
            >
              <CustomText style={styles.percentageButtonText}>-</CustomText>
            </TouchableOpacity>

            {/* Percentage Display */}
            <View style={styles.percentageDisplay}>
              {/* <CustomText fontSize={10} fontFamily="medium">
            {`${lower}%`}
          </CustomText> */}
              {/* <View style={styles.percentageSeparator} /> */}
              <CustomText fontSize={10} fontFamily="medium">
                {`${current}%`}
              </CustomText>
              {/* <View style={styles.percentageSeparator} /> */}
              {/* <CustomText fontSize={10} fontFamily="medium">
            {`${upper}%`}
          </CustomText> */}
            </View>

            {/* Increase Button (+) */}
            <TouchableOpacity
              onPress={() => onPercentageChange(item.id, "increase")}
              style={styles.percentageButton}
            >
              <CustomText style={styles.percentageButtonText}>+</CustomText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.caloriesContainer}>
          {["calories", "fat", "protein", "carbs"].map(
            (_: string, index: number) => (
              <View style={styles.caloriesItem} key={index.toString()}>
                <CustomText fontSize={10} fontFamily="medium">
                  {_}
                </CustomText>
                <CustomText
                  fontSize={11}
                  fontFamily="medium"
                  style={styles.caloriesValue}
                  color={COLORS.whiteTail}
                >
                  {item.calories[index]}
                </CustomText>
              </View>
            )
          )}
        </View>
      </View>

      {/* <Animated.View style={styles.percentageControl}>
        <TouchableOpacity
          onPress={() => onPercentageChange(item.id, "increase")}
        >
          <CustomIcon Icon={ICONS.ArrowUpIcon} height={20} width={20} />
        </TouchableOpacity>

        <View
          {...panResponder.panHandlers}
          style={{ alignItems: "center", gap: verticalScale(2) }}
        >
          <CustomText fontSize={10} fontFamily="medium">
            {`${lower}%`}
          </CustomText>
          <View
            style={{
              width: 20,
              height: 1,
              backgroundColor: COLORS.white,
            }}
          />
          <CustomText fontSize={10} fontFamily="medium">
            {`${current}%`}
          </CustomText>
          <View
            style={{
              width: 20,
              height: 1,
              backgroundColor: COLORS.white,
            }}
          />
          <CustomText fontSize={10} fontFamily="medium">
            {`${upper}%`}
          </CustomText>
        </View>
        <TouchableOpacity
          onPress={() => onPercentageChange(item.id, "decrease")}
        >
          <CustomIcon Icon={ICONS.ArrowDownIcon} height={20} width={20} />
        </TouchableOpacity>
      </Animated.View> */}
    </TouchableOpacity>
  );
};

// --- LogMeal Component (main component) ---
const LogMeal: FC<LogMealScreenProps> = ({ navigation }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientsData, setIngredientsData] = useState([...Ingredients]);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const handlePercentageChange = useCallback(
    (id: string, direction: "increase" | "decrease") => {
      setIngredientsData((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            // Make sure the item has a 'percentage' property,
            // or initialize it if it's missing.
            const currentPercentage =
              item.percentage !== undefined ? item.percentage : 100; // Default to 100 if undefined
            const newPercentage =
              direction === "increase"
                ? Math.min(200, currentPercentage + 10) // Increment by 10
                : Math.max(0, currentPercentage - 10); // Decrement by 10
            return { ...item, percentage: newPercentage };
          }
          return item;
        })
      );
    },
    []
  );

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const calculateTotalMacros = useCallback(() => {
    return ingredientsData.reduce(
      (totals, item: any) => {
        // Ensure percentage is treated as a number and defaults to 100 if not set
        const itemPercentage =
          item.percentage !== undefined ? item.percentage : 100;

        const actualCalories = (item.calories[0] || 0) * (itemPercentage / 100);
        const actualFat = (item.calories[1] || 0) * (itemPercentage / 100);
        const actualProtein = (item.calories[2] || 0) * (itemPercentage / 100);
        const actualCarbs = (item.calories[3] || 0) * (itemPercentage / 100);

        return {
          calories: totals.calories + actualCalories,
          fat: totals.fat + actualFat,
          protein: totals.protein + actualProtein,
          carbs: totals.carbs + actualCarbs,
        };
      },
      { calories: 0, fat: 0, protein: 0, carbs: 0 }
    );
  }, [ingredientsData]);

  const [totalMacros, setTotalMacros] = useState(calculateTotalMacros());

  useEffect(() => {
    setTotalMacros(calculateTotalMacros());
  }, [ingredientsData, calculateTotalMacros]);

  const handleIngredientPress = useCallback((title: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  }, []);

  const handleDeleteSelected = () => {
    if (selectedIngredients.length === 0) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIngredientsData((prev) =>
        prev.filter((item) => !selectedIngredients.includes(item.title))
      );
      setSelectedIngredients([]);
      fadeAnim.setValue(1);
    });
  };

  const renderIngredientList = () => {
    return (
      <FlatList
        data={ingredientsData}
        contentContainerStyle={{ gap: verticalScale(10) }}
        renderItem={({ item }) => (
          <IngredientItem
            item={item}
            isSelected={selectedIngredients.includes(item.title)}
            onPress={handleIngredientPress}
            onPercentageChange={handlePercentageChange}
            setScrollEnabled={setIsScrollEnabled}
          />
        )}
        scrollEnabled={isScrollEnabled}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() => (
          <View style={{ alignItems: "flex-end" }}>
            <PrimaryButton
              onPress={() => {
                navigation.navigate("ingredientList", {
                  isFrom: "Logmeal",
                });
              }}
              isFullWidth={false}
              style={styles.addIngredientsButton}
              textSize={10}
              title="Add ingredients"
            />
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.main}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkBrown,
            alignItems: "center",
            gap: verticalScale(20),
            paddingTop: verticalScale(10),
          }}
        >
          <View
            style={{
              paddingLeft: 10,
              justifyContent: "flex-start",
              width: "100%",
              paddingTop: verticalScale(10),
            }}
          >
            <CustomIcon
              onPress={() => {
                navigation.goBack();
              }}
              Icon={ICONS.BackArrow}
            />
          </View>
          <CustomText fontFamily="bold">Total Meal Macro</CustomText>
          <View style={styles.mealStatsContainer}>
            {[
              { title: "Calories", value: totalMacros.calories },
              { title: "Fat", value: totalMacros.fat },
              { title: "Protein", value: totalMacros.protein },
              { title: "Carbs", value: totalMacros.carbs },
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
                    {item.value.toFixed(0)}
                  </CustomText>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              width: wp(100),
              paddingBottom: verticalScale(10),
              paddingHorizontal: horizontalScale(10),
            }}
          >
            {selectedIngredients.length > 0 && (
              <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
                <TouchableOpacity
                  onPress={handleDeleteSelected}
                  style={styles.actionButton}
                >
                  <CustomIcon Icon={ICONS.DeleteIcon} height={15} width={15} />
                  <CustomText fontSize={7}>Delete</CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <CustomIcon Icon={ICONS.CopyIcon} height={15} width={15} />
                  <CustomText fontSize={7}>Copy</CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {renderIngredientList()}
        </View>
        <View style={styles.bottomButtons}>
          <PrimaryButton title="Log Meal" onPress={() => {}} />
          <PrimaryButton
            title="Save Meal"
            onPress={() => {}}
            style={{ backgroundColor: "transparent" }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LogMeal;

const styles = StyleSheet.create({
  main: { backgroundColor: COLORS.darkBrown, flex: 1 },
  safeArea: {
    flex: 1,
  },
  mealStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(10),
  },
  mealStatItem: {
    alignItems: "center",
    backgroundColor: COLORS.lightBrown,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brown,
    gap: verticalScale(5),
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: verticalScale(10),
    borderColor: COLORS.whiteTail,
    backgroundColor: COLORS.lightBrown,
    width: wp(95),
  },
  selectedIngredientItem: {
    backgroundColor: COLORS.skinColor,
  },
  ingredientImage: {
    height: "100%",
    width: wp(22),
    borderRadius: 10,
    resizeMode: "cover",
  },
  ingredientDetails: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    justifyContent: "space-between",
    flex: 1,
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: horizontalScale(10),
  },
  caloriesItem: {
    alignItems: "center",
    minWidth: horizontalScale(30),
  },
  caloriesValue: {
    backgroundColor: COLORS.brown,
    paddingVertical: verticalScale(2),
    paddingHorizontal: horizontalScale(4),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.brown,
    width: "100%",
    textAlign: "center",
  },
  percentageControl: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(5),
    minWidth: horizontalScale(60),
  },
  actionButton: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.whiteTail,
    borderRadius: 100,
    justifyContent: "center",
    height: 40,
    width: 40,
  },
  addIngredientsButton: {
    width: "auto",
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: verticalScale(5),
  },
  bottomButtons: {
    backgroundColor: COLORS.brown,
    width: wp(100),
    paddingVertical: verticalScale(10),
  },
  percentageControlHorizontal: {
    flexDirection: "row", // Arrange items horizontally
    alignItems: "center",
    justifyContent: "space-around", // Distribute space
    paddingHorizontal: horizontalScale(5),
    minWidth: horizontalScale(100), // Adjust width as needed
  },
  percentageButton: {
    backgroundColor: COLORS.brown, // Or any color you prefer for the buttons
    borderRadius: 5,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(3),
    justifyContent: "center",
    alignItems: "center",
  },
  percentageButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  percentageDisplay: {
    alignItems: "center",
    gap: verticalScale(2),
    marginHorizontal: horizontalScale(5), // Space between buttons and display
  },
  percentageSeparator: {
    width: 20,
    height: 1,
    backgroundColor: COLORS.white,
  },
});
