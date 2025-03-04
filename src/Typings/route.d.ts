import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParams = {
  authStack: NavigatorScreenParams<AuthStackParams>;
  mainStack: NavigatorScreenParams<MainStackParams>;
  splash: undefined;
};

export type AuthStackParams = {
  welcome: undefined;
  signIn: undefined;
  signUp: undefined;
  forgotpassword: undefined;
  resetPassword: undefined;
};

export type MainStackParams = {
  tabs: NavigatorScreenParams<BottomTabParams>;
};

export type BottomTabParams = {
  homeTab: undefined;
  planTab: undefined;
  statsTab: undefined;
  insightTab: undefined;
  settingsTab: undefined;
};

// SCREEN PROPS -------------------------------------------------------------------------------

// Splash Screens
export type SplashProps = NativeStackScreenProps<RootStackParams, 'splash'>;

// Auth Screens

export type WelcomeProps = NativeStackScreenProps<AuthStackParams, 'welcome'>;
export type SignInProps = NativeStackScreenProps<AuthStackParams, 'signIn'>;
export type SignUpProps = NativeStackScreenProps<AuthStackParams, 'signUp'>;
export type ForgotPasswordProps = NativeStackScreenProps<
  AuthStackParams,
  'forgotpassword'
>;
export type ResetPasswordProps = NativeStackScreenProps<
  AuthStackParams,
  'resetPassword'
>;

// Main Screens
