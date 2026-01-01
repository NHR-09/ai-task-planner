# AI Task Planner

A modern, AI-powered task planning application built with React and Firebase. Create personalized daily plans using AI or manually, track progress, and manage your goals efficiently.

## Features

- 🤖 **AI-Powered Planning** - Generate custom plans using AI
- ✏️ **Manual Planning** - Create plans manually with full control
- 📁 **JSON Import** - Import existing plans from JSON files
- 📅 **Calendar View** - Visualize your plans in calendar format
- ✅ **Task Management** - Mark tasks complete, edit, add, or delete
- 🔐 **Authentication** - Secure login with Google/Facebook/Email
- 💾 **Cloud Storage** - Plans saved to Firebase Firestore
- 🎨 **Modern UI** - Beautiful, responsive design with animations

## Tech Stack

- **Frontend**: React, Framer Motion, CSS Modules
- **Backend**: Node.js API Routes (Serverless)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Groq API
- **Deployment**: Vercel

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd day-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Firestore Database
   - Enable Authentication (Google, Facebook, Email)
   - Download service account key and add credentials to `.env`

5. **Run Development Server**
   ```bash
   npm start
   ```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
- `GROQ_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── styles/        # CSS modules
│   ├── utils/         # Utility functions
│   └── firebase.js    # Firebase configuration
├── api/               # Backend API routes
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Usage

1. **Sign up/Login** with email or social providers
2. **Create Plans** using AI generator or manual planner
3. **Track Progress** by checking off completed tasks
4. **Manage Plans** - edit, delete, or view in calendar
5. **Import/Export** plans as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or personal use.