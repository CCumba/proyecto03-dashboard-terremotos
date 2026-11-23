import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, type DatabaseReference } from "firebase/database";
import type { Earthquake } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyBTdY69IoeYVr6vSn2KtFSJKD_N4G3G9GM",
  authDomain: "data-dashboard-terremotos.firebaseapp.com",
  databaseURL: "https://data-dashboard-terremotos-default-rtdb.firebaseio.com",
  projectId: "data-dashboard-terremotos",
  storageBucket: "data-dashboard-terremotos.firebasestorage.app",
  messagingSenderId: "490861596517",
  appId: "1:490861596517:web:5991ab8df9871b0c045b8c",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const sismosRef: DatabaseReference = ref(database, "sismos");

export async function fetchSismos(): Promise<Earthquake[]> {
  const snapshot = await get(sismosRef);
  if (!snapshot.exists()) {
    return [];
  }
  return snapshot.val() as Earthquake[];
}