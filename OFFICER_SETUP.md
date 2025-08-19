# Officer Account Setup Guide

## Overview

PoliceWatch now uses Firebase Authentication with a custom badge number system for officers. Officers can log in using their badge number and password, which maps to their Firebase Auth email/password.

## Database Structure

### Officers Collection (`officers`)

Each officer document is stored with their badge number as the document ID:

```javascript
{
  badgeNumber: "UPF001",
  email: "officer.upf001@police.ug",
  name: "Sarah Nakato",
  rank: "Inspector",
  station: "Kampala Central Police Station",
  district: "Kampala Central Division",
  role: "officer",
  isActive: true,
  createdAt: Timestamp
}
```

### Users Collection (`users`)

Each officer also has a corresponding user document in the `users` collection:

```javascript
{
  uid: "firebase_auth_uid",
  email: "officer.upf001@police.ug",
  role: "officer",
  badgeNumber: "UPF001",
  displayName: "Sarah Nakato",
  createdAt: Timestamp
}
```

## Setting Up Officer Accounts

### Option 1: Manual Setup (Recommended for testing)

1. **Create Firebase Auth User:**

   - Go to Firebase Console > Authentication > Users
   - Add a new user with email and password
   - Example: `officer.upf001@police.ug` / `password123`

2. **Create Officer Document:**

   - Go to Firebase Console > Firestore Database
   - Navigate to `officers` collection
   - Create document with ID `UPF001`
   - Add the officer data as shown above

3. **Create User Document:**
   - Navigate to `users` collection
   - Create document with the Firebase Auth UID
   - Add the user data as shown above

### Option 2: Programmatic Setup

Use the `createOfficerAccount` function from `src/lib/officerAuth.ts`:

```javascript
import { createOfficerAccount } from "@/lib/officerAuth";

const result = await createOfficerAccount(
  "UPF001", // badge number
  "officer.upf001@police.ug", // email
  "password123", // password
  {
    name: "Sarah Nakato",
    rank: "Inspector",
    station: "Kampala Central Police Station",
    district: "Kampala Central Division",
  }
);
```

## Demo Officer Account

For testing purposes, you can create a demo officer account:

**Badge Number:** `UPF001`
**Email:** `demo.officer@police.ug`
**Password:** `demo123`
**Name:** `Sarah Nakato`

## Authentication Flow

1. Officer enters badge number and password
2. System looks up badge number in `officers` collection
3. Gets the associated email address
4. Authenticates with Firebase Auth using email/password
5. If successful, officer is logged in and redirected to dashboard

## Security Rules

Make sure your Firestore security rules allow officers to read reports:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Officers can read all reports and complaints
    match /postsreports/{document} {
      allow read: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'officer' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    match /complaints/{document} {
      allow read: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'officer' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Officers can read their own data
    match /officers/{badgeNumber} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.badgeNumber == badgeNumber;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Invalid badge number"** - Officer document doesn't exist in `officers` collection
2. **"Invalid password"** - Firebase Auth credentials don't match
3. **"Officer account is deactivated"** - `isActive` field is set to `false`
4. **"Officer account not properly configured"** - Missing email field in officer document

### Testing:

1. Verify officer document exists in Firestore
2. Check that email field is present and correct
3. Confirm Firebase Auth user exists with matching email
4. Ensure user document exists in `users` collection with correct role
