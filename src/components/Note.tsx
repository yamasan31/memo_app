import React, { useState, useRef, useEffect } from 'react';
import { Pin, PinOff, Trash, ArchiveIcon, Palette } from 'lucide-react';
import { Note as NoteType, NoteColor } from '../types';
import { useNotes } from '../contexts/NoteContext';
import ColorPicker from './ColorPicker';

interface NoteProps {
  note: NoteType;
}

const getBackgroundColor = (color: NoteColor): string => {
  switch (color) {
    case 'red': return 'bg-red-50';
    case 'orange': return 'bg-orange-50';
    case 'yellow': return 'bg-yellow-50';
    case 'green': return 'bg-green-50';
    case 'teal': return 'bg-teal-50';
    case 'blue': return 'bg-blue-50';
    case 'purple': return 'bg-purple-50';
    case 'pink': return 'bg-pink-50';
    default: return 'bg-white';
  }
};

const getBorderColor = (color: NoteColor): string => {
  switch (color) {
    case 'red': return 'border-red-200';
    case 'orange': return 'border-orange-200';
    case 'yellow': return 'border-yellow-200';
    case 'green': return 'border-green-200';
    case 'teal': return 'border-teal-200';
    case 'blue': return 'border-blue-200';
    case 'purple': return 'border-purple-200';
    case 'pink': return 'border-pink-200';
    default: return 'border-gray-200';
  }
};

const Note: React.FC<NoteProps> = ({ note }) => {
  const { togglePin, changeNoteColor, archiveNote, deleteNote, restoreNote, permanentlyDeleteNote, view } = useNotes();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
      
      if (isEditing && noteRef.current && !noteRef.current.contains(event.target as Node)) {
        saveChanges();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPickerOpen, isEditing]);

  const handleColorSelect = (color: NoteColor) => {
    changeNoteColor(note.id, color);
    setIsColorPickerOpen(false);
  };

  const handleNoteClick = () => {
    if (!isEditing && !note.isDeleted) {
      setIsEditing(true);
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  };

  const saveChanges = () => {
    if (isEditing) {
      const { updateNote } = useNotes();
      updateNote(note.id, { title: editTitle, content: editContent });
      setIsEditing(false);
    }
  };

  const renderActions = () => {
    if (view === 'trash') {
      return (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              restoreNote(note.id);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="復元"
          >
            <ArchiveIcon size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('このメモを完全に削除しますか？この操作は元に戻せません。')) {
                permanentlyDeleteNote(note.id);
              }
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
            title="完全に削除"
          >
            <Trash size={16} />
          </button>
        </>
      );
    }

    if (view === 'archive') {
      return (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              restoreNote(note.id);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="復元"
          >
            <ArchiveIcon size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
            title="ゴミ箱に移動"
          >
            <Trash size={16} />
          </button>
        </>
      );
    }

    return (
      <>
        <div ref={colorPickerRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsColorPickerOpen(!isColorPickerOpen);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="色を変更"
          >
            <Palette size={16} />
          </button>
          {isColorPickerOpen && (
            <ColorPicker onSelectColor={handleColorSelect} currentColor={note.color} />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            archiveNote(note.id);
          }}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="アーカイブ"
        >
          <ArchiveIcon size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePin(note.id);
          }}
          className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-gray-100 rounded-full transition-colors"
          title={note.isPinned ? "ピン留めを解除" : "ピン留め"}
        >
          {note.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>
      </>
    );
  };

  return (
    <div
      ref={noteRef}
      className={`${getBackgroundColor(note.color)} border ${getBorderColor(
        note.color
      )} rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
      onClick={handleNoteClick}
    >
      <div className="p-4">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-2 font-medium bg-transparent focus:outline-none"
              placeholder="タイトル"
              autoFocus
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent focus:outline-none resize-none"
              placeholder="メモを入力..."
              rows={4}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveChanges();
                }}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md"
              >
                保存
              </button>
            </div>
          </>
        ) : (
          <>
            {note.title && (
              <h3 className="font-medium text-gray-800 mb-1 break-words">{note.title}</h3>
            )}
            <p className="text-gray-700 break-words whitespace-pre-line">{note.content}</p>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="flex justify-end items-center p-1 border-t border-opacity-50">
          {renderActions()}
        </div>
      )}
    </div>
  );
};

export default Note;