import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProvider';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const { role, token, user } = useContext(AuthContext);
  const api = import.meta.env.VITE_API_URL;

  if (role !== 'admin') return <Navigate to="/unauthorized" />;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${api}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Unauthorized or fetch error');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [api, token]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${api}/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await res.json();

      if (result.modifiedCount > 0) {
        setUsers(prev =>
          prev.map(user =>
            user._id === id ? { ...user, role: newRole } : user
          )
        );
        Swal.fire('Updated!', `Role changed to "${newRole}"`, 'success');
      } else {
        Swal.fire('Error!', 'Failed to update role.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong while updating role.', 'error');
    }
  };

  const handleDelete = async (id, email) => {
    if (email === user?.email) {
      return Swal.fire('Warning', 'You cannot delete your own admin account.', 'warning');
    }

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${api}/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (result.deletedCount > 0) {
          setUsers(prev => prev.filter(user => user._id !== id));
          Swal.fire('Deleted!', 'User has been removed.', 'success');
        } else {
          Swal.fire('Error!', 'Failed to delete user.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong while deleting user.', 'error');
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return filterRole === 'all'
      ? users
      : users.filter(user => user.role === filterRole);
  }, [users, filterRole]);

  return (
    <section className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-primary">Manage Users</h2>
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

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td className="capitalize">{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>
                    <details className="dropdown">
                      <summary className="btn btn-xs btn-outline capitalize">
                        {user.role}
                      </summary>
                      <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-32 z-[999]">
                        {['user', 'moderator', 'admin'].map((roleOpt) => (
                          <li key={roleOpt}>
                            <button
                              className="capitalize"
                              onClick={() => handleRoleChange(user._id, roleOpt)}
                              disabled={user.role === roleOpt}
                            >
                              {roleOpt}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(user._id, user.email)}
                      className="btn btn-sm btn-error flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageUsers;
