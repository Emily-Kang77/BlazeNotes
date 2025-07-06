import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotesSidebar } from '@/components/NotesSidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import type { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';
import { useAuth } from '@/hooks/useAuth';
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/firebase-notes';

/**
 * Workflow: 
 * 1. User clicks "New Note" button in sidebar
 * 2. handleCreateNew() creates a new note immediately with timestamp title
 *    handleCreateNew() calls createMutation.mutate(newNoteData)
 * 3. createMutation.mutate(newNoteData) calls createNote(newNoteData)
 * 4. createNote(newNoteData) calls createNote in firebase-notes.ts
 * 5. Further edits to the note are handled by handleSave(), which just updates the note in firestore
 */


interface NotesPageProps {
  // No props needed - uses useAuth hook directly
}

export function NotesPage({}: NotesPageProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; note: Note | null }>({
    isOpen: false,
    note: null,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // TanStack Query for notes data. Caches the data with key 'notes'. 
  const { data: notesData = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    enabled: !!user,
  });

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNote(newNote);
    },
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteData }) => 
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setDeleteDialog({ isOpen: false, note: null });
      setSelectedNote(null);
    },
  });

  const handleUpdateNote = (data: UpdateNoteData) => {
    if (selectedNote) {
      updateMutation.mutate({ id: selectedNote.id, data });
    }
  };

  const handleSelectNote = (note: Note | null) => {
    setSelectedNote(note);
  };

  const handleCreateNew = () => {
    // Create a new note immediately with timestamp title
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    const newNoteData = {
      title: `Note ${timestamp}`,
      content: '',
    };
    // This mutation automatically sets the note
    createMutation.mutate(newNoteData);
  };

  const handleDeleteNote = (id: string) => {
    const note = notesData.find(n => n.id === id);
    if (note) {
      setDeleteDialog({ isOpen: true, note });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.note) {
      deleteMutation.mutate(deleteDialog.note.id);
    }
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
  };

  const handleSave = (data: CreateNoteData | UpdateNoteData) => {
    handleUpdateNote(data as UpdateNoteData);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 transition-all duration-300 ease-in-out`}>
        <NotesSidebar
          notes={notesData}
          loading={isLoading}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleSelectNote}
          onCreateNew={handleCreateNew}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Editor */}
      <div className="flex-1">
        <NoteEditor
          note={selectedNote}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onDelete={selectedNote ? () => handleDeleteNote(selectedNote.id) : undefined}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, note: null })}
        onConfirm={handleConfirmDelete}
        noteTitle={deleteDialog.note?.title || ''}
      />
    </div>
  );
} 