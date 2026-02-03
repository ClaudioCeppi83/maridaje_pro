'use server';

import { auth } from "@/auth";
import { db } from "@/lib/firebase/admin";
import { UserProfile, SavedPairing, WineCellar } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const doc = await db.collection('users').doc(session.user.id).get();
  if (!doc.exists) return null;

  return doc.data() as UserProfile;
}

export async function updateUserProfile(data: { displayName?: string; photoURL?: string; isCellarModeEnabled?: boolean }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.collection('users').doc(session.user.id).update({
    ...data,
    updatedAt: Date.now(),
  });

  revalidatePath('/profile');
  return { success: true };
}

export async function savePairing(pairing: Omit<SavedPairing, 'userId' | 'timestamp'>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const newPairing: SavedPairing = {
    ...pairing,
    userId: session.user.id,
    timestamp: Date.now(),
  };

  const docRef = await db.collection('users').doc(session.user.id).collection('saved_pairings').add(newPairing);
  
  return { success: true, id: docRef.id };
}

export async function getSavedPairings() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const snapshot = await db.collection('users')
    .doc(session.user.id)
    .collection('saved_pairings')
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SavedPairing[];
}

export async function updateWineCellar(wines: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.collection('users').doc(session.user.id).collection('settings').doc('cellar').set({
    userId: session.user.id,
    wines,
    updatedAt: Date.now(),
  });

  return { success: true };
}

export async function getWineCellar() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const doc = await db.collection('users').doc(session.user.id).collection('settings').doc('cellar').get();
  if (!doc.exists) return [];

  const data = doc.data() as WineCellar;
  return data.wines;
}
