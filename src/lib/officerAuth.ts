import {
  doc,
  getDoc,
  setDoc,
  collection,
  query as fsQuery,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseClients } from "./firebase";

// Minimal officer data sourced from the users collection
export interface OfficerData {
  // Identity
  uid?: string;
  badgeNumber: string;
  role: "officer";

  // Contact / profile
  email?: string;
  displayName?: string;
  name?: string;
  phone?: string;
  photoURL?: string;

  // Organization
  rank?: string;
  station?: string;
  district?: string;

  // Status / metadata
  isActive?: boolean;
  createdAt?: any;
  [key: string]: any; // keep room for future fields
}

export async function getOfficerByBadge(
  badgeNumber: string
): Promise<OfficerData | null> {
  const { db } = getFirebaseClients();
  try {
    // 1) Preferred: read from public badge index (no auth required)
    const badgeRef = doc(db, "badgeIndex", badgeNumber);
    const badgeSnap = await getDoc(badgeRef);
    if (badgeSnap.exists()) {
      const d = badgeSnap.data() as any;
      return {
        uid: d.uid,
        badgeNumber,
        role: "officer",
        email: d.email,
        displayName: d.displayName,
        name: d.name,
        phone: d.phone,
        photoURL: d.photoURL,
        rank: d.rank,
        station: d.station,
        district: d.district,
        isActive: d.isActive ?? true,
        createdAt: d.createdAt,
        ...d,
      } as OfficerData;
    }

    // 2) Fallback: query users (requires Firestore list permission)
    // Read from users collection instead of officers
    const q = fsQuery(
      collection(db, "users"),
      where("badgeNumber", "==", badgeNumber),
      where("role", "==", "officer"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    const x = d.data() as any;
    return {
      uid: x.uid ?? d.id,
      badgeNumber: x.badgeNumber,
      role: "officer",
      email: x.email,
      displayName: x.displayName,
      name: x.name,
      phone: x.phone,
      photoURL: x.photoURL,
      rank: x.rank,
      station: x.station,
      district: x.district,
      isActive: x.isActive ?? true,
      createdAt: x.createdAt,
      ...x,
    } as OfficerData;
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
  const { db } = getFirebaseClients();

  try {
    // Create Firebase Auth user
    // const userCredential = await createUserWithEmailAndPassword(
    //   auth,
    //   email,
    //   password
    // );
    // const user = userCredential.user;

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
    const userRef = doc(db, "users", badgeNumber);
    await setDoc(userRef, {
      //uid: user.uid,
      password,
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
    // Look up email from public badge index
    const badgeRef = doc(db, "badgeIndex", badgeNumber);
    const badgeSnap = await getDoc(badgeRef);
    if (!badgeSnap.exists()) {
      return { success: false, error: "Invalid badge number" };
    }
    const idx = badgeSnap.data() as any;
    if (idx.isActive === false) {
      return { success: false, error: "Officer account is deactivated" };
    }
    const email: string | undefined = idx.email;
    if (!email) {
      return { success: false, error: "Officer email not found" };
    }

    // Sign in with Firebase Auth using email from badge index
    await signInWithEmailAndPassword(auth, email, password);

    // Return officer profile assembled from index/users
    const officerData = await getOfficerByBadge(badgeNumber);
    return { success: true, officerData: officerData ?? undefined };
  } catch (error: any) {
    console.error("Authentication error:", error);
    if (
      error?.code === "auth/wrong-password" ||
      error?.code === "auth/user-not-found"
    ) {
      return { success: false, error: "Invalid badge number or password" };
    }
    return { success: false, error: error?.message || "Authentication failed" };
  }
}
