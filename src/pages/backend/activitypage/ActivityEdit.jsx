// src/pages/admin/activities/ActivityEdit.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import BackendLayout from "../../../layouts/BackendLayout";
import { formatRupiah, onlyNumber } from "../../../utils/formatRupiah";

const ActivityEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [images, setImages] = useState([]); // image baru
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     FETCH DETAIL ACTIVITY
  ======================= */
  useEffect(() => {
    fetchActivityDetail();
  }, [id]);

  const fetchActivityDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/admin/activities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Failed to fetch activity detail");
      }

      const activity = result.data;

      setFormData({
        name: activity.name,
        description: activity.description,
        itinerary: activity.itinerary,
        includes: activity.includes,
        excludes: activity.excludes,
        price_per_person: activity.price_per_person,
        min_persons: activity.min_persons,
        duration_hours: activity.duration_hours,
        is_available: activity.is_available,
      });

      setExistingImages(activity.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     HANDLERS
  ======================= */
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

  /* =======================
     SUBMIT UPDATE
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = new FormData();
      payload.append("_method", "PUT"); // spoof PUT
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

      const res = await fetch(
        `http://localhost:8000/api/admin/activities/${id}`,
        {
          method: "POST", // spoof PUT
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Update activity failed");
      }

      navigate("/admin/activities");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     UI
  ======================= */
  if (loading) {
    return (
      <BackendLayout>
        <div className="text-center py-20">Loading...</div>
      </BackendLayout>
    );
  }

  return (
    <BackendLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit Activity</h1>
            <p className="text-gray-600">Update activity package</p>
          </div>

          <button
            onClick={() => navigate("/admin/activities")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiX className="mr-2" /> Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow p-6 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BARIS 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Activity Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Price per Person *</label>
                <input
                  type="text"
                  value={formatRupiah(formData.price_per_person)}
                  onChange={handlePriceChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Min Persons *</label>
                <input
                  type="number"
                  name="min_persons"
                  value={formData.min_persons}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Duration (Hours) *</label>
                <input
                  type="number"
                  name="duration_hours"
                  value={formData.duration_hours}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Activity Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* TEXTAREA */}
            {["description", "itinerary", "includes", "excludes"].map((field) => (
              <div key={field}>
                <label className="block mb-2 capitalize">{field} *</label>
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
            ))}

            {/* AVAILABILITY */}
            <div>
              <label className="block mb-2">Availability</label>
              <select
                value={formData.is_available}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_available: e.target.value === "true",
                  }))
                }
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
              <div>
                <label className="block mb-2">Current Images</label>
                <div className="flex gap-3">
                  {existingImages.map((img) => (
                    <img
                      key={img.id}
                      src={`http://localhost:8000/storage/${img.image}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* BUTTON */}
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
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <FiSave className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </BackendLayout>
  );
};

export default ActivityEdit;
