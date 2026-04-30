import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, BookmarkPlus, AlertCircle } from 'lucide-react';
import { translateAndDefine, addVocabularyFromAIDictionary } from '../services/api';
import { showSuccess, showError } from '../utils/toast';

const DictionaryModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addingToVocab, setAddingToVocab] = useState(false);
  const [vocabSuccess, setVocabSuccess] = useState('');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

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
    setVocabSuccess('');
    setRetryAttempt(0);
    
    try {
      const data = await translateAndDefine(text, targetLanguage);
      setResult(data);
      setLoadingMessage('');
    } catch (err) {
      const status = err?.status || err?.response?.status;
      
      // Handle 503 Service Unavailable with auto-retry
      if (status === 503 && retryAttempt < 3) {
        setRetryAttempt(retryAttempt + 1);
        const delaySeconds = Math.pow(2, retryAttempt);
        setLoadingMessage(`⚠️ Service busy. Retrying in ${delaySeconds}s... (Attempt ${retryAttempt + 1}/3)`);
        
        // Retry after delay
        setTimeout(() => {
          handleSearch();
        }, delaySeconds * 1000);
        return;
      }
      
      // Format error message
      let errorMessage = err.message || 'An unexpected error occurred.';
      if (status === 429) {
        errorMessage = 'API quota exceeded. Please try again in a few minutes.';
      } else if (status === 503) {
        errorMessage = 'Service is experiencing high demand. Please try again later.';
      }
      
      setError(errorMessage);
      showError(errorMessage);
      setLoadingMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToVocab = async () => {
    if (!result) return;

    setAddingToVocab(true);
    setError('');
    setVocabSuccess('');
    
    let vocabRetryAttempt = 0;
    
    const attemptAddVocab = async () => {
      try {
        await addVocabularyFromAIDictionary(result.original, result.meaning);
        const successMsg = `✓ "${result.original}" added to ${result.language}!`;
        setVocabSuccess(successMsg);
        showSuccess(successMsg);
        setAddingToVocab(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setVocabSuccess(''), 3000);
      } catch (err) {
        const status = err?.status || err?.response?.status;
        
        // Handle 503 with retry for vocab add
        if ((status === 503 || status === 429) && vocabRetryAttempt < 3) {
          vocabRetryAttempt++;
          const delaySeconds = Math.pow(2, vocabRetryAttempt - 1);
          setError(`⚠️ Service busy. Retrying... (Attempt ${vocabRetryAttempt}/3)`);
          
          setTimeout(() => {
            attemptAddVocab();
          }, delaySeconds * 1000);
        } else {
          let errorMsg = err.message || 'Failed to add to vocabulary';
          if (status === 429) {
            errorMsg = 'API quota exceeded. Please try again in a few minutes.';
          } else if (status === 503) {
            errorMsg = 'Service unavailable. Please try again later.';
          }
          setError(errorMsg);
          showError(errorMsg);
          setAddingToVocab(false);
        }
      }
    };
    
    attemptAddVocab();
  };

  useEffect(() => {
    if (!isOpen) {
      setText('');
      setResult(null);
      setError('');
      setVocabSuccess('');
      setRetryAttempt(0);
      setLoadingMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200/50">
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/50 bg-white/50">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Smart Dictionary & Translator</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </header>

        <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a word or phrase..."
              className="flex-grow p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition input-field"
              rows="3"
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none input-field"
                disabled={loading}
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-lg font-semibold hover:shadow-soft transition-all flex items-center justify-center disabled:opacity-50 gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                <span className="hidden sm:inline">{loading ? 'Processing...' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Loading Message with retry info */}
          {loadingMessage && (
            <div className="mb-4 p-4 bg-blue-50/80 border border-blue-200/50 rounded-lg flex items-start gap-3">
              <Loader2 className="animate-spin text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-blue-700 font-medium text-sm">{loadingMessage}</p>
                <p className="text-xs text-blue-600 mt-1">The API is working on your request with automatic retries...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50/80 border border-red-200/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-red-700 font-medium text-sm">Error</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}
          
          {vocabSuccess && (
            <div className="mb-4 p-4 bg-green-50/80 border border-green-200/50 rounded-lg flex items-start gap-3">
              <div className="text-green-600 flex-shrink-0 mt-0.5">✓</div>
              <p className="text-green-700 font-medium text-sm">{vocabSuccess}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-2 uppercase tracking-wide">Translation ({result.language})</h3>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">{result.translation}</p>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-2 uppercase tracking-wide">Meaning / Definition</h3>
                <p className="text-sm sm:text-base text-slate-800 bg-slate-50/80 backdrop-blur-sm p-4 rounded-lg border border-slate-200/50">{result.meaning}</p>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-2 uppercase tracking-wide">Example Sentences</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm sm:text-base">
                  {result.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-700 mb-2 uppercase tracking-wide">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms.map((syn, i) => (
                    <span key={i} className="bg-indigo-100/80 text-indigo-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-indigo-200/50">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Vocab Button */}
              <div className="border-t border-slate-200/50 pt-4 mt-4 sm:mt-6">
                <button
                  onClick={handleAddToVocab}
                  disabled={addingToVocab}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-lg font-semibold hover:shadow-soft transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {addingToVocab ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Adding to Vocabulary...</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus size={18} />
                      <span>Add to My Workspace</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-600 text-center mt-2">
                  Automatically adds to your {result.language} language folder
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
