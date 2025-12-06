import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Welcome back!");
      onLogin(userCredential.user);
    } catch (error) {
      showFirebaseError(error);
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success("🎉 Account created successfully!");
      onLogin(userCredential.user);
    } catch (error) {
      showFirebaseError(error);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("⚠️ Please enter your email first!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("📩 Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("⚠️ Invalid email format!");
          break;
        case "auth/user-not-found":
          toast.error("🚫 No account found with this email!");
          break;
        default:
          toast.error("⚠️ Something went wrong. Try again later.");
      }
    }
  };

  const showFirebaseError = (error) => {
    const code = error.code;
    switch (code) {
      case "auth/invalid-email":
        toast.error("⚠️ Invalid email format!");
        break;
      case "auth/user-not-found":
        toast.error("🚫 No account found with this email!");
        break;
      case "auth/wrong-password":
      case "auth/invalid-credential":
        toast.error("❌ Incorrect email or password!");
        break;
      case "auth/email-already-in-use":
        toast.error("🔁 This email is already registered!");
        break;
      case "auth/weak-password":
        toast.error("🔒 Password should be at least 6 characters!");
        break;
      case "auth/missing-password":
        toast.error("🔑 Please enter your password!");
        break;
      default:
        toast.error("⚠️ " + (error.message || "Something went wrong"));
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>

      <form onSubmit={isLogin ? handleLogin : handleSignup}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isLogin && (
          <p
            onClick={handleForgotPassword}
            style={{
              color: "orange",
              cursor: "pointer",
              textAlign: "right",
              marginTop: "5px",
              fontSize: "0.9em",
            }}
          >
            Forgot Password?
          </p>
        )}

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p>
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <span
              onClick={() => setIsLogin(false)}
              style={{ color: "orange", cursor: "pointer" }}
            >
              Sign up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              onClick={() => setIsLogin(true)}
              style={{ color: "orange", cursor: "pointer" }}
            >
              Login
            </span>
          </>
        )}
      </p>
    </div>
  );
}
