import React, {FC, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FONTS from '../../Assets/fonts';
import IMAGES from '../../Assets/Images';
import {CustomText} from '../../Components/CustomText';
import PrimaryButton from '../../Components/PrimaryButton';
import COLORS from '../../Utilities/Colors';
import {horizontalScale, hp, verticalScale, wp} from '../../Utilities/Metrics';

import {ForgotPasswordProps} from '../../Typings/route';
import {isValidEmail} from '../../Utilities/Helpers';
import {KeyboardAvoidingContainer} from '../../Components/KeyboardAvoidingComponent';

const ForgotPassword: FC<ForgotPasswordProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [inputDetails, setInputDetails] = useState({
    email: '',
  });

  const onResetPassword = () => {
    if (!isValidEmail(inputDetails.email)) {
      return;
    } else {
      navigation.navigate('resetPassword');
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
      <KeyboardAvoidingContainer
        backgroundColor="transparent"
        style={{
          justifyContent: 'flex-end',
        }}>
        <View style={styles.footer}>
          <View
            style={{marginVertical: verticalScale(20), gap: verticalScale(15)}}>
            <TextInput
              value={inputDetails.email}
              onChangeText={text =>
                setInputDetails({...inputDetails, email: text})
              }
              placeholder="Email Address"
              placeholderTextColor={COLORS.white}
              style={{
                backgroundColor: 'transparent',
                width: wp(85),
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                fontFamily: FONTS.medium,
                paddingVertical: verticalScale(5),
                paddingHorizontal: horizontalScale(10),
                color: COLORS.white,
              }}
            />
          </View>
          <PrimaryButton
            isFullWidth
            title="Reset password"
            onPress={onResetPassword}
          />
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
      </KeyboardAvoidingContainer>
    </ImageBackground>
  );
};

export default ForgotPassword;

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
