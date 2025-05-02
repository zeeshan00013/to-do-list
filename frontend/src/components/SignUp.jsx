import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";
import { VscAccount } from "react-icons/vsc";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://to-do-list-backend-bice.vercel.app/api/auth/signup",
        { username, email, password }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(
          response.data.message || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error signing up. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-indigo-600 rounded-full p-3">
              <VscAccount className="h-10 w-10 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              {loading ? (
                <BeatLoader color="#ffffff" size={10} />
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 font-medium hover:text-indigo-800 focus:outline-none focus:underline transition duration-300"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;
