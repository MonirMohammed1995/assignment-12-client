import React, { useEffect, useState } from "react";
import { Eye, Trash2, MessageCircleMore } from "lucide-react";
import Swal from "sweetalert2";

const ManageAppliedApplication = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    let url = `${import.meta.env.VITE_API_URL}/applications`;
    if (sortOption) {
      const [sortBy, order] = sortOption.split("-");
      url += `?sortBy=${sortBy}&order=${order}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setApplications(data));
  }, [sortOption]);

  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected" }),
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire("Rejected!", "Application has been rejected.", "success");
            setApplications((prev) =>
              prev.map((app) => (app._id === id ? { ...app, status: "rejected" } : app))
            );
          });
      }
    });
  };

  const handleFeedbackSubmit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/applications/${selectedApp._id}/feedback`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback: feedbackText }),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire("Success", "Feedback submitted!", "success");
        setSelectedApp(null);
        setFeedbackText("");
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
        Manage Applied Applications
      </h2>

      {/* Sorting Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          className="select select-bordered w-72 bg-white shadow-sm rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="createdAt-asc">Applied Date (Oldest)</option>
          <option value="createdAt-desc">Applied Date (Newest)</option>
          <option value="scholarshipInfo.deadline-asc">Deadline (Earliest)</option>
          <option value="scholarshipInfo.deadline-desc">Deadline (Latest)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">User Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app, index) => (
              <tr
                key={app._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{app.scholarshipInfo?.university || 'N/A'}</td>
                <td className="px-4 py-3">{app.userEmail || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      app.status === 'pending' ? 'badge-warning' :
                      app.status === 'processing' ? 'badge-info' :
                      app.status === 'completed' ? 'badge-success' :
                      app.status === 'rejected' ? 'badge-error' : ''
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="flex items-center justify-center gap-2 px-4 py-3">
                  <button
                    className="btn btn-sm btn-outline btn-info flex items-center gap-1"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Eye className="w-4 h-4" /> Details
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-warning flex items-center gap-1"
                    onClick={() => setSelectedApp(app)}
                  >
                    <MessageCircleMore className="w-4 h-4" /> Feedback
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-1"
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

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-indigo-700 text-center">
              Application Details
            </h3>

            <img
              src={selectedApp.photo}
              alt="Applicant"
              className="w-28 h-28 rounded-full object-cover mx-auto"
            />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Email:</strong> {selectedApp.userEmail}</p>
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

            <div>
              <label className="font-medium">Feedback:</label>
              <textarea
                className="textarea textarea-bordered w-full mt-1 rounded-lg focus:ring-2 focus:ring-indigo-500 border-none shadow-sm"
                rows="3"
                placeholder="Write feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
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
