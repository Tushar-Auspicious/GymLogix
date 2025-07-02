import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import PrimaryButton from "../../Components/PrimaryButton";
import {
  setActiveWorkoutprogramIndex,
  setCurrentprogramId,
  setCurrentProgramList,
} from "../../Redux/slices/initialSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import bulkingPrograms, { trainingPrograms } from "../../Seeds/Plans";
import { BottomTabParams, MainStackParams } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import WorkoutProgramDetails from "./WorkoutProgramDetails";

export type WorkoutPlansListProps = {
  navigation: NativeStackNavigationProp<
    MainStackParams & BottomTabParams,
    "PLAN",
    undefined
  >;
};

const WorkoutPlansList: FC<WorkoutPlansListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { activeWorkoutprogramIndex, currentProgramList } = useAppSelector(
    (state) => state.initial
  );

  const renderBanner = () => {
    return (
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=1598&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.bannerImage}
        imageStyle={styles.bannerImageStyle}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(setCurrentprogramId("2"));
              dispatch(setActiveWorkoutprogramIndex(2));
            }}
            style={styles.bannerTouchable}
          >
            <CustomText
              fontSize={24}
              fontFamily="bold"
              style={styles.bannerText}
            >
              Full Program Hyper Throphy
            </CustomText>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    );
  };

  const renderGymPrograms = () => {
    return (
      <View style={styles.sectionContainer}>
        {trainingPrograms.slice(4, 6).map((item, index) => {
          return (
            <Pressable
              key={item.id + index.toString()}
              onPress={() => {
                dispatch(setCurrentprogramId(item.id));
                dispatch(setActiveWorkoutprogramIndex(2));
              }}
            >
              <ImageBackground
                source={{
                  uri: item.coverImage,
                }}
                style={styles.programImage}
                imageStyle={styles.programImageStyle}
              >
                <View style={[styles.gradient, styles.programTextContainer]}>
                  <CustomText
                    fontSize={20}
                    fontFamily="bold"
                    style={styles.programTitle}
                  >
                    {item.title}
                  </CustomText>
                  <View style={styles.tagContainer}>
                    {item.tags.map((tag, index) => (
                      <CustomText
                        key={index}
                        style={styles.tag}
                        fontFamily="italicBold"
                        fontSize={12}
                        color={COLORS.black}
                      >
                        {tag}
                      </CustomText>
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          );
        })}
        <PrimaryButton
          isFullWidth
          title="See All"
          onPress={() => {
            dispatch(
              setCurrentProgramList({
                title: "Gym Programs",
                data: trainingPrograms,
              })
            );
            dispatch(setActiveWorkoutprogramIndex(1));
          }}
          backgroundColor={COLORS.lightBrown}
          style={styles.seeAllButton}
        />
      </View>
    );
  };

  const renderTrendingPrograms = () => {
    return (
      <FlatList
        data={trainingPrograms}
        horizontal
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                dispatch(setActiveWorkoutprogramIndex(2));
                dispatch(setCurrentprogramId(item.id));
              }}
              style={styles.trendingProgramItem}
            >
              <Image
                source={{ uri: item.coverImage }}
                style={styles.trendingProgramImage}
              />
              <CustomText
                fontFamily="semiBold"
                style={styles.trendingProgramTitle}
              >
                {item.title}
              </CustomText>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.trendingProgramsList}
      />
    );
  };

  const renderStrengthPrograms = () => {
    return (
      <View style={styles.sectionContainer}>
        {trainingPrograms.slice(6, 8).map((item, index) => {
          return (
            <ImageBackground
              key={item.id + index.toString()}
              source={{
                uri: item.coverImage,
              }}
              style={styles.programImage}
              imageStyle={styles.programImageStyle}
            >
              <Pressable
                onPress={() => {
                  dispatch(setCurrentprogramId(item.id));
                  dispatch(setActiveWorkoutprogramIndex(2));
                }}
                style={[styles.gradient, styles.programTextContainer]}
              >
                <CustomText
                  fontSize={20}
                  fontFamily="bold"
                  style={styles.programTitle}
                >
                  Full Program Hyper Throphy
                </CustomText>
                <View style={styles.tagContainer}>
                  {item.tags.map((tag, index) => (
                    <CustomText
                      key={index}
                      style={styles.tag}
                      fontFamily="italicBold"
                      fontSize={12}
                      color={COLORS.black}
                    >
                      {tag}
                    </CustomText>
                  ))}
                </View>
              </Pressable>
            </ImageBackground>
          );
        })}
        <PrimaryButton
          isFullWidth
          title="See All"
          onPress={() => {
            dispatch(
              setCurrentProgramList({
                title: "Strength Programs",
                data: trainingPrograms,
              })
            );
            dispatch(setActiveWorkoutprogramIndex(1));
          }}
          backgroundColor={COLORS.lightBrown}
          style={styles.seeAllButton}
        />
      </View>
    );
  };

  const renderFullWidthPrograms = (data: any[]) => {
    return (
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        {data.map((item, index) => {
          return (
            <ImageBackground
              key={item.id + index.toString()}
              source={{
                uri: item.coverImage,
              }}
              style={styles.fullWidthProgramImage}
              imageStyle={styles.programImageStyle}
            >
              <Pressable
                onPress={() => {
                  dispatch(setCurrentprogramId(item.id));
                  dispatch(setActiveWorkoutprogramIndex(2));
                }}
                style={[
                  styles.gradient,
                  {
                    justifyContent: "flex-end",
                    paddingVertical: verticalScale(10),
                    paddingHorizontal: horizontalScale(10),
                  },
                ]}
              >
                <CustomText fontFamily="bold">{item?.title}</CustomText>
                <View style={styles.tagContainer}>
                  {item?.tags.map((tag: string, index: number) => (
                    <CustomText
                      key={index}
                      style={styles.tag}
                      fontFamily="italicBold"
                      fontSize={12}
                      color={COLORS.black}
                    >
                      {tag}
                    </CustomText>
                  ))}
                </View>
              </Pressable>
            </ImageBackground>
          );
        })}
        {activeWorkoutprogramIndex === 0 && (
          <PrimaryButton
            isFullWidth
            title="See All"
            onPress={() => {
              setCurrentProgramList({
                title: "Lose Weight programs",
                data: bulkingPrograms,
              });
              dispatch(setActiveWorkoutprogramIndex(1));
            }}
            backgroundColor={COLORS.lightBrown}
            style={styles.seeAllButton}
          />
        )}
      </ScrollView>
    );
  };

  const renderMainView = () => {
    switch (activeWorkoutprogramIndex) {
      case 0:
        return (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            nestedScrollEnabled={true}
            style={styles.scrollView}
          >
            {" "}
            {renderBanner()}
            <CustomText
              fontSize={22}
              fontFamily="extraBold"
              style={styles.sectionTitle}
            >
              Gym programs
            </CustomText>
            {renderGymPrograms()}
            <CustomText
              fontSize={22}
              fontFamily="extraBold"
              style={styles.sectionTitle}
            >
              Trending Programs
            </CustomText>
            {renderTrendingPrograms()}
            <CustomText
              fontSize={22}
              fontFamily="extraBold"
              style={styles.sectionTitle}
            >
              Strength Programs
            </CustomText>
            {renderStrengthPrograms()}
          </ScrollView>
        );
      case 1:
        return (
          <View style={styles.fullWidthView}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setActiveWorkoutprogramIndex(0));
                }}
              >
                <CustomIcon Icon={ICONS.BackArrow} />
              </TouchableOpacity>
              <CustomText
                fontSize={22}
                fontFamily="extraBold"
                style={styles.headerTitle}
              >
                {currentProgramList.title}
              </CustomText>
            </View>
            {renderFullWidthPrograms(currentProgramList.data)}
          </View>
        );
      case 2:
        return (
          <WorkoutProgramDetails
            onPressBack={() => dispatch(setActiveWorkoutprogramIndex(0))}
          />
        );
      default:
        return null;
    }
  };

  return <View style={{ flex: 1 }}>{renderMainView()}</View>;
};

