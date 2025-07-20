import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageScholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState({});
  const api = import.meta.env.VITE_API_URL;

  // Fetch all scholarships
  useEffect(() => {
    fetch(`${api}/scholarships`)
      .then(res => res.json())
      .then(data => setScholarships(data))
      .catch(err => console.error('Failed to fetch scholarships:', err));
  }, [api]);

  // Delete scholarship
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this scholarship!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/scholarships/${id}`, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Deleted!', 'Scholarship has been deleted.', 'success');
            setScholarships(prev => prev.filter(item => item._id !== id));
          });
      }
    });
  };

  // Update scholarship
  const handleUpdate = () => {
    fetch(`${api}/scholarships/${editData._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire('Updated!', 'Scholarship updated successfully.', 'success');
        setSelected(null);
        setEditData({});
        fetch(`${api}/scholarships`)
          .then(res => res.json())
          .then(data => setScholarships(data));
      });
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Scholarships (Admin)</h2>

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="table w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Scholarship</th>
              <th className="p-3 text-left">University</th>
              <th className="p-3 text-left">Degree</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship) => (
              <tr key={scholarship._id} className="border-t">
                <td className="p-3">{scholarship.scholarshipName}</td>
                <td className="p-3">{scholarship.universityName}</td>
                <td className="p-3">{scholarship.degree}</td>
                <td className="p-3">${scholarship.applicationFees}</td>
                <td className="p-3 flex items-center gap-3">
                  <button onClick={() => setSelected(scholarship)} className="text-blue-600 hover:text-blue-800">
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setEditData(scholarship);
                      setSelected('edit');
                    }}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(scholarship._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selected && selected !== 'edit' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Scholarship Details</h3>
            <p><strong>Name:</strong> {selected.scholarshipName}</p>
            <p><strong>University:</strong> {selected.universityName}</p>
            <p><strong>Degree:</strong> {selected.degree}</p>
            <p><strong>Category:</strong> {selected.scholarshipCategory}</p>
            <p><strong>Deadline:</strong> {selected.deadline}</p>
            <p><strong>Subject:</strong> {selected.subjectCategory}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selected === 'edit' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Scholarship</h3>
            <input
              className="input input-bordered w-full mb-3"
              value={editData.scholarshipName || ''}
              onChange={(e) => setEditData({ ...editData, scholarshipName: e.target.value })}
              placeholder="Scholarship Name"
            />
            <input
              className="input input-bordered w-full mb-3"
              value={editData.universityName || ''}
              onChange={(e) => setEditData({ ...editData, universityName: e.target.value })}
              placeholder="University Name"
            />
            <select
              className="input input-bordered w-full mb-3"
              value={editData.degree || ''}
              onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
            >
              <option value="">Select Degree</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Masters">Masters</option>
            </select>
            <input
              className="input input-bordered w-full mb-3"
              value={editData.applicationFees || ''}
              onChange={(e) => setEditData({ ...editData, applicationFees: e.target.value })}
              placeholder="Application Fee"
              type="number"
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleUpdate} className="btn btn-primary">Update</button>
              <button onClick={() => setSelected(null)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarship;
