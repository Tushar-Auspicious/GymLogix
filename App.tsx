import { NavigationContainer, NavigationState } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Appearance, LogBox, StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store';
import Routing from './src/Routes';
import COLORS from './src/Utilities/Colors';

LogBox.ignoreAllLogs();

const App = () => {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to get the current route name from navigation state
  const getCurrentRouteName = (state: any): string | null => {
    if (!state) return null;

    const route = state.routes[state.index];
    if (route.state) {
      // If the route has nested navigators, recurse into the nested state
      return getCurrentRouteName(route.state);
    }
    return route.name;
  };

  // Handler for navigation state changes
  const handleNavigationStateChange = (
    state: Readonly<NavigationState> | undefined,
  ) => {
    const routeName = getCurrentRouteName(state);
    const routeHistory: any = state?.routes.find(
      item => item.name === 'mainStack',
    )?.state?.history;

    setIsDrawerOpen(
      routeHistory?.find((item: any) => item.type === 'drawer')?.status ===
        'open',
    );
    setCurrentRoute(routeName);
  };

  const authRoutes = [
    'welcome',
    'signIn',
    'signUp',
    'forgotpassword',
    'resetPassword',
  ];

  const statusBarColor = useMemo((): {
    bgColor: string;
    content: StatusBarStyle;
  } => {
    if (authRoutes.includes(currentRoute!)) {
      return {
        bgColor: COLORS.black,
        content: 'light-content',
      };
    } else {
      return {
        bgColor: COLORS.white,
        content: 'default',
      };
    }
  }, [currentRoute]);

  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar
            backgroundColor={statusBarColor.bgColor}
            barStyle={statusBarColor.content}
          />
          <NavigationContainer onStateChange={handleNavigationStateChange}>
            <Routing />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </>
  );
};

export default App;
