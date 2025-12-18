// RentalList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BackendLayout from "../../../layouts/BackendLayout"
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiRefreshCw } from 'react-icons/fi'
import { useRental } from '../../../hooks/useRental'
import { formatRupiah } from "../../../utils/formatRupiah"

const RentalList = () => {
  const { rentals, loading, error, fetchRentals, deleteRental } = useRental()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRentals()
  }, [fetchRentals])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      const success = await deleteRental(id)
      if (success) {
        console.log('Rental deleted successfully')
      }
    }
  }
  
  const filteredRentals = rentals.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && rentals.length === 0) {
    return (
      <BackendLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2">
            <FiRefreshCw className="animate-spin" size={20} />
            <span>Loading rentals...</span>
          </div>
        </div>
      </BackendLayout>
    )
  }

  return (
    <BackendLayout>
      <div className="space-y-6">

        {/* Page Header - Disamakan dengan TourList */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rental Packages</h1>
            <p className="text-gray-600">Manage your rental packages</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={fetchRentals} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiRefreshCw className="mr-2" size={18} /> 
              Refresh
            </button>
            <Link 
              to="/admin/rentals/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiPlus className="mr-2" size={18} /> 
              Add New Rental
            </Link>
          </div>
        </div>

        {/* Error Message (Tambahkan jika ada error) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}


        {/* Search and Filters - Disamakan dengan TourList */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search rentals (Name, Brand, or Model)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>


        {/* Table - Disamakan dengan TourList */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Name","Type", "Brand", "Model", "Plate", "Price/Day", "Availability", "Created At", "Actions"]
                    .map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRentals.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">

                    {/* NAME */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {r.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.plate_number}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatRupiah(r.price_per_day)}</div>
                    </td>

                    {/* Availability badge - Disamakan dengan TourList */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.is_available ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          bg-green-100 text-green-800">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          bg-red-100 text-red-800">
                          Not Available
                        </span>
                      )}
                    </td>

                    {/* Created At - Format Tanggal Disamakan */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(r.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* Actions - Disamakan dengan TourList */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/admin/rentals/${r.id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </Link>

                        <Link
                          to={`/admin/rentals/edit/${r.id}`}
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Rental"
                        >
                          <FiEdit size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Rental"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRentals.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No rentals found. <Link to="/admin/rentals/create" className="text-blue-600 hover:underline">Create one now</Link>
          </div>
        )}

      </div>
    </BackendLayout>
  )
}

export default RentalList