import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'

// Layouts
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminDestinations from './pages/admin/destinations/DestinationsList'
import CreateDestination from './pages/admin/destinations/CreateDestination'
import EditDestination from './pages/admin/destinations/EditDestination'
import AdminPackages from './pages/admin/packages/PackagesList'
import CreatePackage from './pages/admin/packages/CreatePackage'
import EditPackage from './pages/admin/packages/EditPackage'
import AdminActivities from './pages/admin/activities/ActivitiesList'
import CreateActivity from './pages/admin/activities/CreateActivity'
import EditActivity from './pages/admin/activities/EditActivity'
import AdminHotels from './pages/admin/hotels/HotelsList'
import CreateHotel from './pages/admin/hotels/CreateHotel'
import EditHotel from './pages/admin/hotels/EditHotel'

// Public Pages
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Destinations from './pages/public/Destinations'
import DestinationDetail from './pages/public/DestinationDetail'
import Packages from './pages/public/Packages'
import PackageDetail from './pages/public/PackageDetail'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          
          {/* Destinations Management */}
          <Route path="destinations" element={<AdminDestinations />} />
          <Route path="destinations/create" element={<CreateDestination />} />
          <Route path="destinations/:id" element={<EditDestination />} />
          
          {/* Packages Management */}
          <Route path="packages" element={<AdminPackages />} />
          <Route path="packages/create" element={<CreatePackage />} />
          <Route path="packages/:id" element={<EditPackage />} />
          
          {/* Activities Management */}
          <Route path="activities" element={<AdminActivities />} />
          <Route path="activities/create" element={<CreateActivity />} />
          <Route path="activities/edit/:id" element={<EditActivity />} />
          
          {/* Hotels Management */}
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="hotels/create" element={<CreateHotel />} />
          <Route path="hotels/edit/:id" element={<EditHotel />} />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
