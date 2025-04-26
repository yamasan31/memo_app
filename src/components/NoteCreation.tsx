import React, { useState, useRef, useEffect } from 'react';
import { useNotes } from '../contexts/NoteContext';

const NoteCreation: React.FC = () => {
  const { addNote } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Handle clicks outside the form to collapse it if empty
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current && 
        !formRef.current.contains(event.target as Node) &&
        !title.trim() && 
        !content.trim()
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [title, content]);

  const handleFormClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Focus the title input after expanding
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 10);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() || content.trim()) {
      addNote(title, content);
      setTitle('');
      setContent('');
      
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4 mt-28">
      <form
        ref={formRef}
        className={`bg-white rounded-lg shadow-md transition-all duration-200 ${
          isExpanded ? 'p-4' : 'p-3'
        }`}
        onClick={handleFormClick}
        onSubmit={handleSubmit}
      >
        {isExpanded && (
          <input
            ref={titleInputRef}
            type="text"
            placeholder="タイトル"
            className="w-full mb-2 p-2 font-medium text-gray-800 placeholder-gray-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        <textarea
          placeholder={isExpanded ? "メモを入力..." : "メモを作成..."}
          className={`w-full p-2 resize-none text-gray-700 placeholder-gray-500 focus:outline-none ${
            isExpanded ? 'min-h-[80px]' : 'min-h-[40px]'
          }`}
          rows={isExpanded ? 3 : 1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleContentKeyDown}
        />
        {isExpanded && (
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-1.5 text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-md transition-colors"
            >
              作成
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NoteCreation;