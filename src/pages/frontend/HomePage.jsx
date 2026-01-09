// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import FrontendLayout from "../../layouts/FrontendLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, Link } from "react-router-dom";

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [activities, setActivities] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const images = [
    "assets/appimages/herosection/Nusa-Penida-Bali.jpg",
    "assets/appimages/herosection/Pura Luhur Lempuyang.jpg",
    "assets/appimages/herosection/Pura Ulun Danu Bratan Temple.jpg",
  ];

  // Fetch data saat komponen mount
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch semua data paralel
        const [toursRes, activitiesRes, rentalsRes] = await Promise.all([
          fetch('http://localhost:8000/api/tour-packages/').then(res => res.json()),
          fetch('http://localhost:8000/api/activity-packages/get').then(res => res.json()),
          fetch('http://localhost:8000/api/rental-packages/get').then(res => res.json())
        ]);

        // Cek jika response sukses
        if (toursRes.success) {
          setTours(toursRes.data.slice(0, 6)); // Ambil 6 pertama
        }
        if (activitiesRes.success) {
          setActivities(activitiesRes.data.slice(0, 6)); // Ambil 6 pertama
        }
        if (rentalsRes.success) {
          setRentals(rentalsRes.data.slice(0, 3)); // Ambil 3 pertama untuk rental
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fungsi untuk menampilkan gambar atau default
  const getImageUrl = (item) => {
    if (item?.images?.length > 0 && item.images[0]?.image) {
      return `http://localhost:8000/storage/${item.images[0].image}`;
    }
    return "/assets/appimages/webimage/default.jpg";
  };

  // Format harga
  const formatPrice = (price) => {
    if (!price) return 'Rp. 0';
    return `Rp. ${parseInt(price).toLocaleString('id-ID')}`;
  };

  // Komponen Skeleton Loading
  const PackageSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4 text-center">
        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        <div className="mt-3 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

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
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide drop-shadow-lg">LET'S TRAVEL!</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experience the Island of Gods with curated tours, unforgettable activities, and seamless transportation.</p>
        </div>
      </section>

      {/* About Section - TIDAK DIHAPUS */}
      <section id="about" className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gambar */}
            <div className="order-2 lg:order-1">
              <img 
                src="/assets/appimages/logo/logo-topten.png" 
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

            {error && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                {error}
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-3 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {loading ? (
                // Skeleton loading saat fetch data
                Array.from({ length: 6 }).map((_, i) => (
                  <PackageSkeleton key={i} />
                ))
              ) : tours.length === 0 ? (
                // Jika tidak ada data
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No tour packages available at the moment.
                </div>
              ) : (
                // Tampilkan data tour (maks 6)
                tours.slice(0, 6).map((tour) => (
                  <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img 
                      src={getImageUrl(tour)} 
                      alt={tour.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{tour.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(tour.price_per_person)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ⏱️ {tour.duration_days || tour.duration || '1'} day(s) • 
                        👥 Min. {tour.min_persons || 1} person(s)
                      </p>
                      <Link
                        to={`/tour-packages/${tour.slug}`}
                        className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 text-white rounded transition duration-300"
                      >
                        DETAIL
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link 
              to="/tour-packages"
              className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 text-white rounded transition duration-300"
            >
              More Tours →
            </Link>
          </div>
          
          {/* Paket Activity Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">ACTIVITY</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get your adrenaline pumping! Choose from thrilling water sports, 
              scenic hikes, cultural workshops, and unique Balinese experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <PackageSkeleton key={i} />
                ))
              ) : activities.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No activity packages available at the moment.
                </div>
              ) : (
                activities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img 
                      src={getImageUrl(activity)} 
                      alt={activity.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{activity.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(activity.price_per_person)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ⏱️ {activity.duration_hours || '1'} hour(s) • 
                        👥 Min. {activity.min_persons || 1} person(s)
                      </p>
                      <Link
                        to={`/activity-packages/${activity.slug}`}
                        className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 text-white rounded transition duration-300"
                      >
                        DETAIL
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link 
              to="/activity-packages"
              className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 text-white rounded transition duration-300"
            >
              More Activities →
            </Link>
          </div>
              
          {/* Paket Rental Section - MAKSIMAL 3 */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">RENTAL MOBIL/MOTOR</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Freedom to explore! Rent well-maintained cars and motorbikes 
              to discover Bali's beauty at your own pace and convenience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <PackageSkeleton key={i} />
                ))
              ) : rentals.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No rental packages available at the moment.
                </div>
              ) : (
                rentals.slice(0, 3).map((rental) => (
                  <div key={rental.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img 
                      src={getImageUrl(rental)} 
                      alt={rental.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{rental.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(rental.price_per_day || rental.price)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        🚗 {rental.type || 'Vehicle'} • 
                        🏷️ {rental.brand || ''}
                      </p>
                      <Link
                        to={`/rental-packages/${rental.slug}`}
                        className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 text-white rounded transition duration-300"
                      >
                        DETAIL
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link 
              to="/rental-packages"
              className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 text-white rounded transition duration-300"
            >
              More Rentals →
            </Link>
          </div>

          {/* Testimonial Section (SAMA) */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">CUSTOMER REVIEWS</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Don't just take our word for it! Here's what our happy customers have to say about their Bali experience with us.
            </p>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
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
          </div>
        </div>
      </section> 
    </FrontendLayout>
  );
}