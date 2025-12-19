import { signOut } from "firebase/auth";
import { auth } from "../components/firebase.js";
import Navbar from "../components/Navbar.jsx";

const Home = ({ user, children }) => {
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />

      <main className="p-6">
        {children ? (
          children
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">
              Welcome to Notes App 👋
            </h2>
            <p className="text-gray-600 mt-2">
              You are logged in successfully.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
