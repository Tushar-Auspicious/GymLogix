import React, {FC, useEffect} from 'react';
import {Appearance, Image, ImageBackground, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IMAGES from '../../Assets/Images';
import {CustomText} from '../../Components/CustomText';
import COLORS from '../../Utilities/Colors';
import {hp, verticalScale, wp} from '../../Utilities/Metrics';
import {SplashProps} from '../../Typings/route';
import {getLocalStorageData} from '../../Utilities/Storage';
import STORAGE_KEYS from '../../Utilities/Constants';
import ENDPOINTS from '../../APIServices/endPoints';
import {fetchData} from '../../APIServices/api';
import {useAppDispatch} from '../../Redux/store';
import {setUserData} from '../../Redux/slices/UserSlice';
import {UserResponse} from '../../Typings/ApiResponse/UserResponse';

const Splash: FC<SplashProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const fetchUserData = async () => {
    const token = await getLocalStorageData(STORAGE_KEYS.token);
    try {
      if (token) {
        const response = await fetchData<UserResponse>(ENDPOINTS.getUser);
        dispatch(setUserData(response.data.user));
      }

      if (token) {
        navigation.replace('mainStack', {
          screen: 'tabs',
          params: {
            screen: 'HOME',
          },
        });
      } else {
        const timeout = setTimeout(() => {
          navigation.replace('authStack', {
            screen: 'welcome',
          });
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <ImageBackground
      source={IMAGES.authBackground}
      style={[
        styles.mainview,
        {
          paddingTop: verticalScale(50) + insets.top,
        },
      ]}>
      <Image source={IMAGES.logo} style={styles.image} />
      <CustomText fontSize={30} fontFamily="italic" color={COLORS.whiteTail}>
        Fuel Your Goals
      </CustomText>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  mainview: {
    height: hp(100),
    width: wp(100),
    alignItems: 'center',
    gap: verticalScale(10),
  },
  image: {
    height: verticalScale(66),
    width: wp(80),
    resizeMode: 'contain',
  },
});
