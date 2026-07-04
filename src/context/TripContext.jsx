import React, { createContext, useState, useContext, useEffect } from 'react';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  // Search parameters & results
  const [destinationGuide, setDestinationGuide] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [events, setEvents] = useState([]);
  
  // Saved trips — stored locally (no auth required)
  const [savedTrips, setSavedTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const localTrips = JSON.parse(localStorage.getItem('cc_saved_trips') || '[]');
      setSavedTrips(localTrips);
    } catch {
      setSavedTrips([]);
    }
  }, []);

  const saveTrip = async (tripData) => {
    const localTrips = JSON.parse(localStorage.getItem('cc_saved_trips') || '[]');
    const newTrip = { ...tripData, id: `local_${Date.now()}`, savedAt: new Date().toISOString() };
    const updated = [newTrip, ...localTrips];
    localStorage.setItem('cc_saved_trips', JSON.stringify(updated));
    setSavedTrips(updated);
    return newTrip;
  };

  const deleteTrip = async (tripId) => {
    const localTrips = JSON.parse(localStorage.getItem('cc_saved_trips') || '[]');
    const updated = localTrips.filter((t) => t.id !== tripId);
    localStorage.setItem('cc_saved_trips', JSON.stringify(updated));
    setSavedTrips(updated);
  };

  return (
    <TripContext.Provider
      value={{
        destinationGuide,
        setDestinationGuide,
        activeStory,
        setActiveStory,
        itinerary,
        setItinerary,
        events,
        setEvents,
        savedTrips,
        tripsLoading,
        saveTrip,
        deleteTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
