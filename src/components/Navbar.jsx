import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-green-600">
          Notes App
        </h1>

        <Link to="/home" className="text-gray-700 hover:text-green-600">
          Home
        </Link>

        <Link to="/notes" className="text-gray-700 hover:text-green-600">
          Notes
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>

  );
};

export default Navbar;
