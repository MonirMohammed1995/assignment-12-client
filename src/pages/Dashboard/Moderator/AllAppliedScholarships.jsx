import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AllAppliedScholarships = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState('');

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${api}/applications`)
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this application?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.patch(`${api}/applications/cancel/${id}`, { status: 'rejected' })
          .then(() => {
            Swal.fire('Cancelled!', 'Application has been rejected.', 'success');
            setApplications(apps => apps.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
          })
          .catch(err => console.error(err));
      }
    });
  };

  const handleFeedback = () => {
    axios.patch(`${api}/applications/feedback/${selectedApp._id}`, { feedback })
      .then(() => {
        Swal.fire('Submitted!', 'Feedback has been sent.', 'success');
        setFeedback('');
        setSelectedApp(null);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-5">All Applied Scholarships</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>University</th>
              <th>Degree</th>
              <th>Scholarship Type</th>
              <th>Applicant Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.universityName}</td>
                <td>{app.degree}</td>
                <td>{app.scholarshipCategory}</td>
                <td>{app.userEmail}</td>
                <td>
                  <span className={`badge ${app.status === 'pending' ? 'bg-yellow-400' : app.status === 'processing' ? 'bg-blue-400' : app.status === 'completed' ? 'bg-green-500' : 'bg-red-400'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="space-x-2 text-center">
                  <button onClick={() => setSelectedApp(app)} className="btn btn-sm btn-info">Details</button>
                  <button onClick={() => setSelectedApp(app)} className="btn btn-sm btn-warning">Feedback</button>
                  <button onClick={() => handleCancel(app._id)} className="btn btn-sm btn-error">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <dialog id="details_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Application Details</h3>
            <p><strong>University:</strong> {selectedApp.universityName}</p>
            <p><strong>Degree:</strong> {selectedApp.degree}</p>
            <p><strong>Scholarship Type:</strong> {selectedApp.scholarshipCategory}</p>
            <p><strong>Email:</strong> {selectedApp.userEmail}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Feedback Modal */}
      {selectedApp && (
        <dialog id="feedback_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Give Feedback</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              rows="4"
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleFeedback}>Submit</button>
              <button className="btn" onClick={() => setSelectedApp(null)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AllAppliedScholarships;
