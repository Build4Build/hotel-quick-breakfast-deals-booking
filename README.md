# Hotel Breakfast Deals

A beautiful React Native mobile app for discovering and booking breakfast deals at hotels you've already booked. The app features a modern UI with high-quality images and an intuitive interface.

## Features

- **Today's Deals**: Swipe through today's breakfast deals at your booked hotels
- **Deal Details**: View detailed information about each breakfast offer
- **Hotel Information**: Browse your booked hotels and see available deals
- **Profile Management**: Manage your preferences and favorite deals
- **Settings**: Customize the app to your liking

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain and build system
- **TypeScript**: Static type checking
- **React Navigation**: Screen navigation
- **Expo Image**: Optimized image component
- **React Native Gesture Handler**: Gestures and animations
- **React Native Reanimated**: Animation library
- **Async Storage**: Local data persistence

## Project Structure

```
src/
├── assets/           # Images and other static assets
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # App screens
├── services/         # API and service integrations
├── types/            # TypeScript types and interfaces
└── utils/            # Utility functions and constants
```

## Installation and Setup

1. Make sure you have Node.js and npm installed
2. Install Expo CLI globally:
   ```
   npm install -g expo-cli
   ```
3. Clone the repository
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm start
   ```
6. Use Expo Go app on your mobile device to scan the QR code, or press 'i' for iOS simulator or 'a' for Android emulator

## Running on a Device

- Download the Expo Go app from the App Store (iOS) or Google Play Store (Android)
- Scan the QR code from the Expo development server
- The app will load on your device

## Build for Production

To create a production build:

```
expo build:android  # For Android
expo build:ios      # For iOS
```

## License

MIT 