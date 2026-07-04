import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../../services/firestoreService';
import { TRAVEL_STYLES } from '../../utils/constants';

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid)
        .then((data) => {
          if (data) {
            setProfile(data);
            setDisplayName(data.displayName || '');
            setSelectedInterests(data.preferences?.interests || []);
          }
        })
        .catch((err) => console.error("Error loading user profile:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        'preferences.interests': selectedInterests
      });
      setMessage({ type: 'success', text: 'Cultural profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-600 dark:text-slate-400">Loading profile data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 transition-theme animate-fade-in">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold font-serif-display text-slate-900 dark:text-white">Your Cultural Identity</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Define your travel styles and immersion interests to custom-tailor the AI's generated recommendations.
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="shadow sm:rounded-md sm:overflow-hidden border dark:border-slate-800 glass-panel p-6">
              {message && (
                <div
                  className={`p-3 border rounded text-sm mb-4 ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900'
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900'
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="displayName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Preferred Moniker / Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email (Read Only)</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="mt-1 block w-full px-3 py-2 border rounded-md bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-850 text-slate-500 cursor-not-allowed"
                  />
                </div>

                {/* Cultural Interests Checkbox Grid */}
                <div className="col-span-6">
                  <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Primary Cultural Interests
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TRAVEL_STYLES.map((style) => (
                      <button
                        type="button"
                        key={style.value}
                        onClick={() => handleInterestToggle(style.value)}
                        className={`flex items-center justify-between p-3 border rounded-lg text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          selectedInterests.includes(style.value)
                            ? 'border-indigo-600 bg-indigo-55/40 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{style.label}</span>
                        {selectedInterests.includes(style.value) && (
                          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving changes...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
