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


## Who Created This Breakfast Deal Mobile App?

**Pierre-Henry Soria** — a **super passionate engineer** who loves automating content creation efficiently!
Enthusiast of YouTube, AI, learning, and—of course—writing!
Find me at [pH7.me](https://ph7.me)

Enjoying this project? **[Buy me a coffee](https://ko-fi.com/phenry)** (spoiler: I love almond extra-hot flat white coffees).

[![Pierre-Henry Soria](https://s.gravatar.com/avatar/a210fe61253c43c869d71eaed0e90149?s=200)](https://ph7.me "Pierre-Henry Soria’s personal website")

[![@phenrysay][x-icon]](https://x.com/phenrysay "Follow Me on X") [![YouTube Tech Videos][youtube-icon]](https://www.youtube.com/@pH7Programming "My YouTube Tech Channel") [![pH-7][github-icon]](https://github.com/pH-7 "Follow Me on GitHub") [![BlueSky][bsky-icon]](https://bsky.app/profile/ph7s.bsky.social "Follow Me on BlueSky")

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

Distributed under MIT license.


<!-- GitHub's Markdown reference links -->
[x-icon]: https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x
[bsky-icon]: https://img.shields.io/badge/BlueSky-00A8E8?style=for-the-badge&logo=bluesky&logoColor=white
[github-icon]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[youtube-icon]: https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white
