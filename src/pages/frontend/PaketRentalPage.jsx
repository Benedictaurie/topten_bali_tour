// src/pages/frontend/PaketRentalPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FrontendLayout from "../../layouts/FrontendLayout";
import { useUserRental } from "../../hooks/useUserRental";

export default function PaketRentalPage() {
  const {
    rentals,
    loading,
    error,
    fetchAvailableRentals
  } = useUserRental();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const IMAGE_BASE = "http://localhost:8000/storage/";

  const getRentalImage = (rental) => {
    if (rental?.images?.length > 0 && rental.images[0]?.image) {
      return IMAGE_BASE + rental.images[0].image;
    }
    return "/assets/appimages/webimage/default.jpg";
  };

  useEffect(() => {
    fetchAvailableRentals();
  }, [fetchAvailableRentals]);

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? rental.category === categoryFilter
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <FrontendLayout title="Rental Mobil/Motor">
      {/* Header */}
      <div className="relative">
        <img
          src="/assets/appimages/webimage/cars.jpg"
          alt="Rental Mobil/Motor"
          className="w-full h-[400px] object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold">RENTAL MOBIL/MOTOR</h1>
        </div>

        {/* Search & Filter */}
        <div className="absolute bottom-[-40px] w-full flex justify-center">
          <div className="bg-white shadow-md p-4 rounded-lg flex gap-4 w-[80%] max-w-3xl">
            <input
              type="text"
              placeholder="Cari rental..."
              className="flex-1 border rounded px-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="flex-1 border rounded px-3 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
              }}
              className="px-6 py-2 bg-gradient-to-r from-gray-400 to-blue-400 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="pt-32 pb-20 px-8 bg-white">
        {loading && (
          <div className="text-center text-gray-500">
            Loading rental packages...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && filteredRentals.length === 0 && (
          <div className="text-center text-gray-500">
            Tidak ada rental ditemukan.
          </div>
        )}

        {!loading && filteredRentals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition hover:scale-[1.02]"
              >
                <img
                  src={getRentalImage(rental)}
                  alt={rental.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold mb-1">
                    {rental.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {rental.short_description ||
                      rental.description?.substring(0, 80)}
                    ...
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Start from</p>
                      <p className="font-semibold">
                        Rp{" "}
                        {(rental.price_per_day ?? rental.price)?.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <Link
                      to={`/rental-packages/${rental.slug}`}
                      className="px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 text-white rounded text-sm"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </FrontendLayout>
  );
}
