// Requires: npm i firebase-admin
const admin = require("firebase-admin");

// Hardcode officer values here
const OFFICER = {
  badgeNumber: "UPF001",
  email: "officer.one@police.ug", // used to create Firebase Auth user
  password: "demo123",
  name: "Officer One",
  rank: "Inspector",
  station: "Kampala Central",
  district: "Kampala Central Division",
};

// Initialize Admin SDK via GOOGLE_APPLICATION_CREDENTIALS
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

async function createOrUpdateOfficer(o) {
  const auth = admin.auth();
  const db = admin.firestore();

  // 1) Ensure Auth user exists (create if missing)
  let user;
  try {
    user = await auth.getUserByEmail(o.email);
    if (o.name && user.displayName !== o.name) {
      user = await auth.updateUser(user.uid, { displayName: o.name });
    }
  } catch (e) {
    if (e && e.code === "auth/user-not-found") {
      user = await auth.createUser({
        email: o.email,
        password: o.password,
        displayName: o.name,
      });
    } else {
      throw e;
    }
  }
  const uid = user.uid;

  // 2) badgeIndex/{badgeNumber} for badge → uid lookup
  await db.doc(`badgeIndex/${o.badgeNumber}`).set(
    {
      uid,
      email: o.email,
      displayName: o.name || user.displayName || null,
      role: "officer",
      isActive: true,
      rank: o.rank || null,
      station: o.station || null,
      district: o.district || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // 3) users/{uid} officer profile
  await db.doc(`users/${uid}`).set(
    {
      uid,
      email: o.email,
      role: "officer",
      badgeNumber: o.badgeNumber,
      displayName: o.name || user.displayName || null,
      isActive: true,
      rank: o.rank || null,
      station: o.station || null,
      district: o.district || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("Officer created/updated:", {
    uid,
    badgeNumber: o.badgeNumber,
    email: o.email,
    name: o.name,
    rank: o.rank,
    station: o.station,
    district: o.district,
  });
}

createOrUpdateOfficer(OFFICER)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
