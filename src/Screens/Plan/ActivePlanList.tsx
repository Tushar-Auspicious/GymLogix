import React, { FC } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { CustomText } from "../../Components/CustomText";
import {
  setActivePlanIndex,
  setCurrentprogramId,
} from "../../Redux/slices/initialSlice";
import { useAppDispatch } from "../../Redux/store";
import { ActivePlanListItem } from "../../Seeds/Plans";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

export const ActivePlanListCard: FC<ActivePlanListItem> = (props) => {
  return (
    <Pressable onPress={props.onPress} style={styles.card}>
      <Image source={{ uri: props.coverImage }} style={styles.image} />
      <View style={styles.cardContent}>
        <CustomText fontFamily="bold" style={styles.title}>
          {props.title}
        </CustomText>
        <View style={styles.tagContainer}>
          {props.tags.map((tag, index) => (
            <CustomText
              key={index}
              style={styles.tag}
              fontFamily="italicBold"
              fontSize={10}
              color={COLORS.black}
            >
              {tag}
            </CustomText>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

type ActivePlanListProps = {
  actviePlanList: ActivePlanListItem[];
};

const ActivePlanList: FC<ActivePlanListProps> = ({ actviePlanList }) => {
  const dispatch = useAppDispatch();

  return (
    <View
      style={{
        paddingHorizontal: horizontalScale(10),
        paddingTop: verticalScale(10),
        backgroundColor: COLORS.darkBrown,
      }}
    >
      <FlatList
        data={actviePlanList}
        renderItem={({ item }) => (
          <ActivePlanListCard
            {...item}
            onPress={() => {
              dispatch(setCurrentprogramId(item.id));
              dispatch(setActivePlanIndex(item.type === "workout" ? 1 : 2));
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(80),
        }}
      />
    </View>
  );
};

export default ActivePlanList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightBrown,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    gap: horizontalScale(10),
    overflow: "hidden",
  },
  image: {
    width: wp(35),
    maxHeight: "100%",
    minHeight: hp(13),
  },
  cardContent: {
    gap: verticalScale(20),
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
  },
  title: {
    shadowColor: "#00000040", // Corrected box shadow equivalent
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
    marginTop: 5,
  },
  tag: {
    backgroundColor: COLORS.whiteGreenish,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(8),
    borderRadius: 5,
  },
});
