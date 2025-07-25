import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AllAppliedScholarships = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details' | 'feedback'
  const [feedback, setFeedback] = useState('');

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${api}/applications`)
      .then(res => setApplications(res.data))
      .catch(err => console.error('Error fetching applications:', err));
  }, []);

  const openModal = (app, type) => {
    setSelectedApp(app);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setModalType(null);
    setFeedback('');
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this application?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.patch(`${api}/applications/cancel/${id}`, { status: 'rejected' })
          .then(() => {
            Swal.fire('Cancelled!', 'Application has been rejected.', 'success');
            setApplications(apps =>
              apps.map(app => app._id === id ? { ...app, status: 'rejected' } : app)
            );
          })
          .catch(err => {
            Swal.fire('Error', 'Failed to cancel application.', 'error');
            console.error(err);
          });
      }
    });
  };

  const handleFeedback = () => {
    if (!feedback.trim()) return Swal.fire('Oops!', 'Feedback cannot be empty.', 'warning');

    axios.patch(`${api}/applications/feedback/${selectedApp._id}`, { feedback })
      .then(() => {
        Swal.fire('Success!', 'Feedback submitted successfully.', 'success');
        closeModal();
      })
      .catch(err => {
        Swal.fire('Error', 'Failed to send feedback.', 'error');
        console.error(err);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Applied Scholarships</h2>

      <div className="overflow-x-auto border rounded-lg shadow bg-white">
        <table className="table w-full">
          <thead className="bg-base-200 text-sm text-gray-700">
            <tr>
              <th>University</th>
              <th>Degree</th>
              <th>Type</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.scholarshipInfo?.university || 'N/A'}</td>
                <td>{app.degree || 'N/A'}</td>
                <td>{app.scholarshipInfo?.category || 'N/A'}</td>
                <td>{app.userEmail || 'N/A'}</td>
                <td>
                  <span className={`badge text-white ${
                    app.status === 'pending' ? 'bg-yellow-500' :
                    app.status === 'processing' ? 'bg-blue-500' :
                    app.status === 'completed' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => openModal(app, 'details')}
                    className="btn btn-sm btn-outline btn-info"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => openModal(app, 'feedback')}
                    className="btn btn-sm btn-outline btn-warning"
                  >
                    Feedback
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    disabled={app.status === 'rejected'}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div className="p-6 text-center text-gray-500">No applications found.</div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && modalType === 'details' && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Application Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>University:</strong> {selectedApp.universityName}</p>
              <p><strong>Degree:</strong> {selectedApp.degree}</p>
              <p><strong>Type:</strong> {selectedApp.scholarshipCategory}</p>
              <p><strong>Email:</strong> {selectedApp.userEmail}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
            </div>
            <div className="modal-action mt-4">
              <button className="btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Feedback Modal */}
      {selectedApp && modalType === 'feedback' && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Send Feedback</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              rows="4"
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
            <div className="modal-action mt-4">
              <button className="btn btn-primary" onClick={handleFeedback}>Submit</button>
              <button className="btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AllAppliedScholarships;
