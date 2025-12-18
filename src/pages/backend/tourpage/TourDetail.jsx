import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import BackendLayout from "../../../layouts/BackendLayout"
import { FiEdit, FiArrowLeft, FiCalendar, FiMapPin, FiDollarSign, FiClock } from 'react-icons/fi'

const TourDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [tour, setTour] = useState(null)

  useEffect(() => {
    fetchTourDetail()
  }, [id])

  const fetchTourDetail = async () => {
    // API call to get tour detail
    setTimeout(() => {
      setTour({
        id: 1,
        name: 'Paket 1 Hari',
        description: 'Tour package eksklusif untuk 1 hari menjelajahi keindahan Bali. Nikmati pengalaman tak terlupakan mengunjungi tempat-tempat ikonik dengan pemandu profesional.',
        price: 123000,
        duration: '1 Day',
        location: 'Bali, Indonesia',
        itinerary: `08:00 - Penjemputan di hotel
10:00 - Mengunjungi Pura Tanah Lot
12:00 - Makan siang di restoran lokal
14:00 - Explore Pantai Kuta
16:00 - Berbelanja di pasar seni
18:00 - Kembali ke hotel`,
        includes: 'Transportasi AC, Pemandum tur berlisensi, Tiket masuk lokasi wisata, Makan siang, Air mineral',
        excludes: 'Pengeluaran pribadi, Tips untuk pemandu, Asuransi perjalanan',
        status: 'active',
        images: [
          '/assets/appimages/webimage/tanah-lot-temple.jpg',
          '/assets/appimages/webimage/monkey_forest.jpg'
        ],
        created_at: '2024-01-15',
        updated_at: '2024-01-20'
      })
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <BackendLayout>
        <div className="flex justify-center items-center h-64">
          <div>Loading tour details...</div>
        </div>
      </BackendLayout>
    )
  }

  if (!tour) {
    return (
      <BackendLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-800">Tour not found</h2>
          <button
            onClick={() => navigate('/admin/tours')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Tours
          </button>
        </div>
      </BackendLayout>
    )
  }

  return (
    <BackendLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/tours')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{tour.name}</h1>
              <p className="text-gray-600">Tour package details and information</p>
            </div>
          </div>
          <Link
            to={`/admin/tours/edit/${tour.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FiEdit className="mr-2" size={16} />
            Edit Tour
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tour Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {tour.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${tour.name} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Itinerary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-gray-700 whitespace-pre-wrap font-sans">{tour.itinerary}</pre>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tour Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiDollarSign className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-gray-800">Rp {tour.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiClock className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800">{tour.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiMapPin className="text-red-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">{tour.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      tour.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tour.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Includes & Excludes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-green-700 mb-2">What's Included</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {tour.includes.split(',').map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-2">What's Excluded</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {tour.excludes.split(',').map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Meta Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Meta Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created Date</span>
                  <span className="text-gray-800">{new Date(tour.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-800">{new Date(tour.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour ID</span>
                  <span className="text-gray-800">#{tour.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackendLayout>
  )
}

export default TourDetail