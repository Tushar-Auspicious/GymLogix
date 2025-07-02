import React, { FC } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import PrimaryButton from "../../Components/PrimaryButton";
import { selectMealById } from "../../Redux/slices/myMealsSlice";
import { useAppSelector } from "../../Redux/store";
import { MealDetailScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

const MACROS = [
  { label: "Calories", key: "calories" },
  { label: "Fat", key: "fat" },
  { label: "Carbs", key: "carbs" },
  { label: "Protein", key: "protein" },
] as const;

const TAGS = Array.from({ length: 7 }, () => "Breakfast");

const MealDetails: FC<MealDetailScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { mealId, isFromMyMeal } = route.params;

  console.log(mealId, "SSS");
  

  const meal = useAppSelector((state) => selectMealById(state, mealId));

  const renderBanner = () => (
    <ImageBackground
      source={{
        uri: meal?.coverImage?.uri,
      }}
      style={styles.banner}
      imageStyle={{ resizeMode: "cover" }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0)", "#1F1A16"]}
        style={styles.gradient}
      >
        <View
          style={[
            styles.bannerTextContainer,
            {
              paddingTop: insets.top + verticalScale(5),
            },
          ]}
        >
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.BackArrow}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomText
              fontSize={18}
              fontFamily="bold"
              style={styles.bannerText}
            >
              {meal?.title}
            </CustomText>
            {isFromMyMeal && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("editMealDetails", { mealId })
                }
                activeOpacity={0.7}
              >
                <CustomIcon Icon={ICONS.EditIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );

  const renderMacros = () => (
    <View style={styles.section}>
      <CustomText fontFamily="extraBold" fontSize={24}>
        Macros
      </CustomText>
      <View style={styles.macrosContainer}>
        {MACROS.map(({ label, key }) => (
          <View key={label} style={styles.macroRow}>
            <CustomText fontSize={14} fontFamily="medium">
              {label}
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              {meal?.macros[key]}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMealImages = () => (
    <FlatList
      horizontal
      data={meal?.mealImages}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.mealList}
      renderItem={({ item }) => (
        <ImageBackground
          source={{ uri: item.uri }}
          imageStyle={{
            borderRadius: 10,
          }}
          style={styles.mealImage}
        ></ImageBackground>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );

  const renderSectionDivider = () => <View style={styles.divider} />;

  console.log(meal?.ingredients);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {renderBanner()}

      {/* Info Section */}
      {!isFromMyMeal && (
        <View style={styles.infoRow}>
          {["10 min", "Medium", "512 cal"].map((info) => (
            <CustomText key={info} fontSize={14} fontFamily="medium">
              {info}
            </CustomText>
          ))}
        </View>
      )}

      {/* Tags */}
      {!isFromMyMeal && (
        <View style={styles.tagsContainer}>
          {TAGS.map((tag, index) => (
            <CustomText
              key={index}
              fontSize={14}
              fontFamily="medium"
              color={COLORS.whiteTail}
              style={styles.tag}
            >
              {tag}
            </CustomText>
          ))}
        </View>
      )}

      {renderMacros()}
      {renderSectionDivider()}

      {/* Description */}
      <View style={styles.section}>
        <CustomText fontFamily="extraBold" fontSize={24}>
          Description
        </CustomText>
        <CustomText fontSize={14} style={styles.description}>
          {meal?.description}
        </CustomText>
      </View>
      {renderSectionDivider()}

      {renderMealImages()}
      {renderSectionDivider()}

      {/* Ingredients */}
      {meal?.ingredients && meal?.ingredients.length > 0 && (
        <View style={styles.section}>
          <CustomText fontFamily="extraBold" fontSize={24}>
            Ingredients
          </CustomText>
          <View style={styles.ingredientsContainer}>
            {meal?.ingredients.map(({ title = "", quantity, image }, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Image source={{ uri: image }} style={styles.ingredientImage} />
                <CustomText style={styles.ingredientText}>{title}</CustomText>
                <CustomText>{quantity}</CustomText>
              </View>
            ))}
          </View>
        </View>
      )}

      {renderSectionDivider()}

      {/* Instructions */}
      <View style={styles.section}>
        <CustomText fontFamily="extraBold" fontSize={24}>
          Instructions
        </CustomText>
        <CustomText fontSize={14} style={styles.description}>
          {meal?.instructions}
        </CustomText>
      </View>

      <PrimaryButton
        title="Log"
        onPress={() => {
          navigation.goBack();
          Toast.show({
            type: "success",
            text1: "Meal Logged Successfully",
            visibilityTime: 2000,
          });
        }}
        style={styles.button}
      />
    </ScrollView>
  );
};

export default MealDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
  },
  contentContainer: {
    gap: verticalScale(30),
    paddingBottom: verticalScale(20),
  },
  banner: {
    height: hp(45),
    justifyContent: "flex-end",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: "space-between",
    gap: verticalScale(10),
    paddingBottom: verticalScale(50),
    paddingHorizontal: horizontalScale(10),
  },
  bannerText: {
    width: "85%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: verticalScale(10),
    columnGap: horizontalScale(10),
    justifyContent: "center",
  },
  tag: {
    padding: verticalScale(5),
    backgroundColor: COLORS.brown,
    borderWidth: 1,
    borderColor: COLORS.lightBrown,
    borderRadius: 5,
  },
  section: {
    gap: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  macrosContainer: {
    paddingRight: horizontalScale(20),
    gap: verticalScale(10),
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 0.4,
    backgroundColor: COLORS.lightBrown,
    width: "95%",
    alignSelf: "center",
  },
  description: {
    lineHeight: 22,
  },
  mealList: {
    gap: horizontalScale(15),
    paddingHorizontal: horizontalScale(20),
  },
  mealImage: {
    height: hp(18),
    width: wp(35),
    resizeMode: "cover",
    borderRadius: 10,
  },
  ingredientsContainer: {
    gap: verticalScale(10),
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingRight: horizontalScale(20),
  },
  ingredientImage: {
    height: hp(8),
    width: hp(8),
    resizeMode: "cover",
    borderRadius: 10,
  },
  ingredientText: {
    flex: 1,
  },
  button: {
    width: wp(30),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 10,
  },
});
