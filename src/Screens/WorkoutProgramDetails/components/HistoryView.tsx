import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";

const HistoryView = () => {
  return (
    <ScrollView
      style={{
        paddingBottom: verticalScale(10),
        paddingHorizontal: horizontalScale(10),
      }}
      contentContainerStyle={{
        rowGap: verticalScale(10),
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
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
                  backgroundColor: COLORS.darkPink,
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
    </ScrollView>
  );
};

export default HistoryView;

const styles = StyleSheet.create({});
