# Opportunity Finder

A Next.js application that helps users discover and match job opportunities with their CV using AI-powered matching.

## Overview

Opportunity Finder is a web application designed to:
- **Browse opportunities** - Explore available job opportunities
- **Save opportunities** - Bookmark interesting opportunities for later review
- **AI-powered matching** - Upload your CV and get intelligent opportunity recommendations with match scores and reasoning
- **Dashboard** - Manage and view all your saved opportunities in one place

## How It Works

1. **Authentication**: Users sign up/login with email and password via Firebase Auth
2. **Opportunities**: Browse a list of available opportunities on the opportunities page
3. **Save/Bookmark**: Click the save button on any opportunity to add it to your dashboard
4. **AI Matching**: 
   - Navigate to "AI Match"
   - Upload a CV (PDF, text) or paste CV text directly
   - The app analyzes your CV and scores each opportunity based on skills, experience, and requirements
   - View top matches with detailed reasoning for each score
5. **Dashboard**: View all your saved opportunities in one organized place

## Tech Stack

### Frontend
- **Next.js 13.5.1** - React framework with server-side rendering
- **React 18.2.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 3.3.3** - Utility-first styling
- **shadcn/ui + Radix UI** - Accessible component library

### Backend & Services
- **Firebase 12.13.0**
  - **Firebase Auth** - Email/password authentication
  - **Firestore** - NoSQL database for user profiles and saved opportunities
- **Netlify** - Deployment platform

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Firestore and Auth enabled
- Firebase credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Opportunity-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase credentials:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project

2. **Enable Authentication**
   - Go to **Authentication** → **Sign-in method**
   - Enable **Email/Password** provider
   - Click **Save**

3. **Create Firestore Database**
   - Go to **Firestore Database** → **Create database**
   - Select **Production mode**
   - Choose your preferred region
   - Click **Create**

4. **Configure Security Rules**
   - In Firestore, go to **Rules** tab
   - Replace with the following rules:
     ```
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
   - Click **Publish**

### Running the App

**Development mode**
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

**Build for production**
```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx              # Home page
├── auth/                 # Authentication pages (signup/login)
├── dashboard/            # User's saved opportunities
├── ai-match/             # AI opportunity matching
└── layout.tsx            # Root layout with AuthProvider

components/
├── Navbar.tsx            # Navigation bar
├── OpportunityCard.tsx   # Individual opportunity display
└── ui/                   # shadcn/ui components

contexts/
└── AuthContext.tsx       # Global authentication state

lib/
├── firebase.ts           # Firebase initialization
├── supabase.ts           # Database utilities
└── utils.ts              # Helper functions
```

## Usage

### Sign Up
1. Go to `http://localhost:3000/auth`
2. Enter email and password
3. Click "Sign Up"
4. You're automatically logged in

### Browse & Save Opportunities
1. Navigate to the **Opportunities** page
2. Browse available opportunities
3. Click the **Save** button on any opportunity to bookmark it
4. View saved opportunities in the **Dashboard**

### Use AI Matching
1. Go to **AI Match**
2. Upload a CV file (PDF/text) or paste CV text
3. Click **Find Matches**
4. View opportunities ranked by match score with reasoning

## Features

- ✅ User authentication (email/password)
- ✅ Browse opportunities
- ✅ Save/bookmark opportunities
- ✅ Persistent user dashboard
- ✅ AI-powered CV-to-opportunity matching
- ✅ Match scoring with detailed reasoning
- ✅ Responsive design
- ✅ TypeScript for type safety

## Environment Variables

See `.env.example` for a template. Required variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Deployment

The project is configured for deployment on **Netlify**:

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

## License

[Add your license here]
