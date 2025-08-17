import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageScholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState({});
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${api}/scholarships`)
      .then((res) => res.json())
      .then((data) => setScholarships(data))
      .catch((err) => console.error("Failed to fetch scholarships:", err));
  }, [api]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/scholarships/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then(() => {
            Swal.fire("Deleted!", "Scholarship deleted successfully.", "success");
            setScholarships((prev) => prev.filter((s) => s._id !== id));
          });
      }
    });
  };

  const handleUpdate = () => {
    fetch(`${api}/scholarships/${editData._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire("Updated!", "Scholarship updated successfully.", "success");
        setSelected(null);
        setEditData({});
        fetch(`${api}/scholarships`)
          .then((res) => res.json())
          .then((data) => setScholarships(data));
      });
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Manage Scholarships
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3">Scholarship</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Degree</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {scholarships.map((sch) => (
              <tr
                key={sch._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3">{sch.scholarshipName}</td>
                <td className="px-4 py-3">{sch.universityName}</td>
                <td className="px-4 py-3">{sch.degree}</td>
                <td className="px-4 py-3">${sch.applicationFees}</td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => setSelected(sch)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setEditData(sch);
                      setSelected("edit");
                    }}
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
      </div>

      {/* ===== View Modal ===== */}
      {selected && selected !== "edit" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-2xl font-semibold mb-4">{selected.scholarshipName}</h3>
            <p><strong>University:</strong> {selected.universityName}</p>
            <p><strong>Degree:</strong> {selected.degree}</p>
            <p><strong>Category:</strong> {selected.scholarshipCategory}</p>
            <p><strong>Subject:</strong> {selected.subjectCategory}</p>
            <p><strong>Deadline:</strong> {selected.deadline}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {selected === "edit" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Edit Scholarship</h3>

            <input
              type="text"
              className="w-full mb-3 input input-lg rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 border-none shadow-sm"
              placeholder="Scholarship Name"
              value={editData.scholarshipName || ""}
              onChange={(e) =>
                setEditData({ ...editData, scholarshipName: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full mb-3 input input-lg rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 border-none shadow-sm"
              placeholder="University Name"
              value={editData.universityName || ""}
              onChange={(e) =>
                setEditData({ ...editData, universityName: e.target.value })
              }
            />
            <select
              className="w-full mb-3 input input-lg rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 border-none shadow-sm"
              value={editData.degree || ""}
              onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
            >
              <option value="">Select Degree</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Masters">Masters</option>
            </select>
            <input
              type="number"
              className="w-full mb-3 input input-lg rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 border-none shadow-sm"
              placeholder="Application Fee"
              value={editData.applicationFees || ""}
              onChange={(e) =>
                setEditData({ ...editData, applicationFees: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow"
              >
                Update
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarship;
