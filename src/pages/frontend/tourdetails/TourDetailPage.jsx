import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FrontendLayout from '../../../layouts/FrontendLayout'
import { userTourService } from '../../../services/userTourService'
import BookingForm from '../../../components/frontend/BookingForm'

export default function TourDetailPage() {
  const { slug } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)

  const IMAGE_BASE = "http://localhost:8000/storage/"

  useEffect(() => {
    userTourService.getTourBySlug(slug).then(res => {
      setTour(res.data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div>Loading...</div>
  if (!tour) return <div>Tour not found</div>

  return (
    <FrontendLayout title={tour.name}>
      <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>

      <img
        src={
          tour.images?.length > 0
            ? IMAGE_BASE + tour.images[0].image
            : "/assets/appimages/webimage/default.jpg"
        }
        className="w-full h-96 object-cover rounded mb-6"
      />

      <p className="mb-6">{tour.description}</p>

      <BookingForm
        packageType="tour"
        packageId={tour.id}
        packageName={tour.name}
        price={tour.price_per_person}
      />
    </FrontendLayout>
  )
}
