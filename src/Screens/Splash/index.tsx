import React, {FC, useEffect} from 'react';
import {Appearance, Image, ImageBackground, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IMAGES from '../../Assets/Images';
import {CustomText} from '../../Components/CustomText';
import COLORS from '../../Utilities/Colors';
import {hp, verticalScale, wp} from '../../Utilities/Metrics';
import {SplashProps} from '../../Typings/route';

const Splash: FC<SplashProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('authStack', {screen: 'welcome'});
    }, 3000);
    return () => clearTimeout(timeout);
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
