import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { generateVocabulary } from '../../services/geminiService';
import { textToSpeech } from '../../utils/helpers';
import { MessageSquare, Volume2, Save, Sparkles, Check } from 'lucide-react';

export const VocabularyBuilder = () => {
  const { destinationGuide } = useTrip();
  
  const [vocab, setVocab] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState([]);

  const destination = destinationGuide?.queryDestination || '';

  useEffect(() => {
    if (destination) {
      setLoading(true);
      generateVocabulary(destination)
        .then((data) => {
          if (data && !data.error) setVocab(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [destination]);

  const handleSpeak = (phrase) => {
    textToSpeech.speak(phrase);
  };

  const handleSavePhrase = (phraseObj) => {
    setSavedPhrases((prev) => {
      const exists = prev.some((p) => p.phrase === phraseObj.phrase);
      if (exists) {
        return prev.filter((p) => p.phrase !== phraseObj.phrase);
      }
      return [...prev, phraseObj];
    });
  };

  if (!destinationGuide) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <MessageSquare className="text-indigo-650" />
          <span>Local Vocabulary Builder</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Learn critical local words, pronunciation, and etiquette contexts for polite interactions in {destination}.
        </p>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-400">Compiling language charts...</p>
          </div>
        ) : vocab.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vocab.map((v, index) => {
              const isSaved = savedPhrases.some((p) => p.phrase === v.phrase);

              return (
                <div
                  key={index}
                  className="p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 flex justify-between items-start"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-slate-900 dark:text-white">{v.phrase}</span>
                      <span className="text-xs text-slate-400 italic">[{v.pronunciation}]</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 block">Meaning: {v.meaning}</span>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed font-sans pt-1">
                      Context: {v.culturalContext}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 ml-3 shrink-0">
                    <button
                      onClick={() => handleSpeak(v.phrase)}
                      className="p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                      title="Listen to pronunciation"
                    >
                      <Volume2 size={14} />
                    </button>
                    <button
                      onClick={() => handleSavePhrase(v)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSaved
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'border-slate-300 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove from practice' : 'Save phrase'}
                    >
                      {isSaved ? <Check size={14} /> : <Save size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-6 text-xs text-slate-400">Could not resolve language vocabulary for this destination.</p>
        )}
      </div>
    </div>
  );
};

export default VocabularyBuilder;
