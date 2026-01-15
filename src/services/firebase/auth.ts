/**
 * Firebase Authentication Service
 * Handles login, logout, signup, and user deletion
 */

import {
    createUserWithEmailAndPassword,
    deleteUser,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    updateProfile,
    User,
} from 'firebase/auth';
import {
    collection,
    doc,
    getDocs,
    query,
    where,
    writeBatch
} from 'firebase/firestore';
import { auth, db, isFirebaseInitialized } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt?: Date;
}

/**
 * Convert Firebase User to AuthUser
 */
function firebaseUserToAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth!,
      email,
      password
    );
    const user = userCredential.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    return firebaseUserToAuthUser(user);
  } catch (error: any) {
    throw new Error(`Sign up failed: ${error.message}`);
  }
}

/**
 * Sign in with email and password
 */
export async function logIn(
  email: string,
  password: string
): Promise<AuthUser> {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth!, email, password);
    return firebaseUserToAuthUser(userCredential.user);
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

/**
 * Log out current user
 */
export async function logOut(): Promise<void> {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  try {
    await signOut(auth!);
  } catch (error: any) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}

/**
 * Delete user account and all associated data
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  try {
    // Delete user data from Firestore
    await deleteUserData(userId);

    // Delete Firebase Auth user
    const currentUser = auth!.currentUser;
    if (currentUser && currentUser.uid === userId) {
      await deleteUser(currentUser);
    } else {
      throw new Error('User ID does not match current user');
    }
  } catch (error: any) {
    throw new Error(`Failed to delete user account: ${error.message}`);
  }
}

/**
 * Delete all user data from Firestore
 */
export async function deleteUserData(userId: string): Promise<void> {
  if (!isFirebaseInitialized) {
    console.warn('Firebase is not initialized. Skipping Firestore cleanup.');
    return;
  }

  try {
    const batch = writeBatch(db!);

    // Delete user document
    const userDocRef = doc(db!, 'users', userId);
    batch.delete(userDocRef);

    // Delete all analytics records for user
    const analyticsQuery = query(
      collection(db!, 'analytics'),
      where('userId', '==', userId)
    );
    const analyticsSnapshot = await getDocs(analyticsQuery);
    analyticsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all check-in history
    const checkInQuery = query(
      collection(db!, 'checkInHistory'),
      where('userId', '==', userId)
    );
    const checkInSnapshot = await getDocs(checkInQuery);
    checkInSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all achievements
    const achievementsQuery = query(
      collection(db!, 'achievements'),
      where('userId', '==', userId)
    );
    const achievementsSnapshot = await getDocs(achievementsQuery);
    achievementsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit all deletions
    await batch.commit();
    console.log(`✅ User data deleted for user ${userId}`);
  } catch (error: any) {
    console.error(`Failed to delete user data: ${error.message}`);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  if (!isFirebaseInitialized || !auth!.currentUser) {
    return null;
  }
  return firebaseUserToAuthUser(auth!.currentUser);
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  try {
    await sendPasswordResetEmail(auth!, email);
  } catch (error: any) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}

/**
 * Update user email
 */
export async function updateUserEmail(newEmail: string): Promise<void> {
  if (!isFirebaseInitialized || !auth!.currentUser) {
    throw new Error('No authenticated user found');
  }

  try {
    await updateEmail(auth!.currentUser, newEmail);
  } catch (error: any) {
    throw new Error(`Failed to update email: ${error.message}`);
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(newPassword: string): Promise<void> {
  if (!isFirebaseInitialized || !auth!.currentUser) {
    throw new Error('No authenticated user found');
  }

  try {
    await updatePassword(auth!.currentUser, newPassword);
  } catch (error: any) {
    throw new Error(`Failed to update password: ${error.message}`);
  }
}

/**
 * Update user display name
 */
export async function updateUserDisplayName(newName: string): Promise<void> {
  if (!isFirebaseInitialized || !auth!.currentUser) {
    throw new Error('No authenticated user found');
  }

  try {
    await updateProfile(auth!.currentUser, { displayName: newName });
  } catch (error: any) {
    throw new Error(`Failed to update display name: ${error.message}`);
  }
}
