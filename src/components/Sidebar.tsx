import React from 'react';
import { StickyNote, Tag, Archive, Trash } from 'lucide-react';
import { useNotes } from '../contexts/NoteContext';
import { View } from '../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onCloseSidebar }) => {
  const { view, setView } = useNotes();

  const handleViewChange = (newView: View) => {
    setView(newView);
    if (window.innerWidth < 768) {
      onCloseSidebar();
    }
  };

  const sidebarItems = [
    { id: 'notes', label: 'メモ', icon: <StickyNote size={20} />, view: 'notes' as View },
    { id: 'labels', label: 'ラベル', icon: <Tag size={20} />, view: 'labels' as View },
    { id: 'archive', label: 'アーカイブ', icon: <Archive size={20} />, view: 'archive' as View },
    { id: 'trash', label: 'ゴミ箱', icon: <Trash size={20} />, view: 'trash' as View },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onCloseSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-24 bottom-0 w-64 bg-white shadow-sm overflow-y-auto z-30 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="p-2 pt-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleViewChange(item.view)}
                  className={`w-full flex items-center py-3 px-4 rounded-full transition-colors ${
                    view === item.view
                      ? 'bg-yellow-100 text-yellow-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-4">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;