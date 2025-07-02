import React, { FC, useState } from "react";
import { Alert, ImageBackground, StyleSheet, View } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import UploadImageOptions from "../../Components/Modals/UploadImageOptions";
import PrimaryButton from "../../Components/PrimaryButton";
import {
  ExerciseListItem,
  resetNewWorkoutSlice,
  setActiveStep,
  setWorkoutData,
} from "../../Redux/slices/newWorkoutSlice";
import { saveWorkout } from "../../Redux/slices/savedWorkoutsSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { AddNewWorkoutScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { hp, verticalScale, wp } from "../../Utilities/Metrics";
import AddNewExercise from "./steps/AddNewExercise";
import SelectExercise from "./steps/SelectExercise";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import WorkroutDataScreen from "./steps/WorkroutDataScreen";
import { KeyboardAvoidingContainer } from "../../Components/KeyboardAvoidingComponent";
import ExerciseSettings from "./steps/ExerciseSettings";
import SelectAlternateExercise from "./steps/SelectAlternateExercise";

const AddNewWorkout: FC<AddNewWorkoutScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { workoutData, activeStep } = useAppSelector(
    (state) => state.newWorkout
  );

  const [isUploadOptionModal, setIsUploadOptionModal] = useState(false);

  const [selectedDayForAddExercise, setSelectedDayForAddExercise] =
    useState<ExerciseListItem | null>(null);

  const closeModal = () => {
    setIsUploadOptionModal(false);
  };

  const [selectedExerciseForSettingsStep, setSelectedExerciseForSettingsStep] =
    useState<string | null>(null);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        dispatch(
          setWorkoutData({
            ...workoutData,
            coverImage: asset,
          })
        );
      }
      closeModal();
    });
  };

  const handleCameraPick = async () => {
    try {
      const result = await launchCamera({
        quality: 1,
        mediaType: "photo",
      });

      if (result.didCancel) {
        console.log("User cancelled camera");
      } else if (result.errorCode) {
        console.log("Camera error:", result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        dispatch(
          setWorkoutData({
            ...workoutData,
            coverImage: asset,
          })
        );
      }
      closeModal();
    } catch (error) {
      console.log("Camera capture failed:", error);
    }
  };

  const isNextButtonDisabled = () => {
    switch (activeStep) {
      case 1:
        return !workoutData.name.trim();
      case 2:
        return !workoutData.goal;
      case 3:
        return !workoutData.location;
      case 4:
        return !workoutData.instruction.trim();
      case 5:
        return workoutData.durationInWeeks === 0;
      default:
        return false;
    }
  };

  const renderSteps = () => {
    switch (activeStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6 />;
      case 7:
        return (
          <WorkroutDataScreen
            selectedDayForAddExercise={selectedDayForAddExercise}
            setSelectedDayForAddExercise={setSelectedDayForAddExercise}
          />
        );
      case 8:
        return (
          <SelectExercise
            selectedDayForAddExercise={selectedDayForAddExercise}
            setSelectedExerciseForSettingsStep={
              setSelectedExerciseForSettingsStep
            }
          />
        );
      case 9:
        return <AddNewExercise />;
      case 10:
        return (
          <ExerciseSettings
            selectedExercise={selectedExerciseForSettingsStep}
            setSelectedExercise={setSelectedExerciseForSettingsStep}
          />
        );
      case 11:
        return (
          <SelectAlternateExercise
            selectedExercise={selectedExerciseForSettingsStep}
          />
        );
    }
  };

  return (
    <View style={styles.main}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingContainer backgroundColor="transparent">
          {activeStep < 8 && (
            <ImageBackground
              source={
                workoutData.coverImage
                  ? { uri: workoutData.coverImage.uri }
                  : IMAGES.exerciseDummy
              }
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
                  <CustomIcon
                    onPress={() => {
                      if (activeStep === 1) {
                        navigation.goBack();
                      } else {
                        dispatch(setActiveStep(activeStep - 1));
                      }
                    }}
                    Icon={ICONS.BackArrow}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: wp(90),
                    }}
                  >
                    <CustomText color={COLORS.white} fontSize={18}>
                      {workoutData.name ? workoutData.name : "New Exercise"}
                    </CustomText>
                    {activeStep === 7 ? (
                      <CustomIcon
                        onPress={() => dispatch(setActiveStep(1))}
                        Icon={ICONS.smallSettingIcon}
                        height={24}
                        width={24}
                      />
                    ) : (
                      <CustomIcon
                        onPress={() => setIsUploadOptionModal(true)}
                        Icon={ICONS.EditIcon}
                        height={24}
                        width={24}
                      />
                    )}
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          )}
          {renderSteps()}

          {activeStep < 8 && (
            <View
              style={{
                paddingVertical: verticalScale(20),
              }}
            >
              <PrimaryButton
                title={activeStep === 7 ? "Save Workout" : "Next"}
                onPress={() => {
                  if (activeStep === 7) {
                    // Save the workout
                    dispatch(saveWorkout(workoutData));

                    // Show success message
                    Alert.alert(
                      "Success!",
                      `Workout "${workoutData.name}" has been saved successfully!`,
                      [
                        {
                          text: "View My Workouts",
                          onPress: () => {
                            dispatch(resetNewWorkoutSlice());
                            navigation.navigate("savedWorkouts");
                          },
                        },
                        {
                          text: "Create Another",
                          onPress: () => {
                            dispatch(resetNewWorkoutSlice());
                            dispatch(setActiveStep(1));
                          },
                        },
                      ]
                    );
                  } else {
                    // Continue to next step
                    dispatch(setActiveStep(activeStep + 1));
                  }
                }}
                disabled={isNextButtonDisabled()}
              />
              {activeStep > 1 && activeStep < 7 && (
                <PrimaryButton
                  title="Skip"
                  onPress={() => {
                    dispatch(setActiveStep(activeStep + 1));
                  }}
                  backgroundColor={"transparent"}
                  textColor={COLORS.white}
                  style={{ alignSelf: "center" }}
                />
              )}
            </View>
          )}
        </KeyboardAvoidingContainer>
      </SafeAreaView>
      {isUploadOptionModal && (
        <UploadImageOptions
          closeModal={closeModal}
          isModalVisible={isUploadOptionModal}
          onPressCamera={handleCameraPick}
          onPressGallery={handleImagePick}
        />
      )}
    </View>
  );
};

export default AddNewWorkout;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.darkBrown,
    flex: 1,
    paddingBottom: verticalScale(5),
  },
  safeArea: { flex: 1, gap: verticalScale(10) },
  coverImage: {
    height: hp(20),
    justifyContent: "flex-end",
  },
  coverImageStyle: {
    borderRadius: 10,
    resizeMode: "cover",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: verticalScale(10),
    paddingVertical: verticalScale(20),
    paddingHorizontal: verticalScale(10),
  },
});
