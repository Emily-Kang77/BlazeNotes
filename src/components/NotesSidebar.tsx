import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Note } from '@/types/notes';
import { Search, Plus, Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface NotesSidebarProps {
  notes: Note[];
  loading: boolean;
  selectedNoteId: string | null;
  onSelectNote: (note: Note | null) => void;
  onCreateNew: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function NotesSidebar({ 
  notes, 
  loading, 
  selectedNoteId, 
  onSelectNote,
  onCreateNew,
  collapsed = false,
  onToggleCollapse
}: NotesSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {!collapsed && <h2 className="text-lg font-semibold">Notes</h2>}
            {onToggleCollapse && (
              <Button 
                onClick={onToggleCollapse} 
                size="sm" 
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </div>
          {!collapsed && (
            <Button onClick={onCreateNew} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New
            </Button>
          )}
        </div>
        
        {/* Search */}
        {!collapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        )}
        
        {/* New button for collapsed state */}
        {collapsed && (
          <div className="flex justify-center">
            <Button 
              onClick={onCreateNew} 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 p-0"
              title="New Note"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {collapsed ? (
            // Collapsed view - just show icons
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={`
                    p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center
                    ${selectedNoteId === note.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                    }
                  `}
                  title={note.title}
                >
                  <FileText className="h-4 w-4" />
                </div>
              ))}
            </div>
          ) : (
            // Expanded view - show full note details
            <>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        No notes found for "{searchTerm}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        No notes yet
                      </p>
                      <Button onClick={onCreateNew} size="sm" variant="outline">
                        Create Note
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => onSelectNote(note)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedNoteId === note.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm line-clamp-1 ${
                            selectedNoteId === note.id ? 'text-primary-foreground' : ''
                          }`}>
                            {note.title}
                          </h3>
                          <p className={`text-xs mt-1 line-clamp-2 ${
                            selectedNoteId === note.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          }`}>
                            {truncateText(note.content)}
                          </p>
                          <p className={`text-xs mt-2 ${
                            selectedNoteId === note.id ? 'text-primary-foreground/60' : 'text-muted-foreground'
                          }`}>
                            {formatDate(note.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 