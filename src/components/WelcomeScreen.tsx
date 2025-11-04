import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { images } from "../assets/images/config";

interface WelcomeScreenProps {
  onStart: () => void;
  onLogout: () => void;
  userName?: string;
}

export function WelcomeScreen({ onStart, onLogout, userName }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <div className="text-gray-400 text-xs">
            💡 Tip: Triple-click top-left for admin
          </div>
          <Button variant="outline" onClick={onLogout} size="sm">
            Logout
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🧭</span>
            <h1 className="text-purple-600">CareerCompass AI</h1>
          </div>
          {userName && (
            <p className="text-gray-700 mb-2">
              Welcome back, <strong>{userName}</strong>! 👋
            </p>
          )}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your personalized AI-powered career guidance companion. Discover the perfect career path tailored to your unique strengths, interests, and aspirations.
          </p>
        </div>

        {/* Hero Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="mb-4 text-gray-800">Find Your Perfect Career Path</h2>
              <p className="text-gray-600 mb-6">
                We use advanced AI to analyze your aptitude, aspirations, abilities, and experience to recommend careers where you'll thrive and succeed.
              </p>
              <Button 
                onClick={onStart}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                🚀 Start Your Journey
              </Button>
            </div>
            <div className="h-64 md:h-auto">
              <img 
                src={images.hero.welcomeBanner}
                alt="Career Guidance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="mb-2 text-gray-800">Aptitude Assessment</h3>
            <p className="text-gray-600">Discover your natural strengths and talents</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="mb-2 text-gray-800">Interest Mapping</h3>
            <p className="text-gray-600">Align careers with your passions</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="mb-2 text-gray-800">Skill Analysis</h3>
            <p className="text-gray-600">Evaluate your current abilities</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="mb-2 text-gray-800">Growth Pathways</h3>
            <p className="text-gray-600">Plan your career progression</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
