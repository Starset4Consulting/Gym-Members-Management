# My Expo Gym Members Management application

This is a mobile application built using **Expo**. It is designed to provide an easy-to-use interface for user authentication, including sign-up, sign-in, sign-out.
## Features

- **User Authentication**: Allows users to sign up, sign in, and sign out.
- **Password Visibility Toggle**: Users can toggle password visibility in the sign-in and sign-up forms.
- **Responsive UI**: Built using Expo and React Native Paper for a modern, responsive design.

## Tech Stack

- **Frontend**: 
  - React Native
  - Expo SDK
  - React Navigation
  - React Native Paper
- **Backend**:
  - Supabase (Authentication)
  - AsyncStorage for session management

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **Expo CLI**: To run and build the app:
  ```bash
  npm install -g expo-cli
EAS CLI: To use Expo's EAS build service:
bash
Copy code
npm install -g eas-cli
Setup Instructions
Clone the repository:

bash
Copy code
git clone <repository-url>
cd <project-directory>
Install dependencies:

Run the following command to install the required packages:

bash
Copy code
npm install
Configure Supabase:

If you haven’t already, create a Supabase account and project at Supabase. After setting up the project, you will need to configure your supabase.js or supabase.ts file in the /lib folder to use your project’s credentials. Example:

js
Copy code
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://<your-project-id>.supabase.co';
const supabaseKey = '<your-anon-key>';

export const supabase = createClient(supabaseUrl, supabaseKey);
Configure the EAS Build (Optional, for production builds):

Create an eas.json file for configuration, specifying the platform and build profile.
Run the build command for either iOS or Android using:
bash
Copy code
eas build --platform <platform>
Running the App Locally
To run the application locally on your device or simulator:

Start the Expo project:

bash
Copy code
expo start
Open the app on a physical device or simulator:

Scan the QR code with the Expo Go app (available on iOS and Android).
Or use the iOS/Android simulator on your machine.
Access the app in the browser:

If you prefer to test in a browser, you can open it directly with:

bash
Copy code
expo start --web
Building the App for Production
To build the app for iOS or Android:

Configure your EAS Build settings in the eas.json file.

Build the app:

For Android:
bash
Copy code
eas build --platform android --profile production
For iOS:
bash
Copy code
eas build --platform ios --profile production
Download the Build: After the build completes, you’ll be able to download the .apk, .aab, or .ipa file.

Distribute the App:

For Android, upload to Google Play Console.
For iOS, upload to App Store Connect.
Features and Screens
Authentication Screens:
Sign Up: User can create a new account by providing their email and password.
Sign In: User can log into the app with their email and password.
Sign Out: User can sign out from the app.
Password Recovery: User can reset their password via email.
Show/Hide Password: Option to toggle password visibility for easier input.
Contributing
Fork the repository.
Create a new branch for your changes.
Commit your changes.
Push your changes.
Submit a Pull Request with a description of your changes.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Authentication Workflow
Sign Up
The user is prompted to provide an email and password.
On successful sign-up, the user will be authenticated and the session will be saved using AsyncStorage.
Sign In
The user can log in using their registered email and password.
The session will be stored and managed by Supabase.
Password Recovery
Users who forget their password can request a password reset link.
The reset link is sent to the provided email via Supabase authentication.
Sign Out
Users can sign out, which removes the session from memory and clears the AsyncStorage.
Tools and Libraries Used
React Native: A framework for building mobile apps using JavaScript and React.
Expo: A platform for building React Native applications with a managed workflow.
Supabase: Open-source backend as a service, used here for authentication.
AsyncStorage: For persistent storage of user session data.
React Native Paper: UI component library for building material design-based user interfaces.
EAS Build: Expo Application Services (EAS) for building the app for production.
React Navigation: Navigation library for React Native apps.
Troubleshooting
If you encounter issues during the build or runtime, consider the following steps:

Ensure that all dependencies are installed by running:

bash
Copy code
npm install
Clear Expo Cache (if there are issues related to the build or dependencies):

bash
Copy code
expo start -c
Check for errors in the console: Read the error messages to identify missing packages or misconfigurations.

Supabase Authentication Issues: Make sure your Supabase project credentials (URL and API Key) are correctly configured.

EAS Build Errors: Review the build logs for any issues with the build process or environment setup.
