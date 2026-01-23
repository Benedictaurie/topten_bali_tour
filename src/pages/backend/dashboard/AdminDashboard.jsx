import { useState, useEffect } from 'react';
import BackendLayout from "../../../layouts/BackendLayout"; 
import { 
  FiUsers, 
  FiCalendar, 
  FiStar, 
  FiDollarSign,
  FiFileText,
  FiMessageSquare,
  FiRefreshCw,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalReviews: 0,
    totalRevenue: 0,
    pendingBookings: 0
  })
  const [loading, setLoading] = useState(false) // Ubah ke false untuk immediate render
  const [initialLoading, setInitialLoading] = useState(true) // Loading pertama saja
  const [error, setError] = useState('')
  const [recentBookings, setRecentBookings] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [packageCounts, setPackageCounts] = useState({
    tours: 0,
    activities: 0,
    rentals: 0
  })
  const [apiStatus, setApiStatus] = useState({
    users: 'idle',
    bookings: 'idle',
    reviews: 'idle',
    packages: 'idle'
  })

  // Helper function untuk fetch dengan timeout
  const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ])
  }

  // Function untuk fetch semua data dashboard secara paralel
  const fetchDashboardData = async () => {
    try {
      if (initialLoading) setInitialLoading(true)
      setLoading(true)
      setError('')
      
      // Ambil token dari localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('You are not authenticated. Please login.')
        setInitialLoading(false)
        setLoading(false)
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }

      console.log('🔄 Starting parallel API calls...')

      // Buat semua API calls secara paralel
      const apiCalls = {
        users: fetchWithTimeout('http://localhost:8000/api/admin/users?per_page=1', { headers }, 3000)
          .then(res => res.ok ? res.json() : Promise.reject('Users API failed'))
          .catch(err => {
            console.warn('⚠️ Users API error:', err.message || err)
            setApiStatus(prev => ({ ...prev, users: 'error' }))
            return { success: false, data: [] }
          }),
        
        bookings: fetchWithTimeout('http://localhost:8000/api/admin/bookings?per_page=3', { headers }, 3000)
          .then(res => res.ok ? res.json() : Promise.reject('Bookings API failed'))
          .catch(err => {
            console.warn('⚠️ Bookings API error:', err.message || err)
            setApiStatus(prev => ({ ...prev, bookings: 'error' }))
            return { success: false, data: { bookings: [], statistics: {} } }
          }),
        
        reviews: fetchWithTimeout('http://localhost:8000/api/admin/reviews?per_page=3', { headers }, 3000)
          .then(res => res.ok ? res.json() : Promise.reject('Reviews API failed'))
          .catch(err => {
            console.warn('⚠️ Reviews API error:', err.message || err)
            setApiStatus(prev => ({ ...prev, reviews: 'error' }))
            return { success: false, data: [] }
          }),
        
        tours: fetchWithTimeout('http://localhost:8000/api/admin/tours', { headers }, 3000)
          .then(res => res.ok ? res.json() : Promise.reject('Tours API failed'))
          .catch(err => {
            console.warn('⚠️ Tours API error:', err.message || err)
            return { success: false, data: [] }
          }),
        
        activities: fetchWithTimeout('http://localhost:8000/api/admin/activities', { headers }, 3000)
          .then(res => res.ok ? res.json() : Promise.reject('Activities API failed'))
          .catch(err => {
            console.warn('⚠️ Activities API error:', err.message || err)
            return { success: false, data: [] }
          }),
        
        rentals: fetchWithTimeout('http://localhost:8000/api/admin/rentals', { headers }, 3000)
          .then(res => res.ok ? res.json() : Promise.reject('Rentals API failed'))
          .catch(err => {
            console.warn('⚠️ Rentals API error:', err.message || err)
            return { success: false, data: [] }
          })
      }

      // Tunggu semua API calls selesai
      const results = await Promise.allSettled(Object.values(apiCalls))
      
      console.log('✅ All API calls completed', results)

      // Reset API status
      setApiStatus({
        users: 'success',
        bookings: 'success',
        reviews: 'success',
        packages: 'success'
      })

      // Proses hasil
      const [usersResult, bookingsResult, reviewsResult, toursResult, activitiesResult, rentalsResult] = results

      // 1. Process users data
      let totalUsers = 0
      if (usersResult.status === 'fulfilled' && usersResult.value.success) {
        const usersData = usersResult.value.data
        if (usersData && usersData.total !== undefined) {
          totalUsers = usersData.total
        } else if (Array.isArray(usersData)) {
          totalUsers = usersData.length
        }
      }

      // 2. Process bookings data
      let totalBookings = 0
      let pendingBookings = 0
      let recentBookingsData = []
      let totalRevenue = 0
      
      if (bookingsResult.status === 'fulfilled' && bookingsResult.value.success) {
        const bookingsData = bookingsResult.value.data
        if (bookingsData) {
          if (bookingsData.pagination) {
            totalBookings = bookingsData.pagination.total || 0
          }
          if (bookingsData.statistics) {
            pendingBookings = bookingsData.statistics.pending || 0
          }
          if (bookingsData.bookings) {
            recentBookingsData = bookingsData.bookings.slice(0, 3).map(booking => ({
              id: booking.id,
              booking_code: booking.booking_code,
              package_name: booking.bookable?.name || 'Unknown Package',
              status: booking.status,
              total_price: booking.total_price,
              created_at: booking.created_at
            }))
            
            // Calculate revenue from recent bookings
            totalRevenue = recentBookingsData.reduce((sum, booking) => {
              return sum + (parseFloat(booking.total_price) || 0)
            }, 0)
          }
        }
      }

      // 3. Process reviews data
      let totalReviews = 0
      let recentReviewsData = []
      
      if (reviewsResult.status === 'fulfilled' && reviewsResult.value.success) {
        const reviewsData = reviewsResult.value.data
        if (Array.isArray(reviewsData)) {
          totalReviews = reviewsData.length
          recentReviewsData = reviewsData.slice(0, 3).map(review => ({
            id: review.id,
            user_name: review.user?.name || 'Customer',
            comment: review.comment,
            rating: review.rating || 5
          }))
        }
      }

      // 4. Process package counts
      let tourCount = 0
      let activityCount = 0
      let rentalCount = 0
      
      if (toursResult.status === 'fulfilled' && toursResult.value.success && Array.isArray(toursResult.value.data)) {
        tourCount = toursResult.value.data.length
      }
      
      if (activitiesResult.status === 'fulfilled' && activitiesResult.value.success && Array.isArray(activitiesResult.value.data)) {
        activityCount = activitiesResult.value.data.length
      }
      
      if (rentalsResult.status === 'fulfilled' && rentalsResult.value.success && Array.isArray(rentalsResult.value.data)) {
        rentalCount = rentalsResult.value.data.length
      }

      // Update semua state
      setStats({
        totalUsers,
        totalBookings,
        totalReviews,
        totalRevenue,
        pendingBookings
      })
      
      setRecentBookings(recentBookingsData)
      setRecentReviews(recentReviewsData)
      setPackageCounts({
        tours: tourCount,
        activities: activityCount,
        rentals: rentalCount
      })

      console.log('✅ Dashboard data loaded successfully')

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data. Some APIs may be unavailable.')
      
      // Fallback to sample data lebih cepat
      setTimeout(() => {
        setStats({
          totalUsers: 9,
          totalBookings: 0,
          totalReviews: 0,
          totalRevenue: 0,
          pendingBookings: 0
        })
        
        setRecentBookings([
          { id: 1, booking_code: 'BK-0001', package_name: 'Sample Tour', status: 'pending', total_price: 500000 },
          { id: 2, booking_code: 'BK-0002', package_name: 'ATV Adventure', status: 'confirmed', total_price: 750000 },
          { id: 3, booking_code: 'BK-0003', package_name: 'Car Rental', status: 'completed', total_price: 450000 }
        ])
        
        setRecentReviews([
          { id: 1, user_name: 'Customer 1', comment: 'Great experience!', rating: 5 },
          { id: 2, user_name: 'Customer 2', comment: 'Very professional', rating: 4 },
          { id: 3, user_name: 'Customer 3', comment: 'Will book again', rating: 5 }
        ])
        
        setPackageCounts({
          tours: 0,
          activities: 0,
          rentals: 0
        })
      }, 100) // Very short delay for fallback
      
    } finally {
      setInitialLoading(false)
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData()
    }, 100) // Small delay untuk render UI dulu
    
    return () => clearTimeout(timer)
  }, [])

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )

  // Initial loading screen
  if (initialLoading) {
    return (
      <BackendLayout>
        <div className="animate-fadeIn">
          {/* Page Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Package Counts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Recent Activity Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BackendLayout>
    )
  }

  return (
    <BackendLayout>
      <div className="animate-fadeIn">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Admin Dashboard - Real-time statistics</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Error Message (show briefly then auto-hide) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
            <div className="flex items-start">
              <FiAlertCircle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">API Connection Issue</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">Using sample data for display</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-1 ${apiStatus.users === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs text-gray-500">API: {apiStatus.users === 'success' ? 'Connected' : 'Error'}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalBookings}
                </p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-1 ${apiStatus.bookings === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs text-gray-500">
                    {stats.pendingBookings} pending • API: {apiStatus.bookings === 'success' ? 'OK' : 'Error'}
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total Reviews Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalReviews.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-1 ${apiStatus.reviews === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs text-gray-500">API: {apiStatus.reviews === 'success' ? 'Connected' : 'Error'}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiStar className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Revenue</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">From {recentBookings.length} recent bookings</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Package Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tour Packages</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {packageCounts.tours}
                </p>
                <p className="text-xs text-blue-600 mt-1">Available tours</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiPackage className="text-blue-500" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activity Packages</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {packageCounts.activities}
                </p>
                <p className="text-xs text-green-600 mt-1">Available activities</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FiPackage className="text-green-500" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rental Packages</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {packageCounts.rentals}
                </p>
                <p className="text-xs text-purple-600 mt-1">Available rentals</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FiPackage className="text-purple-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
              <span className="text-sm text-gray-500">{recentBookings.length} bookings</span>
            </div>
            <div className="space-y-3">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FiFileText className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {booking.booking_code || `Booking #${booking.id}`}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {booking.package_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium mb-1 ${getStatusColor(booking.status)}`}>
                        {booking.status || 'pending'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatPrice(booking.total_price || 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FiCalendar className="mx-auto h-12 w-12 mb-3" />
                  <p>No bookings yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>
              <span className="text-sm text-gray-500">{recentReviews.length} reviews</span>
            </div>
            <div className="space-y-3">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors flex-shrink-0">
                      <FiMessageSquare className="text-yellow-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {review.user_name}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        "{review.comment || 'No comment'}"
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < (review.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            size={16} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FiStar className="mx-auto h-12 w-12 mb-3" />
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Status Bar */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${error ? 'text-red-600' : 'text-green-600'}`}>
                {error ? <FiAlertCircle className="mr-2" /> : <FiCheckCircle className="mr-2" />}
                <span className="text-sm font-medium">Dashboard Status: {error ? 'Limited' : 'Active'}</span>
              </div>
              <div className="text-sm text-gray-600">
                Data loaded: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {loading ? 'Loading...' : 'Update Now'}
            </button>
          </div>
        </div>
      </div>
    </BackendLayout>
  )
}

export default AdminDashboard