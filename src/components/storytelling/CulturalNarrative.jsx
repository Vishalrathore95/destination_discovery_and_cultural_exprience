import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { generateStory } from '../../services/geminiService';
import { textToSpeech } from '../../utils/helpers';
import { Award, Compass, Play, StopCircle, RefreshCw, Feather } from 'lucide-react';

const PERSONAS = [
  { value: 'elderly monk', label: 'Eldest Monk / Priest 🏯', desc: 'Focuses on ancient rituals, mindfulness, and spiritual history.' },
  { value: 'street merchant', label: 'Vibrant Street Merchant 🧺', desc: 'Focuses on lively markets, local culinary arts, and daily community struggles.' },
  { value: 'scholarly archivist', label: 'Scholarly Archivist 📜', desc: 'Provides heavy historical records, dates, and architectural facts.' }
];

export const CulturalNarrative = () => {
  const { destinationGuide } = useTrip();
  const [persona, setPersona] = useState('elderly monk');
  const [selectedAttraction, setSelectedAttraction] = useState('');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!destinationGuide || !destinationGuide.topAttractions) return null;

  const attractions = [...destinationGuide.topAttractions, ...destinationGuide.hiddenGems];

  const handleEvokeNarrative = async () => {
    if (!selectedAttraction) return;
    setLoading(true);
    setStory(null);
    textToSpeech.stop();
    setIsPlaying(false);

    try {
      const fullPrompt = `As a master storyteller speaking in the exact tone of a "${persona}" from ${destinationGuide.queryDestination}, craft a story for ${selectedAttraction}.`;
      // Call standard storyteller api but we customize prompt parameter if needed
      const data = await generateStory(selectedAttraction, `${destinationGuide.queryDestination} told from the persona of a ${persona}`);
      setStory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = () => {
    if (!story || !story.story) return;
    if (isPlaying) {
      textToSpeech.stop();
      setIsPlaying(false);
    } else {
      textToSpeech.speak(story.story);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <Feather className="text-indigo-650 dark:text-indigo-400" />
          <span>Interactive Cultural Personas</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-450 mb-6">
          Experience historical chronicles told through the distinct viewpoints of native characters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4 md:col-span-1 border-r border-slate-200 dark:border-slate-800 pr-4">
            <div>
              <label htmlFor="attraction-select" className="block text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Select Site
              </label>
              <select
                id="attraction-select"
                value={selectedAttraction}
                onChange={(e) => setSelectedAttraction(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-slate-850 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- Choose Attraction --</option>
                {attractions.map((a, i) => (
                  <option key={i} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider mb-2">
                Choose Narrator Persona
              </span>
              <div className="space-y-2">
                {PERSONAS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPersona(p.value)}
                    className={`w-full text-left p-2.5 border rounded-lg text-xs transition-all ${
                      persona === p.value
                        ? 'border-indigo-600 bg-indigo-55/30 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                        : 'border-slate-300 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleEvokeNarrative}
              disabled={loading || !selectedAttraction}
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Chronicles loading...' : 'Evoke Character Legend'}</span>
            </button>
          </div>

          {/* Chronicle Display */}
          <div className="md:col-span-2 flex flex-col justify-center min-h-[220px]">
            {loading && (
              <div className="text-center py-6">
                <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-550 dark:text-slate-400">Oral history loading...</p>
              </div>
            )}

            {!loading && !story && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2">
                <Compass className="w-12 h-12 stroke-[1.25] text-slate-300" />
                <p className="text-sm font-medium">Select a site and character to unlock their oral records.</p>
              </div>
            )}

            {!loading && story && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Award className="text-orange-500 w-5 h-5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Narrator Voice</span>
                      <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200">{persona}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSpeech}
                    className="p-1.5 rounded-lg border text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 focus:ring-1 focus:ring-indigo-500"
                    title={isPlaying ? 'Stop voice' : 'Listen to story'}
                  >
                    {isPlaying ? <StopCircle size={18} /> : <Play size={18} />}
                  </button>
                </div>

                <p className="text-sm italic leading-relaxed text-slate-700 dark:text-slate-350 border-l-2 pl-4 border-orange-500 font-serif">
                  "{story.story}"
                </p>

                <div className="pt-2 border-t text-xs text-slate-500 dark:text-slate-450 space-y-1">
                  <span className="font-bold text-slate-750 dark:text-slate-300">Stewardship Tip:</span>
                  <p>{story.engagementTip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalNarrative;
