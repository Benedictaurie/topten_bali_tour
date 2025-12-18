import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import BackendLayout from "../../../layouts/BackendLayout";
import { formatRupiah, onlyNumber } from "../../../utils/formatRupiah";


const TourCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    itinerary: "",
    includes: "",
    excludes: "",
    price_per_person: "",
    min_persons: "",
    duration_days: "",
    is_available: true,
  });

  const [images, setImages] = useState([]); // Multiple files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]); // store as array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("itinerary", formData.itinerary);
      payload.append("includes", formData.includes);
      payload.append("excludes", formData.excludes);
      payload.append("price_per_person", formData.price_per_person);
      payload.append("min_persons", formData.min_persons);
      payload.append("duration_days", formData.duration_days);
      payload.append("is_available", formData.is_available ? 1 : 0);

      // multiple images
      images.forEach((file) => {
        payload.append("image[]", file);
      });

      const response = await fetch(
        "http://localhost:8000/api/admin/tours",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create tour package"
        );
      }

      navigate("/admin/tours");
    } catch (err) {
      console.error("Error creating tour:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e) => {
    const rawValue = onlyNumber(e.target.value);

    setFormData((prev) => ({
      ...prev,
      price_per_person: rawValue, // SIMPAN ANGKA
    }));
  };


  return (
    <BackendLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Create New Tour</h1>
            <p className="text-gray-600">
              Add a new tour package to your offerings
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/tours")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiX className="mr-2" size={16} /> Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow p-6 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2">Tour Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Price per Person (IDR) *</label>
                <input
                  type="text"
                  name="price_per_person"
                  required
                  value={formatRupiah(formData.price_per_person)}
                  onChange={handlePriceChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Min Persons *</label>
                <input
                  type="number"
                  name="min_persons"
                  required
                  value={formData.min_persons}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Duration (Days) *</label>
                <input
                  type="number"
                  name="duration_days"
                  required
                  value={formData.duration_days}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
              />
            </div>

            {/* Itinerary */}
            <div>
              <label className="block mb-2">Itinerary *</label>
              <textarea
                name="itinerary"
                required
                value={formData.itinerary}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
              />
            </div>

            {/* Includes */}
            <div>
              <label className="block mb-2">Includes *</label>
              <textarea
                name="includes"
                required
                value={formData.includes}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
              />
            </div>

            {/* Excludes */}
            <div>
              <label className="block mb-2">Excludes *</label>
              <textarea
                name="excludes"
                required
                value={formData.excludes}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block mb-2">Availability</label>
              <select
                name="is_available"
                value={formData.is_available}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_available: e.target.value === "true",
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/tours")}
                className="px-6 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <FiSave className="mr-2" size={16} />
                {loading ? "Creating..." : "Create Tour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackendLayout>
  );
};

export default TourCreate;
