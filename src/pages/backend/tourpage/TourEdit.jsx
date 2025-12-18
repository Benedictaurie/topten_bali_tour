import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import BackendLayout from "../../../layouts/BackendLayout";
import { formatRupiah, onlyNumber } from "../../../utils/formatRupiah";


const TourEdit = () => {
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
    duration_days: "",
    is_available: true,
  });

  const [images, setImages] = useState([]); // new images
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     FETCH DETAIL
  ======================= */
  useEffect(() => {
    fetchTourDetail();
  }, [id]);

  const fetchTourDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/admin/tours/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Failed to fetch tour detail");
      }

      const tour = result.data;

      setFormData({
        name: tour.name,
        description: tour.description,
        itinerary: tour.itinerary,
        includes: tour.includes,
        excludes: tour.excludes,
        price_per_person: tour.price_per_person,
        min_persons: tour.min_persons,
        duration_days: tour.duration_days,
        is_available: tour.is_available,
      });

      setExistingImages(tour.images || []);
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
      payload.append("_method", "PUT"); // IMPORTANT
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("itinerary", formData.itinerary);
      payload.append("includes", formData.includes);
      payload.append("excludes", formData.excludes);
      payload.append("price_per_person", formData.price_per_person);
      payload.append("min_persons", formData.min_persons);
      payload.append("duration_days", formData.duration_days);
      payload.append("is_available", formData.is_available ? 1 : 0);

      images.forEach((file) => {
        payload.append("image[]", file);
      });

      const res = await fetch(
        `http://localhost:8000/api/admin/tours/${id}`,
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
        throw new Error(result.message || "Update failed");
      }

      navigate("/admin/tours");
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

  const handlePriceChange = (e) => {
    const rawValue = onlyNumber(e.target.value);

    setFormData((prev) => ({
      ...prev,
      price_per_person: rawValue,
    }));
  };

  return (
    <BackendLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit Tour</h1>
            <p className="text-gray-600">Update tour package</p>
          </div>
          <button
            onClick={() => navigate("/admin/tours")}
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

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Tour Name *
                </label>
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
                <label className="block mb-2 font-medium">
                  Price per Person (IDR) *
                </label>
                <input
                  type="text"
                  name="price_per_person"
                  value={formatRupiah(formData.price_per_person)}
                  onChange={handlePriceChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Minimum Persons *
                </label>
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
                <label className="block mb-2 font-medium">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Tour Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            {/* Itinerary */}
            <div>
              <label className="block mb-2 font-medium">
                Itinerary *
              </label>
              <textarea
                name="itinerary"
                value={formData.itinerary}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            {/* Includes */}
            <div>
              <label className="block mb-2 font-medium">
                Includes *
              </label>
              <textarea
                name="includes"
                value={formData.includes}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            {/* Excludes */}
            <div>
              <label className="block mb-2 font-medium">
                Excludes *
              </label>
              <textarea
                name="excludes"
                value={formData.excludes}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block mb-2 font-medium">
                Availability
              </label>
              <select
                name="is_available"
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

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block mb-2 font-medium">
                  Current Images
                </label>
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

export default TourEdit;
