import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { generateVirtualImmersion } from '../../services/geminiService';
import { textToSpeech } from '../../utils/helpers';
import { Compass, Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

export const VirtualImmersion = () => {
  const { destinationGuide } = useTrip();
  
  const [selectedSite, setSelectedSite] = useState('');
  const [immersion, setImmersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!destinationGuide) return null;

  const sites = [...(destinationGuide.topAttractions || []), ...(destinationGuide.hiddenGems || [])];

  const handleEvokeImmersion = async () => {
    if (!selectedSite) return;
    setLoading(true);
    setImmersion(null);
    textToSpeech.stop();
    setIsPlaying(false);

    try {
      const data = await generateVirtualImmersion(selectedSite, destinationGuide.queryDestination);
      setImmersion(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!immersion) return;
    
    if (isPlaying) {
      textToSpeech.stop();
      setIsPlaying(false);
    } else {
      const textToRead = `${immersion.title}. ${immersion.introduction}. ${immersion.steps.join('. ')}. ${immersion.mindfulnessReflection}`;
      textToSpeech.speak(textToRead);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <Compass className="text-indigo-650" />
          <span>Virtual Cultural Immersion & Meditation</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Unlock a guided sensory visualization to "mentally visit" sacred landmarks respectfully.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <div className="flex-1 w-full">
            <label htmlFor="site-select" className="sr-only">Select Cultural Site</label>
            <select
              id="site-select"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs font-semibold"
            >
              <option value="">-- Select Cultural Site --</option>
              {sites.map((s, idx) => (
                <option key={idx} value={s.name}>
                  {s.name} ({s.category || 'Local Gem'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleEvokeImmersion}
            disabled={loading || !selectedSite}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shrink-0 shadow-sm transition-colors"
          >
            {loading ? 'Evoking sensory paths...' : 'Begin Meditation'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-450 animate-pulse">Softening ambient environments...</p>
          </div>
        )}

        {!loading && immersion && (
          <div className="space-y-4 animate-fade-in border-t pt-6">
            <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Eye className="text-indigo-550" />
                <span>{immersion.title}</span>
              </h3>

              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-lg border text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                title={isPlaying ? 'Stop audio guide' : 'Listen to guided meditation'}
              >
                {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 italic font-medium">
              {immersion.introduction}
            </p>

            <div className="space-y-3">
              {immersion.steps?.map((step, idx) => (
                <div key={idx} className="flex space-x-3 items-start">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-455 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">{step}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-955/20 p-3 border-l-4 border-amber-500 rounded-r-lg mt-4 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">Mindful Reflection:</span>
                <p className="text-xs text-amber-800 dark:text-amber-300 italic font-serif leading-relaxed">
                  "{immersion.mindfulnessReflection}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualImmersion;
