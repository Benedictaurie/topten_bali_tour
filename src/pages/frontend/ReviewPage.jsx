// src/pages/ReviewPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FrontendLayout from "../../layouts/FrontendLayout";

export default function ReviewPage() {
  const { bookingId } = useParams(); // Jika review berdasarkan booking
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '', // Ganti dari 'review' ke 'comment' untuk match backend
    image: null
  });
  
  const [bookingInfo, setBookingInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  
  // Jika ada bookingId, fetch booking info
  useEffect(() => {
    if (bookingId) {
      fetch(`/api/bookings/${bookingId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookingInfo(data.data);
          }
        });
    }
  }, [bookingId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle file upload - PERBAIKI
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0] // 'image' bukan 'photo'
      }));
    }
  };

  // Handle form submission yang real
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setErrors({ rating: 'Please select a rating' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('comment', formData.comment);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          navigate('/my-bookings'); // Kembali ke my bookings setelah success
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FrontendLayout>
      <div className="bg-gray-50 py-12 px-4 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Write your Review</h1>
            <p className="text-gray-600 mb-8">Share your experiences with TOPTEN BALI TOUR</p>
            
            {/* Booking Info */}
            {bookingInfo && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-800">Review for your Booking</h3>
                <p className="text-blue-600">
                  Package: {bookingInfo.bookable?.name} • 
                  Booking Code: {bookingInfo.booking_code}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Rating Section */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Rating *
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="mr-1 focus:outline-none"
                    >
                      <span className="text-3xl">
                        {star <= formData.rating ? '⭐' : '☆'}
                      </span>
                    </button>
                  ))}
                  <span className="ml-4 text-gray-600 text-lg">
                    {formData.rating > 0 ? `${formData.rating} dari 5` : 'Please select a rating'}
                  </span>
                </div>
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>
              
              {/* ✅ Comment Section */}
              <div className="mb-6">
                <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                  Review Anda *
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Please tell us about your experience with TOPTEN BALI TOUR..."
                ></textarea>
                {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
              </div>
              
              {/* ✅ File Upload - PERBAIKI NAME */}
              <div className="mb-6">
                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                  Foto (Opsional)
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="image"
                    className="flex items-center justify-center w-full px-4 py-2 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-400">📁</span>
                      <span className="text-gray-600">
                        {formData.image ? formData.image.name : 'Select your photo'}
                      </span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Supported formats: JPG, PNG, GIF. Maximum 2MB.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}