# PoliceWatch Setup Guide

## Firebase Configuration

PoliceWatch is now configured to connect to the same Firebase backend as CitizenWatch. To set this up:

1. **Install Firebase dependencies:**

   ```bash
   npm install firebase
   ```

2. **Create environment file:**
   Create a `.env.local` file in the policewatch directory with the same Firebase configuration as citizenwatch:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Copy Firebase config from citizenwatch:**
   The Firebase configuration should be identical to what's used in the citizenwatch project.

## Features

- **Shared Database:** PoliceWatch now reads from the same Firestore collections as CitizenWatch
- **Reports Feed:** Officers can view all reports from the `postsreports` collection
- **Complaints Feed:** Officers can view all complaints from the `complaints` collection
- **Authentication:** Uses the same Firebase Auth with role-based access (officer role)
- **Real-time Updates:** Reports are fetched directly from Firestore

## User Roles

The system supports three user roles:

- `citizen`: Can only view their own reports
- `officer`: Can view all reports and complaints
- `admin`: Full access to all features

## Collections Accessed

- `postsreports`: Citizen reports and posts
- `complaints`: Citizen complaints
- `users`: User profiles and roles
- `payments`: Payment records

## Running the Application

```bash
npm run dev
```

The application will now display real reports from the CitizenWatch Firebase backend instead of dummy data.
