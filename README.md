# Welcome to your Expo app 👋

# Development Command

npx expo start --clear --reset-cache

<!-- 
   To clean and rebuild your Expo project's native directories (iOS and Android), you should use the command npx expo prebuild --clean. This command removes the existing native directories (ios and android) and then rebuilds them based on your project's configuration in app.json. It ensures that your native code is synchronized with your current configuration
-->
eas build:configure

## Test Build vs Production Build

# ⚠️ DANGER ZONE - EACH OF THESE COUNTS AS 1 BUILD

eas build --platform android
eas build --platform ios  
eas build --platform all
eas build --platform android --profile development                 THIS ONE!!! for personal dev testing(Allows notifications!!!)

## When Building use this progression

## step 1

npx expo prebuild --clean                do this first to delete and rebuild android/ios folders(should fix cached app icons and splash screen)

## Step 2

a. npx expo run:android --variant release
build a local release to test for build errors so you dont BURN/WASTE expo builds(bc errored builds still count towards free limit)
definitely free, needs android emulator, and only runs on local machine

OR

b. eas build --platform android --profile preview --local
should be free, can share apk file, requires android studio

## Step 3

Exactly! That's almost certainly the issue. EAS builds from your committed code, not your working directory changes.

eas build --platform android --profile preview                     Similiar to dev but for test user and play store internal testing(But CANNOT TEST notifications!!)
eas build --platform android --profile preview
eas build --clear-cache --platform android --profile preview

# Step 4 - PROD BUILD

## MAKE SURE EAS.JSON android build type is 'app-bundle' not 'apk'

## IN APP.JSON "ANDROID" MUST ALSO ++INCREMENT VERSIONCODE for each release uploaded to google

eas build --clear-cache --platform android --profile production

# ✅ SAFE ZONE - USE THESE ALL YOU WANT

expo run:android                    # Local development
expo run:android --device          # Run on physical device
expo start                         # Start dev server
expo install                       # Install packages
eas login                          # Login to account
eas build:configure                # Setup only (no build!)

## Dev build to prod build

# Clear NPX cache completely

npm cache clean --force

# Clear NPX specific cache

npx expo start --clear --reset-cache

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
