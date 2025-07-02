import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { useAppSelector } from "../../Redux/store";
import { ActivePlanListItem, trainingPrograms } from "../../Seeds/Plans";
import { workoutPlan } from "../../Seeds/WorkoutProgramData";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import ProgramExcercise from "./ProgramExcerciseList";

type WorkoutProgramDetailsProps = {
  onPressBack: () => void;
};

const TabOptions: Array<"Excercise" | "Details" | "Coach's corner"> = [
  "Excercise",
  "Details",
  "Coach's corner",
];

const COLOR = {
  sender: "#F5ECDC",
  receiver: "#EEF3F8",
  black: "#000",
  white: "#fff",
};

const messages = [
  { id: "1", text: "you will have to do hard", sender: false },
  { id: "2", text: "How do I work the bench press", sender: true },
  { id: "3", text: "You can start with light weights", sender: false },
  { id: "4", text: "You can start with light weights", sender: false },
  { id: "5", text: "You can start with light weights", sender: false },
  { id: "6", text: "You can start with light weights", sender: false },
  { id: "7", text: "You can start with light weights", sender: true },
];

export const ChatBubble: FC<{ text: string; sender: boolean }> = ({
  text,
  sender,
}) => {
  return (
    <View
      style={[
        styles.chatBubble,
        {
          backgroundColor: sender ? COLOR.sender : COLOR.receiver,
          borderTopStartRadius: sender ? 16 : 0,
          borderBottomEndRadius: sender ? 0 : 16,
          alignSelf: sender ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text style={styles.chatBubbleText}>{text}</Text>
    </View>
  );
};

const WorkoutProgramDetails: FC<WorkoutProgramDetailsProps> = ({
  onPressBack,
}) => {
  const navigation = useNavigation<any>();
  const { currentProgramId } = useAppSelector((state) => state.initial);
  const [currentProgramDetails, setCurrentProgramDetails] =
    useState<null | ActivePlanListItem>(null);
  const [activeProgramTab, setActiveProgramTab] = useState<
    "Excercise" | "Details" | "Coach's corner"
  >("Excercise");
  const [message, setMessage] = useState("");

  const [isPlanActive, setIsPlanActive] = useState(false);

  const [isKyeboard, setisKyeboard] = useState(false);

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

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setisKyeboard(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setisKyeboard(false);
    });

    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  useEffect(() => {
    const foundProgram = trainingPrograms.find(
      (item) => item.id === currentProgramId
    );
    setCurrentProgramDetails(foundProgram ?? null);
  }, [currentProgramId]);

  return (
    <View style={styles.container}>
      {!isKyeboard && (
        <ImageBackground
          source={{
            uri: currentProgramDetails?.coverImage,
          }}
          style={styles.coverImage}
          imageStyle={styles.coverImageStyle}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "#1F1A16"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.headerContainer}>
              <CustomIcon onPress={onPressBack} Icon={ICONS.BackArrow} />
              <View style={styles.headerTextContainer}>
                <CustomText fontFamily="bold">
                  {currentProgramDetails?.title}
                </CustomText>
                <View style={styles.tagContainer}>
                  {currentProgramDetails?.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <CustomText fontSize={12}>{tag}</CustomText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      )}

      <View style={styles.tabContainer}>
        {TabOptions.map(
          (tab: "Excercise" | "Details" | "Coach's corner", index: number) => {
            const isSelected = activeProgramTab === tab;
            return (
              <Pressable
                key={index}
                onPress={() => setActiveProgramTab(tab)}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: isSelected ? COLORS.yellow : "transparent",
                  },
                ]}
              >
                <CustomText>{tab}</CustomText>
              </Pressable>
            );
          }
        )}
      </View>

      {activeProgramTab === "Excercise" && (
        <ProgramExcercise
          programData={workoutPlan}
          isActivated={isPlanActive}
          onPressActive={() => setIsPlanActive(!isPlanActive)}
        />
      )}

      {activeProgramTab === "Details" && (
        <ScrollView contentContainerStyle={styles.detailsContainer}>
          <View style={styles.detailsStatsContainer}>
            <View style={styles.statItem}>
              <CustomIcon Icon={ICONS.EnduranceIcon} height={48} width={48} />
              <CustomText fontSize={14} fontFamily="bold">
                Endurance
              </CustomText>
            </View>
            <View style={styles.statItem}>
              <CustomIcon
                Icon={ICONS.GreenCalendarIcon}
                height={48}
                width={48}
              />
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
            Juicy, tender salmon fillet seasoned with a zesty lemon-herb
            marinade, grilled to perfection. Served on a bed of fluffy quinoa
            mixed with fresh cherry tomatoes, crisp cucumbers, chopped parsley,
            and a drizzle of olive oil. Accompanied by a side of roasted
            asparagus for a light, healthy, and flavorful meal. Perfect for a
            refreshing post-workout dinner or a wholesome lunch!
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            Juicy, tender salmon fillet seasoned with a zesty lemon-herb
            marinade, grilled to perfection. Served on a bed of fluffy quinoa
            mixed with fresh cherry tomatoes, crisp cucumbers, chopped parsley,
            and a drizzle of olive oil. Accompanied by a side of roasted
            asparagus for a light, healthy, and flavorful meal. Perfect for a
            refreshing post-workout dinner or a wholesome lunch!
          </CustomText>
        </ScrollView>
      )}

      {activeProgramTab === "Coach's corner" && (
        <View style={styles.conversationContainer}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatBubble text={item.text} sender={item.sender} />
            )}
          />
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              style={styles.messageInput}
            />
            <View style={styles.sendIconContainer}>
              <CustomIcon Icon={ICONS.SendMessageIcon} height={40} width={40} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default WorkoutProgramDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
    paddingTop: verticalScale(10),
  },
  coverImage: {
    height: hp(15),
  },
  coverImageStyle: {
    borderRadius: 10,
    resizeMode: "cover",
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: verticalScale(10),
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(10),
  },
  headerTextContainer: {
    gap: verticalScale(10),
  },
  tagContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
    marginTop: 5,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: COLORS.brown,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 5,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: verticalScale(8),
  },
  tabButton: {
    justifyContent: "center",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(8),
    borderRadius: 10,
  },
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
  conversationContainer: {
    paddingHorizontal: horizontalScale(10),
    gap: verticalScale(10),
    flex: 1,
    justifyContent: "space-between",
  },
  chatBubble: {
    padding: 12,
    borderTopEndRadius: 16,
    borderBottomStartRadius: 16,
    maxWidth: "75%",
    marginVertical: 4,
  },
  chatBubbleText: {
    color: COLORS.black,
    fontSize: 16,
  },
  inputContainer: {
    position: "relative",
  },
  messageInput: {
    backgroundColor: COLORS.white,
    borderRadius: 100,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderWidth: 1.5,
    borderColor: "#979C9E",
  },
  sendIconContainer: {
    position: "absolute",
    right: horizontalScale(0),
    top: "50%",
    transform: [{ translateY: -20 }],
  },
});
