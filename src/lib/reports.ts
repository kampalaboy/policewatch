import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { getFirebaseClients } from "./firebase";

export interface Report {
  id: string;
  text?: string;
  createdAt?: any;
  media?: { url: string; type: string }[];
  location?: { lat: number; lng: number } | null;
  status?: string;
  citizenId?: string;
  citizenName?: string;
  category?: string;
  priority?: string;
}

export async function fetchReports(
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  reports: Report[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const { db } = getFirebaseClients();

  try {
    let q = query(
      collection(db, "postsreports"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const reports: Report[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        text: data.text,
        createdAt: data.createdAt,
        media: data.media || [],
        location: data.location || null,
        status: data.status || "pending",
        citizenId: data.citizenId,
        citizenName: data.citizenName,
        category: data.category,
        priority: data.priority,
      });
    });

    const lastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { reports, lastDoc: lastVisible };
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export async function fetchComplaints(
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  complaints: any[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const { db } = getFirebaseClients();

  try {
    let q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const complaints: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      complaints.push({
        id: doc.id,
        ...data,
      });
    });

    const lastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { complaints, lastDoc: lastVisible };
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
}
