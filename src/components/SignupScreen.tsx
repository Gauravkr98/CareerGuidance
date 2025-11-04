import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { images } from "../assets/images/config";
import { serverUrl, getAuthHeaders } from "../lib/supabaseClient";

interface SignupScreenProps {
  onSignup: (user: { id: string; email: string; name: string }) => void;
  onSwitchToLogin: () => void;
}

export function SignupScreen({ onSignup, onSwitchToLogin }: SignupScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${serverUrl}/auth/signup`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Pass user data to parent
      onSignup({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      });
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
      setLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Signup Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="mb-2 text-gray-800">Create Your Account ✨</h1>
            <p className="text-gray-600">Start your career discovery journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="signup-email">Email Address</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`mt-2 ${!passwordsMatch ? "border-red-500" : ""}`}
              />
              {!passwordsMatch && (
                <p className="text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <label className="text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
              disabled={!passwordsMatch || loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-600 hover:text-purple-700"
              >
                Login here
              </button>
            </p>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              <strong>🔐 Secure Signup:</strong> Your account is created in Supabase with tracking
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block relative">
          <img
            src={images.auth.signupBanner}
            alt="Start Your Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-8">
            <div className="text-white">
              <h2 className="mb-2">Start Your Journey! 🚀</h2>
              <p>Join thousands discovering their perfect career path with AI guidance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
