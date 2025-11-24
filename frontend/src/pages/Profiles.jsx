import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import api from "../api/api";

export default function Profiles() {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        role: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchProfiles();
        }
    }, [user]);

    const fetchProfiles = async () => {
        try {
            setLoadingData(true);
            const res = await api.get("/api/users");
            setProfiles(res.data);
        } catch (err) {
            setError("Failed to load profiles.");
        } finally {
            setLoadingData(false);
        }
    };

    const handleEdit = (profile) => {
        setEditingId(profile.id);
        setFormData({
            firstname: profile.firstname || "",
            lastname: profile.lastname || "",
            username: profile.username || "",
            email: profile.email || "",
            password: "",
            role: profile.role || ""
        });
        setError("");
        setSuccess("");
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            role: ""
        });
        setError("");
        setSuccess("");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e, profileId) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const updateData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                email: formData.email,
                role: formData.role
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await api.put(`/api/users/${profileId}`, updateData);
            setSuccess("Profile updated successfully!");
            setEditingId(null);
            setFormData({
                firstname: "",
                lastname: "",
                username: "",
                email: "",
                password: "",
                role: ""
            });
            fetchProfiles();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="text-white text-xl">Access denied. Admin only.</div>
            </div>
        );
    }

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">All Profiles</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <div className="bg-gray-50 rounded-2xl shadow-xl p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="text-left p-3 text-gray-700 font-semibold">ID</th>
                                    <th className="text-left p-3 text-gray-700 font-semibold">First Name</th>
                                    <th className="text-left p-3 text-gray-700 font-semibold">Last Name</th>
                                    <th className="text-left p-3 text-gray-700 font-semibold">Username</th>
                                    <th className="text-left p-3 text-gray-700 font-semibold">Email</th>
                                    <th className="text-left p-3 text-gray-700 font-semibold">Role</th>
                                    <th className="text-left p-3 text-gray-700 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-b border-gray-200">
                                        {editingId === profile.id ? (
                                            <td colSpan="7" className="p-4">
                                                <form onSubmit={(e) => handleSubmit(e, profile.id)} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                                First Name
                                                            </label>
                                                            <input
                                                                name="firstname"
                                                                type="text"
                                                                value={formData.firstname}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                                Last Name
                                                            </label>
                                                            <input
                                                                name="lastname"
                                                                type="text"
                                                                value={formData.lastname}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                                Username
                                                            </label>
                                                            <input
                                                                name="username"
                                                                type="text"
                                                                value={formData.username}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                                Email
                                                            </label>
                                                            <input
                                                                name="email"
                                                                type="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                                Password (leave blank to keep current)
                                                            </label>
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                                Role
                                                            </label>
                                                            <select
                                                                name="role"
                                                                value={formData.role}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            >
                                                                <option value="basic">Basic</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
                                                        >
                                                            {loading ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleCancel}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </td>
                                        ) : (
                                            <>
                                                <td className="p-3 text-gray-800">{profile.id}</td>
                                                <td className="p-3 text-gray-800">{profile.firstname}</td>
                                                <td className="p-3 text-gray-800">{profile.lastname}</td>
                                                <td className="p-3 text-gray-800">{profile.username}</td>
                                                <td className="p-3 text-gray-800">{profile.email}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        profile.role === 'admin' 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {profile.role}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleEdit(profile)}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

