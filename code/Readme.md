# Safe Traveler Buddy - SIH 2025 Project

A comprehensive mobile-first safety application for tourists with real-time monitoring, emergency response, and multi-language support developed for Smart India Hackathon 2025.

## Tasks Accomplished

- [x] **Multi-Language Support:** Implemented comprehensive internationalization with 13+ languages including Hindi, Tamil, Telugu, Gujarati, and more
- [x] **Emergency Response System:** Developed one-touch SOS functionality with live location sharing and automatic emergency contact notifications
- [x] **Map-Centric Dashboard:** Created full-screen interactive Google Maps integration with geo-fenced safety zones and real-time tracking
- [x] **Trip Management System:** Built comprehensive trip tracking with start/pause/end functionality and safety checkpoints
- [x] **User Profile & Digital ID:** Implemented blockchain-verified digital ID system with emergency contacts management

## Technology Stack

This project leverages the following modern technologies:

- **[React 18](https://react.dev/):** Latest React version for building robust user interfaces with improved performance and developer experience
- **[TypeScript](https://www.typescriptlang.org/):** Provides type safety and improved code maintainability for large-scale applications
- **[Vite](https://vitejs.dev/):** Next-generation frontend build tool for fast development and optimized production builds
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for rapid and consistent UI development
- **[shadcn/ui](https://ui.shadcn.com/):** High-quality React components built on top of Radix UI for accessible and customizable interfaces
- **[Google Maps API](https://developers.google.com/maps):** Provides interactive mapping capabilities for real-time location tracking and geo-fencing
- **[react-i18next](https://react.i18next.com/):** Robust internationalization framework supporting 13+ languages for global accessibility
- **[Firebase](https://firebase.google.com/):** Backend-as-a-Service for authentication, real-time database, and cloud functions

## Key Features

- **Emergency SOS System:** One-touch panic button with live location sharing and automated emergency contact notifications
- **Multi-Language Support:** Complete UI translations in 13+ languages including Indian regional languages (Hindi, Tamil, Telugu, Gujarati, Marathi)
- **Interactive Map Dashboard:** Full-screen Google Maps with real-time location tracking, geo-fenced safety zones, and safety status indicators
- **Trip Management:** Comprehensive trip tracking with itinerary management, safety checkpoints, and real-time progress monitoring
- **Alerts Feed System:** Real-time notifications for geo-fencing alerts, weather advisories, security updates, and traffic information
- **Digital ID Verification:** Blockchain-style tamper-proof digital identity system for tourist verification and emergency response
- **Offline Capabilities:** Robust offline support with data synchronization when connectivity is restored

## Local Setup Instructions

Follow these steps to run the project locally on both Windows and macOS:

### Prerequisites
- Node.js (v16 or higher) - [Download from nodejs.org](https://nodejs.org/)
- npm (comes with Node.js) or yarn package manager
- Git for version control
- Google Maps API key (optional for full map functionality)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd code
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. **Environment Configuration**
   - Copy the example environment file:
     ```bash
     # Windows (Command Prompt)
     copy .env.example .env
     
     # Windows (PowerShell) / macOS / Linux
     cp .env.example .env
     ```
   - Open `.env` file and add your Google Maps API key:
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     ```

4. **Start Development Server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   # Using npm
   npm run build
   
   # Or using yarn
   yarn build
   ```

### Additional Setup (Optional)

6. **Firebase Configuration** (for full backend functionality)
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore Database, and Cloud Functions
   - Copy your Firebase config to `.env` file
   - Follow `FIREBASE_SETUP.md` for detailed instructions

## Project Structure

```
src/
├── components/ui/          # Reusable UI components (shadcn/ui)
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization configuration
│   ├── index.ts           # i18n setup and configuration
│   └── locales/           # Translation files for 13+ languages
├── pages/                  # Main application pages/screens
│   ├── Index.tsx          # Enhanced home page
│   ├── Dashboard.tsx      # Map-centric dashboard
│   ├── TripManagement.tsx # Trip tracking and management
│   ├── AlertsFeed.tsx     # Safety alerts and notifications
│   ├── Profile.tsx        # User profile and settings
│   └── Login.tsx          # Authentication and onboarding
├── services/              # Business logic and API calls
│   ├── emergencyService.ts    # Emergency response functionality
│   ├── databaseService.ts     # Database operations
│   └── authService.ts         # Authentication services
├── contexts/              # React context providers
└── lib/                   # Utility functions and configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

**Common Issues:**

1. **Node.js version error:** Ensure you have Node.js v16 or higher installed
2. **Map not loading:** Check if Google Maps API key is correctly set in `.env` file
3. **Build errors:** Try deleting `node_modules` folder and running `npm install` again
4. **Port already in use:** The development server will automatically use the next available port

**For Windows users:** If you encounter permission errors, try running the terminal as Administrator.

**For macOS users:** If you face permission issues, you might need to use `sudo` for global npm installations.
