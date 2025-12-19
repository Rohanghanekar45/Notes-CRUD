import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase.js";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Notes from "./pages/Notes.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
               element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" 
               element={!user ? <Register /> : <Navigate to="/home" />} />
        <Route
          path="/home"
          element={user ? <Home user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/notes"
          element={
            user ? (
            <Home user={user}>
            <Notes />
            </Home>
      ) : (
        <Navigate to="/" />
      )
    }
  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
