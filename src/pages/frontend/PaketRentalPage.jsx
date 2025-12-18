// src/pages/PaketRentalPage.jsx
import React from "react";
import FrontendLayout from "../../layouts/FrontendLayout";

export default function Rental() {
  const paketList = [
    { id: 1, title: "Hiace", price: "Rp. 220.000", img: "/assets/appimages/homeimage/hiace.png" },
    { id: 2, title: "Yamaha Mio Z Suzuki", price: "Rp. 120.000", img: "/assets/appimages/webimage/Yamaha-Mio-Z.jpg" },
    { id: 3, title: "N/A", price: "Rp. 340.000", img: "/assets/appimages/tour3.jpg" },
    { id: 4, title: "N/A", price: "Rp. 410.000", img: "/assets/appimages/tour4.jpg" },
    { id: 5, title: "N/A", price: "Rp. 520.000", img: "/assets/appimages/tour5.jpg" },
    { id: 6, title: "N/A", price: "Rp. 611.000", img: "/assets/appimages/tour6.jpg" },
  ];

  return (
    <FrontendLayout title="Rental Mobil/Motor">
      {/* Header Section */}
      <div className="relative">
        <img
          src="/assets/appimages/webimage/cars.jpg"
          alt="Rental Mobil/Motor"
          className="w-full h-[400px] object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold">RENTAL MOBIL/MOTOR</h1>
        </div>

        {/* Search Box */}
        <div className="absolute bottom-[-40px] w-full flex justify-center">
          <div className="bg-white shadow-md p-4 rounded-lg flex gap-4 w-[80%] max-w-3xl">
            <input
              type="text"
              placeholder="Cari disini..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
            />
            <select className="flex-1 border rounded px-3 py-2 focus:outline-none">
              <option value="">Pilih Kategori</option>
              <option value="day1">Hiace</option>
              <option value="day2">Yamaha Mio</option>
              <option value="day3">Suzuki R3</option>
            </select>
            <button className="px-6 py-2 rounded bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="pt-32 pb-20 px-8 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {paketList.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img src={item.img} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">Start from</p>
                <p className="text-base font-semibold text-gray-800">{item.price}</p>
                <button className="mt-3 px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 hover:from-blue-400 hover:to-gray-400 rounded text-sm">
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </FrontendLayout>
  );
}