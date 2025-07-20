import React, { useEffect, useState } from 'react';
import { Eye, Trash2, MessageCircleMore } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageAppliedApplication = () => {
  const [applications, setApplications] = useState([]);

  // Fetch all applications
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/applications`)
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to reject this application?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject it!',
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' }),
        })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Rejected!', 'Application has been rejected.', 'success');
            setApplications(prev => prev.map(app =>
              app._id === id ? { ...app, status: 'rejected' } : app
            ));
          });
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage All Applied Applications</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Scholarship</th>
              <th>User Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id}>
                <td>{index + 1}</td>
                <td>{app.scholarshipName}</td>
                <td>{app.userEmail}</td>
                <td>
                  <span className={`badge ${
                    app.status === 'pending' ? 'badge-warning' :
                    app.status === 'processing' ? 'badge-info' :
                    app.status === 'completed' ? 'badge-success' :
                    app.status === 'rejected' ? 'badge-error' : ''
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="flex items-center gap-2 justify-center">
                  <button className="btn btn-sm btn-outline btn-info">
                    <Eye className="w-4 h-4" /> Details
                  </button>
                  <button className="btn btn-sm btn-outline btn-warning">
                    <MessageCircleMore className="w-4 h-4" /> Feedback
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="btn btn-sm btn-outline btn-error"
                    disabled={app.status === 'rejected'}
                  >
                    <Trash2 className="w-4 h-4" /> Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div className="p-4 text-center text-gray-500">No applications found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageAppliedApplication;
