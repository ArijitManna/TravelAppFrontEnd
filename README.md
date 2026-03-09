# TNT Travel Frontend

A modern, full-featured travel booking platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Project Overview

This is a complete frontend application for a travel booking system featuring:
- **Public Website**: Browse destinations and packages, user authentication
- **Admin Panel**: Manage destinations, packages, and itineraries

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: Sonner (toast)
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   └── common/            # Shared/reusable components
├── layouts/
│   ├── AdminLayout.tsx    # Admin panel layout
│   └── PublicLayout.tsx   # Public website layout
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── destinations/  # Destination CRUD pages
│   │   └── packages/      # Package CRUD pages with itinerary builder
│   └── public/
│       ├── Home.tsx
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── Destinations.tsx
│       ├── DestinationDetail.tsx
│       ├── Packages.tsx
│       └── PackageDetail.tsx
├── services/              # API service layer
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
├── config/                # App configuration & constants
└── App.tsx               # Main app component with routing
```

## 🌐 Routes

### Public Routes (/)
- `/` - Home page with featured packages
- `/login` - User login
- `/register` - User registration
- `/destinations` - Browse all destinations
- `/destinations/:id` - Destination detail page
- `/packages` - Browse packages with advanced filters
- `/packages/:id` - Package detail with itinerary

### Admin Routes (/admin)
- `/admin` - Dashboard with statistics
- `/admin/destinations` - Manage destinations
- `/admin/destinations/create` - Create new destination
- `/admin/destinations/:id` - Edit destination
- `/admin/packages` - Manage packages
- `/admin/packages/create` - Create package with itinerary builder
- `/admin/packages/:id` - Edit package

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd "c:\EXT\TNT FRONTEND"
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the API base URL if needed:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=TNT Travel
   ```

4. **Start development server** (already running)
   ```bash
   npm run dev
   ```
   
   Visit: **http://localhost:3000**

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔑 Key Features

### Public Website
- **Modern Hero Section** with search functionality
- **Featured Packages** showcase
- **Destination Gallery** with beautiful cards
- **Advanced Package Filters**:
  - Search by keywords
  - Filter by destination
  - Filter by category
  - Price range (min/max)
  - Featured packages only
- **Detailed Package View** with:
  - Image gallery
  - Day-by-day itinerary
  - What's included section
  - Booking information
- **Responsive Design** - Mobile, tablet, and desktop optimized

### Admin Panel
- **Dashboard** with statistics and quick actions
- **Destination Management**:
  - Create, edit, delete destinations
  - Image URL support
  - Active/inactive toggle
  - Real-time preview
- **Package Management**:
  - Create, edit, delete packages
  - Multiple image URLs
  - **Dynamic Itinerary Builder**:
    - Add/remove days
    - Day number, title, description
    - Drag-to-reorder (UI ready)
  - Featured package toggle
  - Active/inactive status
  - Category management
- **Modern Sidebar Navigation**
- **Mobile-responsive** with collapsible sidebar

## 🎨 Design System

### Colors
- **Primary**: Blue (`hsl(221.2 83.2% 53.3%)`)
- **Secondary**: Light gray backgrounds
- **Accent**: Green for success, Red for errors
- **Featured**: Yellow for featured badges

### Typography
- **Headings**: Bold, hierarchy-based sizing
- **Body**: Clean, readable sans-serif
- **Spacing**: Consistent padding and margins

## 🔐 Authentication

The app includes:
- Login page with email/password
- Registration page with validation
- Protected routes for admin panel
- JWT token storage
- Auto-redirect based on user role
- Automatic logout on 401 (unauthorized)

## 📡 API Integration

All API services are centralized in `src/services/`:

- **authService**: Login, register, logout
- **destinationsService**: Get all, get by ID
- **packagesService**: Get all with filters, get by ID
- **adminDestinationsService**: Create, update, delete
- **adminPackagesService**: Create, update, delete

**API Client Features**:
- Automatic JWT token injection
- 401 auto-logout
- Error handling
- TypeScript typed responses

## 🧩 Components

### Completed Components
- ✅ AdminLayout - Sidebar navigation
- ✅ PublicLayout - Header, footer, navigation
- ✅ ProtectedRoute - Auth guard
- ✅ All admin pages (Dashboard, Destinations CRUD, Packages CRUD)
- ✅ All public pages (Home, Login, Register, Destinations, Packages, Details)
- ✅ Itinerary Builder - Dynamic form with add/remove days

### Design Highlights
- **Cards**: Hover effects, shadows, smooth transitions
- **Forms**: Validation, error messages, loading states
- **Images**: Fallback handling, lazy loading ready
- **Modals**: Confirmation dialogs for destructive actions
- **Toast Notifications**: Success/error feedback

## 📝 TypeScript Types

All types are defined in `src/types/index.ts`:
- Destination
- Package
- ItineraryDay
- User
- Auth (Login, Register, Response)
- API request/response types
- Filter interfaces

## 🎯 Next Steps

To complete the application:

1. **Connect to Real API**
   - Update `VITE_API_BASE_URL` in `.env`
   - Test all endpoints

2. **Image Upload** (optional enhancement)
   - Integrate Cloudinary or AWS S3
   - Replace URL inputs with file uploads

3. **Additional Features**:
   - User profile management
   - Booking system
   - Payment integration
   - Reviews and ratings
   - Search autocomplete
   - Advanced analytics dashboard

4. **Testing**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Accessibility testing

5. **Deployment**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or Azure Static Web Apps
   - Set up CI/CD pipeline

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

Preview the build:
```bash
npm run preview
```

## 🐛 Common Issues

### Port already in use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

### API Connection Issues
- Ensure backend API is running
- Check CORS configuration on backend
- Verify `VITE_API_BASE_URL` in `.env`

### Module not found errors
```bash
npm install
```

## 📄 License

This project is part of TNT Travel application.

## 👥 Development Team

Built with ❤️ using modern web technologies.

---

**Development Server**: http://localhost:3000  
**Admin Panel**: http://localhost:3000/admin  
**API Documentation**: See TASKS.md for complete feature list
