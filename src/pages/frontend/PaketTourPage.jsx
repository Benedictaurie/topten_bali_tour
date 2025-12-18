// src/pages/PaketTourPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import FrontendLayout from "../../layouts/FrontendLayout";
import { useUserTour } from "../../hooks/useUserTour";

export default function PaketTourPage() {
  const { 
    tours, 
    loading, 
    error, 
    fetchAvailableTours,
    fetchToursByCategory 
  } = useUserTour();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const IMAGE_BASE = "http://localhost:8000/storage/"
  const getTourImage = (pkg) => {
    if (pkg?.images?.length > 0 && pkg.images[0]?.image) {
      return IMAGE_BASE + pkg.images[0].image
    }
    return "/assets/appimages/webimage/default.jpg"
  }


  // Fetch data saat komponen mount
  useEffect(() => {
    fetchAvailableTours();
  }, [fetchAvailableTours]);

  // Handle category filter change
  useEffect(() => {
    if (categoryFilter) {
      fetchToursByCategory(categoryFilter);
    } else {
      fetchAvailableTours();
    }
  }, [categoryFilter, fetchToursByCategory, fetchAvailableTours]);

  // Filter data berdasarkan search
  const filteredPackages = tours.filter(pkg => {
    const matchesSearch = 
      pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <FrontendLayout title="Paket Tour">
        <div className="relative">
          <img  
            src="/assets/appimages/webimage/Kuta Beach.jpg"
            alt="Paket Tour"
            className="w-full h-[400px] object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl font-bold">PAKET TOUR</h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading tour packages...</div>
        </div>
      </FrontendLayout>
    );
  }

  if (error) {
    return (
      <FrontendLayout title="Paket Tour">
        <div className="relative">
          <img
            src="/assets/appimages/webimage/Kuta Beach.jpg"
            alt="Paket Tour"
            className="w-full h-[400px] object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl font-bold">PAKET TOUR</h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
          <button 
            onClick={fetchAvailableTours}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout title="Paket Tour">
      {/* Header Section */}
      <div className="relative">
        <img
          src="/assets/appimages/webimage/Kuta Beach.jpg"
          alt="Paket Tour"
          className="w-full h-[400px] object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold">PAKET TOUR</h1>
        </div>

        {/* Search Box */}
        <div className="absolute bottom-[-40px] w-full flex justify-center">
          <div className="bg-white shadow-md p-4 rounded-lg flex gap-4 w-[80%] max-w-3xl">
            <input
              type="text"
              placeholder="Cari paket tour..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              <option value="Paket 1 hari">Paket 1 Hari</option>
              <option value="Paket 2 hari">Paket 2 hari</option>
              <option value="Paket 3 hari">Paket 3 hari</option>
            </select>
            <button className="px-6 py-2 rounded bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="pt-32 pb-20 px-8 bg-white">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada paket tour yang ditemukan.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            {/* <div className="mb-8 text-center">
              <p className="text-gray-600">
                Menampilkan {filteredPackages.length} paket tour
              </p>
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition hover:scale-[1.02] duration-300"
                >
                  {/* Badge untuk kategori/special */}
                  {pkg.category && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        {pkg.category.toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <img 
                    src={getTourImage(pkg)}
                    alt={pkg.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4 text-left">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{pkg.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {pkg.short_description || pkg.description?.substring(0, 100)}...
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="mr-4">⏱️ {pkg.duration_days || 'N/A'} hari</span>
                      <span>👥 Min. {pkg.min_persons || 'N/A'} orang</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Mulai dari</p>
                        <p className="text-base font-semibold text-gray-800">
                          Rp. {pkg.price_per_person?.toLocaleString('id-ID') || '0'}
                        </p>
                      </div>
                      <a 
                        href={`/tour-packages/${pkg.slug}`}
                        className="px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 rounded text-sm text-white transition"
                      >
                        Detail
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </FrontendLayout>
  );
}