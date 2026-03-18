import { useMemo, useState } from "react";
import { WireframeNav } from "./components/WireframeNav";
import { WireframeViewer } from "./components/WireframeViewer";
import { EventSubmissionForm } from "./components/EventSubmissionForm";
import { EventSearch } from "./components/EventSearch";

// ... rest of your imports and type definitions

export default function App() {
  const [userType, setUserType] = useState<UserType>("unregistered");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // ... rest of your existing state and functions

  return (
    <div className="min-h-screen bg-gray-50">
      <WireframeNav
        currentPage={currentPage}
        userType={userType}
        onPageChange={setPage}
        onUserTypeChange={setRole}
      />
      
      {/* Add these buttons for lab features */}
      <div className="fixed top-16 right-4 z-40 flex gap-2">
        <button
          onClick={() => {
            setShowSubmissionForm(!showSubmissionForm);
            setShowSearch(false);
          }}
          className={`px-4 py-2 rounded-lg shadow-lg transition-colors ${
            showSubmissionForm 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {showSubmissionForm ? 'Hide Form' : 'Add Event'}
        </button>
        <button
          onClick={() => {
            setShowSearch(!showSearch);
            setShowSubmissionForm(false);
          }}
          className={`px-4 py-2 rounded-lg shadow-lg transition-colors ${
            showSearch 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {showSearch ? 'Hide Search' : 'Search Events'}
        </button>
      </div>

      <main className="pt-20">
        {(showSubmissionForm || showSearch) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {showSubmissionForm && <EventSubmissionForm />}
            {showSearch && <EventSearch />}
          </div>
        )}

        {!showSubmissionForm && !showSearch && (
          <WireframeViewer page={currentPage} userType={userType} onNavigate={setPage} />
        )}
      </main>
    </div>  
  );
}