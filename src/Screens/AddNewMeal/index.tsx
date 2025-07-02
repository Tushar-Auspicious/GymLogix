import React, { FC, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import LinearGradient from "react-native-linear-gradient";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import UploadImageOptions from "../../Components/Modals/UploadImageOptions";
import PrimaryButton from "../../Components/PrimaryButton";
import {
  removeIngredient,
  removeMealImage,
  resetMeal,
  setCoverImage,
  setDescription,
  setInstructions,
  setMacros,
  setMealImages,
  setTitle,
} from "../../Redux/slices/newMealSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { AddNewMealScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import { addMeal } from "../../Redux/slices/myMealsSlice";

export interface CapturedPhoto {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
}

const AddNewMeal: FC<AddNewMealScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const {
    title,
    description,
    coverImage,
    ingredients,
    macros,
    mealImages,
    instructions,
  } = useAppSelector((state) => state.newMeal);

  const [isUploadImageOptionModal, setIsUploadImageOptionModal] =
    useState(false);

  const [isMealImagesModal, setIsMealImagesModal] = useState(false);

  const [showInstructionInput, setShowInstructionInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showMacrosInput, setShowMacrosInput] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(false);

  const handleSave = () => {
    navigation.goBack();
    dispatch(
      addMeal({
        id: `meals-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        coverImage,
        description,
        title,
        ingredients,
        instructions,
        macros,
        mealImages,
      })
    );
    dispatch(resetMeal());
  };

  const closeModal = () => {
    setIsUploadImageOptionModal(false);
    setIsMealImagesModal(false);
  };

  const openImagePicker = (type: "cover" | "ingredient", index?: number) => {
    setIsUploadImageOptionModal(true);
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const imageData: CapturedPhoto = {
          uri: asset.uri || "",
          width: asset.width,
          height: asset.height,
          type: asset.type,
        };
        dispatch(setCoverImage(imageData));
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
        const imageData: CapturedPhoto = {
          uri: asset.uri || "",
          width: asset.width,
          height: asset.height,
          type: asset.type,
        };

        dispatch(setCoverImage(imageData));
      }

      closeModal();
    } catch (error) {
      console.log("Camera capture failed:", error);
    }
  };

  const removeImage = (index: number) => {
    dispatch(removeMealImage(index));
  };

  // Function to handle multiple image selection from gallery
  const handleMultipleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        selectionLimit: 0, // 0 means no limit
      });

      if (result.didCancel) {
        console.log("User cancelled image picker");
      } else if (result.errorCode) {
        console.log("ImagePicker Error:", result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        // Add new images to existing ones
        dispatch(setMealImages([...mealImages, ...(result.assets as Asset[])]));
      }
      closeModal();
    } catch (error) {
      console.log("Multiple image selection failed:", error);
    }
  };

  // Function to handle multiple image selection from camera
  const handleMultipleImageCamera = async () => {
    try {
      const result = await launchCamera({
        quality: 0.8,
        mediaType: "photo",
      });

      if (result.didCancel) {
        console.log("User cancelled camera");
      } else if (result.errorCode) {
        console.log("Camera Error:", result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        // Add new image to existing ones
        dispatch(setMealImages([...mealImages, ...(result.assets as Asset[])]));
      }
      closeModal();
    } catch (error) {
      console.log("Camera capture failed:", error);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <ScrollView
        contentContainerStyle={{
          gap: verticalScale(40),
        }}
      >
        {/* Cover Image Section */}
        <ImageBackground
          source={{
            uri: coverImage?.uri,
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <CustomIcon
                  onPress={() => navigation.goBack()}
                  Icon={ICONS.BackArrow}
                />
                <View style={styles.headerTextContainer}>
                  <CustomIcon
                    onPress={() => {
                      openImagePicker("cover");
                    }}
                    Icon={ICONS.EditIcon}
                  />
                </View>
              </View>

              {/* Title Section */}
              <View style={[styles.section, { width: "100%" }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: horizontalScale(10),
                  }}
                >
                  <CustomText fontFamily="extraBold" fontSize={18}>
                    {title.length > 0 ? title : "Title"}
                  </CustomText>
                  <TouchableOpacity
                    onPress={() => setShowTitleInput(!showTitleInput)}
                  >
                    <CustomIcon Icon={ICONS.EditIcon} height={20} width={20} />
                  </TouchableOpacity>
                </View>
                {showTitleInput && (
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={(text) => dispatch(setTitle(text))}
                    placeholder="Enter meal title"
                    placeholderTextColor={COLORS.lightBrown}
                  />
                )}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Macros Section */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomText fontFamily="extraBold" fontSize={18}>
              Macros
            </CustomText>
          </View>
          {ingredients.length > 0 && (
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  Calories
                </CustomText>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  {ingredients.reduce(
                    (sum, item) => sum + (item.calories[0] || 0),
                    0
                  )}
                </CustomText>
              </View>

              <View style={styles.macroItem}>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  Fat
                </CustomText>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  {ingredients.reduce(
                    (sum, item) => sum + (item.calories[1] || 0),
                    0
                  )}
                </CustomText>
              </View>

              <View style={styles.macroItem}>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  Carbs
                </CustomText>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  {ingredients.reduce(
                    (sum, item) => sum + (item.calories[2] || 0),
                    0
                  )}
                </CustomText>
              </View>

              <View style={styles.macroItem}>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  Protein
                </CustomText>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.whiteTail}
                >
                  {ingredients.reduce(
                    (sum, item) => sum + (item.calories[3] || 0),
                    0
                  )}
                </CustomText>
              </View>
            </View>
          )}
        </View>

        {/* Description Section */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View
            style={{
              justifyContent: "space-between",
              gap: verticalScale(10),
            }}
          >
            <CustomText fontFamily="extraBold" fontSize={18}>
              Description
            </CustomText>
            <TouchableOpacity
              onPress={() => setShowDescriptionInput(!showDescriptionInput)}
            >
              <CustomIcon Icon={ICONS.EditIcon} height={20} width={20} />
            </TouchableOpacity>
          </View>
          {showDescriptionInput && (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={description}
              onChangeText={(text) => dispatch(setDescription(text))}
              placeholder="Enter meal description"
              placeholderTextColor={COLORS.lightBrown}
              multiline
              numberOfLines={4}
            />
          )}
        </View>

        {/* Meal Images Section */}
        <View
          style={[
            styles.imagesContainer,
            {
              justifyContent:
                mealImages.length === 1 ? "flex-start" : "space-between",
            },
          ]}
        >
          {mealImages.map((image, index) => (
            <View
              key={index}
              style={[
                styles.imageItem,
                {
                  width: index === 3 ? wp(90) : horizontalScale(100),
                  height: index === 3 ? hp(30) : horizontalScale(100),
                },
              ]}
            >
              <Image
                source={{ uri: image.uri }}
                style={
                  index === 3
                    ? {
                        ...styles.mealImage,
                        width: horizontalScale(400),
                        height: horizontalScale(400),
                      }
                    : styles.mealImage
                }
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <CustomIcon Icon={ICONS.DeleteIcon} height={16} width={16} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add image button */}
          {mealImages.length < 4 && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => setIsMealImagesModal(true)}
            >
              <CustomIcon Icon={ICONS.PlusIcon} height={24} width={24} />
            </TouchableOpacity>
          )}
        </View>

        {/* Ingredients Section */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={styles.sectionHeader}>
            <CustomText fontFamily="extraBold" fontSize={18}>
              Ingredients
            </CustomText>
            <PrimaryButton
              onPress={() =>
                navigation.navigate("ingredientList", {
                  isFrom: "addNewMeal",
                })
              }
              title="Add ingredients"
              isFullWidth={false}
              style={{
                paddingVertical: verticalScale(5),
                paddingHorizontal: horizontalScale(10),
                borderRadius: verticalScale(5),
              }}
            />
          </View>
          <FlatList
            data={ingredients}
            contentContainerStyle={{ gap: horizontalScale(10) }}
            renderItem={({ item: ingredient, index }) => {
              return (
                <View key={index} style={styles.ingredientRow}>
                  <Image
                    source={{ uri: ingredient.image }}
                    style={{ height: 70, width: 70, borderRadius: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <CustomText fontFamily="medium" fontSize={14}>
                      {ingredient.title}
                    </CustomText>
                  </View>
                  <CustomText fontFamily="medium" fontSize={14}>
                    {ingredient.quantity}
                  </CustomText>

                  <TouchableOpacity
                    style={{ marginLeft: horizontalScale(20) }}
                    onPress={() => dispatch(removeIngredient(ingredient.id))}
                  >
                    <CustomIcon
                      Icon={ICONS.DeleteIcon}
                      height={20}
                      width={20}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>

        {/* Instructions Section */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View
            style={{
              justifyContent: "space-between",
              gap: verticalScale(10),
            }}
          >
            <CustomText fontFamily="extraBold" fontSize={18}>
              Instructions
            </CustomText>
            <TouchableOpacity
              onPress={() => setShowInstructionInput(!showInstructionInput)}
            >
              <CustomIcon Icon={ICONS.EditIcon} height={20} width={20} />
            </TouchableOpacity>
          </View>
          {showInstructionInput && (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={instructions}
              onChangeText={(text) => dispatch(setInstructions(text))}
              placeholder="Enter cooking instructions"
              placeholderTextColor={COLORS.lightBrown}
              multiline
              numberOfLines={6}
            />
          )}
        </View>

        {/* Save Button */}
        <PrimaryButton
          title="Save"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={
            !title || !description || !instructions || ingredients.length == 0
          }
        />
      </ScrollView>

      {isUploadImageOptionModal && (
        <UploadImageOptions
          closeModal={closeModal}
          isModalVisible={isUploadImageOptionModal}
          onPressCamera={handleCameraPick}
          onPressGallery={handleImagePick}
          title={"Select Cover Image"}
        />
      )}
      {isMealImagesModal && (
        <UploadImageOptions
          closeModal={() => setIsMealImagesModal(false)}
          isModalVisible={isMealImagesModal}
          onPressCamera={handleMultipleImageCamera}
          onPressGallery={handleMultipleImagePick}
        />
      )}
    </View>
  );
};

export default AddNewMeal;

const styles = StyleSheet.create({
  coverImage: {
    height: hp(20),
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
    paddingHorizontal: verticalScale(15),
    paddingVertical: verticalScale(10),
  },
  headerTextContainer: {
    gap: verticalScale(10),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
    paddingBottom: verticalScale(20),
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(10),
  },
  section: {
    gap: verticalScale(10),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageContainer: {
    height: verticalScale(200),
    borderRadius: 10,
    overflow: "hidden",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: verticalScale(5),
    flexDirection: "row",
    padding: verticalScale(10),
  },
  overlayText: {
    color: COLORS.whiteTail,
    fontFamily: "medium",
  },
  input: {
    backgroundColor: COLORS.brown,
    borderRadius: 8,
    padding: verticalScale(10),
    color: COLORS.whiteTail,
    fontFamily: "medium",
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.lightBrown,
  },
  multilineInput: {
    minHeight: verticalScale(100),
    textAlignVertical: "top",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(10),
  },
  infoInputContainer: {
    flex: 1,
    gap: verticalScale(5),
  },
  infoInput: {
    backgroundColor: COLORS.brown,
    borderRadius: 8,
    padding: verticalScale(8),
    color: COLORS.whiteTail,
    fontFamily: "medium",
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.lightBrown,
    textAlign: "center",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    marginVertical: verticalScale(5),
    position: "relative",
  },
  ingredientImage: {
    height: hp(8),
    width: hp(8),
    resizeMode: "cover",
    borderRadius: 10,
  },
  ingredientInput: {
    flex: 1,
  },
  weightInput: {
    width: wp(20),
    textAlign: "center",
  },
  saveButton: {
    width: wp(40),
    alignSelf: "center",
  },
  ingredientImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  macrosContainer: {
    gap: verticalScale(5),
  },
  macroItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
  },
  macroValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  macroInput: {
    backgroundColor: COLORS.lightBrown,
    borderRadius: 6,
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(12),
    color: COLORS.white,
    fontFamily: "medium",
    fontSize: 14,
    textAlign: "center",
    minWidth: wp(15),
  },

  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(5),
    width: wp(90),
    paddingHorizontal: horizontalScale(10),
  },
  imageItem: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    borderRadius: 20,

    overflow: "hidden",
    position: "relative",
    marginBottom: verticalScale(10),
  },
  mealImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: COLORS.darkBrown,
    borderRadius: 15,
    padding: 5,
  },
  addImageButton: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.whiteTail,
    justifyContent: "center",
    alignItems: "center",
  },
});
