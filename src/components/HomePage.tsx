import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { images } from "../assets/images/config";

interface HomePageProps {
  userName: string;
  userEmail: string;
  userProfile: any;
  hasCompletedAssessment: boolean;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

export function HomePage({
  userName,
  userEmail,
  userProfile,
  hasCompletedAssessment,
  onNavigate,
  onLogout,
}: HomePageProps) {
  const navigationCards = [
    {
      id: "aptitude",
      title: "📊 Career Assessment",
      description: "Discover your perfect career path through our comprehensive assessment",
      action: "Start Assessment",
      color: "from-purple-500 to-blue-500",
      completed: hasCompletedAssessment,
    },
    {
      id: "resume",
      title: "📄 Resume Analysis",
      description: "Upload your resume for AI-powered career recommendations",
      action: "Analyze Resume",
      color: "from-blue-500 to-cyan-500",
      badge: "AI Powered",
    },
    {
      id: "interview",
      title: "💼 Interview Preparation",
      description: "Get ready with common interview questions and expert tips",
      action: "Practice Now",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "courses",
      title: "📚 Learning Resources",
      description: "Explore courses to bridge your skill gaps and advance your career",
      action: "View Courses",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "chat",
      title: "🤖 AI Career Coach",
      description: "Chat with our AI assistant for personalized career guidance",
      action: "Start Chat",
      color: "from-pink-500 to-purple-500",
      badge: "24/7 Available",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-gray-800">CareerCompass AI</h1>
            <p className="text-gray-600">Your Personalized Career Journey</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-800">{userName}</p>
              <p className="text-gray-500">{userEmail}</p>
            </div>
            <Button variant="outline" onClick={onLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-2">Welcome back, {userName}! 👋</h2>
          <p className="text-gray-600">
            Let's continue building your successful career path
          </p>
        </div>

        {/* Progress Summary */}
        {hasCompletedAssessment && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2">🎉 Assessment Completed!</h3>
                <p className="opacity-90">
                  You've completed your career assessment. Check your results or explore more features below.
                </p>
              </div>
              <Button
                onClick={() => onNavigate("results")}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                View Results
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => (
            <Card
              key={card.id}
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => onNavigate(card.id)}
            >
              <div
                className={`h-2 w-full bg-gradient-to-r ${card.color} rounded-full mb-4`}
              />
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-gray-800">{card.title}</h3>
                {card.badge && (
                  <Badge className="bg-purple-100 text-purple-700">
                    {card.badge}
                  </Badge>
                )}
                {card.completed && (
                  <Badge className="bg-green-500">✓ Done</Badge>
                )}
              </div>
              <p className="text-gray-600 mb-6">{card.description}</p>
              <Button
                className={`w-full bg-gradient-to-r ${card.color} hover:opacity-90`}
              >
                {card.action}
              </Button>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎯</div>
              <div>
                <p className="text-gray-600">Career Matches</p>
                <p className="text-gray-800">
                  {hasCompletedAssessment ? "6+ Options" : "Not yet assessed"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📈</div>
              <div>
                <p className="text-gray-600">Progress</p>
                <p className="text-gray-800">
                  {hasCompletedAssessment ? "Complete" : "In Progress"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <p className="text-gray-600">AI Features</p>
                <p className="text-gray-800">5 Tools Available</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💬</div>
            <div className="flex-1">
              <h3 className="text-gray-800 mb-1">Need Help?</h3>
              <p className="text-gray-600">
                Our AI Career Coach is available 24/7 to answer your questions
              </p>
            </div>
            <Button
              onClick={() => onNavigate("chat")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Chat Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
