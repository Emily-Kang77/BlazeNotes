# Notes App

A modern, responsive notes application built with React, TypeScript, TanStack Query, and shadcn/ui components.

## Features

- ✨ **Create Notes**: Add new notes with title and content
- 📝 **Edit Notes**: Modify existing notes inline
- 🗑️ **Delete Notes**: Remove notes with confirmation dialog
- 🔍 **Search Notes**: Search through notes by title or content
- 💾 **Local Storage**: Notes are automatically saved to Firebase
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful interface using shadcn/ui components
- ⚡ **TanStack Query**: Efficient data management and caching

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and state management
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Components

### Core Components
- `NotesPage` - Main page that orchestrates all functionality
- `NotesList` - Displays all notes with search functionality
- `NoteCard` - Individual note display with edit/delete actions
- `NoteForm` - Form for creating and editing notes
- `DeleteConfirmDialog` - Confirmation dialog for note deletion
- `AppHeader` - Application header

### Hooks
- `useNotes` - Custom hook for notes state management

### Types
- `Note` - Note data structure
- `CreateNoteData` - Data for creating new notes
- `UpdateNoteData` - Data for updating existing notes

## Usage

1. **Create a Note**: Click the "Add Note" button to open the note creation form
2. **Edit a Note**: Click the edit icon on any note card
3. **Delete a Note**: Click the delete icon and confirm in the dialog
4. **Search Notes**: Use the search bar to filter notes by title or content

## Data Persistence

Notes are automatically saved to localStorage and will persist between browser sessions. The app uses TanStack Query for efficient data management and caching.

## Development

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── AppHeader.tsx
│   ├── NoteCard.tsx
│   ├── NoteForm.tsx
│   ├── NotesList.tsx
│   └── DeleteConfirmDialog.tsx
├── hooks/
│   └── useNotes.ts
├── pages/
│   └── NotesPage.tsx
├── types/
│   └── notes.ts
└── App.tsx
``` 