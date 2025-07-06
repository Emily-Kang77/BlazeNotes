import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';

const NOTES_COLLECTION = 'notes';

// Helper to get current user ID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

// Create a new note
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const userId = getCurrentUserId();
  
  const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
    ...noteData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const newNote: Note = {
    id: docRef.id,
    title: noteData.title,
    content: noteData.content,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('newNote object created: ', newNote)
  return newNote;
};

// Get all notes for the current user
export const getNotes = async (): Promise<Note[]> => {
  console.log('getNotes function called')
  const userId = getCurrentUserId();
  
  const q = query(
    collection(db, NOTES_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  
  const notes_array = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Note;
  });

  // console.log('notes_array: ', notes_array)
  return notes_array;
};

// Update a note
export const updateNote = async (id: string, noteData: UpdateNoteData): Promise<Note | null> => {
  const userId = getCurrentUserId();
  
  const noteRef = doc(db, NOTES_COLLECTION, id);
  console.log('Updating note...')
  await updateDoc(noteRef, {
    ...noteData,
    updatedAt: serverTimestamp(),
  });

  // Return the updated note (you might want to fetch it again)
  console.log('Updated note: ', noteData)
  return {
    id,
    title: noteData.title || '',
    content: noteData.content || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Note;
};

// Delete a note
export const deleteNote = async (id: string): Promise<void> => {
  const userId = getCurrentUserId();
  
  const noteRef = doc(db, NOTES_COLLECTION, id);
  await deleteDoc(noteRef);
}; 