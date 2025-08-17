import React, { useContext, useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthProvider';
import { FaTrashAlt } from 'react-icons/fa';

const ManageUsers = () => {
  const { token, user, role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (!token || role !== 'admin') return;

    fetch(`${import.meta.env.VITE_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, [token, role]);

  const handleRoleChange = (userId, newRole, currentRole) => {
    if (newRole === currentRole) return;

    fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          Swal.fire('Success', 'User role updated!', 'success');
          setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
          );
        }
      });
  };

  const handleDelete = (userId, email) => {
    if (email === user?.email) {
      return Swal.fire('Warning', 'You cannot delete yourself.', 'warning');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
              setUsers((prev) => prev.filter((u) => u._id !== userId));
            }
          });
      }
    });
  };

  const filteredUsers = useMemo(() => {
    if (filterRole === 'all') return users;
    return users.filter((u) => u.role === filterRole);
  }, [users, filterRole]);

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>

      {/* Role Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="font-medium text-gray-700">Filter by role:</label>
        <select
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <details className="dropdown">
                      <summary className="cursor-pointer px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md capitalize">
                        {u.role}
                      </summary>
                      <ul className="p-2 shadow-lg menu dropdown-content bg-white rounded-md w-32 z-[999]">
                        {['user', 'moderator', 'admin'].map((opt) => (
                          <li key={opt}>
                            <button
                              className={`capitalize w-full text-left px-2 py-1 hover:bg-indigo-50 rounded-md ${
                                u.role === opt ? 'text-gray-400 cursor-not-allowed' : ''
                              }`}
                              onClick={() => handleRoleChange(u._id, opt, u.role)}
                              disabled={u.role === opt}
                            >
                              {opt}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                      onClick={() => handleDelete(u._id, u.email)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found for this role.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
