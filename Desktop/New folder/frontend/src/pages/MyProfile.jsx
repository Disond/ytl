import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import api from "../api/api";

export default function MyProfile() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/users/me");
                setFormData({
                    firstname: res.data.firstname || "",
                    lastname: res.data.lastname || "",
                    username: res.data.username || "",
                    email: res.data.email || "",
                    password: "",
                    confirmPassword: ""
                });
            } catch (err) {
                setError("Failed to load profile data.");
            } finally {
                setLoadingData(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                email: formData.email
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const res = await api.put("/api/users/me", updateData);
            setUser(res.data);
            setSuccess("Profile updated successfully!");
            setFormData({
                ...formData,
                password: "",
                confirmPassword: ""
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h1>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstname" className="block text-gray-700 font-medium mb-2">
                            First Name
                        </label>
                        <input
                            id="firstname"
                            name="firstname"
                            type="text"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your first name"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastname" className="block text-gray-700 font-medium mb-2">
                            Last Name
                        </label>
                        <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your last name"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose a username"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            New Password (leave blank to keep current)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password"
                        />
                    </div>

                    {formData.password && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            value={user?.role || ""}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        <p className="text-sm text-gray-500 mt-1">Role cannot be changed</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}

