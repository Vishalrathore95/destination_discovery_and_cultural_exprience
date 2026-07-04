import '@testing-library/jest-dom';
import React from 'react';

// Mock Firebase to prevent auth/invalid-api-key in test environment
jest.mock('../../services/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: jest.fn() },
  db: {},
  storage: {},
}));
jest.mock('../../services/authService', () => ({
  logoutUser: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../../components/discovery/SearchBar';
import { TripContext } from '../../context/TripContext';
import { ThemeContext } from '../../context/ThemeContext';

// Mock the Gemini service function
jest.mock('../../services/geminiService', () => ({
  generateDestinationGuide: jest.fn().mockResolvedValue({
    overview: { description: 'Mocked description' },
    topAttractions: [],
    hiddenGems: [],
    travelTips: []
  })
}));

const mockSetDestinationGuide = jest.fn();
const mockSetItinerary = jest.fn();
const mockSetEvents = jest.fn();

const mockTripProviderValue = {
  setDestinationGuide: mockSetDestinationGuide,
  setItinerary: mockSetItinerary,
  setEvents: mockSetEvents
};

const mockThemeProviderValue = {
  language: 'en'
};

const renderSearchBar = () => {
  return render(
    <ThemeContext.Provider value={mockThemeProviderValue}>
      <TripContext.Provider value={mockTripProviderValue}>
        <SearchBar />
      </TripContext.Provider>
    </ThemeContext.Provider>
  );
};

describe('SearchBar Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render search bar with destination input and buttons', () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText(/Where do you want to explore/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Discover Culture/i })).toBeInTheDocument();
  });

  test('should show validation error for empty destination', async () => {
    renderSearchBar();
    const form = document.querySelector('form');

    // Submit empty form
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/Search query cannot be empty/i)).toBeInTheDocument();
    });
  });

  test('should invoke search and update guide on successful query', async () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText(/Where do you want to explore/i);
    const form = document.querySelector('form');

    fireEvent.change(input, { target: { value: 'Kyoto, Japan' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSetDestinationGuide).toHaveBeenCalled();
    });
  });
});
