import React, { useState } from "react";
import { Menu } from "lucide-react";
import { NoteProvider,  } from "./contexts/NoteContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteCreation from "./components/NoteCreation";
import NoteGrid from "./components/NoteGrid";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <NoteProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex pt-16">
          {/* Mobile menu button */}
          <button
            className="fixed bottom-4 left-4 z-40 md:hidden bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors focus:outline-none"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>

          <Sidebar isSidebarOpen={false} onCloseSidebar={() => {}} />

          <main className="flex-1 md:ml-64 p-4 pt-6">
            <div className="max-w-6xl mx-auto">
              <NoteCreation />
              <NoteGrid />
            </div>
          </main>
        </div>
      </div>
    </NoteProvider>
  );
}

export default App;
