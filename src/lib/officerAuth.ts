import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirebaseClients } from "./firebase";

export interface OfficerData {
  badgeNumber: string;
  email: string;
  name: string;
  rank: string;
  station: string;
  district: string;
  role: "officer";
  createdAt: any;
  isActive: boolean;
}

export async function getOfficerByBadge(
  badgeNumber: string
): Promise<OfficerData | null> {
  const { db } = getFirebaseClients();

  try {
    const officerRef = doc(db, "officers", badgeNumber);
    const officerDoc = await getDoc(officerRef);

    if (officerDoc.exists()) {
      return officerDoc.data() as OfficerData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching officer:", error);
    return null;
  }
}

export async function createOfficerAccount(
  badgeNumber: string,
  email: string,
  password: string,
  officerData: Omit<
    OfficerData,
    "badgeNumber" | "email" | "role" | "createdAt" | "isActive"
  >
): Promise<{ success: boolean; error?: string }> {
  const { auth, db } = getFirebaseClients();

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create officer document in Firestore
    const officerRef = doc(db, "officers", badgeNumber);
    const officerDoc = {
      badgeNumber,
      email,
      role: "officer" as const,
      isActive: true,
      createdAt: new Date(),
      ...officerData,
    };

    await setDoc(officerRef, officerDoc);

    // Also create user document in users collection
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email,
      role: "officer",
      badgeNumber,
      displayName: officerData.name,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating officer account:", error);
    return {
      success: false,
      error:
        error.code === "auth/email-already-in-use"
          ? "Email already registered"
          : "Failed to create officer account",
    };
  }
}

export async function authenticateOfficer(
  badgeNumber: string,
  password: string
): Promise<{ success: boolean; error?: string; officerData?: OfficerData }> {
  const { auth, db } = getFirebaseClients();

  try {
    // Get officer data by badge number
    const officerData = await getOfficerByBadge(badgeNumber);

    if (!officerData) {
      return { success: false, error: "Invalid badge number" };
    }

    if (!officerData.isActive) {
      return { success: false, error: "Officer account is deactivated" };
    }

    // Sign in with Firebase Auth
    await signInWithEmailAndPassword(auth, officerData.email, password);

    return { success: true, officerData };
  } catch (error: any) {
    console.error("Authentication error:", error);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      return { success: false, error: "Invalid badge number or password" };
    } else if (error.code === "auth/too-many-requests") {
      return {
        success: false,
        error: "Too many failed attempts. Please try again later.",
      };
    } else {
      return { success: false, error: "Authentication failed" };
    }
  }
}
