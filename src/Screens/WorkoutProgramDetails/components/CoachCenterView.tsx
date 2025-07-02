import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { horizontalScale, verticalScale, wp } from "../../../Utilities/Metrics";
import COLORS from "../../../Utilities/Colors";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";
import { ChatBubble } from "../../Plan/WorkoutProgramDetails";
import { KeyboardAvoidingContainer } from "../../../Components/KeyboardAvoidingComponent";
import { CustomText } from "../../../Components/CustomText";
import PrimaryButton from "../../../Components/PrimaryButton";
const messages = [
  { id: "1", text: "you will have to do hard", sender: false },
  { id: "2", text: "How do I work the bench press", sender: true },
  { id: "3", text: "You can start with light weights", sender: false },
];

const CoachCenterView = () => {
  const [message, setMessage] = useState("");
  const [ispremium, setIspremium] = useState(Math.random() < 0.5); // Simulating premium status

  return (
    <KeyboardAvoidingContainer backgroundColor="">
      <View style={styles.conversationContainer}>
        {ispremium ? (
          <>
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
                <CustomIcon
                  Icon={ICONS.SendMessageIcon}
                  height={40}
                  width={40}
                />
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              alignItems: "center",
              marginTop: verticalScale(20),
              flex: 1,
              justifyContent: "center",
            }}
          >
            <CustomText fontFamily="medium" fontSize={20}>
              Premium Access Only
            </CustomText>

            <CustomText
              fontFamily="medium"
              fontSize={14}
              style={{
                marginTop: verticalScale(10),
                marginBottom: verticalScale(30),
                textAlign: "center",
                width: wp(70),
              }}
            >
              Upgrade now to chat, ask questions, and get expert support!
            </CustomText>

            <PrimaryButton
              title="Upgrade now!"
              onPress={() => {}}
              backgroundColor="#FFB700"
              style={{ width: wp(70) }}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingContainer>
  );
};

export default CoachCenterView;

const styles = StyleSheet.create({
  conversationContainer: {
    paddingHorizontal: horizontalScale(10),
    gap: verticalScale(10),
    flex: 1,
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
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
