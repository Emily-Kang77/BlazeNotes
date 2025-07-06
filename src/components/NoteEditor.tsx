import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';
import { Save, X, FileText } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import { debounce } from 'lodash';

interface NoteEditorProps {
  note: Note | null;
  onSave: (data: CreateNoteData | UpdateNoteData) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export function NoteEditor({ 
  note, 
  onSave, 
  onCancel, 
  onDelete 
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setHasChanges(false);
    }
  }, [note]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
    debouncedSaveRef.current?.(value, content); // Call the stored debounced function
  };

  // Create the debounced function once and store it in a ref
  const debouncedSaveRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Initialize the debounced function once!
  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce((currentTitle: string, currentContent: string) => {
      console.log('Saving note... with title: ', currentTitle, 'content: ', currentContent);
      onSave({ title: currentTitle, content: currentContent });
      setHasChanges(false);
    }, 2000);
  }

  const handleContentChange = (value?: string) => {
    const newContent = value || '';
    setContent(newContent);
    setHasChanges(true);
    debouncedSaveRef.current?.(title, newContent); // Call the stored debounced function
  };

  const handleCancel = () => {
    if (hasChanges) {
      // You could add a confirmation dialog here
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleDelete = () => {
    if (note && onDelete) {
      if (confirm('Are you sure you want to delete this note?')) {
        onDelete(note.id);
      }
    }
  };

  // Show empty state when no note is selected
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No note selected
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a note from the sidebar to edit, or create a new one.
        </p>
      </div> 
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-0"
          />
          {hasChanges && (
            <span className="text-xs text-muted-foreground">(unsaved)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {note && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="container">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          previewOptions={{
            rehypePlugins: [rehypeSanitize],
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {note && (
              <span>
                Last updated: {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(note.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 