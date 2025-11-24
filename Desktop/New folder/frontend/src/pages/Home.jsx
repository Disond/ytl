import { useAuth } from "../context/authContext";
import Tasks from "../components/Tasks";
import Login from "./Login";

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return user ? <Tasks /> : <Login />;
}
