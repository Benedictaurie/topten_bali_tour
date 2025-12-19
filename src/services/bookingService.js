// // src/services/bookingService.js
// import api from './api'

// export const bookingService = {
//   // Create new booking (for logged in users)
//   createBooking(bookingData) {
//     return api.post('/bookings', bookingData);
//   },
  
//   // Create guest booking (without login)
//   createGuestBooking(bookingData) {
//     return api.post('/guest-bookings', bookingData);
//   },
  
//   // Get user's bookings
//   getMyBookings() {
//     return api.get('/my-bookings');
//   },
  
//   // Get booking detail
//   getBookingDetail(id) {
//     return api.get(`/booking/detail/${id}`);
//   },
  
//   // Cancel booking
//   cancelBooking(id) {
//     return api.post(`/bookings/${id}/cancel`);
//   }
// };