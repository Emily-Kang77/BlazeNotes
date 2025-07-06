import { useState, useEffect } from 'react';
import type { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes, loading]);

  const createNote = (noteData: CreateNoteData): Note => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, noteData: UpdateNoteData): Note | null => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        return {
          ...note,
          ...noteData,
          updatedAt: new Date(),
        };
      }
      return note;
    }));
    return notes.find(note => note.id === id) || null;
  };

  const deleteNote = (id: string): void => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getNote = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
} 