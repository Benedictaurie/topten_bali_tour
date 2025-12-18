import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import BackendLayout from "../../../layouts/BackendLayout";
import { formatRupiah, onlyNumber } from "../../../utils/formatRupiah";

const RentalEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    type: "motor",
    brand: "",
    model: "",
    plate_number: "",
    description: "",
    includes: "",
    excludes: "",
    price_per_day: "",
    is_available: true,
  });

  const [images, setImages] = useState([]); // image baru
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     FETCH DETAIL RENTAL
  ======================= */
  useEffect(() => {
    fetchRentalDetail();
  }, [id]);

  const fetchRentalDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/admin/rentals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Failed to fetch rental detail");
      }

      const rental = result.data;

      setFormData({
        name: rental.name,
        type: rental.type,
        brand: rental.brand,
        model: rental.model,
        plate_number: rental.plate_number,
        description: rental.description,
        includes: rental.includes,
        excludes: rental.excludes,
        price_per_day: rental.price_per_day,
        is_available: rental.is_available,
      });

      setExistingImages(rental.images || []);
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
      price_per_day: rawValue,
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
      payload.append("_method", "PUT");
      payload.append("name", formData.name);
      payload.append("type", formData.type);
      payload.append("brand", formData.brand);
      payload.append("model", formData.model);
      payload.append("plate_number", formData.plate_number);
      payload.append("description", formData.description);
      payload.append("includes", formData.includes);
      payload.append("excludes", formData.excludes);
      payload.append("price_per_day", formData.price_per_day);
      payload.append("is_available", formData.is_available ? 1 : 0);

      images.forEach((file) => {
        payload.append("image[]", file);
      });

      const res = await fetch(
        `http://localhost:8000/api/admin/rentals/${id}`,
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
        throw new Error(result.message || "Update rental failed");
      }

      navigate("/admin/rentals");
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
            <h1 className="text-2xl font-bold">Edit Rental</h1>
            <p className="text-gray-600">Update rental package</p>
          </div>

          <button
            onClick={() => navigate("/admin/rentals")}
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

            {/* Nama & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Rental Name *</label>
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
                <label className="block mb-2">Vehicle Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="motor">Motorcycle</option>
                  <option value="mobil">Car</option>
                </select>
              </div>
            </div>

            {/* Brand, Model, Plate */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                name="plate_number"
                placeholder="Plate Number"
                value={formData.plate_number}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
            </div>

            {/* Harga & Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                value={formatRupiah(formData.price_per_day)}
                onChange={handlePriceChange}
                className="border px-3 py-2 rounded-lg"
              />

              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="border px-3 py-2 rounded-lg"
              />
            </div>

            {/* Textarea */}
            {["description", "includes", "excludes"].map((field) => (
              <textarea
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                rows="3"
                className="w-full border px-3 py-2 rounded-lg"
              />
            ))}

            {/* Availability */}
            <select
              value={formData.is_available}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_available: e.target.value === "true",
                }))
              }
              className="border px-3 py-2 rounded-lg"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="flex gap-3">
                {existingImages.map((img) => (
                  <img
                    key={img.id}
                    src={`http://localhost:8000/storage/${img.image}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/rentals")}
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

export default RentalEdit;