export default WorkoutPlansList;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    gap: verticalScale(30),
    paddingBottom: verticalScale(20),
    backgroundColor: COLORS.darkBrown,
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
    marginTop: 5,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: COLORS.whiteGreenish,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 5,
  },
  bannerImage: {
    height: hp(35),
    justifyContent: "flex-end",
  },
  bannerImageStyle: {
    borderRadius: 10,
    resizeMode: "cover",
  },
  bannerTouchable: {
    paddingHorizontal: verticalScale(10),
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: verticalScale(10),
  },
  bannerText: {
    width: "70%",
    paddingBottom: verticalScale(10),
  },
  sectionContainer: {
    gap: verticalScale(15),
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(50),
  },
  programImage: {
    height: hp(25),
    overflow: "hidden",
    borderRadius: 10,
  },
  programImageStyle: {
    resizeMode: "cover",
  },
  programTextContainer: {
    justifyContent: "flex-end",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  programTitle: {
    width: "100%",
  },
  seeAllButton: {
    borderRadius: 100,
  },
  trendingProgramsList: {
    paddingBottom: verticalScale(20),
    gap: verticalScale(15),
    paddingHorizontal: horizontalScale(10),
  },
  trendingProgramItem: {
    width: wp(35),
    gap: verticalScale(10),
  },
  trendingProgramImage: {
    height: hp(20),
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  trendingProgramTitle: {
    flex: 1,
  },
  fullWidthProgramImage: {
    height: hp(25),
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 10,
  },
  fullWidthView: {
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
  },
  sectionTitle: {
    paddingHorizontal: horizontalScale(10),
  },
  headerTitle: {
    paddingHorizontal: horizontalScale(10),
  },
});
