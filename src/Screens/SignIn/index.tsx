import React, {FC, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IMAGES from '../../Assets/Images';
import CustomInput from '../../Components/CustomInput';
import {CustomText} from '../../Components/CustomText';
import GoogleButton from '../../Components/GoogleButton';
import PrimaryButton from '../../Components/PrimaryButton';
import {SignInProps} from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {hp, verticalScale, wp} from '../../Utilities/Metrics';
import {showCustomToast} from '../../Utilities/Helpers';
import ENDPOINTS from '../../APIServices/endPoints';
import {storeLocalStorageData} from '../../Utilities/Storage';
import STORAGE_KEYS from '../../Utilities/Constants';
import {LoginResponse} from '../../Typings/ApiResponse/LoginResponse';
import {UserResponse} from '../../Typings/ApiResponse/UserResponse';
import {fetchData, postData} from '../../APIServices/api';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {setUserData} from '../../Redux/slices/UserSlice';
import {FoodResponse} from '../../Typings/ApiResponse/FoodResponse';
import {setFoodData} from '../../Redux/slices/foodSlice';
import {MealResponse} from '../../Typings/ApiResponse/MyMealResponse';
import {setMeal} from '../../Redux/slices/myMealsSlice';
import {Data, GetPlanResponse} from '../../Typings/ApiResponse/GetPlanResponse';
import {setPlanData} from '../../Redux/slices/PlanDataSlice';
import {setExerciseData} from '../../Redux/slices/ExerciseSlice';
import {ExerciseResponse} from '../../Typings/ApiResponse/ExerciseResponse';
import {setIngredients} from '../../Redux/slices/ingredientSlice';
import {
  ScheduleAPIData,
  setScheduleData,
} from '../../Redux/slices/ScheduleSlice';
import {setExerciseCatalog} from '../../Redux/slices/exerciseCatalogSlice';
import {buildExerciseCatalog} from '../Splash';
import {setInsightData} from '../../Redux/slices/InsightSlice';

const SignIn: FC<SignInProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: 'jack@yopmail.com',
    password: '12345678',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validInputs = () => {
    let valid = true;
    let newErrors = {
      email: '',
      password: '',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!loginDetails.email.trim()) {
      valid = false;
      newErrors.email = 'Email is required.';
      showCustomToast('error', newErrors.email);
      return;
    } else if (!emailRegex.test(loginDetails.email)) {
      valid = false;
      newErrors.email = 'Invalid email format.';
      showCustomToast('error', newErrors.email);

      return;
    }
    if (!loginDetails.password) {
      valid = false;
      newErrors.password = 'Password is required';
      showCustomToast('error', newErrors.password);
      return;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (!validInputs()) {
      return;
    }

    const data = {
      email: loginDetails.email,
      password: loginDetails.password,
    };
    setLoading(true);
    try {
      const response = await postData<LoginResponse>(
        `${ENDPOINTS.signin}?email=${data.email}&password=${data.password}`,
      );

      if (response.status === 200) {
        const rawToken = response.data.token;
        const cleanToken = rawToken.replace(/^Bearer\s/, '');

        await storeLocalStorageData(STORAGE_KEYS.token, cleanToken);

        if (cleanToken) {
          const response = await fetchData<UserResponse>(ENDPOINTS.getUser);

          if (response.data.user) {
            dispatch(setUserData(response.data.user));
          }
          await storeAllHashes();
          await getPlanData();
          await getFoodData();
          await getScheduleData();
          await getInsight();
        }
        // showCustomToast('success', 'Log in Successfully');
        navigation.replace('mainStack', {
          screen: 'tabs',
          params: {
            screen: 'HOME',
          },
        });
      }
    } catch (error: any) {
      console.log(error.reason);
      showCustomToast('error', error.reason || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const storeAllHashes = async () => {
    const hashResponse = await fetchData<any>(ENDPOINTS.allGet);
    if (hashResponse.data) {
      const {foods_hash, exercises_hash, plans_hash} = hashResponse.data;
      await storeLocalStorageData(STORAGE_KEYS.allHashes, {
        foods_hash,
        exercises_hash,
        plans_hash,
      });
    }
  };

  const getFoodData = async () => {
    const response = await fetchData<FoodResponse>(ENDPOINTS.foodGet);

    if (response.data.data) {
      await storeLocalStorageData(
        STORAGE_KEYS.localFoodData,
        response.data.data,
      );

      dispatch(setFoodData(response.data.data));

      // console.log('bsfn', response.data.data);

      dispatch(
        setIngredients(
          response.data.data.map(item => ({
            id: item.id,
            idFood: Number(item.food_id),
            title: item.name,
            percentage: 0,
            image: item.image_url,
            calories: [
              item.calories || 0,
              item.carbs || 0,
              item.fat || 0,
              item.protein || 0,
            ],
            quantity: item.serving_size_amount.toString(),
            measurementUnit: item.serving_size_measurement,
            size: item.serving_weight_grams,
          })),
        ),
      );

      await getMealData(response.data);
    }
  };

  const getMealData = async (foodList: FoodResponse) => {
    const response = await fetchData<MealResponse>(ENDPOINTS.getMeal);

    if (response.data.data) {
      await storeLocalStorageData(
        STORAGE_KEYS.localMealData,
        response.data.data,
      );

      dispatch(
        setMeal(
          response.data.data.map(item => ({
            id: item.meal_id,
            userId: item.user_id,
            coverImage: {
              uri: item.image_url,
            },
            title: item.name,
            description: item.description,
            macros: {
              calories: item.calories,
              fat: item.fats,
              carbs: item.carbs,
              protein: item.protein,
            },
            instructions: item.preparation_instructions,
            isPublic: item.is_public,
            ingredients: item.foods.map(food => {
              const match = foodList.data?.find(
                f => f.food_id === food.food_id,
              );

              return {
                id: food.food_id.toString(),
                idFood: Number(food.food_id),
                title: match?.name || 'Unknown',
                image:
                  match?.image_url ||
                  'https://nix-tag-images.s3.amazonaws.com/384_highres.jpg',
                quantity: match?.serving_size_amount.toString()!,
                percentage: 0,
                calories: [
                  Number(match?.calories) || 0,
                  Number(match?.carbs) || 0,
                  Number(match?.fat) || 0,
                  Number(match?.protein) || 0,
                ],
                size: match?.serving_weight_grams || 0,
                measurementUnit: match?.serving_size_measurement || 'gram',
              };
            }),
            mealImages: [],
            tags: item.tags,
          })),
        ),
      );
    }
  };

  const getPlanData = async () => {
    const response = await fetchData<GetPlanResponse>(ENDPOINTS.planGet);

    if (response.data.data) {
      await storeLocalStorageData(
        STORAGE_KEYS.localWorkoutData,
        response.data.data,
      );

      dispatch(
        setPlanData(
          response.data.data.map(item => ({
            id: item._id ? item._id : item.id ? item.id : item.plan_id,
            title: item.name || '',
            coverImage:
              item.image_url ||
              'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=1598&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            tags: item.tags,
            type: item.type === 'workout' ? 'workout' : 'food',
            allData: item,
          })),
        ),
      );

      await getExerciseData();
    }
  };

  const getExerciseData = async () => {
    const response = await fetchData<ExerciseResponse>(ENDPOINTS.exerciseGet);

    if (response.data.data) {
      const exerciseList = response.data.data;

      await storeLocalStorageData(STORAGE_KEYS.localExerciseData, exerciseList);

      await storeLocalStorageData(
        STORAGE_KEYS.localExerciseCatalog,
        exerciseList,
      );

      dispatch(setExerciseData(exerciseList));

      const catalog = buildExerciseCatalog(exerciseList);
      // console.log('catalog --->', catalog);
      dispatch(setExerciseCatalog(catalog));
    }
  };

  const getScheduleData = async () => {
    try {
      const response = await fetchData<ScheduleAPIData[] | any>(
        ENDPOINTS.schedule,
      );
      if (response.data) {
        await storeLocalStorageData(
          STORAGE_KEYS.localScheduleData,
          response.data,
        );

        // console.log('response -snfks', response.data.data);

        dispatch(setScheduleData(response.data.data));
      }
    } catch (error) {
      console.log(error, 'Something went wrong');
    }
  };

  const getInsight = async () => {
    try {
      const response = await fetchData<any>(ENDPOINTS.get_insight);
      if (response.data.data) {
        await storeLocalStorageData(
          STORAGE_KEYS.localInsight,
          response.data.data,
        );
        dispatch(setInsightData(response.data.data));
      }
    } catch (error) {
      console.log(error, 'Something went wrong');
    }
  };

  return (
    <ImageBackground
      source={IMAGES.authBackground}
      style={[
        styles.background,
        {
          paddingTop: verticalScale(50) + insets.top,
          paddingBottom: verticalScale(10) + insets.bottom,
        },
      ]}>
      <View style={styles.header}>
        <Image source={IMAGES.logo} style={styles.logo} />
      </View>

      <View style={styles.footer}>
        <GoogleButton onPress={() => {}} />
        <CustomText fontFamily="medium">OR</CustomText>
        <View
          style={{marginVertical: verticalScale(20), gap: verticalScale(15)}}>
          <CustomInput
            value={loginDetails.email}
            onChangeText={text =>
              setLoginDetails({...loginDetails, email: text})
            }
            placeholder="Email Address"
            placeholderTextColor={COLORS.white}
          />

          <CustomInput
            value={loginDetails.password}
            onChangeText={text =>
              setLoginDetails({...loginDetails, password: text})
            }
            placeholder="Password"
            placeholderTextColor={COLORS.white}
            type="password"
          />
        </View>

        <PrimaryButton
          isFullWidth
          title="Sign in"
          onPress={handleSignIn}
          isLoading={loading}
        />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('forgotpassword')}>
          <CustomText fontFamily="bold" color={COLORS.yellow}>
            Forgot Password?
          </CustomText>
        </TouchableOpacity>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          style={{
            textAlign: 'center',
            width: wp(90),
            marginTop: verticalScale(20),
          }}>
          By continuing, you acknowledge and accept GymLogix's{' '}
          <CustomText color={COLORS.yellow} fontFamily="medium" fontSize={12}>
            privacy policy
          </CustomText>{' '}
          and{' '}
          <CustomText color={COLORS.yellow} fontFamily="medium" fontSize={12}>
            Terms & Conditions
          </CustomText>
        </CustomText>
      </View>
    </ImageBackground>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  // Background Styles
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: verticalScale(10),
    backgroundColor: COLORS.black,
  },

  // Header (Top Section) Styles
  header: {
    alignItems: 'center',
    gap: verticalScale(10),
  },
  logo: {
    height: verticalScale(66),
    width: wp(80),
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontFamily: 'bold',
    color: COLORS.whiteTail,
  },

  // Footer (Bottom Section) Styles
  footer: {
    alignItems: 'center',
    gap: verticalScale(10),
  },
  linkContainer: {
    marginTop: verticalScale(10), // Moved from inline, using GAP_SIZE for consistency
  },
  linkText: {
    fontFamily: 'bold',
    color: COLORS.white, // Default color for consistency with dark background
  },
  legalText: {
    fontSize: 12,
    fontFamily: 'medium',
    textAlign: 'center',
    width: wp(90),
    color: COLORS.white, // Default color for consistency with dark background
    marginTop: verticalScale(20), // Moved from inline, added for spacing
  },
  legalLink: {
    color: COLORS.yellow,
    fontFamily: 'medium',
    fontSize: 12,
  },
});
