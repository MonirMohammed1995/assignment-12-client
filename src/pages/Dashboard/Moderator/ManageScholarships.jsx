import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState({});
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${api}/scholarships`)
      .then(res => res.json())
      .then(data => setScholarships(data))
      .catch(err => console.error(err));
  }, [api]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/scholarships/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Deleted!', 'Scholarship has been deleted.', 'success');
            setScholarships(prev => prev.filter(s => s._id !== id));
          });
      }
    });
  };

  const handleEdit = () => {
    fetch(`${api}/scholarships/${editData._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire('Updated!', 'Scholarship has been updated.', 'success');
        setSelected(null);
        setEditData({});
        fetch(`${api}/scholarships`)
          .then(res => res.json())
          .then(data => setScholarships(data));
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Manage Scholarships</h2>

      <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">University</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Degree</th>
              <th className="px-4 py-3 text-left">Application Fee</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {scholarships.map((sch) => (
              <tr key={sch._id} className="hover:bg-indigo-50 transition">
                <td className="px-4 py-2">{sch.scholarshipName}</td>
                <td className="px-4 py-2">{sch.universityName}</td>
                <td className="px-4 py-2">{sch.subjectCategory}</td>
                <td className="px-4 py-2">{sch.degree}</td>
                <td className="px-4 py-2">${sch.applicationFees}</td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() => setSelected(sch)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => { setEditData(sch); setSelected('edit'); }}
                    className="text-yellow-600 hover:text-yellow-800 transition"
                    title="Edit Scholarship"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(sch._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete Scholarship"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {scholarships.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No scholarships found.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && selected !== 'edit' && (
        <div className="fixed inset-0 hero hero-overlay flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Scholarship Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {selected.scholarshipName}</p>
              <p><strong>University:</strong> {selected.universityName}</p>
              <p><strong>Degree:</strong> {selected.degree}</p>
              <p><strong>Category:</strong> {selected.scholarshipCategory}</p>
              <p><strong>Deadline:</strong> {selected.deadline}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelected(null)}
                className="btn btn-outline btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selected === 'edit' && (
        <div className="fixed inset-0 hero hero-overlay flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Edit Scholarship</h3>
            <div className="space-y-3">
              <input
                className="input input-bordered w-full"
                value={editData.scholarshipName || ''}
                onChange={(e) => setEditData({ ...editData, scholarshipName: e.target.value })}
                placeholder="Scholarship Name"
              />
              <input
                className="input input-bordered w-full"
                value={editData.universityName || ''}
                onChange={(e) => setEditData({ ...editData, universityName: e.target.value })}
                placeholder="University Name"
              />
              <select
                className="input input-bordered w-full"
                value={editData.degree || ''}
                onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
              >
                <option value="">Select Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Masters">Masters</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleEdit} className="btn btn-primary">Update</button>
              <button onClick={() => setSelected(null)} className="btn btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarships;
