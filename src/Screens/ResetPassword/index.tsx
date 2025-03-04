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
import {ResetPasswordProps} from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {horizontalScale, hp, verticalScale, wp} from '../../Utilities/Metrics';
import {KeyboardAvoidingContainer} from '../../Components/KeyboardAvoidingComponent';

const ResetPassword: FC<ResetPasswordProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState('');

  const [inputDetails, setInputDetails] = useState({
    newPassword: '',
    consfirmNewPassword: '',
  });

  return (
    <ImageBackground
      source={IMAGES.authBackground2}
      style={[
        styles.background,
        {
          paddingTop: verticalScale(50) + insets.top,
          paddingBottom: verticalScale(10) + insets.bottom,
        },
      ]}>
      <KeyboardAvoidingContainer
        backgroundColor="transparent"
        style={{
          justifyContent: 'flex-end',
          paddingBottom: insets.bottom
        }}>
        <View style={styles.footer}>
          <CustomText
            color={COLORS.white}
            fontFamily="italicBold"
            fontSize={32}>
            Reset your Password
          </CustomText>
          <View
            style={{marginVertical: verticalScale(20), gap: verticalScale(15)}}>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="New Password"
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
                marginBottom: verticalScale(10),
              }}
            />
            <TextInput
              value={inputDetails.newPassword}
              onChangeText={text =>
                setInputDetails({...inputDetails, newPassword: text})
              }
              placeholder="New Password"
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
            <TextInput
              value={inputDetails.consfirmNewPassword}
              onChangeText={text =>
                setInputDetails({...inputDetails, consfirmNewPassword: text})
              }
              placeholder="Confirm New Password"
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
            title="Back To Login"
            onPress={() => navigation.replace('signIn')}
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

export default ResetPassword;

const styles = StyleSheet.create({
  // Background Styles
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'flex-end',
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
