import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";
import { CustomText } from "../../../Components/CustomText";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

const DetailsView = () => {
  const renderLevelWithStars = () => {
    const level: string = "Intermediate";
    const isFilled =
      level === "Beginner" ? 1 : level === "Intermediate" ? 2 : 3;

    return (
      <View style={styles.levelContainer}>
        <View style={styles.starContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <CustomIcon
              key={index}
              Icon={
                index < isFilled ? ICONS.FilledStarIcon : ICONS.EmptyStarIcon
              }
              height={53}
              width={53}
            />
          ))}
        </View>
        <CustomText fontFamily="bold">{level}</CustomText>
      </View>
    );
  };

  return (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.detailsStatsContainer}>
        <View style={styles.statItem}>
          <CustomIcon Icon={ICONS.EnduranceIcon} height={48} width={48} />
          <CustomText fontSize={14} fontFamily="bold">
            Endurance
          </CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomIcon Icon={ICONS.GreenCalendarIcon} height={48} width={48} />
          <CustomText fontSize={14} fontFamily="bold">
            12 Weeks
          </CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomIcon Icon={ICONS.barbellIcon} height={48} width={48} />
          <CustomText fontSize={14} fontFamily="bold">
            GYM
          </CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText fontSize={30} fontFamily="bold">
            3
          </CustomText>
          <CustomText fontSize={14} fontFamily="bold">
            Days
          </CustomText>
        </View>
      </View>

      {renderLevelWithStars()}
      <CustomText fontSize={22} fontFamily="extraBold">
        Details
      </CustomText>
      <CustomText fontSize={14} style={styles.detailsText}>
        Juicy, tender salmon fillet seasoned with a zesty lemon-herb marinade,
        grilled to perfection. Served on a bed of fluffy quinoa mixed with fresh
        cherry tomatoes, crisp cucumbers, chopped parsley, and a drizzle of
        olive oil. Accompanied by a side of roasted asparagus for a light,
        healthy, and flavorful meal. Perfect for a refreshing post-workout
        dinner or a wholesome lunch!
        {"\n"}
        {"\n"}
        {"\n"}
        {"\n"}
        Juicy, tender salmon fillet seasoned with a zesty lemon-herb marinade,
        grilled to perfection. Served on a bed of fluffy quinoa mixed with fresh
        cherry tomatoes, crisp cucumbers, chopped parsley, and a drizzle of
        olive oil. Accompanied by a side of roasted asparagus for a light,
        healthy, and flavorful meal. Perfect for a refreshing post-workout
        dinner or a wholesome lunch!
      </CustomText>
    </ScrollView>
  );
};

export default DetailsView;

const styles = StyleSheet.create({
  detailsContainer: {
    paddingHorizontal: horizontalScale(10),
    gap: verticalScale(10),
  },
  detailsStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: verticalScale(20),
    minHeight: verticalScale(85),
    maxHeight: verticalScale(85),
  },
  statItem: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelContainer: {
    gap: verticalScale(20),
    alignItems: "center",
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    justifyContent: "center",
  },
  detailsText: {
    lineHeight: 22,
  },
});
