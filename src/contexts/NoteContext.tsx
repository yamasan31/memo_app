import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, View, NoteColor } from '../types';
import {addTodo} from "../utils/supabaseFunctions.ts";
import note from "../components/Note.tsx";

interface NoteContextType {
  notes: Note[];
  view: View;
  searchQuery: string;
  setView: (view: View) => void;
  setSearchQuery: (query: string) => void;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  restoreNote: (id: string) => void;
  replaceNotes: (notes: Note[]) => void;
  permanentlyDeleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  changeNoteColor: (id: string, color: NoteColor) => void;
  refreshNotes: () => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<View>('notes');
  const [searchQuery, setSearchQuery] = useState('');

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('mynotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Failed to parse notes from localStorage:', error);
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mynotes', JSON.stringify(notes));
  }, [notes]);

  const refreshNotes = () => {
    const savedNotes = localStorage.getItem('mynotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Failed to parse notes from localStorage:', error);
      }
    }
  };

  const addNote = (title: string, content: string) => {
    if (!title.trim() && !content.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      color: 'default',
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);

    addTodo(title);
  };

  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, ...data, updatedAt: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, isDeleted: true, updatedAt: Date.now() }
          : note
      )
    );
  };

  const archiveNote = (id: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, isArchived: true, isPinned: false, updatedAt: Date.now() }
          : note
      )
    );
  };

  const restoreNote = (id: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, isArchived: false, isDeleted: false, updatedAt: Date.now() }
          : note
      )
    );
  };

  const replaceNotes = (notes: Note[]) => {
    setNotes(notes);
  };

  const permanentlyDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
          : note
      )
    );
  };

  const changeNoteColor = (id: string, color: NoteColor) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, color, updatedAt: Date.now() }
          : note
      )
    );
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        view,
        searchQuery,
        setView,
        setSearchQuery,
        addNote,
        updateNote,
        deleteNote,
        archiveNote,
        restoreNote,
        replaceNotes,
        permanentlyDeleteNote,
        togglePin,
        changeNoteColor,
        refreshNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};