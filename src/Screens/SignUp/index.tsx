import React, {FC, useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
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
import {SignUpProps} from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {hp, verticalScale, wp} from '../../Utilities/Metrics';
import {showCustomToast} from '../../Utilities/Helpers';
import DeviceInfo from 'react-native-device-info';
import {postData} from '../../APIServices/api';
import ENDPOINTS from '../../APIServices/endPoints';

const SignUp: FC<SignUpProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repassword: '',
  });

  const [error, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    repassword: '',
  });

  const validInputs = () => {
    let valid = true;
    let newErrors = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      repassword: '',
    };
    if (!loginDetails.firstName.trim()) {
      valid = false;
      newErrors.firstname = 'First name is required.';
      showCustomToast('error', newErrors.firstname);
      return;
    }
    if (!loginDetails.lastName.trim()) {
      valid = false;
      newErrors.lastname = 'Last name is required.';
      showCustomToast('error', newErrors.lastname);
      return;
    }
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
    if (!loginDetails.repassword.trim()) {
      valid = false;
      newErrors.repassword = 'Re Password is required.';
      showCustomToast('error', newErrors.repassword);
      return;
    } else if (loginDetails.password !== loginDetails.repassword) {
      valid = false;
      newErrors.repassword = 'Re Passwords do not match.';
      showCustomToast('error', newErrors.repassword);
      return;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validInputs()) {
      return;
    }
    const data = {
      email: loginDetails.email,
      password: loginDetails.password,
      password_confirmation: loginDetails.repassword,
      locale: 'en-US',
      platform: Platform.OS === 'android' ? 'android' : 'ios',
      device_id: await DeviceInfo.getUniqueId(),
    };

    setLoading(true);

    try {
      const response = await postData(
        `${ENDPOINTS.signup}?email=${data.email}&password=${data.password}&password_confirmation=${data.password_confirmation}&locale=${data.locale}&platform=${data.platform}&device_id=${data.device_id}`,
      );
      if (response.status === 200) {
        showCustomToast('success', 'User successfully registered');
        navigation.navigate('signIn');
      }
    } catch (error: any) {
      showCustomToast('error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
          style={{marginVertical: verticalScale(20), gap: verticalScale(10)}}>
          <CustomInput
            value={loginDetails.firstName}
            onChangeText={text =>
              setLoginDetails({...loginDetails, firstName: text})
            }
            placeholder="First Name"
            placeholderTextColor={COLORS.white}
            style={{
              marginBottom: verticalScale(10),
            }}
          />
          <CustomInput
            value={loginDetails.lastName}
            onChangeText={text =>
              setLoginDetails({...loginDetails, lastName: text})
            }
            placeholder="Last Name"
            placeholderTextColor={COLORS.white}
            style={{
              marginBottom: verticalScale(10),
            }}
          />
          <CustomInput
            value={loginDetails.email}
            onChangeText={text =>
              setLoginDetails({...loginDetails, email: text})
            }
            placeholder="Email Address"
            placeholderTextColor={COLORS.white}
            style={{
              marginBottom: verticalScale(10),
            }}
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
          <CustomInput
            value={loginDetails.repassword}
            onChangeText={text =>
              setLoginDetails({...loginDetails, repassword: text})
            }
            placeholder="Re password"
            placeholderTextColor={COLORS.white}
            type="password"
          />
        </View>
        <PrimaryButton
          isFullWidth
          title="Sign up"
          onPress={handleSignUp}
          isLoading={loading}
        />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('signIn')}>
          <CustomText fontFamily="bold">Already have an account</CustomText>
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

export default SignUp;

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
