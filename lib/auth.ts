import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth"
import { auth } from "./firebase"

const googleProvider = new GoogleAuthProvider()

// Register with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  photoURL?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Update profile with name and photo
    await updateProfile(user, {
      displayName: name,
      photoURL: photoURL || null,
    })

    // Get Firebase ID token
    const idToken = await user.getIdToken()

    return { user, idToken }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Get Firebase ID token
    const idToken = await user.getIdToken()

    return { user, idToken }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Get Firebase ID token
    const idToken = await user.getIdToken()

    return { user, idToken }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback)
}
