  import { useState, useEffect } from "react";

export default function BookingForm({
  packageType,
  packageId,
  packageName,
  price,
  minPersons = 1
}) {
  // ===== SAFETY GUARD =====
  if (!packageType || !packageId) {
    return (
      <div className="mt-10 p-6 bg-white rounded-xl shadow text-gray-500">
        Booking form is unavailable.
      </div>
    );
  }

  const safePrice = Number(price || 0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    persons: minPersons
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      persons: minPersons
    }));
  }, [minPersons]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      package_type: packageType,
      package_id: packageId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      persons: Number(form.persons),
      price: safePrice
    };

    console.log("BOOKING:", payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 p-6 bg-white rounded-xl shadow"
    >
      <h3 className="text-xl font-semibold mb-2">
        Booking Paket: {packageName}
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Harga mulai dari{" "}
        <span className="font-semibold">
          Rp {safePrice.toLocaleString("id-ID")}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="border rounded px-3 py-2"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded px-3 py-2"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="No HP"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="persons"
          min={minPersons}
          value={form.persons}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Book Now
      </button>
    </form>
  );
}
