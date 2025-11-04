import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { HomePage } from "./components/HomePage";
import { AptitudeAssessment } from "./components/AptitudeAssessment";
import { AspirationsForm } from "./components/AspirationsForm";
import { SkillsExperienceForm } from "./components/SkillsExperienceForm";
import { ResultsPage } from "./components/ResultsPage";
import { ResumeAnalysis } from "./components/ResumeAnalysis";
import { InterviewPrep } from "./components/InterviewPrep";
import { CoursesPage } from "./components/CoursesPage";
import { AIChat } from "./components/AIChat";
import { AdminDashboard } from "./components/AdminDashboard";
import { serverUrl, getAuthHeaders, trackInteraction, saveAssessmentProgress, saveAssessmentResults } from "./lib/supabaseClient";

type Step = "login" | "signup" | "home" | "aptitude" | "aspirations" | "skills" | "results" | "resume" | "interview" | "courses" | "chat" | "admin";

interface UserProfile {
  aptitudes: Record<string, number>;
  interests: string[];
  values: string[];
  goals: string;
  timeframe: string;
  education: string;
  experience: string;
  skills: string[];
  certifications: string;
}

interface UserAuth {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  sessionId?: string;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>("login");
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const handleLogin = (user: { id: string; email: string; name: string; accessToken: string; sessionId: string }) => {
    setUserAuth(user);
    setCurrentStep("home");
  };

  const handleSignup = (user: { id: string; email: string; name: string }) => {
    setUserAuth({ ...user, accessToken: "", sessionId: "" });
    // After signup, redirect to login
    setCurrentStep("login");
  };

  const handleLogout = async () => {
    if (userAuth?.accessToken && userAuth?.sessionId) {
      try {
        await fetch(`${serverUrl}/auth/signout`, {
          method: "POST",
          headers: getAuthHeaders(userAuth.accessToken),
          body: JSON.stringify({ sessionId: userAuth.sessionId }),
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    setUserAuth(null);
    setUserProfile({});
    setHasCompletedAssessment(false);
    setCurrentStep("login");
  };

  const handleNavigate = (section: string) => {
    if (section === "aptitude") {
      setCurrentStep("aptitude");
    } else if (section === "resume") {
      setCurrentStep("resume");
    } else if (section === "interview") {
      setCurrentStep("interview");
    } else if (section === "courses") {
      setCurrentStep("courses");
    } else if (section === "chat") {
      setCurrentStep("chat");
    } else if (section === "results") {
      setCurrentStep("results");
    }
  };

  const handleBackToHome = () => {
    setCurrentStep("home");
  };

  const handleStart = () => {
    // Track interaction
    if (userAuth?.accessToken) {
      trackInteraction(userAuth.accessToken, "started_assessment", "welcome");
    }
    setCurrentStep("aptitude");
  };

  const handleAptitudeComplete = async (aptitudes: Record<string, number>) => {
    const updatedProfile = { ...userProfile, aptitudes };
    setUserProfile(updatedProfile);
    
    // Save progress and track interaction
    if (userAuth?.accessToken) {
      await saveAssessmentProgress(userAuth.accessToken, updatedProfile, "aptitude_completed");
      await trackInteraction(userAuth.accessToken, "completed_step", "aptitude", { aptitudes });
    }
    
    setCurrentStep("aspirations");
  };

  const handleAspirationsComplete = async (data: {
    interests: string[];
    values: string[];
    goals: string;
    timeframe: string;
  }) => {
    const updatedProfile = { ...userProfile, ...data };
    setUserProfile(updatedProfile);
    
    // Save progress and track interaction
    if (userAuth?.accessToken) {
      await saveAssessmentProgress(userAuth.accessToken, updatedProfile, "aspirations_completed");
      await trackInteraction(userAuth.accessToken, "completed_step", "aspirations", data);
    }
    
    setCurrentStep("skills");
  };

  const handleSkillsComplete = async (data: {
    education: string;
    experience: string;
    skills: string[];
    certifications: string;
  }) => {
    const updatedProfile = { ...userProfile, ...data };
    setUserProfile(updatedProfile);
    
    // Save progress and track interaction
    if (userAuth?.accessToken) {
      await saveAssessmentProgress(userAuth.accessToken, updatedProfile, "skills_completed");
      await trackInteraction(userAuth.accessToken, "completed_step", "skills", data);
    }
    
    setHasCompletedAssessment(true);
    setCurrentStep("results");
  };

  const handleRestart = async () => {
    // Track restart
    if (userAuth?.accessToken) {
      await trackInteraction(userAuth.accessToken, "restarted_assessment", "welcome");
    }
    
    setUserProfile({});
    setHasCompletedAssessment(false);
    setCurrentStep("home");
  };

  const handleResumeResults = (results: any) => {
    // Store resume results temporarily
    // You can create a separate state for this if needed
    setCurrentStep("home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Secret Admin Button - Triple click top-left corner to access */}
      <button
        onClick={(e) => {
          if (e.detail === 3) {
            setCurrentStep("admin");
          }
        }}
        className="fixed top-2 left-2 w-8 h-8 opacity-0 hover:opacity-10 transition-opacity z-50"
        title="Triple-click for admin"
      >
        📊
      </button>

      {currentStep === "admin" && <AdminDashboard />}

      {currentStep === "login" && (
        <LoginScreen 
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentStep("signup")}
        />
      )}

      {currentStep === "signup" && (
        <SignupScreen
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentStep("login")}
        />
      )}

      {currentStep === "home" && userAuth && (
        <HomePage
          userName={userAuth.name}
          userEmail={userAuth.email}
          userProfile={userProfile}
          hasCompletedAssessment={hasCompletedAssessment}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentStep === "aptitude" && (
        <AptitudeAssessment
          onComplete={handleAptitudeComplete}
          onBack={handleBackToHome}
        />
      )}

      {currentStep === "aspirations" && (
        <AspirationsForm
          onComplete={handleAspirationsComplete}
          onBack={() => setCurrentStep("aptitude")}
        />
      )}

      {currentStep === "skills" && (
        <SkillsExperienceForm
          onComplete={handleSkillsComplete}
          onBack={() => setCurrentStep("aspirations")}
        />
      )}

      {currentStep === "results" && (
        <ResultsPage
          userProfile={userProfile as UserProfile}
          onRestart={handleRestart}
          accessToken={userAuth?.accessToken}
        />
      )}

      {currentStep === "resume" && userAuth && (
        <ResumeAnalysis
          accessToken={userAuth.accessToken}
          onBack={handleBackToHome}
          onViewResults={handleResumeResults}
        />
      )}

      {currentStep === "interview" && (
        <InterviewPrep onBack={handleBackToHome} />
      )}

      {currentStep === "courses" && (
        <CoursesPage
          userSkills={userProfile.skills}
          onBack={handleBackToHome}
        />
      )}

      {currentStep === "chat" && userAuth && (
        <AIChat
          accessToken={userAuth.accessToken}
          userName={userAuth.name}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}
