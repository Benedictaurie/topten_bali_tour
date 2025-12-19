// src/pages/admin/activities/ActivityCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import BackendLayout from "../../../layouts/BackendLayout";
import { formatRupiah, onlyNumber } from "../../../utils/formatRupiah";

const ActivityCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    itinerary: "",
    includes: "",
    excludes: "",
    price_per_person: "",
    min_persons: "",
    duration_hours: "",
    is_available: true,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePriceChange = (e) => {
    const rawValue = onlyNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      price_per_person: rawValue,
    }));
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
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
        payload.append("duration_hours", formData.duration_hours);
        
        payload.append("is_available", formData.is_available ? 1 : 0);

        images.forEach((file) => {
            payload.append("image[]", file);
        });

        const response = await fetch(
            "http://localhost:8000/api/admin/activities", 
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
                result.message || "Failed to create activity package"
            );
        }

        navigate("/admin/activities");

    } catch (err) {
        console.error("Error creating activity:", err);
        setError(err.message || "An unknown error occurred.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <BackendLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Create New Activity</h1>
            <p className="text-gray-600">
              Add a new activity package
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/activities")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiX className="mr-2" /> Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow p-6 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Activity Name *</label>
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
                <label className="block mb-2">Price per Person *</label>
                <input
                  type="text"
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
                <label className="block mb-2">Duration (Hours) *</label>
                <input
                  type="number"
                  name="duration_hours"
                  required
                  value={formData.duration_hours}
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

            {["description", "itinerary", "includes", "excludes"].map((field) => (
              <div key={field}>
                <label className="block mb-2 capitalize">{field} *</label>
                <textarea
                  name={field}
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="4"
                />
              </div>
            ))}

            <div>
              <label className="block mb-2">Availability</label>
              <select
                value={formData.is_available}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    // Pastikan nilai disimpan sebagai boolean, 
                    // karena konversi ke 1/0 dilakukan di handleSubmit
                    is_available: e.target.value === "true", 
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/activities")}
                className="px-6 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <FiSave className="mr-2" />
                {loading ? "Saving..." : "Create Activity"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </BackendLayout>
  );
};

export default ActivityCreate;