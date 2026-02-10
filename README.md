# Chat Application

A real-time chat application built with React, Firebase, and React Chat Engine.

## Features

-   **Real-time Chat**: Powered by React Chat Engine.
-   **Authentication**: Google and GitHub Sign-In via Firebase Auth.
-   **User Onboarding**: Set username and profile picture.
-   **Dark Mode**: Toggle between light and dark themes.
-   **Responsive Design**: Works on desktop and mobile.

## Prerequisites

-   Node.js (v14 or higher)
-   npm

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd chat_application
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase and Chat Engine credentials.

**Firebase Configuration:**
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Add a Web App.
4.  Copy the config values to your `.env` file (API Key, Auth Domain, etc.).
5.  Enable **Authentication** (Google and GitHub providers).
6.  Enable **Firestore Database**.
7.  Enable **Storage**.

**Chat Engine Configuration:**
1.  Go to [Chat Engine](https://chatengine.io/).
2.  Create a project.
3.  Copy the **Project ID** and **Private Key** to your `.env` file.

**Required Environment Variables:**
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_CHAT_ENGINE_PROJECT_ID`
- `REACT_APP_CHAT_ENGINE_PRIVATE_KEY`

### 4. Run the Application

Start the development server:

```bash
npm start
```

The app will run at `http://localhost:3000`.

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

To build the app for production:

```bash
npm run build
```

This creates a `build` folder with optimized static files.

## Project Structure

-   `src/component`: React components (ChatFeed, LoginForm, Onboarding, etc.).
-   `src/contexts`: Context providers (AuthContext, ThemeContext).
-   `src/firebase.js`: Firebase initialization.
-   `src/App.js`: Main application component with routing.

## License

MIT
