import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2, Info, MessageSquare } from 'lucide-react';

const AllAppliedScholarships = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details' | 'feedback'
  const [feedbackText, setFeedbackText] = useState('');

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${api}/applications`)
      .then((res) => setApplications(res.data))
      .catch((err) => console.error('Error fetching applications:', err));
  }, []);

  const openModal = (app, type) => {
    setSelectedApp(app);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setModalType(null);
    setFeedbackText('');
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to reject this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/applications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' }),
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire('Rejected!', 'Application has been rejected.', 'success');
            setApplications((prev) =>
              prev.map((app) =>
                app._id === id ? { ...app, status: 'rejected' } : app
              )
            );
          })
          .catch((err) => {
            Swal.fire('Error', 'Something went wrong.', 'error');
            console.error(err);
          });
      }
    });
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      return Swal.fire('Oops!', 'Feedback cannot be empty.', 'warning');
    }

    fetch(`${api}/applications/${selectedApp._id}/feedback`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: feedbackText }),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire('Success', 'Feedback submitted!', 'success');
        closeModal();
      })
      .catch((err) => {
        Swal.fire('Error', 'Failed to submit feedback.', 'error');
        console.error(err);
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">All Applied Scholarships</h2>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="table w-full text-sm">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3">University</th>
              <th className="p-3">Degree</th>
              <th className="p-3">Type</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-indigo-50 transition">
                <td className="p-2">{app.scholarshipInfo?.university || 'N/A'}</td>
                <td className="p-2">{app.degree || 'N/A'}</td>
                <td className="p-2">{app.scholarshipInfo?.category || 'N/A'}</td>
                <td className="p-2 break-words">{app.userEmail || 'N/A'}</td>
                <td className="p-2">
                  <span
                    className={`badge text-white px-3 py-1 rounded-full ${
                      app.status === 'pending'
                        ? 'bg-yellow-500'
                        : app.status === 'processing'
                        ? 'bg-blue-500'
                        : app.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-2 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => openModal(app, 'details')}
                    className="btn btn-sm btn-outline btn-info flex items-center gap-1 hover:scale-105 transition"
                  >
                    <Info className="w-4 h-4" /> Details
                  </button>
                  <button
                    onClick={() => openModal(app, 'feedback')}
                    className="btn btn-sm btn-outline btn-warning flex items-center gap-1 hover:scale-105 transition"
                  >
                    <MessageSquare className="w-4 h-4" /> Feedback
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-1 hover:scale-105 transition"
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
          <div className="p-6 text-center text-gray-500">
            No applications found.
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && modalType === 'details' && (
        <dialog open className="modal modal-open">
          <div className="modal-box rounded-xl p-6">
            <h3 className="font-bold text-xl mb-4 text-indigo-700">Application Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>University:</strong> {selectedApp.scholarshipInfo?.university}</p>
              <p><strong>Degree:</strong> {selectedApp.degree}</p>
              <p><strong>Type:</strong> {selectedApp.scholarshipInfo?.category}</p>
              <p><strong>Email:</strong> {selectedApp.userEmail}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
            </div>
            <div className="modal-action mt-4">
              <button className="btn btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Feedback Modal */}
      {selectedApp && modalType === 'feedback' && (
        <dialog open className="modal modal-open">
          <div className="modal-box rounded-xl p-6">
            <h3 className="font-bold text-xl mb-4 text-indigo-700">Send Feedback</h3>
            <textarea
              className="textarea textarea-bordered w-full mt-1 focus:ring-2 focus:ring-indigo-500 transition"
              rows="4"
              placeholder="Write feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
            <div className="modal-action mt-4 flex gap-3">
              <button
                onClick={handleFeedbackSubmit}
                className="btn btn-success hover:scale-105 transition"
              >
                Submit Feedback
              </button>
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AllAppliedScholarships;
