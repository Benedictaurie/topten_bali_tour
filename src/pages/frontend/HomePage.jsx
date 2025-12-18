// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import FrontendLayout from "../../layouts/FrontendLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // const { 
  //   tours, 
  //   loading, 
  //   error, 
  //   fetchAvailableTours 
  // } = useCustomerTour();

  // // Fetch data saat komponen mount
  // useEffect(() => {
  //   fetchAvailableTours();
  // }, [fetchAvailableTours]);

  // // Ambil hanya 6 paket untuk homepage
  // const homepagePackages = tours.slice(0, 6);
  
  const images = [
    "assets/appimages/herosection/Nusa-Penida-Bali.jpg",
    "assets/appimages/herosection/Pura Luhur Lempuyang.jpg",
    "assets/appimages/herosection/Pura Ulun Danu Bratan Temple.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fungsi untuk navigasi ke halaman detail
  const handleDetailClick = (type, packageName) => {
    // Konversi nama paket menjadi format URL-friendly
    const formattedName = packageName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${type}/${formattedName}`);
  };

  return (
    <FrontendLayout>
      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Bali"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] 
            ${current === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide drop-shadow-lg">LET’S TRAVEL!</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experience the Island of Gods with curated tours, unforgettable activities, and seamless transportation.</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gambar */}
            <div className="order-2 lg:order-1">
              <img 
                src="/assets/appimages/webimage/Business-Travel.jpg" 
                alt="TOPTEN BALI TOUR Team" 
                className="w-full h-80 lg:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Konten Teks */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">WHO WE ARE?</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                <strong>TOPTEN BALI TOUR</strong> is a premier service that promotes exclusive private packages, 
                including <span className="font-semibold">tour packages</span>, 
                <span className="font-semibold"> activity packages</span>, and 
                <span className="font-semibold"> vehicle rental packages</span> in Bali.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Personalized Experiences:</strong> Tailored tours designed just for you
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Adventure Activities:</strong> From serene to extreme, we've got it all
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <span className="text-purple-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Convenient Rentals:</strong> Explore Bali at your own pace with our vehicles
                  </p>
                </div>
              </div>
              
              {/* <button className="bg-gradient-to-r from-gray-600 to-blue-600 hover:from-blue-700 hover:to-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 shadow-lg">
                Discover Our Story →
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-8 bg-white text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">SERVICES</h2>
          <p className="text-xl text-gray-600 mb-12">
            Everything you need for an unforgettable Bali adventure in one place
          </p>

          {/* Paket Tour Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">PAKET TOUR</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover Bali's hidden gems with our carefully crafted tour itineraries. 
              From cultural landmarks to breathtaking landscapes, we'll show you the real Bali.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {[
                { title: "Paket 1 hari", price: "Rp. 123.000", img: "/assets/appimages/webimage/tanah-lot-temple.jpg" },
                { title: "Paket 2 hari", price: "Rp. 266.000", img: "/assets/appimages/webimage/monkey_forest.jpg" },
                { title: "Paket 3 hari", price: "Rp. 340.000", img: "/assets/appimages/webimage/tour3.jpg" },
                { title: "Paket 4 hari", price: "Rp. 410.000", img: "/assets/appimages/webimage/tour4.jpg" },
                { title: "Paket 5 hari", price: "Rp. 520.000", img: "/assets/appimages/webimage/tour5.jpg" },
                { title: "Paket 6 hari", price: "Rp. 611.000", img: "/assets/appimages/webimage/tour6.jpg" },
              ].map((pkg, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={pkg.img} alt={pkg.title} className="w-full h-48 object-cover" />
                  <div className="p-4 text-center">
                    <h4 className="font-semibold">{pkg.title}</h4>
                    <p className="text-sm">{pkg.price}</p>
                    <button onClick={() => handleDetailClick('paket-tours', pkg.title)} className="mt-2 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                      DETAIL
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 rounded">
              <a href="/tour-packages">More</a>
            </button>
          </div>
          
          {/* Paket Activity Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">ACTIVITY</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get your adrenaline pumping! Choose from thrilling water sports, 
              scenic hikes, cultural workshops, and unique Balinese experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {[
                { title: "ATV", price: "Rp. 410.000", img: "/assets/appimages/webimage/atv.jpg" },
                { title: "Swing", price: "Rp. 410.000", img: "/assets/appimages/webimage/swing.jpg" },
                { title: "Water Sports", price: "Rp. 410.000", img: "/assets/appimages/webimage/watersport.jpg" },
                { title: "Rafting", price: "Rp. 410.000", img: "/assets/appimages/webimage/rafting.jpg" },
                { title: "Helicopter", price: "Rp. 410.000", img: "/assets/appimages/webimage/heli.jpg" },
                { title: "Surfing", price: "Rp. 410.000", img: "/assets/appimages/webimage/surfing.jpg" },
              ].map((pkg, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={pkg.img} alt={pkg.title} className="w-full h-48 object-cover"/>
                  <div className="p-4 text-center">
                    <h4 className="font-semibold">{pkg.title}</h4>
                    <p className="text-sm">{pkg.price}</p>
                    <button onClick={() => handleDetailClick('activities', pkg.title)} className="mt-2 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                      See Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 rounded">
              <a href="/activity-packages">More</a>
            </button>
          </div>
              
          {/* Paket Rental Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">RENTAL MOBIL/MOTOR</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Freedom to explore! Rent well-maintained cars and motorbikes 
              to discover Bali's beauty at your own pace and convenience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {[
                { title: "Hiace", price: "Rp. 220.000", img: "/assets/appimages/hiace.png" },
                { title: "Yamaha Mio Z Suzuki", price: "Rp. 120.000", img: "/assets/appimages/Yamaha-Mio-Z.jpg" },
              ].map((pkg, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={pkg.img} alt={pkg.title} className="w-full h-48 object-cover" />
                  <div className="p-4 text-center">
                    <h4 className="font-semibold">{pkg.title}</h4>
                    <p className="text-sm">{pkg.price}</p>
                    <button onClick={() => handleDetailClick('rentals', pkg.title)} className="mt-2 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                      See Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 rounded">
              <a href="/rental-packages">More</a>
            </button>
          </div>

          {/*Testimonial Section*/}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">CUSTOMER REVIEWS</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Don't just take our word for it! Here's what our happy customers have to say about their Bali experience with us.
            </p>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20} //jarak tiap card
              slidesPerView={1} //atur slidenya
              breakpoints={{
                640: { slidesPerView: 1 }, //atur slide di mobile - 1 card
                768: { slidesPerView: 2 }, //atur slide di tablet - 2 card
                1024: { slidesPerView: 3 }, //atur slide di desktop - 3 card
              }}
              navigation //menampilkan panah kiri-kanan
              pagination={{ clickable: true }} //titik pagination dibawah slider
              autoplay={{ delay: 5000, disableOnInteraction: false }} //otomatis geser tiap 5 detik
              loop={true} //geser terus tnpa habis
              className="pb-12"
            >
              {[
                {
                  name: "Sarah & James",
                  country: "Australia",
                  text: "Absolutely incredible experience! The private tour showed us parts of Bali we never would have found on our own."
                },
                {
                  name: "Miguel Rodriguez",
                  country: "Spain", 
                  text: "The ATV adventure was the highlight of our trip! Professional guides and breathtaking views."
                },
                { 
                  name: "Chen Li",
                  country: "Singapore",
                  text: "Car rental process was seamless. Perfect condition vehicle and great customer service throughout."
                },
                {
                  name: "Emma Wilson",
                  country: "UK",
                  text: "Water sports package exceeded all expectations. Safety was their top priority while ensuring maximum fun!"
                },
                {
                  name: "Takashi Yamamoto",
                  country: "Japan",
                  text: "Cultural tour gave us deep insights into Balinese traditions. Truly authentic experience."
                },
                {
                  name: "Lisa Johnson", 
                  country: "USA",
                  text: "From booking to completion, everything was perfect. Highly recommend for first-time Bali visitors!"
                }
              ].map((testimonial, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">{testimonial.name}</span>
                        <span className="text-sm text-gray-500">{testimonial.country}</span>
                      </div>
                    </div>
                    <p className="text-yellow-500 text-lg mb-3">★★★★★</p>
                    <p className="text-gray-700 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="text-center mt-4">
              <button 
                onClick={() => {
                  if (user) {
                    navigate('/my-bookings'); // Arahkan ke my bookings
                  } else {
                    navigate('/login'); // Arahkan ke login dulu
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 rounded text-white"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </section> 
    </FrontendLayout>
  );
}

//Perbaikan biar ssama dgn backend
// Di HomePage.jsx - Testimonial Section
// import { useState, useEffect } from 'react';

// export default function HomePage() {
//   const [reviews, setReviews] = useState([]);
//   const [user, setUser] = useState(null); // ✅ Untuk cek login

//   // ✅ Fetch real reviews dari API
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await fetch('/api/reviews');
//         const data = await response.json();
//         if (data.success) {
//           setReviews(data.data.reviews);2
//         }
//       } catch (error) {
//         console.error('Failed to fetch reviews:', error);
//       }
//     };

//     fetchReviews();
//   }, []);

//   // ✅ Ganti hardcoded testimonials dengan real data
//   <Swiper
//     // ... swiper props ...
//   >
//     {reviews.map((review) => (
//       <SwiperSlide key={review.id}>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
//           <div className="flex items-center mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
//               {review.user_initial}
//             </div>
//             <div>
//               <span className="font-semibold text-gray-800 block">{review.user_name}</span>
//               <span className="text-sm text-gray-500">{review.travel_date}</span>
//             </div>
//           </div>
//           <p className="text-yellow-500 text-lg mb-3">{review.stars}</p>
//           <p className="text-gray-700 leading-relaxed">
//             "{review.comment}"
//           </p>
//           {review.image && (
//             <img 
//               src={review.image} 
//               alt="Review" 
//               className="mt-3 rounded-lg w-full h-32 object-cover"
//             />
//           )}
//         </div>
//       </SwiperSlide>
//     ))}
//   </Swiper>