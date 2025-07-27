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
            prev.map((u) =>
              u._id === userId ? { ...u, role: newRole } : u
            )
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="mb-4">
        <select
          className="select select-bordered max-w-xs"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <details className="dropdown">
                    <summary className="btn btn-xs btn-outline capitalize">
                      {u.role}
                    </summary>
                    <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-32 z-[999]">
                      {['user', 'moderator', 'admin'].map((opt) => (
                        <li key={opt}>
                          <button
                            className="capitalize"
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
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleDelete(u._id, u.email)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
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
