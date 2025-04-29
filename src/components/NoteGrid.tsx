import React from 'react';
import { useNotes } from '../contexts/NoteContext';
import Note from './Note';
import { Note as NoteType } from '../types';

const NoteGrid: React.FC = () => {
  const { notes, view, searchQuery } = useNotes();

  const filterNotes = (notes: NoteType[]): NoteType[] => {
    // Filter based on view
    let filteredNotes = notes.filter(note => {
      switch (view) {
        case 'notes':
          return !note.isArchived && !note.isDeleted;
        case 'archive':
          return note.isArchived && !note.isDeleted;
        case 'trash':
          return note.isDeleted;
        case 'labels':
          // In a real app, we would filter by labels here
          return !note.isArchived && !note.isDeleted;
        default:
          return !note.isArchived && !note.isDeleted;
      }
    });

    // Filter based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    return filteredNotes;
  };

  const filteredNotes = filterNotes(notes);
  
  // Separate pinned and unpinned notes (only in notes view)
  const pinnedNotes = view === 'notes' 
    ? filteredNotes.filter(note => note.isPinned)
    : [];
  
  const unpinnedNotes = view === 'notes'
    ? filteredNotes.filter(note => !note.isPinned)
    : filteredNotes;

  // Show appropriate message when no notes are found
  const renderEmptyState = () => {
    let message = '';
    switch (view) {
      case 'notes':
        message = searchQuery 
          ? '検索結果はありません'
          : 'メモはありません。新しいメモを作成してください。';
        break;
      case 'archive':
        message = 'アーカイブされたメモはありません';
        break;
      case 'trash':
        message = 'ゴミ箱は空です';
        break;
      case 'labels':
        message = 'ラベル付きのメモはありません';
        break;
      default:
        message = 'メモはありません';
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {filteredNotes.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <>
              <div className="mb-2 mt-6 text-sm font-medium text-gray-500 px-1">
                ピン留めされたメモ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {pinnedNotes.map(note => (
                  <div><Note key={note.id} note={note} /></div>
                ))}
              </div>
            </>
          )}

          {unpinnedNotes.length > 0 && (
            <>
              {pinnedNotes.length > 0 && (
                <div className="mb-2 text-sm font-medium text-gray-500 px-1">
                  その他のメモ
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {unpinnedNotes.map(note => (
                  <div><Note key={note.id} note={note} /></div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NoteGrid;