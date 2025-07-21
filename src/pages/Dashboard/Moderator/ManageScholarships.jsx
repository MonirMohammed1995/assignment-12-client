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
      .then(data => setScholarships(data));
  }, [api]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/scholarships/${id}`, {
          method: 'DELETE',
        })
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Scholarships</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">University</th>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-left">Degree</th>
              <th className="p-2 text-left">Application Fee</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((sch) => (
              <tr key={sch._id} className="border-b">
                <td className="p-2">{sch.scholarshipName}</td>
                <td className="p-2">{sch.universityName}</td>
                <td className="p-2">{sch.subjectCategory}</td>
                <td className="p-2">{sch.degree}</td>
                <td className="p-2">${sch.applicationFees}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setSelected(sch)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setEditData(sch);
                      setSelected('edit');
                    }}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(sch._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && selected !== 'edit' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Scholarship Details</h3>
            <p><strong>Name:</strong> {selected.scholarshipName}</p>
            <p><strong>University:</strong> {selected.universityName}</p>
            <p><strong>Degree:</strong> {selected.degree}</p>
            <p><strong>Category:</strong> {selected.scholarshipCategory}</p>
            <p><strong>Deadline:</strong> {selected.deadline}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selected === 'edit' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Edit Scholarship</h3>
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
            <button onClick={handleEdit} className="btn btn-primary mr-2">Update</button>
            <button onClick={() => setSelected(null)} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarships;