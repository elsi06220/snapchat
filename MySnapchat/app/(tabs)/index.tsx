import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './welcome';
import Login from './login';
import Home from './home';
import Register from './register';
import SplashScreen from './splashscreen';
import SendSnap from './sendsnap';
import ReceivedSnaps from './receivedsnap';

type RootStackParamList = {
  'tabs/splashscreen': undefined;
  'tabs/welcome': undefined;
  'tabs/login': { isAuthenticated: boolean } | undefined;
  'tabs/home': { isAuthenticated: boolean } | undefined;
  'tabs/register': undefined;
  'tabs/sendsnap': undefined;
  'tabs/receivedsnap': undefined;
};

const Stack = createStackNavigator<RootStackParamList>()
const App = () => {
  return (
      <Stack.Navigator initialRouteName="tabs/splashscreen">
        <Stack.Screen name="tabs/splashscreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tabs/welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="tabs/login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="tabs/home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="tabs/register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="tabs/sendsnap" component={SendSnap} options={{ headerShown: true, title: 'Envoyer un Snap' }} />
        <Stack.Screen name="tabs/receivedsnap" component={ReceivedSnaps} options={{ headerShown: true, title: 'Snaps Reçus' }} />
      </Stack.Navigator>
  );
};

export default App;
