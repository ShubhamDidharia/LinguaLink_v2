import React, { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { translateAndDefine } from '../services/api';

const DictionaryModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese (Simplified)', 'Japanese', 'Korean', 'Arabic'
  ];

  const handleSearch = async () => {
    if (!text.trim()) {
      setError('Please enter a word or phrase.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await translateAndDefine(text, targetLanguage);
      setResult(data);
    } catch (err) {
      setError(err.error || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setText('');
      setResult(null);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Smart Dictionary & Translator</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </header>

        <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a word or phrase..."
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              rows="3"
            />
            <div className="flex flex-col gap-2">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-300"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                <span className="ml-2">Search</span>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Translation ({result.language})</h3>
                <p className="text-2xl font-bold text-blue-600">{result.translation}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Meaning / Definition</h3>
                <p className="text-gray-800 bg-gray-100 p-4 rounded-lg">{result.meaning}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Example Sentences</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {result.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms.map((syn, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
