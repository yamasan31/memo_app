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
    <header className="fixed top-0 left-0 right-0 h-24 bg-white shadow-sm flex items-center px-4 z-10">
      <div className="flex items-center w-full max-w-7xl mx-auto justify-start gap-6">
        <div className="flex items-center flex-shrink-0">
          <a href="/" className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="text-yellow-500">My</span>
            <span className="ml-1">Note</span>
          </a>
        </div>

        <div
          className={`flex items-center w-full max-w-md px-5 py-3 rounded-lg ${
            isSearchFocused ? 'bg-white shadow-md' : 'bg-gray-100'
          } transition-all duration-200`}
        >
          <Search size={20} className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="メモを検索"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-lg"
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
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-grow">
          {/* 右側の余白部分 */}
        </div>
      </div>
    </header>
  );
};

export default Header;