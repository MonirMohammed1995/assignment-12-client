import React, { useEffect, useState } from 'react';
import { Eye, Trash2, MessageCircleMore } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageAppliedApplication = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/applications`)
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to reject this application?',
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
            setApplications(prev =>
              prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app)
            );
          });
      }
    });
  };

  const handleFeedbackSubmit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/applications/${selectedApp._id}/feedback`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: feedbackText }),
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire('Success', 'Feedback submitted!', 'success');
        setSelectedApp(null);
        setFeedbackText('');
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
              <th>University</th>
              <th>User Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id}>
                <td>{index + 1}</td>
                <td>{app.scholarshipInfo?.university || 'N/A'}</td>
                <td>{app.userEmail || 'N/A'}</td>
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
                  <button
                    className="btn btn-sm btn-outline btn-info"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Eye className="w-4 h-4" /> Details
                  </button>

                  <button
                    className="btn btn-sm btn-outline btn-warning"
                    onClick={() => setSelectedApp(app)}
                  >
                    <MessageCircleMore className="w-4 h-4" /> Feedback
                  </button>

                  <button
  onClick={() => handleCancel(app._id)}
  className="btn btn-sm btn-outline btn-error"
  disabled={app.status === 'rejected'}
  title={app.status === 'rejected' ? 'Already rejected' : 'Reject application'}
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

      {/* ✅ Modal with details */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold mb-2">Application Details</h3>

            <img
              src={selectedApp.photo}
              alt="Applicant"
              className="w-28 h-28 rounded-full object-cover mx-auto"
            />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Name:</strong> {selectedApp.userEmail}</p>
              <p><strong>Phone:</strong> {selectedApp.phone}</p>
              <p><strong>Degree:</strong> {selectedApp.degree}</p>
              <p><strong>Gender:</strong> {selectedApp.gender}</p>
              <p><strong>Country:</strong> {selectedApp.country}</p>
              <p><strong>Study Gap:</strong> {selectedApp.studyGap}</p>
              <p><strong>SSC:</strong> {selectedApp.ssc}</p>
              <p><strong>HSC:</strong> {selectedApp.hsc}</p>
              <p><strong>University:</strong> {selectedApp.scholarshipInfo?.university}</p>
              <p><strong>Subject:</strong> {selectedApp.scholarshipInfo?.subject}</p>
              <p><strong>Category:</strong> {selectedApp.scholarshipInfo?.category}</p>
              <p><strong>Fee:</strong> ${selectedApp.scholarshipInfo?.fee}</p>
              <p><strong>Payment:</strong> {selectedApp.paymentStatus}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
            </div>

            {/* ✅ Feedback textarea */}
            <div>
              <label className="font-medium">Feedback:</label>
              <textarea
                className="textarea textarea-bordered w-full mt-1"
                rows="3"
                placeholder="Write feedback here..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="btn btn-sm btn-outline"
              >
                Close
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="btn btn-sm btn-primary"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppliedApplication;
