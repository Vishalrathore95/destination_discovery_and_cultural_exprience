import '@testing-library/jest-dom';
import React from 'react';

// Mock Firebase to prevent auth/invalid-api-key in test environment
jest.mock('../../services/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: jest.fn() },
  db: {},
  storage: {},
}));
jest.mock('../../services/firestoreService', () => ({
  saveUserTrip: jest.fn(),
  getUserTrips: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../services/authService', () => ({
  logoutUser: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DestinationCard from '../../components/discovery/DestinationCard';
import { TripContext } from '../../context/TripContext';
import { ThemeContext } from '../../context/ThemeContext';

const mockSaveTrip = jest.fn().mockResolvedValue({});
const mockSavedTrips = [];

const mockGuideData = {
  queryDestination: 'Kyoto, Japan',
  queryStyle: 'historical',
  overview: {
    description: 'Kyoto is the cultural heart of Japan.',
    bestTimeToVisit: 'Spring',
    culturalSignificance: 'UNESCO heritage'
  }
};

const renderDestinationCard = (guide = mockGuideData, savedList = mockSavedTrips) => {
  return render(
    <ThemeContext.Provider value={{ language: 'en' }}>
      <TripContext.Provider value={{ destinationGuide: guide, saveTrip: mockSaveTrip, savedTrips: savedList }}>
        <DestinationCard />
      </TripContext.Provider>
    </ThemeContext.Provider>
  );
};

describe('DestinationCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render guide information when data is available', () => {
    renderDestinationCard();
    expect(screen.getByText('Kyoto, Japan')).toBeInTheDocument();
    expect(screen.getByText('Kyoto is the cultural heart of Japan.')).toBeInTheDocument();
    expect(screen.getByText('Spring')).toBeInTheDocument();
  });

  test('should trigger saveTrip when bookmark button is clicked', async () => {
    renderDestinationCard();
    const btn = screen.getByRole('button', { name: /Save Cultural Journey/i });
    fireEvent.click(btn);
    
    await waitFor(() => {
      expect(mockSaveTrip).toHaveBeenCalled();
    });
  });

  test('should render bookmarked status if already saved', () => {
    renderDestinationCard(mockGuideData, [{ queryDestination: 'Kyoto, Japan' }]);
    expect(screen.getByRole('button', { name: /Journey Bookmarked/i })).toBeInTheDocument();
  });
});
