import { SafelistLink } from '../../../types/safelist';
import { db } from './config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

export async function getUserSafelistLinks(
  userId: string
): Promise<SafelistLink[]> {
  try {
    const q = query(
      collection(db, 'safelistLinks'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }) as SafelistLink
    );
  } catch (error) {
    console.error('Error fetching safelist links:', error);
    return [];
  }
}

export function calculateReadiness(
  lastSubmitted: Date | null,
  frequency: number
) {
  if (!lastSubmitted) return { status: 'ready', timeUntilReady: 0 };

  const now = new Date();
  const timeDiff = now.getTime() - lastSubmitted.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);

  if (hoursDiff >= frequency) {
    return { status: 'ready', timeUntilReady: 0 };
  } else if (hoursDiff >= frequency * 0.8) {
    return { status: 'soon', timeUntilReady: frequency - hoursDiff };
  } else {
    return { status: 'waiting', timeUntilReady: frequency - hoursDiff };
  }
}

export async function getDashboardStats(userId: string) {
  try {
    const links = await getUserSafelistLinks(userId);
    const totalLinks = links.length;
    const activeLinks = links.filter((link) => link.isActive).length;
    const readyLinks = links.filter((link) => {
      const readiness = calculateReadiness(
        link.lastSubmitted ?? null,
        link.frequency
      );
      return readiness.status === 'ready';
    }).length;
    const soonLinks = links.filter((link) => {
      const readiness = calculateReadiness(
        link.lastSubmitted ?? null,
        link.frequency
      );
      return readiness.status === 'soon';
    }).length;
    const waitingLinks = links.filter((link) => {
      const readiness = calculateReadiness(
        link.lastSubmitted ?? null,
        link.frequency
      );
      return readiness.status === 'waiting';
    }).length;

    return {
      totalLinks,
      activeLinks,
      readyLinks,
      submissionRate:
        totalLinks > 0 ? Math.round((readyLinks / totalLinks) * 100) : 0,
      readyNow: readyLinks,
      readySoon: soonLinks,
      waiting: waitingLinks,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalLinks: 0,
      activeLinks: 0,
      readyLinks: 0,
      submissionRate: 0,
      readyNow: 0,
      readySoon: 0,
      waiting: 0,
    };
  }
}

export async function addSafelistLink(
  userId: string,
  linkData: Omit<SafelistLink, 'id' | 'userId' | 'createdAt'>
) {
  try {
    const newLink: Omit<SafelistLink, 'id'> = {
      ...linkData,
      userId,
      createdAt: new Date(),
    };

    console.log('Adding safelist link:', newLink);
    return { success: true, id: 'temp-id' };
  } catch (error) {
    console.error('Error adding safelist link:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateLastSubmitted(
  linkId: string,
  timestamp: Date = new Date()
) {
  try {
    const linkRef = doc(db, 'safelistLinks', linkId);
    await updateDoc(linkRef, {
      lastSubmitted: timestamp,
    });
    console.log('Updated last submitted timestamp for link:', linkId);
    return { success: true };
  } catch (error) {
    console.error('Error updating last submitted timestamp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
