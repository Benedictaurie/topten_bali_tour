// src/pages/admin/activities/ActivityList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackendLayout from "../../../layouts/BackendLayout";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useActivity } from '../../../hooks/useActivity';
import { formatRupiah } from "../../../utils/formatRupiah";

const ActivityList = () => {
  const { activities, loading, error, fetchActivities, deleteActivity } = useActivity()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const success = await deleteActivity(id)
      if (success) {
        console.log('Activity deleted successfully')
      }
    }
  }

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && activities.length === 0) {
    return (
      <BackendLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2">
            <FiRefreshCw className="animate-spin" size={20} />
            <span>Loading activities...</span>
          </div>
        </div>
      </BackendLayout>
    )
  }

  return (
    <BackendLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Activity Packages</h1>
            <p className="text-gray-600">Manage your activity packages</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchActivities} // Langsung panggil fetchActivities
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiRefreshCw className="mr-2" size={18} />
              Refresh
            </button>
            <Link
              to="/admin/activities/create" // Sesuaikan path
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiPlus className="mr-2" size={18} />
              Add New Activity
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {/* Sesuaikan kolom untuk Activity */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price per person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Persons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration (Hrs)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatRupiah(activity.price_per_person)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.min_persons || 1} Person(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.duration_hours} Hours</div>
                    </td>
                    
                    {/* Status badge (sama seperti TourList) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.is_available ? (
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

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    
                    {/* Actions (Sama seperti TourList) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {/* Link View */}
{/*                         <Link
                          to={`/admin/activities/${activity.id}`} // Sesuaikan path view
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </Link> */}
                        
                        {/* Link Edit */}
                        <Link
                          to={`/admin/activities/edit/${activity.id}`} // Sesuaikan path edit
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Activity"
                        >
                          <FiEdit size={18} />
                        </Link>
                        
                        {/* Button Delete */}
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Activity"
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

        {filteredActivities.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No activities found. <Link to="/admin/activities/create" className="text-blue-600 hover:underline">Create one now</Link>
          </div>
        )}
      </div>
    </BackendLayout>
  )
}

export default ActivityList