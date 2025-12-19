// src/pages/frontend/rentaldetails/RentalDetailPage.jsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import FrontendLayout from "../../../layouts/FrontendLayout"
import { userRentalService } from "../../../services/userRentalService"
import BookingForm from "../../../components/frontend/BookingForm"
import { FiDollarSign, FiTruck, FiPackage, FiNavigation } from "react-icons/fi"

export default function RentalDetailPage() {
  const { slug } = useParams()
  const [rental, setRental] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const IMAGE_BASE = "http://localhost:8000/storage/"

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true)
        const response = await userRentalService.getRentalBySlug(slug)
        
        if (response.data) {
          setRental(response.data)
        } else {
          setError("Rental not found")
        }
      } catch (err) {
        console.error("Error fetching rental:", err)
        setError("Failed to load rental details")
      } finally {
        setLoading(false)
      }
    }

    fetchRental()
  }, [slug])

  if (loading) {
    return (
      <FrontendLayout title="Rental Detail">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading rental details...</p>
          </div>
        </div>
      </FrontendLayout>
    )
  }

  if (error) {
    return (
      <FrontendLayout title="Rental Detail">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </FrontendLayout>
    )
  }

  if (!rental) {
    return (
      <FrontendLayout title="Rental Detail">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Rental not found</p>
        </div>
      </FrontendLayout>
    )
  }

  return (
    <FrontendLayout title={rental.name}>
      <div className="max-w-6xl mx-auto space-y-6 pt-8">
        <h1 className="text-3xl font-bold">{rental.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <img
              src={
                rental.images?.length
                  ? IMAGE_BASE + rental.images[0].image
                  : "/assets/appimages/webimage/default.jpg"
              }
              alt={rental.name}
              className="w-full h-96 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = "/assets/appimages/webimage/default.jpg"
              }}
            />

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {rental.description}
              </p>
            </div>

            {/* INCLUDES & EXCLUDES jika ada */}
            {(rental.includes || rental.excludes) && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Features & Conditions</h3>
                
                {rental.includes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <FiPackage className="mr-2" /> Included
                    </h4>
                    <ul className="text-sm space-y-1">
                      {rental.includes.split(",").map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rental.excludes && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                      <FiNavigation className="mr-2" /> Excluded
                    </h4>
                    <ul className="text-sm space-y-1">
                      {rental.excludes.split(",").map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* RENTAL INFO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <InfoItem icon={<FiTruck />} label="Vehicle Type">
                {rental.type || "Not specified"}
              </InfoItem>

              {rental.brand && (
                <InfoItem icon={<FiPackage />} label="Brand">
                  {rental.brand}
                </InfoItem>
              )}

              {rental.model && (
                <InfoItem icon={<FiNavigation />} label="Model">
                  {rental.model}
                </InfoItem>
              )}

              <InfoItem icon={<FiDollarSign />} label="Price per Day">
                Rp {parseInt(rental.price_per_day || 0).toLocaleString("id-ID")}
              </InfoItem>
            </div>

            {/* BOOKING */}
            {rental?.id && (
              <BookingForm
                packageType="rental"
                packageId={rental.id}
                packageName={rental.name}
                price={rental.price_per_day}
              />
            )}
          </div>
        </div>
      </div>
    </FrontendLayout>
  )
}

/* ================= COMPONENT KECIL ================= */

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-center space-x-3">
    <div className="text-blue-600 text-xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{children}</p>
    </div>
  </div>
)