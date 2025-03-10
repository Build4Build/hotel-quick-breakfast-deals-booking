# Hotel Breakfast Deals

A beautiful React Native mobile app for discovering and booking breakfast deals at hotels you've already booked. The app features a modern UI with high-quality images and an intuitive interface.

## Features

- **Today's Deals**: Swipe through today's breakfast deals at your booked hotels
- **Deal Details**: View detailed information about each breakfast offer
- **Hotel Information**: Browse your booked hotels and see available deals
- **Profile Management**: Manage your preferences and favorite deals
- **Settings**: Customize the app to your liking
- **Real Images**: Beautiful high-quality images from Unsplash

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain and build system
- **TypeScript**: Static type checking
- **React Navigation**: Screen navigation
- **Expo Image**: Optimized image component
- **React Native Gesture Handler**: Gestures and animations
- **React Native Reanimated**: Animation library
- **Async Storage**: Local data persistence
- **Unsplash API**: High-quality images

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

## Deployment with EAS (Expo Application Services)

This app is configured for deployment using EAS, which makes it easy to build and publish to both the App Store and Google Play Store.

### Prerequisites

1. Create an [Expo](https://expo.dev/) account
2. Install EAS CLI:
   ```
   npm install -g eas-cli
   ```
3. Log in to EAS from the CLI:
   ```
   eas login
   ```

### Configure App Stores

#### iOS App Store
1. Register for an Apple Developer account
2. Create a new app in App Store Connect
3. Generate required provisioning profiles and certificates
4. Update `eas.json` with your Apple ID, Team ID, and App ID

#### Google Play Store
1. Create a Google Play Developer account
2. Create a new app in the Google Play Console
3. Generate a service account key and download the JSON file
4. Update `eas.json` with the path to your service account key

### Build and Submit

1. Build the app for production:
   ```
   eas build --platform all --profile production
   ```

2. Submit to stores:
   ```
   eas submit --platform ios
   eas submit --platform android
   ```

## Images Attribution

This app uses images from [Unsplash](https://unsplash.com/), a free high-quality photo service. In a production environment, please follow Unsplash attribution requirements.

## License

MIT 