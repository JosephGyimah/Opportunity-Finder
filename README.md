# Opportunity Finder

Opportunity Finder is a Next.js application for discovering and matching curated job and opportunity listings against a user's CV using AI.

## What it does

- Browse curated opportunities in a clean interface
- Save and bookmark opportunities to a personal dashboard
- Upload or paste your CV/resume for AI-powered matching
- Receive ranked opportunity recommendations with match scores and reasoning
- Use a responsive UI built with Tailwind CSS and shadcn/ui

## Key features

- Email/password authentication with Firebase Auth
- Firestore-backed saved opportunities per user
- AI CV matching via Google Gemini API
- Fallback opportunity ranking when AI is unavailable
- Personalized dashboard and saved opportunity tracking
- Modern responsive UI and accessible components

## Tech stack

- **Next.js 13.5.1**
- **React 18.2**
- **TypeScript**
- **Tailwind CSS 3.3.3**
- **shadcn/ui + Radix UI**
- **Firebase** (Auth + Firestore)
- **Google Gemini** (AI match endpoint)
- **Netlify** deployment support

## Repository structure

```
app/
├── page.tsx                # Home page
├── auth/                   # Authentication pages
├── dashboard/              # Saved opportunities dashboard
├── ai-match/               # CV upload and AI matching page
└── api/                    # Server API routes
    └── ai-match/route.ts   # Gemini match API endpoint

components/
├── Navbar.tsx              # Navigation bar component
├── OpportunityCard.tsx     # Opportunity item UI
└── ui/                     # shadcn/ui helper components

contexts/
└── AuthContext.tsx         # Global auth state and hooks

lib/
├── firebase.ts             # Firebase initialization
├── opportunities.ts        # Opportunity data and utility helpers
├── opportunityInsights.ts  # AI ranking and fallback scoring logic
└── utils.ts                # Shared helpers

```

## Getting started

### Prerequisites

- Node.js 16+
- npm
- Firebase project with Auth and Firestore enabled
- Google Gemini API key

### Installation

```bash
git clone <repository-url>
cd Opportunity-Finder
npm install
```

### Environment configuration

Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Email/Password** under Authentication → Sign-in method
3. Create a Firestore database
4. Add Firestore rules for secure per-user access:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /savedOpportunities/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## How the app works

### Authentication

Users sign up and log in via Firebase Auth. The app stores saved opportunities under `users/{userId}/savedOpportunities` in Firestore.

### Opportunity browsing

Opportunities are rendered from `lib/opportunities.ts` and displayed via `OpportunityCard` components.

### AI matching

The AI match page sends CV text to the server route at `/api/ai-match`. That route loads opportunity data and uses the Google Gemini API to return ranked match results.

If Gemini is unavailable, the page falls back to local ranking logic from `lib/opportunityInsights.ts`.

## Usage

### Sign up

1. Visit `/auth`
2. Enter email and password
3. Submit to create an account

### Browse opportunities

1. Navigate the opportunities section
2. Read opportunity details
3. Click **Save** to bookmark

### View dashboard

1. Visit `/dashboard`
2. See saved opportunities and profile metrics
3. Explore recommended matches based on saved tags

### Use AI matching

1. Visit `/ai-match`
2. Paste CV text or upload a `.txt` / `.pdf` file
3. Click to analyze
4. Review ranked matches with reasoning

## Deployment

This project is ready for Netlify deployment.

1. Push the repo to GitHub
2. Connect the repo in Netlify
3. Set the same environment variables in Netlify
4. Deploy the site

## Notes

- AI matching depends on `GOOGLE_GEMINI_API_KEY`.
- If the API fails, the app still returns local opportunity recommendations.
- The UI is built with Tailwind CSS and reusable shadcn/ui components.

## License

Add your license information here.
