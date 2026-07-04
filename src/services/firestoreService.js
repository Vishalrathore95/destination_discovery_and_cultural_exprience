import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

/**
 * User Profile Operations
 */
export const getUserProfile = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const updateUserProfile = async (uid, updates) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

/**
 * Trip Operations
 */
export const getSavedTrips = async (uid) => {
  const tripsRef = collection(db, 'trips');
  const q = query(tripsRef, where('userId', '==', uid));
  const querySnapshot = await getDocs(q);
  const trips = [];
  querySnapshot.forEach((doc) => {
    trips.push({ id: doc.id, ...doc.data() });
  });
  return trips;
};

export const saveTripToDb = async (uid, tripData) => {
  const tripsRef = collection(db, 'trips');
  const payload = {
    ...tripData,
    userId: uid,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(tripsRef, payload);
  return { id: docRef.id, ...payload };
};

export const deleteTripFromDb = async (tripId) => {
  const docRef = doc(db, 'trips', tripId);
  await deleteDoc(docRef);
};

/**
 * Reviews Operations
 */
export const getReviews = async (destination) => {
  const refCol = collection(db, 'reviews');
  const q = query(refCol, where('destination', '==', destination));
  const snap = await getDocs(q);
  const reviews = [];
  snap.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addReviewToDb = async (reviewData) => {
  const refCol = collection(db, 'reviews');
  const payload = {
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(refCol, payload);
  return { id: docRef.id, ...payload };
};

/**
 * Photo Uploading to Storage
 */
export const uploadUserPhoto = async (uid, file) => {
  const storageRef = ref(storage, `users/${uid}/gallery/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};
