import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { User } from 'firebase/auth';

/**
 * Creates a user profile document in the 'users' collection in Firestore.
 * This is the simple, correct version that fixes the bug and adds the name field.
 * @param user The user object from Firebase Authentication.
 * @param additionalData An object containing the user's name from the form.
 */
export const createUserProfileDocument = async (
  user: User,
  additionalData: { name: string }
) => {
  if (!user) return; // Exit if there's no user

  // Create a reference to the document using the user's unique ID
  const userDocRef = doc(db, 'users', user.uid);

  // This is the clean data we will send to the database.
  // No complex logic, no chance of 'undefined' values.
  const userData = {
    uid: user.uid,
    email: user.email,
    name: additionalData.name, // This is the name from your sign-up form!
    createdAt: serverTimestamp(), // Let Firebase handle the timestamp
  };

  // Write the data to the document. This will now succeed.
  await setDoc(userDocRef, userData);
};

// ===================================================================
// SAFELIST LINK MANAGEMENT FUNCTIONS
// ===================================================================

import {
  deleteDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';

// Import your SafelistLink type
import { SafelistLink } from '@/types/safelist';

/**
 * Adds a new safelist link document to the 'safelistLinks' collection.
 * This replaces the hardcoded 'temp-id' with real Firestore functionality.
 * @param linkData The link data to add (without id and lastSubmitted)
 * @param userId The ID of the user adding the link
 * @returns Promise with the new document ID
 */
export const addSafelistLink = async (
  linkData: Omit<SafelistLink, 'id' | 'lastSubmitted'>,
  userId: string
): Promise<{ id: string }> => {
  try {
    const docData = {
      ...linkData,
      userId,
      createdAt: serverTimestamp(),
      lastSubmitted: null,
    };

    const safelistLinksCollection = collection(
      db,
      'users',
      userId,
      'safelistLinks'
    );
    const docRef = await addDoc(safelistLinksCollection, docData);

    console.log('Document written with ID: ', docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Failed to add safelist link.');
  }
};

/**
 * Updates the 'lastSubmitted' timestamp for a specific safelist link.
 * @param linkId The ID of the document to update
 */
export const updateLastSubmitted = async (linkId: string): Promise<void> => {
  try {
    const linkDocRef = doc(db, 'safelistLinks', linkId);
    await updateDoc(linkDocRef, {
      lastSubmitted: serverTimestamp(),
    });
    console.log(`Successfully updated lastSubmitted for link: ${linkId}`);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw new Error('Failed to update submission timestamp.');
  }
};

/**
 * Fetches dashboard statistics for a given user.
 * @param userId The user's ID
 * @returns Promise with dashboard stats object
 */
export const getDashboardStats = async (userId: string) => {
  try {
    const linksCollection = collection(db, 'users', userId, 'safelistLinks');
    const q = query(linksCollection, where('userId', '==', userId));
    const totalLinksSnapshot = await getCountFromServer(q);

    return {
      totalLinks: totalLinksSnapshot.data().count,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats: ', error);
    throw new Error('Failed to fetch dashboard statistics.');
  }
};

/**
 * Fetches all safelist links for a given user.
 * @param userId The user's ID
 * @returns Promise with array of safelist links
 */
export const getSafelistLinks = async (
  userId: string
): Promise<SafelistLink[]> => {
  try {
    const linksCollection = collection(db, 'users', userId, 'safelistLinks');
    const q = query(linksCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as SafelistLink
    );
  } catch (error) {
    console.error('Error fetching safelist links: ', error);
    throw new Error('Failed to fetch safelist links.');
  }
};

/**
 * Alias function to match component expectations
 * @param userId The user's ID
 * @returns Promise with array of safelist links
 */

export const getUserSafelistLinks = async (
  userId: string
): Promise<SafelistLink[]> => {
  return getSafelistLinks(userId);
};

/**
 * Calculates readiness status for a safelist link based on submission frequency
 * @param link The safelist link object
 * @returns Readiness status information
 */
export const calculateReadiness = (link: SafelistLink | null) => {
  // Add null safety check
  if (!link) {
    return {
      status: 'unknown',
      message: 'Invalid link data',
      daysUntilReady: 0,
    };
  }

  if (!link.lastSubmitted) {
    return {
      status: 'ready',
      message: 'Ready to submit',
      daysUntilReady: 0,
    };
  }

  const lastSubmittedDate =
    link.lastSubmitted instanceof Date
      ? link.lastSubmitted
      : new Date(link.lastSubmitted.seconds * 1000);

  const daysSinceSubmission = Math.floor(
    (Date.now() - lastSubmittedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const frequency = link.frequency || 7; // Default to 7 days if not specified
  const daysUntilReady = Math.max(0, frequency - daysSinceSubmission);

  if (daysUntilReady === 0) {
    return {
      status: 'ready',
      message: 'Ready to submit',
      daysUntilReady: 0,
    };
  } else {
    return {
      status: 'waiting',
      message: `Wait ${daysUntilReady} more day${daysUntilReady > 1 ? 's' : ''}`,
      daysUntilReady,
    };
  }
};

/**
 * Deletes a safelist link from the user's subcollection
 * @param userId The user's ID
 * @param linkId The ID of the link to delete
 * @returns Promise that resolves when deletion is complete
 */

export const deleteSafelistLink = async (
  userId: string,
  linkId: string
): Promise<void> => {
  try {
    const linkDocRef = doc(db, 'users', userId, 'safelistLinks', linkId);
    await deleteDoc(linkDocRef);
    console.log(`Successfully deleted safelist link: ${linkId}`);
  } catch (error) {
    console.error('Error deleting safelist link: ', error);
    throw new Error('Failed to delete safelist link.');
  }
};
