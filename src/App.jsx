import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import AllTasks from "./pages/AllTasks";
import "./style.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <BrowserRouter>
      {!user ? (
        <AuthPage onLogin={setUser} />
      ) : (
        <div className="container">
          <div className="topBar">
            <h3>Todo App</h3>
            <Navbar />
          </div>


          <div className="inputContainer">
            <AllTasks />
          </div>
        </div>
      )}

      {/* ✅ Global toast container (works anywhere) */}
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </BrowserRouter>
  );
}
