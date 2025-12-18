import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import BackendLayout from "../../../layouts/BackendLayout";
import { formatRupiah, onlyNumber } from "../../../utils/formatRupiah";

const RentalCreate = () => {
  const navigate = useNavigate();

  // Ubah state sesuai dengan field RentalPackageController (price_per_day, type, brand, model, plate_number)
  const [formData, setFormData] = useState({
    name: "",
    type: "motor", // Default value, bisa diubah
    brand: "",
    model: "",
    plate_number: "",
    description: "",
    includes: "",
    excludes: "",
    price_per_day: "", // Ganti dari price_per_person
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

  // Mengubah nama fungsi dan field untuk harga per hari
  const handlePriceChange = (e) => {
    const rawValue = onlyNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      price_per_day: rawValue, // Menggunakan price_per_day
    }));
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi sederhana sebelum kirim
    if (!formData.name || !formData.type || !formData.brand || !formData.model || !formData.plate_number || 
        !formData.description || !formData.includes || !formData.excludes || !formData.price_per_day) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("type", formData.type);
        payload.append("brand", formData.brand);
        payload.append("model", formData.model);
        payload.append("plate_number", formData.plate_number);
        payload.append("description", formData.description);
        payload.append("includes", formData.includes);
        payload.append("excludes", formData.excludes);
        payload.append("price_per_day", formData.price_per_day); // Menggunakan price_per_day
        
        payload.append("is_available", formData.is_available ? 1 : 0);

        images.forEach((file) => {
            payload.append("image[]", file);
        });

        const response = await fetch(
            "http://localhost:8000/api/admin/rentals", // Ubah endpoint ke rentals
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
            // Periksa jika ada error validasi dari backend
            let errorMessage = result.message || "Failed to create rental package";
            if (result.errors) {
                // Ambil pesan error pertama dari objek errors
                errorMessage = Object.values(result.errors)[0][0] || errorMessage;
            }
            throw new Error(errorMessage);
        }

        navigate("/admin/rentals"); // Redirect ke halaman rentals

    } catch (err) {
        console.error("Error creating rental:", err);
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
            <h1 className="text-2xl font-bold">Create New Rental Package</h1>
            <p className="text-gray-600">
              Add a new vehicle for rental
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/rentals")}
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

            {/* BARIS 1: Nama dan Tipe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Rental Name *</label>
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
                <label className="block mb-2">Vehicle Type *</label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value="motor">Motorcycle</option>
                    <option value="mobil">Car</option>
                </select>
              </div>
            </div>

            {/* BARIS 2: Brand, Model, dan Plat Nomor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Plate Number *</label>
                <input
                  type="text"
                  name="plate_number"
                  required
                  value={formData.plate_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* BARIS 3: Harga per Hari dan Gambar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Price per Day *</label>
                <input
                  type="text"
                  required
                  // Menggunakan value dari state untuk menampilkan format Rupiah
                  value={formatRupiah(formData.price_per_day)}
                  onChange={handlePriceChange} // Menggunakan fungsi handlePriceChange
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Images (Max 6)</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            
            {/* Field Textarea: Description, Includes, Excludes */}
            {["description", "includes", "excludes"].map((field) => (
              <div key={field}>
                <label className="block mb-2 capitalize">{field.replace('_', ' ')} *</label>
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

            {/* Availability */}
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
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            {/* Tombol Aksi */}
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
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {loading ? "Saving..." : "Create Rental"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </BackendLayout>
  );
};

export default RentalCreate;