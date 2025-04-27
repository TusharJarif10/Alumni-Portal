"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [view, setView] = useState("blogs");
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Profile state variables
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    useEffect(() => {
        fetchBlogs();
        if (session?.user) {
            setEmail(session.user.email);
            setName(session.user.name);
            // Set initial Date of Birth from session if available
            setDateOfBirth(session.user.dateOfBirth ? session.user.dateOfBirth.split("T")[0] : ""); // assuming dateOfBirth is stored as a string in 'YYYY-MM-DD' format
        }
    }, [session]);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get("/api/blogs");
            setBlogs(res.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const handlePost = async () => {
        if (!title || !content) return alert("Title and content are required");

        try {
            await axios.post("/api/blogs", {
                title,
                content,
                authorEmail: session?.user?.name,
            });
            setTitle("");
            setContent("");
            fetchBlogs();
        } catch (error) {
            console.error("Error posting blog:", error);
        }
    };

    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setView("singleBlog");
    };

    const handleViewProfile = () => {
        setView("profile");
    };

    const handleViewBlogs = () => {
        setView("blogs");
    };

   const handleUpdateProfile = async () => {
    if (!name || !email || !dateOfBirth) return alert("All fields are required");
    if (newPassword && newPassword !== confirmPassword) {
        return alert("Passwords do not match");
    }

    try {
        const user = await axios.put("/api/user", {
            id: session?.user?.id,
            email,
            name,
            dateOfBirth,
            password: newPassword || currentPassword,
            status: "ACTIVE",
        });

        alert("Profile updated successfully!");

        // Refetch session so form gets the updated data
        const updatedSession = await signIn('credentials', {
            redirect: false,
            email,
            password: newPassword || currentPassword,
        });

        if (!updatedSession?.error) {
            setView("blogs"); // Go back to blogs or whatever you want
        } else {
            console.error("Error refreshing session:", updatedSession.error);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile");
    }
};

    return (
        <div className="w-dvw h-dvh bg-base-300 grid grid-cols-7">
            <div className="col-span-1 bg-base-300 ">
                <div className="p-2 h-full w-full flex flex-col">
                    <div className="flex flex-col h-full pt-2">
                        <a href="#" onClick={handleViewProfile} className="py-2 px-4">
                            Profile
                        </a>
                        <a href="#" onClick={handleViewBlogs} className="py-2 px-4">
                            Blogs
                        </a>
                    </div>
                    <div className="px-1 my-10">
                        <button className="btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-span-6 bg-base-100 p-6">
                {view === "blogs" && (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Post a Blog</h1>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded-lg p-2 w-full mb-2"
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border  p-2 w-full mb-2 rounded-lg"
                        ></textarea>
                        <button onClick={handlePost} className="btn bg-base-300 p-2 rounded-xl px-4">
                            Post Blog
                        </button>

                        <h2 className="text-xl font-semibold mt-6">Your Blogs</h2>
                        {blogs.length > 0 ? (
                            <ul>
                                {blogs.map((blog) => (
                                    <li
                                        key={blog.id}
                                        className="border rounded-lg p-2 mt-2 cursor-pointer"
                                        onClick={() => handleViewBlog(blog)}
                                    >
                                        <h3 className="font-bold">{blog.title}</h3>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No blogs found.</p>
                        )}
                    </>
                )}

                {view === "singleBlog" && selectedBlog && (
                    <div>
                        <button onClick={handleViewBlogs} className=" mb-4">
                            Back to Blogs
                        </button>
                        <h1 className="text-3xl font-bold">{selectedBlog.title}</h1>
                        <p>{selectedBlog.content}</p>
                    </div>
                )}

                {view === "profile" && (
                    <div>
                        <h1 className="text-3xl font-bold">Update Profile</h1>
                        <div className="my-4">
                            <label className="block ">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border  rounded-lg p-2 w-full mb-2"
                            />
                        </div>
                        <div className="my-4">
                            <label className="block ">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border  rounded-lg p-2 w-full mb-2"
                            />
                        </div>
                        <div className="my-4">
                            <label className="block ">Date of Birth</label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="border  rounded-lg p-2 w-full mb-2"
                            />
                        </div>
                        <div className="my-4">
                            <label className="block ">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="border rounded-lg p-2 w-full mb-2"
                            />
                        </div>
                        <div className="my-4">
                            <label className="block ">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border rounded-lg p-2 w-full mb-2"
                            />
                        </div>
                        <div className="my-4">
                            <label className="block ">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border  rounded-lg p-2 w-full mb-2"
                            />
                        </div>
                        <button onClick={handleUpdateProfile} className="bg-base-300 p-2 rounded-xl px-4">
                            Update Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
