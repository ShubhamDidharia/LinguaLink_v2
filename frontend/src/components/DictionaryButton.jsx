import React, { useState } from 'react';
import { BookMarked } from 'lucide-react';
import DictionaryModal from './DictionaryModal';

const DictionaryButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-50"
        aria-label="Open Smart Dictionary"
      >
        <BookMarked size={24} />
      </button>
      <DictionaryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default DictionaryButton;
