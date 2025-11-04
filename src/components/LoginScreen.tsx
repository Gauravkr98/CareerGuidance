import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { images } from "../assets/images/config";
import { serverUrl, getAuthHeaders } from "../lib/supabaseClient";

interface LoginScreenProps {
  onLogin: (user: { id: string; email: string; name: string; accessToken: string; sessionId: string }) => void;
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${serverUrl}/auth/signin`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Pass user data with access token to parent
      onLogin({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        accessToken: data.accessToken,
        sessionId: data.sessionId,
      });
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:block relative">
          <img
            src={images.auth.loginBanner}
            alt="Career Success"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end p-8">
            <div className="text-white">
              <h2 className="mb-2">Welcome Back! 👋</h2>
              <p>Continue your journey to finding the perfect career path</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="mb-2 text-gray-800">Login to CareerCompass</h1>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-purple-600 hover:text-purple-700">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-purple-600 hover:text-purple-700"
              >
                Sign up here
              </button>
            </p>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              <strong>🔐 Secure Login:</strong> Your login activity is tracked in Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
