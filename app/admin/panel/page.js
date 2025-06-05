'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    id: '',
    name: '',
    email: '',
    registrationNo: '',
    dateOfBirth: '',
    role: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // safe browser-only code
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push('/auth/adminlogin');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [session]);

  const handleUpdate = async (userData) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/user/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      
      // Update the users list
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      // Close the modal
      setShowUpdateModal(false);
      
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/user/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        // Remove the user from the list
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <div className="flex justify-center items-center h-screen">Unauthorized</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-success/50 p-2 ">
        <div className='bg-success-content/70'>
          <h1 className='font-bold text-black p-2 text-center'>
            Admin Panel
          </h1>
        </div>

        <ul className="menu mt-10 flex flex-col gap-4 ">
          <li className="cursor-pointer text-center bg-warning-content/70 p-2  ">Users</li>
          <li className="cursor-pointer text-center bg-warning-content/70 p-2 ">Notices</li>
          <li className="cursor-pointer text-center bg-warning-content/70 p-2  ">Blogs</li>
          <li className="cursor-pointer text-center bg-warning-content/70 p-2 ">News/Events</li>
        </ul>
      </div>

      {/* User Management Page */}
      <div className="w-4/5 p-4">
        <h2 className="text-xl font-bold mb-2">Manage Users</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setSelectedUser(user);
                      setUpdatedUserData({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        registrationNo: user.registrationNo || '',
                        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
                        role: user.role || 'USER',
                      });
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-error ml-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-success-content bg-opacity-50 flex justify-center items-center">
          <div className="bg-success p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Update User</h3>
            <div className="mb-2">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={updatedUserData.name}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={updatedUserData.email}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Registration No:</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={updatedUserData.registrationNo}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, registrationNo: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Date of Birth:</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={updatedUserData.dateOfBirth}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Role:</label>
              <select
                className="select select-bordered w-full"
                value={updatedUserData.role}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, role: e.target.value })}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-neutral"
                onClick={() => setShowUpdateModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleUpdate(updatedUserData)}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;