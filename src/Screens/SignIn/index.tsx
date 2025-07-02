import React, { FC, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IMAGES from "../../Assets/Images";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import GoogleButton from "../../Components/GoogleButton";
import PrimaryButton from "../../Components/PrimaryButton";
import { SignInProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { hp, verticalScale, wp } from "../../Utilities/Metrics";

const SignIn: FC<SignInProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  return (
    <ImageBackground
      source={IMAGES.authBackground}
      style={[
        styles.background,
        {
          paddingTop: verticalScale(50) + insets.top,
          paddingBottom: verticalScale(10) + insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Image source={IMAGES.logo} style={styles.logo} />
      </View>

      <View style={styles.footer}>
        <GoogleButton onPress={() => {}} />
        <CustomText fontFamily="medium">OR</CustomText>
        <View
          style={{ marginVertical: verticalScale(20), gap: verticalScale(15) }}
        >
          <CustomInput
            value={loginDetails.email}
            onChangeText={(text) =>
              setLoginDetails({ ...loginDetails, email: text })
            }
            placeholder="Email Address"
            placeholderTextColor={COLORS.white}
          />

          <CustomInput
            value={loginDetails.password}
            onChangeText={(text) =>
              setLoginDetails({ ...loginDetails, password: text })
            }
            placeholder="Password"
            placeholderTextColor={COLORS.white}
            type="password"
          />
        </View>

        <PrimaryButton
          isFullWidth
          title="Sign in"
          onPress={() => {
            if (!loginDetails.email.trim() || !loginDetails.password.trim()) {
              Toast.show({
                type: "error",
                text1: "Login Details",
                text2: "Please enter Login details",
              });
              return;
            }
            // if (!isValidEmail(loginDetails.email)) {
            //   Toast.show({
            //     type: "error",
            //     text1: "Login Details",
            //     text2: "Please enter a valid email",
            //   });
            //   return;
            // }
            navigation.replace("mainStack", {
              screen: "tabs",
              params: {
                screen: "HOME",
              },
            });
          }}
        />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate("forgotpassword")}
        >
          <CustomText fontFamily="bold" color={COLORS.yellow}>
            Forgot Password?
          </CustomText>
        </TouchableOpacity>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          style={{
            textAlign: "center",
            width: wp(90),
            marginTop: verticalScale(20),
          }}
        >
          By continuing, you acknowledge and accept GymLogix's{" "}
          <CustomText color={COLORS.yellow} fontFamily="medium" fontSize={12}>
            privacy policy
          </CustomText>{" "}
          and{" "}
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: verticalScale(10),
    backgroundColor: COLORS.black,
  },

  // Header (Top Section) Styles
  header: {
    alignItems: "center",
    gap: verticalScale(10),
  },
  logo: {
    height: verticalScale(66),
    width: wp(80),
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontFamily: "bold",
    color: COLORS.whiteTail,
  },

  // Footer (Bottom Section) Styles
  footer: {
    alignItems: "center",
    gap: verticalScale(10),
  },
  linkContainer: {
    marginTop: verticalScale(10), // Moved from inline, using GAP_SIZE for consistency
  },
  linkText: {
    fontFamily: "bold",
    color: COLORS.white, // Default color for consistency with dark background
  },
  legalText: {
    fontSize: 12,
    fontFamily: "medium",
    textAlign: "center",
    width: wp(90),
    color: COLORS.white, // Default color for consistency with dark background
    marginTop: verticalScale(20), // Moved from inline, added for spacing
  },
  legalLink: {
    color: COLORS.yellow,
    fontFamily: "medium",
    fontSize: 12,
  },
});
