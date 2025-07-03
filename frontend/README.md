# Frontend - React Web Application

## Overview
This is the frontend web application for the Deepfake Detection system built with React 18 and Vite. It provides a modern, responsive user interface for uploading files, managing analyses, and viewing results.

## 🚀 Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: CSS3 + Custom Components
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Authentication**: Context API + Local Storage
- **Testing**: Jest + React Testing Library

## 📁 Project Structure
```
frontend/
├── public/
│   ├── landing.html         # Static landing page
│   ├── style.css           # Landing page styles
│   └── login.css           # Login page styles
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components (Button, etc.)
│   │   ├── Navbar.jsx     # Navigation component
│   │   └── Dropzone.jsx   # File upload component
│   ├── pages/             # Page components
│   │   ├── LoginPage.jsx  # Authentication pages
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   └── ResultsPage.jsx # Results viewing
│   ├── context/           # React contexts
│   │   └── AuthContext.js # Authentication context
│   ├── hooks/             # Custom hooks
│   │   └── useAuth.js     # Authentication hook
│   ├── routes/            # Route components
│   │   └── ProtectedRoute.jsx # Auth protection
│   ├── services/          # API services
│   │   └── api.js         # Axios configuration
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
└── package.json          # Dependencies
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Environment Configuration
Create `.env` file with these variables:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=VeriFake
VITE_APP_URL=http://localhost:5173
```

## 🎨 Features

### Landing Page (`/landing.html`)
- **Hero Section**: Compelling introduction to VeriFake
- **Features Grid**: Showcases all detection capabilities
- **Upload Section**: Preview of file upload functionality
- **Statistics**: User engagement metrics
- **Responsive Design**: Mobile-first approach

### Authentication
- **Login/Register**: Clean, professional auth forms
- **Brand Integration**: Consistent VeriFake branding
- **Form Validation**: Client-side input validation
- **Error Handling**: User-friendly error messages

### Dashboard (`/dashboard`)
- **File Upload**: Drag-and-drop file interface
- **Service Selection**: Choose analysis type:
  - Deepfake Detection
  - Face Detection
  - Weapons/Alcohol/Drugs
  - Offensive Content
  - Properties Detection
  - Celebrity Recognition
- **Progress Tracking**: Real-time upload progress
- **Results History**: Previous analysis results

### Navigation
- **Protected Routes**: Authentication-based access
- **Dynamic Navigation**: Context-aware menu items
- **Responsive Design**: Mobile-friendly navigation

## 🔌 API Integration

### Authentication Endpoints
```javascript
// Login
POST /api/login
{ email, password }

// Register
POST /api/register
{ name, email, password, password_confirmation }

// Logout
POST /api/logout
```

### Analysis Endpoints
```javascript
// Submit file for analysis
POST /api/analyses
FormData: { file, service }

// Get analysis history
GET /api/analyses

// Get specific result
GET /api/analyses/{id}
```

## 🎯 Key Components

### Dropzone Component
```jsx
<Dropzone
  onFileSelect={handleFileSelect}
  acceptedTypes={['image/*', 'video/*', 'audio/*']}
  maxSize={100} // MB
/>
```

### Authentication Context
```jsx
const { isAuthenticated, login, logout, user } = useAuth();
```

### Protected Routes
```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

## 🧪 Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Custom responsive breakpoints
- **Touch Friendly**: Large tap targets for mobile
- **Cross Browser**: Compatible with modern browsers

## 🎨 Styling Architecture
- **CSS Modules**: Scoped component styles
- **Custom Properties**: CSS variables for theming
- **Flexbox/Grid**: Modern layout techniques
- **Animation**: Smooth transitions and micro-interactions

## 🚀 Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Optimized bundle size
- **Image Optimization**: Efficient asset loading
- **Caching**: Strategic caching for better performance

## 🔒 Security Features
- **Input Sanitization**: XSS protection
- **CORS Configuration**: Proper cross-origin setup
- **Token Management**: Secure token storage
- **Route Protection**: Authentication guards

## 🚀 Deployment
```bash
# Build for production
npm run build

# Deploy to static hosting
npm run deploy

# Environment-specific builds
npm run build:staging
npm run build:production
```

## 🐛 Debugging
- **React DevTools**: Component debugging
- **Console Logging**: Strategic logging for development
- **Error Boundaries**: Graceful error handling
- **Hot Module Replacement**: Fast development iteration

## 📚 Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0",
  "react-toastify": "^9.1.0"
}
```

## 🤝 Contributing
1. Follow React best practices
2. Use functional components with hooks
3. Write tests for new components
4. Maintain consistent code style
5. Update documentation for new features

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
