// src/pages/frontend/tourdetails/TourDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FrontendLayout from "../../../layouts/FrontendLayout";
import { userTourService } from "../../../services/userTourService";
import BookingForm from "../../../components/frontend/BookingForm";
import { FiClock, FiUsers, FiDollarSign, FiMapPin } from "react-icons/fi";

export default function TourDetailPage() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  const IMAGE_BASE = "http://localhost:8000/storage/";

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true)
        const response = await userTourService.getTourBySlug(slug)
          
        if (response.data) {
          setTour(response.data)
        } else {
          setError("Tour not found")
        }
      } catch (err) {
        console.error("Error fetching tour:", err)
        setError("Failed to load tour details")
      } finally {
        setLoading(false)
      }
    }
  
    fetchTour()
  }, [slug])

  if (loading) {
    return (
      <FrontendLayout title="Tour Detail">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading tour details...</p>
          </div>
        </div>
      </FrontendLayout>
    )
  }

  if (error) {
    return (
      <FrontendLayout title="Tour Detail">
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

  if (!tour) {
    return (
      <FrontendLayout title="Tour Detail">
        <div className="text-center py-20 text-gray-500">Tour not found</div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout title={tour.name}>
      <div className="max-w-6xl mx-auto space-y-6 pt-8">
        <h1 className="text-3xl font-bold">{tour.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* IMAGE */}
            <img
              src={
                tour.images?.length > 0
                  ? IMAGE_BASE + tour.images[0].image
                  : "/assets/appimages/webimage/default.jpg"
              }
              alt={tour.name}
              className="w-full h-96 object-cover rounded-xl"
            />

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* ITINERARY */}
            {tour.itinerary && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {tour.itinerary}
                </pre>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* INFO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <InfoItem icon={<FiDollarSign />} label="Price per Person">
                Rp {Number(tour.price_per_person || 0).toLocaleString("id-ID")}
              </InfoItem>
              <InfoItem icon={<FiClock />} label="Duration">
                {tour.duration_days}
              </InfoItem>
              <InfoItem icon={<FiUsers />} label="Min Persons">
                {tour.min_persons || 1} Person(s)
              </InfoItem>
              {tour.location && (
                <InfoItem icon={<FiMapPin />} label="Location">
                  {tour.location}
                </InfoItem>
              )}
            </div>

            {/* INCLUDES / EXCLUDES */}
            <IncludesExcludes
              includes={tour.includes}
              excludes={tour.excludes}
            />

            {/* BOOKING FORM */}
            <BookingForm
              packageType="tour"
              packageId={tour.id}
              packageName={tour.name}
              price={tour.price_per_person}
              minPersons={tour.min_persons || 1}
            />
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-center space-x-3">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{children}</p>
    </div>
  </div>
);

const IncludesExcludes = ({ includes, excludes }) => {
  const parseTextToList = (text) => {
    if (!text) return [];
    
    // Coba split berdasarkan newline dulu
    const lines = text.split(/\r?\n|\r/);
    
    // Jika hasilnya hanya 1 line tapi ada koma, split berdasarkan koma
    if (lines.length === 1 && lines[0].includes(',')) {
      return lines[0].split(',').map(item => item.trim());
    }
    
    // Kalau ada newline, gunakan yang newline
    return lines.map(item => item.trim()).filter(item => item.length > 0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {includes && (
        <>
          <h4 className="font-semibold text-green-700 mb-2">Included</h4>
          <ul className="text-sm space-y-1 mb-4">
            {parseTextToList(includes).map((i, idx) => (
              <li key={idx}>• {i}</li>
            ))}
          </ul>
        </>
      )}

      {excludes && (
        <>
          <h4 className="font-semibold text-red-700 mb-2">Excluded</h4>
          <ul className="text-sm space-y-1">
            {parseTextToList(excludes).map((i, idx) => (
              <li key={idx}>• {i}</li>
            ))}
          </ul> 
        </>
      )}
    </div>
  );
};