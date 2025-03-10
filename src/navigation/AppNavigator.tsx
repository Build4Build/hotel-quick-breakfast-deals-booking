import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { RootStackParamList } from '../types';
import { colors } from '../utils/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DealDetailScreen from '../screens/DealDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookedHotelsScreen from '../screens/BookedHotelsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.secondary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Today\'s Breakfast Deals' }}
        />
        <Stack.Screen 
          name="DealDetail" 
          component={DealDetailScreen} 
          options={{ title: 'Deal Details' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Your Profile' }}
        />
        <Stack.Screen 
          name="BookedHotels" 
          component={BookedHotelsScreen} 
          options={{ title: 'Your Booked Hotels' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 