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
    name: '',
    email: '',
    registrationNo: '',
    dateOfBirth: '',
    role: '',
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      // safe browser-only code here
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
      fetch('/api/user')  // <-- Fetch ALL users, not just one
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched users:", data);
          setUsers(data);
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [session]);


  // Handle update user data
  const handleUpdate = async (updatedUser) => {
    try {
      console.log("Updating user with data:", updatedUser);

      const response = await fetch(`/api/user/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const responseBody = await response.text(); // Read response as text
      console.log("Raw response:", responseBody);

      if (response.ok) {
        const updatedUserData = JSON.parse(responseBody);
        console.log("User updated successfully:", updatedUserData);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUserData.id ? updatedUserData : user
          )
        );

        setShowUpdateModal(false);
      } else {
        // Log the response status for more details on what went wrong
        console.error("Error response:", responseBody);
        throw new Error(`Failed to update user: ${responseBody}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        console.error("Error deleting user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // if (status === "loading") return <div className="flex justify-center items-center h-screen">Loading...</div>;
  // if (!session || session.user.role !== "ADMIN") return null;

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setSelectedUser(user);
                      // setUpdatedUserData({
                      //   name: user.name,
                      //   email: user.email,
                      //   registrationNo: user.registrationNo,
                      //   dateOfBirth: user.dateOfBirth,
                      //   role: user.role,
                      // });
                      setUpdatedUserData({
                        id: user.id, // Ensure the ID is passed correctly
                        name: user.name,
                        email: user.email,
                        registrationNo: user.registrationNo,
                        dateOfBirth: user.dateOfBirth.split('T')[0], // safe format
                        role: user.role,
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
          <div className="bg-success p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Update User</h3>
            <div className="mb-2">
              <label>Name:</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={updatedUserData.name}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Email:</label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={updatedUserData.email}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Registration No:</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={updatedUserData.registrationNo}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, registrationNo: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Date of Birth:</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={updatedUserData.dateOfBirth}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Role:</label>
              <select
                className="input input-bordered w-full"
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
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleUpdate(updatedUserData)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
