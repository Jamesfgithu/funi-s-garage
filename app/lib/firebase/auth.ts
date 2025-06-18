import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification,
    User,
    NextOrObserver,
    ActionCodeSettings,
  } from 'firebase/auth';
  import { auth } from './config';
  
  // Sign Up with Email and Password
  export const signUpWithEmailPassword = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };
  
  // Sign In with Email and Password
  export const signInWithEmailPassword = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };
  
  // Sign Out
  export const signOutUser = async (): Promise<void> => {
    await signOut(auth);
  };
  
  // Password Reset
  export const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };
  
  // Send Email Verification
  export const sendVerification = async (user: User): Promise<void> => {
    if (!user) {
      console.error("Auth: sendVerification called with null user.");
      throw new Error("User object is null, cannot send verification email.");
    }
    if (!user.email) {
      console.error("Auth: sendVerification called for user with no email. UID:", user.uid);
      throw new Error("User object has no email, cannot send verification email.");
    }
  
    const currentOrigin = window.location.origin;
    console.log(`Auth: Attempting to send verification email to: ${user.email} from origin: ${currentOrigin}`);
    
    if (auth && auth.app && auth.app.options) {
      console.log("Auth: Firebase app options being used by auth instance in sendVerification:", JSON.stringify(auth.app.options, null, 2));
    } else {
      console.warn("Auth: Firebase auth instance or app options not available in sendVerification.");
    }
  
    const actionCodeSettings: ActionCodeSettings = {
      url: `${currentOrigin}/email-verified?email=${encodeURIComponent(user.email || '')}`,
      handleCodeInApp: true,
    };
    
    console.log("Auth: actionCodeSettings for sendVerification:", JSON.stringify(actionCodeSettings, null, 2));
  
    try {
      await sendEmailVerification(user, actionCodeSettings);
      console.log("Auth: sendEmailVerification SDK call SUCCEEDED for:", user.email);
    } catch (error: any) {
      console.error(`Auth: Error calling sendEmailVerification for user: ${user.uid}, Email: ${user.email}`, error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/unauthorized-continue-uri') {
        console.error(`IMPORTANT: The domain Firebase is rejecting for continue URL is: ${currentOrigin}. Ensure this is in Firebase Auth > Settings > Authorized domains list.`);
      }
      throw error; 
    }
  };
  
  // Auth State Listener
  export const onAuthStateChangedListener = (callback: NextOrObserver<User | null>): (() => void) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Get Current User
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  