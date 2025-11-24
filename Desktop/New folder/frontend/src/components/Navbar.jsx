import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/api";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to="/"
                        className="text-white text-2xl font-bold hover:text-blue-400 transition-colors"
                    >
                        TaskApp
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-gray-300 text-sm">
                                    {user.firstname} {user.lastname}
                                </span>
                                <Link
                                    to="/tasks"
                                    className="text-gray-200 hover:text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Tasks
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-gray-200 hover:text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    My Profile
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/profiles"
                                        className="text-gray-200 hover:text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        Profiles
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-200 hover:text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
