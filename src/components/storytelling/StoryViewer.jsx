import React, { useState, useEffect } from 'react';
import { generateStory } from '../../services/geminiService';
import { textToSpeech } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';
import { Volume2, VolumeX, BookOpen, Quote, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export const StoryViewer = ({ attractionName, destination, onClose }) => {
  const { language } = useTheme();
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    textToSpeech.stop();
    setIsPlaying(false);

    generateStory(attractionName, destination)
      .then((data) => {
        if (!active) return;
        if (data && data.error) {
          setError(data.error);
        } else {
          setStoryData(data);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to fetch the legend.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      textToSpeech.stop();
    };
  }, [attractionName, destination]);

  const handleSpeak = () => {
    if (!storyData || !storyData.story) return;
    
    if (isPlaying) {
      textToSpeech.stop();
      setIsPlaying(false);
    } else {
      textToSpeech.speak(storyData.story, language);
      setIsPlaying(true);
      
      // Auto-reset isPlaying when speech ends
      if ('speechSynthesis' in window) {
        const checkSpeechInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            setIsPlaying(false);
            clearInterval(checkSpeechInterval);
          }
        }, 1000);
      }
    }
  };

  if (loading) {
    return (
      <div className="glass-panel border rounded-xl p-8 max-w-2xl mx-auto my-6 text-center shadow-lg">
        <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-serif-display font-medium text-slate-700 dark:text-slate-350">
          Channelling ancient legends of {attractionName}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel border border-red-200 bg-red-50 dark:bg-red-950/40 p-6 max-w-2xl mx-auto my-6 rounded-xl flex items-start space-x-3 shadow-md">
        <AlertTriangle className="text-red-650 dark:text-red-400 shrink-0 w-5 h-5 mt-0.5" />
        <div>
          <h3 className="font-bold text-red-850 dark:text-red-305">Failed to evoke lore</h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
          <button onClick={onClose} className="mt-4 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline">
            Back to attractions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 shrink-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-0.5">
              Oral History & Legend
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-slate-900 dark:text-white">
              {attractionName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close legend overlay"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Legend Story Block */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Quote size={14} />
                <span>The Storyteller's Account</span>
              </span>
              
              {/* Audio Speech controls */}
              <button
                onClick={handleSpeak}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-95/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all focus:ring-2 focus:ring-indigo-500"
                aria-label={isPlaying ? "Stop audio narration" : "Listen to audio narration"}
              >
                {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isPlaying ? 'Stop Narration' : 'Narrate Story'}</span>
              </button>
            </div>
            
            <blockquote className="border-l-4 border-indigo-600 pl-4 italic text-slate-700 dark:text-slate-300 font-serif leading-relaxed text-base sm:text-lg">
              "{storyData.story}"
            </blockquote>
          </div>

          {/* Cultural Context */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Info size={14} className="text-orange-500" />
              <span>Historical context & lore details</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
              {storyData.culturalContext}
            </p>
          </div>

          {/* Did You Know Bullet points */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Did You Know?</h3>
            <ul className="space-y-2.5">
              {storyData.didYouKnow?.map((fact, i) => (
                <li key={i} className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-350">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Engagement Tip */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-900 rounded-xl">
            <span className="block text-xs font-bold text-emerald-805 dark:text-emerald-305 uppercase tracking-wider mb-1.5">
              How to experience respectfully
            </span>
            <p className="text-xs text-emerald-705 dark:text-emerald-300 leading-relaxed font-sans">
              {storyData.engagementTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
