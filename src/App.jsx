// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/global/ProtectedRoute';

// Frontend Pages
import HomePage from './pages/frontend/HomePage';
import PaketTourPage from './pages/frontend/PaketTourPage';
import TourDetailPage from './pages/frontend/tourdetails/TourDetailPage';
import PaketActivityPage from './pages/frontend/PaketActivityPage'; 
import PaketRentalPage from './pages/frontend/PaketRentalPage'; 
// import ReviewPage from './pages/frontend/ReviewPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Backend Pages
import AdminDashboard from './pages/backend/dashboard/AdminDashboard';
import AdminProfile from './pages/backend/profile/AdminProfile';
import TourList from './pages/backend/tourpage/TourList';
import TourCreate from './pages/backend/tourpage/TourCreate';
import TourEdit from './pages/backend/tourpage/TourEdit';
import TourDetail from './pages/backend/tourpage/TourDetail';
import RentalList from './pages/backend/rentalpage/RentalList';
import RentalCreate from './pages/backend/rentalpage/RentalCreate';
import RentalEdit from './pages/backend/rentalpage/RentalEdit';
import ActivityList from './pages/backend/activitypage/ActivityList';
import ActivityCreate from './pages/backend/activitypage/ActivityCreate';
import ActivityEdit from './pages/backend/activitypage/ActivityEdit';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {/* Public Frontend routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tour-packages" element={<PaketTourPage />} />
        <Route path="/tour-packages/:slug" element={<TourDetailPage />} />
        <Route path="/activity-packages" element={<PaketActivityPage />} />
        {/* <Route path="/activity-packages/:slug" element={<ActivityDetailPage />} /> */}
        <Route path="/rental-packages" element={<PaketRentalPage />} />
        {/* <Route path="/rental-packages/:slug" element={<RentalDetailPage />} /> */}

        {/* Protected Admin routes - tanpa email verification requirement untuk admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/profile" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <AdminProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* CRUD TOUR - hanya admin*/}
        <Route 
          path="/admin/tours" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <TourList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tours/create" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <TourCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tours/edit/:id" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <TourEdit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tours/:id" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <TourDetail />
            </ProtectedRoute>
          } 
        />

        {/* CRUD RENTAL - hanya admin*/}
        <Route 
          path="/admin/rentals" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <RentalList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/rentals/create" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <RentalCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/rentals/edit/:id" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <RentalEdit />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="/admin/rentals /:id" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <RentalDetail />
            </ProtectedRoute>
          } 
        /> */}

        {/* CRUD ACTIVITY - hanya admin*/}
        <Route 
          path="/admin/activities" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <ActivityList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/activities/create" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <ActivityCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/activities/edit/:id" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <ActivityEdit />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="/admin/activities/:id" 
          element={
            <ProtectedRoute requiredRoles={['admin']} requireVerification={false}>
              <RentalDetail />
            </ProtectedRoute>
          } 
        /> */}


        {/* Protected Customer routes - require email verification */}
        {/* <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute requiredRoles={['user']}>
              <MyBookingsPage />
            </ProtectedRoute>
          } 
        /> */}

        {/* SHARED ROUTES - Untuk semua user */}
        {/* yang login (admin & user)       */}
        {/* <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requireVerification={true}>
              <SettingsPage />
            </ProtectedRoute>
          } 
        /> */}
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;