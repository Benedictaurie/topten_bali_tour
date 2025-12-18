import React, { useEffect, useState } from "react";
import FrontendLayout from "../../layouts/FrontendLayout";
import { useUserActivity } from "../../hooks/useUserActivity";

export default function PaketActivityPage() {
  const {
    activities,
    loading,
    error,
    fetchAvailableActivities
  } = useUserActivity();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const IMAGE_BASE = "http://localhost:8000/storage/";

  const getActivityImage = (activity) => {
    if (activity?.images?.length > 0 && activity.images[0]?.image) {
      return IMAGE_BASE + activity.images[0].image;
    }
    return "/assets/appimages/webimage/default.jpg";
  };

  // Fetch activity saat page load
  useEffect(() => {
    fetchAvailableActivities();
  }, [fetchAvailableActivities]);

  // Filter search & category
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? act.category === categoryFilter
      : true;

    return matchesSearch && matchesCategory;
  });

  // ================== UI STATE ==================
  if (loading) {
    return (
      <FrontendLayout title="Activity">
        <div className="flex justify-center items-center h-64">
          <p>Loading activities...</p>
        </div>
      </FrontendLayout>
    );
  }

  if (error) {
    return (
      <FrontendLayout title="Activity">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchAvailableActivities}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </FrontendLayout>
    );
  }

  // ================== MAIN UI ==================
  return (
    <FrontendLayout title="Activity">
      {/* Header */}
      <div className="relative">
        <img
          src="/assets/appimages/webimage/rafting.jpg"
          alt="Activity"
          className="w-full h-[400px] object-cover brightness-50"
        />
        <div className="absolute inset-0 flex justify-center items-center text-white">
          <h1 className="text-4xl font-bold">ACTIVITY</h1>
        </div>

        {/* Search & Filter */}
        <div className="absolute bottom-[-40px] w-full flex justify-center">
          <div className="bg-white shadow-md p-4 rounded-lg flex gap-4 w-[80%] max-w-3xl">
            <input
              type="text"
              placeholder="Cari activity..."
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
              <option value="ATV">ATV</option>
              <option value="Swing">Swing</option>
              <option value="Water Sports">Water Sports</option>
              <option value="Rafting">Rafting</option>
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
        {filteredActivities.length === 0 ? (
          <div className="text-center text-gray-500">
            Tidak ada activity ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition hover:scale-[1.02]"
              >
                <img
                  src={getActivityImage(activity)}
                  alt={activity.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold mb-1">
                    {activity.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {activity.short_description ||
                      activity.description?.substring(0, 80)}
                    ...
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Start from</p>
                      <p className="font-semibold">
                        Rp{" "}
                        {activity.price?.toLocaleString("id-ID") || "0"}
                      </p>
                    </div>

                    <a
                      href={`/activities/${activity.slug}`}
                      className="px-4 py-2 bg-gradient-to-r from-gray-400 to-blue-400 text-white rounded text-sm"
                    >
                      Detail
                    </a>
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
