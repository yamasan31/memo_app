import React, { useState } from 'react';
import {Search, X } from 'lucide-react';
import { useNotes } from '../contexts/NoteContext';

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, refreshNotes } = useNotes();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleRefresh = () => {
    refreshNotes();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center px-4 z-10">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <a href="/" className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="text-yellow-500">My</span>
            <span className="ml-1">Note</span>
          </a>
        </div>

        <div
          className={`flex items-center flex-1 max-w-2xl mx-4 px-4 py-2 rounded-lg ${
            isSearchFocused ? 'bg-white shadow-md' : 'bg-gray-100'
          } transition-all duration-200`}
        >
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="メモを検索"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div>

        </div>
      </div>
    </header>
  );
};

export default Header;