import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import ForgotPassword from '../Screens/ForgotPassword';
import ResetPassword from '../Screens/ResetPassword';
import SignIn from '../Screens/SignIn';
import SignUp from '../Screens/SignUp';
import Splash from '../Screens/Splash';
import Welcome from '../Screens/Welcome';
import {
  AuthStackParams,
  BottomTabParams,
  MainStackParams,
  RootStackParams,
} from '../Typings/route';

const RootStack = createNativeStackNavigator<RootStackParams>();
const Auth = createNativeStackNavigator<AuthStackParams>();
const Tabs = createBottomTabNavigator<BottomTabParams>();
const Main = createNativeStackNavigator<MainStackParams>(); // Create Drawer Navigator

const Routing = () => {
  function AuthStack() {
    return (
      <Auth.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Auth.Screen name="welcome" component={Welcome} />
        <Auth.Screen name="signIn" component={SignIn} />
        <Auth.Screen name="signUp" component={SignUp} />
        <Auth.Screen name="forgotpassword" component={ForgotPassword} />
        <Auth.Screen name="resetPassword" component={ResetPassword} />
      </Auth.Navigator>
    );
  }

  //   function TabStack() {
  //     return (
  //       <Tabs.Navigator
  //         screenOptions={{
  //           headerShown: false,
  //         }}
  //         tabBar={props => <BottomTabBar {...props} />}>
  //         <Tabs.Screen
  //           options={{
  //             title: 'Dashboard',
  //           }}
  //           name="dashboard"
  //           component={Dashboard}
  //         />
  //         <Tabs.Screen
  //           options={{
  //             title: 'Aggrement',
  //           }}
  //           name="aggrement"
  //           component={Agreement}
  //         />
  //         <Tabs.Screen
  //           options={{
  //             title: 'Progress',
  //           }}
  //           name="progress"
  //           component={Progress}
  //         />
  //         <Tabs.Screen
  //           options={{
  //             title: 'Messenger',
  //           }}
  //           name="messenger"
  //           component={Messenger}
  //         />
  //       </Tabs.Navigator>
  //     );
  //   }

  //   function MianStack() {
  //     return (
  //       <Main.Navigator
  //         screenOptions={{
  //           headerShown: false,
  //         }}>
  //         <Main.Screen name="tabs" component={TabStack} />
  //       </Main.Navigator>
  //     );
  //   }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      {/* <RootStack.Screen name="mainStack" component={MianStack} /> */}
      <RootStack.Screen name="splash" component={Splash} />
      <RootStack.Screen name="authStack" component={AuthStack} />
    </RootStack.Navigator>
  );
};

export default Routing;
