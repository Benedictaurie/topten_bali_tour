import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";

const AdminNotificationPage = () => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all_users', // 'all_users', 'specific_user', 'specific_booking'
    userId: '',
    bookingId: '',
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  // Fetch users and bookings for dropdown
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch users
        const usersRes = await axios.get('/api/admin/users', { headers });
        if (usersRes.data.success) {
          setUsers(usersRes.data.data.users || []);
        }

        // Fetch recent bookings
        const bookingsRes = await axios.get('/api/admin/bookings?per_page=50', { headers });
        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.data.bookings || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setResponseMessage('Title and message are required');
      setResponseType('error');
      return;
    }

    setSending(true);
    setResponseMessage('');

    try {
      const token = getToken();
      const payload = {
        title: formData.title,
        message: formData.message,
        target: formData.target,
        ...(formData.target === 'specific_user' && { user_id: formData.userId }),
        ...(formData.target === 'specific_booking' && { booking_id: formData.bookingId }),
      };

      const response = await axios.post('/api/admin/send-notification', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setResponseMessage('Notification sent successfully!');
        setResponseType('success');
        // Reset form
        setFormData({
          title: '',
          message: '',
          target: 'all_users',
          userId: '',
          bookingId: '',
        });
      } else {
        setResponseMessage(response.data.message || 'Failed to send notification');
        setResponseType('error');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setResponseMessage(error.response?.data?.message || 'Failed to send notification');
      setResponseType('error');
    } finally {
      setSending(false);
    }
  };

  // Pre-fill form for booking notification
  const fillBookingNotification = (booking) => {
    if (booking) {
      setFormData({
        title: `Booking Update: ${booking.booking_code}`,
        message: `Your booking for ${booking.bookable?.name} has been updated. Status: ${booking.status}`,
        target: 'specific_booking',
        userId: booking.user_id,
        bookingId: booking.id,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Send Push Notification</h1>
        <p className="text-gray-600 mt-2">
          Send notifications to mobile app users via Firebase Cloud Messaging
        </p>
      </div>

      {responseMessage && (
        <div className={`mb-6 p-4 rounded-lg ${responseType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {responseMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Target Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send To
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['all_users', 'specific_user', 'specific_booking'].map((target) => (
                      <label key={target} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="target"
                          value={target}
                          checked={formData.target === target}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {target === 'all_users' && 'All Users'}
                          {target === 'specific_user' && 'Specific User'}
                          {target === 'specific_booking' && 'Specific Booking'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* User Selection (if specific_user) */}
                {formData.target === 'specific_user' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select User
                    </label>
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Booking Selection (if specific_booking) */}
                {formData.target === 'specific_booking' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Booking
                    </label>
                    <select
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a booking</option>
                      {bookings.map(booking => (
                        <option key={booking.id} value={booking.id}>
                          {booking.booking_code} - {booking.bookable?.name} ({booking.user?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Booking Confirmed!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your notification message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Notification'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Bookings Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings found</p>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map(booking => (
                  <div 
                    key={booking.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => fillBookingNotification(booking)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{booking.booking_code}</p>
                        <p className="text-sm text-gray-600 truncate">{booking.bookable?.name}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{booking.user?.name}</span>
                      <span>Rp {booking.total_price?.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => fillBookingNotification(booking)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Use for notification →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Notification Tips */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tips for Effective Notifications:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep title short & clear</li>
                <li>• Include relevant details in message</li>
                <li>• For booking updates, include booking code</li>
                <li>• Test with specific users first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPage;