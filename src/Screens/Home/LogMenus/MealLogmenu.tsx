import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import PrimaryButton from "../../../Components/PrimaryButton";
import { setLogMealActiveIndex } from "../../../Redux/slices/initialSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/store";
import MealPlanData, { MealsONly } from "../../../Seeds/MealPlansData";
import COLORS from "../../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../../Utilities/Metrics";

const MealLogmenu = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { logMealActiveIndex } = useAppSelector((state) => state.initial);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const flatListRefs = Array.from({ length: 3 }).map(() =>
    useRef<FlatList>(null)
  );
  const mainFlatListRef = useRef<FlatList>(null); // Ref for main FlatList

  const topTabsData = [
    {
      label: "By Plan",
      value: 1,
      onClick: () => dispatch(setLogMealActiveIndex(1)),
    },
    {
      label: "By Meal",
      value: 2,
      onClick: () => dispatch(setLogMealActiveIndex(2)),
    },
    {
      label: "Quick",
      value: 3,
      onClick: () => dispatch(setLogMealActiveIndex(3)),
    },
  ];

  const scrollToIndex = (sectionIndex: number, itemIndex: number) => {
    const flatListRef = flatListRefs[sectionIndex].current;

    if (
      flatListRef &&
      itemIndex >= 0 &&
      itemIndex < MealPlanData[sectionIndex].meals.length
    ) {
      flatListRef.scrollToIndex({ index: itemIndex, animated: true });
    }
  };

  const renderTopTabs = () => {
    return (
      <View
        style={[
          styles.topTabsContainer,
          logMealActiveIndex === 3 && {
            borderBottomColor: COLORS.white,
            borderBottomWidth: 0.6,
            paddingBottom: verticalScale(10),
          },
        ]}
      >
        {topTabsData.map((tab) => (
          <Pressable
            key={tab.value}
            style={[
              styles.tab,
              logMealActiveIndex === tab.value && styles.activeTab,
            ]}
            onPress={tab.onClick}
          >
            <CustomText
              fontSize={13}
              fontFamily="medium"
              color={COLORS.whiteTail}
            >
              {tab.label}
            </CustomText>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderNestedItem = ({ item, index }: any) => {
    const isSelected = selectedPlan === item.id;

    return (
      <View
        style={{
          gap: verticalScale(10),
        }}
      >
        <Pressable
          style={[
            styles.nestedItem,
            {
              backgroundColor: isSelected ? COLORS.skinColor : COLORS.brown,
            },
          ]}
          onPress={() => {
            if (isSelected) {
              setSelectedPlan(null);
              setSelectedIndex(null);
            } else {
              setSelectedPlan(item.id);
              setSelectedIndex(index); // Store the index of the clicked item
            }
          }}
        >
          <Image
            source={{ uri: item.coverImage }}
            style={{ height: 98, width: 148, borderRadius: 5 }}
          />
          <View
            style={{
              flex: 1,
              padding: verticalScale(10),
              justifyContent: "space-between",
            }}
          >
            <CustomText fontFamily="bold">{item.title}</CustomText>
            <View style={styles.tagContainer}>
              {item.tags.map((tag: string, index: number) => (
                <CustomText
                  key={index}
                  style={styles.tag}
                  fontFamily="italicBold"
                  fontSize={10}
                  color={COLORS.black}
                >
                  {tag.slice(0, 8)}
                </CustomText>
              ))}
            </View>
          </View>
        </Pressable>
        {isSelected && (
          <ScrollView
            style={{
              maxHeight: hp(30),
            }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {item?.meals.map((section: any, sectionIndex: number) => {
              return (
                <View
                  key={sectionIndex.toString()}
                  style={styles.mealSectionContainer}
                >
                  <View style={styles.sectionHeader}>
                    <CustomText fontFamily="italicBold" fontSize={24}>
                      {`Meal ${section.mealNumber}`}
                    </CustomText>
                  </View>

                  <FlatList
                    ref={flatListRefs[sectionIndex]}
                    data={section.options}
                    keyExtractor={(item, index) => item + index}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={styles.item}>
                          <View style={styles.mealItemContainer}>
                            <CustomIcon
                              Icon={ICONS.SlideleftArrowIcon}
                              height={20}
                              width={20}
                              onPress={() =>
                                scrollToIndex(sectionIndex, index - 1)
                              }
                            />
                            <Pressable
                              onPress={() => {
                                navigation.navigate("logMeal", {
                                  mealId: item.id,
                                });
                              }}
                            >
                              <ImageBackground
                                source={{
                                  uri: "https://gylogix.s3.us-east-1.amazonaws.com/meal/1003.jpg",
                                }}
                                style={styles.mealImage}
                                imageStyle={styles.mealImageStyle}
                              >
                                <View style={styles.mealImageContent}>
                                  <View style={styles.mealTitleContainer}>
                                    <View style={styles.mealIndicator} />
                                    <CustomText
                                      fontSize={24}
                                      fontFamily="bold"
                                      style={styles.mealTitle}
                                    >
                                      {item.title}
                                    </CustomText>
                                  </View>
                                  <View style={styles.mealStatsContainer}>
                                    {Array.from({ length: 4 }).map(
                                      (item, index) => (
                                        <View
                                          key={index.toString()}
                                          style={styles.mealStatItem}
                                        >
                                          <CustomText
                                            fontSize={8}
                                            fontFamily="bold"
                                          >
                                            Calories
                                          </CustomText>
                                          <CustomText
                                            fontSize={10}
                                            fontFamily="medium"
                                          >
                                            1500
                                          </CustomText>
                                        </View>
                                      )
                                    )}
                                  </View>
                                </View>
                              </ImageBackground>
                            </Pressable>
                            <CustomIcon
                              Icon={ICONS.SlideRightArrowIcon}
                              height={20}
                              width={20}
                              onPress={() =>
                                index < section.options.length - 1 &&
                                scrollToIndex(sectionIndex, index + 1)
                              }
                            />
                          </View>
                          {sectionIndex < MealPlanData.length - 1 && (
                            <View style={styles.mealDivider} />
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderPlanList = () => {
    return (
      <FlatList
        ref={mainFlatListRef}
        data={MealPlanData}
        renderItem={renderNestedItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: verticalScale(15) }}
      />
    );
  };

  const renderMealList = () => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <FlatList
          data={MealsONly}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate("logMeal", {
                  mealId: item.id,
                });
              }}
            >
              <ImageBackground
                source={{
                  uri: item.image,
                }}
                style={{ height: hp(25), width: wp(85) }}
                imageStyle={{
                  height: hp(25),
                  width: wp(85),
                  borderRadius: 10,
                }}
              >
                <View style={styles.mealImageContent}>
                  <View style={styles.mealTitleContainer}>
                    <CustomText
                      fontSize={22}
                      fontFamily="bold"
                      style={styles.mealTitle}
                    >
                      {item.title}
                    </CustomText>
                  </View>
                  <View style={styles.mealStatsContainer}>
                    {Array.from({ length: 4 }).map((item, index) => (
                      <View key={index.toString()} style={styles.mealStatItem}>
                        <CustomText fontSize={10} fontFamily="bold">
                          Calories
                        </CustomText>
                        <CustomText fontSize={12} fontFamily="medium">
                          1500
                        </CustomText>
                      </View>
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: verticalScale(20) }}
        />
      </View>
    );
  };

  const renderQuickTab = () => {
    return (
      <View style={{ flex: 1, gap: verticalScale(10) }}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <CustomText>Add new Ingredients to your meal</CustomText>
          </View>
          <PrimaryButton
            onPress={() => {
              navigation.navigate("ingredientList", {
                isFrom: "addNewMeal",
              });
            }}
            isFullWidth={false}
            style={styles.addIngredientsButton}
            textSize={10}
            title="Add ingredients"
          />
        </View>
        <View
          style={{
            backgroundColor: COLORS.brown,
            width: wp(100),
            paddingVertical: verticalScale(10),
          }}
        >
          <PrimaryButton title="Log Meal" onPress={() => {}} />
          <PrimaryButton
            title="Save Meal"
            onPress={() => {}}
            style={{ backgroundColor: "transparent" }}
          />
        </View>
      </View>
    );
  };

  const renderView = () => {
    switch (logMealActiveIndex) {
      case 1:
        return renderPlanList();
      case 2:
        return renderMealList();
      case 3:
        return renderQuickTab();
    }
  };

  // Effect to scroll to the clicked item or the next item when an item is expanded
  useEffect(() => {
    if (selectedPlan && mainFlatListRef.current && selectedIndex !== null) {
      const targetIndex = Math.min(selectedIndex, MealPlanData.length - 1); // Scroll to the next item, or the last item if there is no next item
      mainFlatListRef.current.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0,
      });
    }
  }, [selectedPlan, selectedIndex]);

  return (
    <View style={styles.main}>
      {renderTopTabs()}
      {renderView()}
    </View>
  );
};

export default MealLogmenu;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: horizontalScale(10),
    flex: 1,
    gap: verticalScale(20),
  },
  topTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  tab: {
    paddingVertical: verticalScale(8),
    borderRadius: 10,
    width: wp(30),
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: COLORS.yellow,
  },
  nestedItem: {
    flexDirection: "row",
    gap: horizontalScale(10),
    borderRadius: 10,
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
  },
  tag: {
    backgroundColor: COLORS.whiteGreenish,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(8),
    borderRadius: 5,
  },
  mealItem: {
    padding: verticalScale(10),
    backgroundColor: COLORS.darkBrown,
    borderRadius: 10,
    marginTop: verticalScale(5),
  },
  mealOption: {
    padding: verticalScale(5),
    marginRight: horizontalScale(10),
    backgroundColor: COLORS.lightBrown,
    borderRadius: 5,
    alignItems: "center",
  },

  mealsListContainer: {
    width: "100%",
  },
  mealSectionContainer: {
    marginBottom: verticalScale(0),
  },
  sectionHeader: {
    width: "100%",
    alignItems: "center",
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(8),
  },
  item: {
    width: wp(95),
    alignItems: "center",
    gap: verticalScale(10),
  },
  mealItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(10),
  },
  mealImage: {
    height: hp(20),
    width: wp(75),
  },
  mealImageStyle: {
    height: hp(20),
    width: wp(75),
    borderRadius: 10,
  },

  mealImageContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  mealTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: horizontalScale(5),
  },
  mealIndicator: {
    height: 10,
    width: 10,
    backgroundColor: "red",
    borderRadius: 100,
    top: 10,
  },
  mealTitle: {
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
    backgroundColor: COLORS.brown,
    paddingVertical: verticalScale(2),
    paddingHorizontal: horizontalScale(7),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#4C3F3A",
    gap: verticalScale(5),
  },
  mealDivider: {
    height: verticalScale(20),
    width: 2,
    backgroundColor: COLORS.whiteTail,
  },
  addIngredientsButton: {
    width: "auto",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    borderRadius: verticalScale(10),
    alignSelf: "flex-end",
  },
});
