import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProvider';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      const api = import.meta.env.VITE_API_URL;
      fetch(`${api}applications?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setApplications(data);
          setLoading(false);
        });
    }
  }, [user]);

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const api = import.meta.env.VITE_API_URL;
        fetch(`${api}/applications/${id}`, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Canceled!', 'Your application has been canceled.', 'success');
            setApplications(applications.filter(app => app._id !== id));
          });
      }
    });
  };

  const handleEdit = (application) => {
    if (application.status !== 'pending') {
      return Swal.fire('Cannot Edit', 'This application is already processing or completed.', 'error');
    }
    navigate(`/dashboard/edit-application/${application._id}`);
  };

  const handleReview = (application) => {
    Swal.fire({
      title: 'Write your review',
      input: 'text',
      inputLabel: 'Your Review',
      inputPlaceholder: 'Enter your review here...',
      showCancelButton: true,
      confirmButtonText: 'Submit',
    }).then(result => {
      if (result.isConfirmed && result.value) {
        // You would POST this to /reviews or similar
        Swal.fire('Thanks!', 'Your review has been submitted.', 'success');
      }
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading applications...</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">You haven't applied for any scholarships yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="p-3 border">University</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Degree</th>
              <th className="p-3 border">Fees</th>
              <th className="p-3 border">Service</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} className="hover:bg-indigo-50 transition">
                <td className="p-3 border">{app.universityName || 'N/A'}</td>
                <td className="p-3 border">{app.universityAddress || 'N/A'}</td>
                <td className="p-3 border">{app.subjectCategory || 'N/A'}</td>
                <td className="p-3 border">{app.appliedDegree || 'N/A'}</td>
                <td className="p-3 border">${app.applicationFee || 0}</td>
                <td className="p-3 border">${app.serviceCharge || 0}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      app.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : app.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-3 border text-center space-x-2">
                  <Link
                    to={`/scholarship/${app.scholarshipId}`}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleEdit(app)}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReview(app)}
                    className="text-sm px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;