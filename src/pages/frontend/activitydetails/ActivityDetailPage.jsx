import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import FrontendLayout from "../../../layouts/FrontendLayout"
import { userActivityService } from "../../../services/userActivityService"
import BookingForm from "../../../components/frontend/BookingForm"
import { FiClock, FiUsers, FiDollarSign } from "react-icons/fi"

export default function ActivityDetailPage() {
  const { slug } = useParams()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const IMAGE_BASE = "http://localhost:8000/storage/"

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        const response = await userActivityService.getActivityBySlug(slug)
          
        if (response.data) {
          setActivity(response.data)
        } else {
          setError("Activity not found")
        }
      } catch (err) {
        console.error("Error fetching activity:", err)
        setError("Failed to load activity details")
      } finally {
        setLoading(false)
      }
    }
  
    fetchActivity()
  }, [slug])

  if (loading) {
    return (
      <FrontendLayout title="Activity Detail">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading activity details...</p>
          </div>
        </div>
      </FrontendLayout>
    )
  }

  if (error) {
    return (
      <FrontendLayout title="Activity Detail">
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

  if (!activity) {
    return (
      <FrontendLayout title="Activity Detail">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Activity not found</p>
        </div>
      </FrontendLayout>
    )
  }

  return (
    <FrontendLayout title={activity.name}>
      <div className="max-w-6xl mx-auto space-y-6 pt-8">

        <h1 className="text-3xl font-bold">{activity.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* IMAGE */}
            <img
              src={
                activity.images?.length
                  ? IMAGE_BASE + activity.images[0].image
                  : "/assets/appimages/webimage/default.jpg"
              }
              className="w-full h-96 object-cover rounded-xl"
            />

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* ITINERARY */}
            {activity.itinerary && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {activity.itinerary}
                </pre>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* INFO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <InfoItem icon={<FiDollarSign />} label="Price per Person">
                Rp {activity.price_per_person?.toLocaleString("id-ID")}
              </InfoItem>
              <InfoItem icon={<FiClock />} label="Duration">
                {activity.duration_hours} Hours
              </InfoItem>
              <InfoItem icon={<FiUsers />} label="Min Persons">
                {activity.min_persons}
              </InfoItem>
            </div>

            {/* INCLUDES / EXCLUDES */}
            <IncludesExcludes
              includes={activity.includes}
              excludes={activity.excludes}
            />

            {/* BOOKING */}
            <BookingForm
              packageType="activity"
              packageId={activity.id}
              packageName={activity.name}
              price={activity.price_per_person}
            />
          </div>
        </div>
      </div>
    </FrontendLayout>
  )
}

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-center space-x-3">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{children}</p>
    </div>
  </div>
)

const IncludesExcludes = ({ includes, excludes }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    {includes && (
      <>
        <h4 className="font-semibold text-green-700 mb-2">Included</h4>
        <ul className="text-sm space-y-1 mb-4">
          {includes.split('\n').filter(line => line.trim() !== '').map((i, idx) => (
            <li key={idx}>• {i.trim()}</li>
          ))}
        </ul>
      </>
    )}

    {excludes && (
      <>
        <h4 className="font-semibold text-red-700 mb-2">Excluded</h4>
        <ul className="text-sm space-y-1">
          {excludes.split('\n').filter(line => line.trim() !== '').map((i, idx) => (
            <li key={idx}>• {i.trim()}</li>
          ))}
        </ul> 
      </>
    )}
  </div>
);
