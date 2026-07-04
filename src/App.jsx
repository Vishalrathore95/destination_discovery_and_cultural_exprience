import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TripProvider } from './context/TripContext';

// Import components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import Chatbot from './components/common/Chatbot';

import SearchBar from './components/discovery/SearchBar';
import DestinationCard from './components/discovery/DestinationCard';
import AttractionsList from './components/discovery/AttractionsList';
import HiddenGems from './components/discovery/HiddenGems';
import ItineraryGenerator from './components/discovery/ItineraryGenerator';
import VocabularyBuilder from './components/discovery/VocabularyBuilder';
import FoodPairing from './components/discovery/FoodPairing';

import StoryViewer from './components/storytelling/StoryViewer';
import HeritageHighlights from './components/storytelling/HeritageHighlights';
import VirtualImmersion from './components/storytelling/VirtualImmersion';
import CulturalNarrative from './components/storytelling/CulturalNarrative';

import EventsCalendar from './components/events/EventsCalendar';

import UserReviews from './components/community/UserReviews';
import PhotoGallery from './components/community/PhotoGallery';
import CulturalTips from './components/community/CulturalTips';

import UserDashboard from './components/dashboard/UserDashboard';
import SavedTrips from './components/dashboard/SavedTrips';
import Preferences from './components/dashboard/Preferences';

// CSS Files
import './App.css';

const DiscoveryHub = () => {
  const [activeStorytellingSite, setActiveStorytellingSite] = useState('');

  return (
    <div className="flex-1 space-y-4">
      {/* Search Input bar */}
      <SearchBar />

      {/* Main details displayed only after guide is generated */}
      <DestinationCard />
      
      {/* Top attractions list */}
      <AttractionsList onSelectAttraction={setActiveStorytellingSite} />
      
      {/* Stories details viewer modal */}
      {activeStorytellingSite && (
        <StoryViewer
          attractionName={activeStorytellingSite}
          onClose={() => setActiveStorytellingSite('')}
        />
      )}

      {/* Narrative tone personalization and character chronicle builder */}
      <CulturalNarrative />
      
      {/* Hidden gems list */}
      <HiddenGems onSelectGem={setActiveStorytellingSite} />
      
      {/* Custom itinerary creator */}
      <ItineraryGenerator />

      {/* Local etiquette highlights */}
      <HeritageHighlights />

      {/* Innovative Enhancement Panels */}
      <VocabularyBuilder />
      <VirtualImmersion />
      <FoodPairing />

      {/* Events calendar workshops */}
      <EventsCalendar />

      {/* Community exchanges reviews */}
      <UserReviews />
      <PhotoGallery />
      <CulturalTips />
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <TripProvider>
          <ErrorBoundary>
            <div className="app-container font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
              {/* Responsive Global Navigation */}
              <Header />

              {/* Primary viewport content */}
              <main className="flex-1 pb-16 flex flex-col justify-start">
                <Routes>
                  <Route path="/" element={<DiscoveryHub />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/saved-trips" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                      <SavedTrips />
                    </div>
                  } />
                  <Route path="/preferences" element={<Preferences />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Persistent chatbot floating overlay */}
              <Chatbot />

              {/* Brand Footnotes */}
              <Footer />
            </div>
          </ErrorBoundary>
        </TripProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
