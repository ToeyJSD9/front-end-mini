import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser({ fullName, email, password });
      setUser(data.user); // Save user to AuthContext
      navigate("/dashboard"); // Redirect on success
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6bJigfCwijCqO9vlzZ3EiZQxuL_1JDmW8Ag&s')", // พื้นหลัง Akatsuki (ใช้ลิงก์อื่นได้)
      }}
    >
      <div className="bg-white/90 p-8 rounded-lg shadow-2xl w-full max-w-md backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
          Create Your Akatsuki Account
        </h2>
  
        {error && (
          <div className="bg-red-200 text-red-800 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-red-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />
          </div>
  
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-red-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-red-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-red-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {loading ? "Signing up..." : "Join Akatsuki"}
          </button>
        </form>
  
        <p className="text-center text-sm text-gray-600 mt-4">
          Already part of us?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
  }

export default SignupPage;
