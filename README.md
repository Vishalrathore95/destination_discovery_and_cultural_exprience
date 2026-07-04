# Cultural Compass AI 🧭✨

Cultural Compass AI is a production-ready Generative AI-powered travel and cultural discovery platform. Designed for the **PromptX In-person Build with AI Challenge**, the platform connects travelers with authentic local cultures, recommends attractions, uncovers hidden gems, generates immersive legends and stories, schedules authentic events, and provides custom-tailored cultural itineraries.

---

## 🚀 Key Features

1. **Smart Destination Discovery**: Input destination, travel style, and season to receive 5 curated attractions and 3-4 off-the-beaten-path hidden gems.
2. **Immersive Storytelling & Heritage Promotion**: Narrative stories written from the perspective of historical or local figures, "Did You Know?" facts, and interactive text-to-speech narration.
3. **Local Events & Authentic Experiences**: Search by destination and date to find workshops, community gatherings, local markets, and festivals.
4. **AI-powered Cultural Q&A Chatbot**: A persistent assistant answering questions about cultural etiquette, traditions, history, and behavioral rules.
5. **Personalized Cultural Itinerary Generator**: Create custom multi-day plans focusing on cultural immersion, including daily themes, activities, meal recommendations, and local respect tips.
6. **Community & Cultural Exchange**: User reviews, photo sharing, and cultural tips with real-time AI moderation for cultural sensitivity.
7. **Innovative Enhancements**:
   - **Cultural Vocabulary Builder**: Pronunciation guides, terms, and context.
   - **Virtual Cultural Immersion**: Visual and auditory guided meditations.
   - **Cultural Food Pairing**: Recommended local dishes matched to visited attractions.
   - **Cultural Impact Tracker**: A journey logger showing learning progress.
   - **Accessibility first**: High contrast mode, dynamic font sizing, screen-reader friendly tags, and multilingual translations.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite-powered), React Router, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Firebase Hosting, Cloud Functions, Authentication (Google / Email & Password), Firestore, Storage.
- **AI Integration**: Google Gemini API (via Secure Cloud Functions).

---

## 📁 Project Folder Structure

```text
destination_discovery_and_cultural_exprience/
├── .env
├── .gitignore
├── firebase.json
├── firestore.rules
├── storage.rules
├── package.json
├── README.md
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   ├── setupTests.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ErrorBoundary.js
│   │   ├── auth/ ...
│   │   ├── discovery/ ...
│   │   ├── storytelling/ ...
│   │   ├── events/ ...
│   │   ├── community/ ...
│   │   └── dashboard/ ...
│   ├── services/
│   │   ├── firebase.js
│   │   ├── geminiService.js
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   └── apiClient.js
│   ├── hooks/ ...
│   ├── context/ ...
│   ├── utils/ ...
│   ├── tests/ ...
│   └── styles/ ...
└── functions/ ...
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd destination_discovery_and_cultural_exprience
```

### 2. Install Dependencies
```bash
# Install frontend packages
npm install

# Install backend functions packages
cd functions && npm install && cd ..
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` at the project root and fill in your Firebase and Gemini credentials:
```bash
cp .env.example .env
```

Create a `.env` in the `functions/` directory for Cloud Functions secrets:
```text
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Locally
To run the React development server:
```bash
npm run dev
```

To run Firebase Emulators (Firestore, Authentication, Storage, Functions):
```bash
firebase emulators:start
```

---

## 🧪 Testing

We use Jest and React Testing Library for automated tests.

To run all unit and integration tests:
```bash
npm test
```

To generate a test coverage report:
```bash
npm run test:coverage
```

---

## 🚀 Deployment

### Firebase Deployment
1. Log in to Firebase:
   ```bash
   firebase login
   ```
2. Initialize Firebase and associate it with your project:
   ```bash
   firebase init
   ```
3. Deploy the application:
   ```bash
   # Deploy Hosting and Functions together
   firebase deploy
   ```

---

## 📄 License
This project is licensed under the MIT License.
