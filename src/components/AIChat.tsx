import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { serverUrl, getAuthHeaders } from "../lib/supabaseClient";

interface AIChatProps {
  accessToken: string;
  userName: string;
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "How do I choose the right career?",
  "What skills are in demand?",
  "How to prepare for interviews?",
  "Should I change my career?",
  "How to negotiate salary?",
  "What certifications should I get?",
];

const sampleResponses: Record<string, string> = {
  "how do i choose the right career": "Great question! Choosing the right career involves: 1) Self-assessment (interests, values, skills) 2) Research different careers 3) Consider growth potential 4) Think about work-life balance 5) Try internships or projects. Our career assessment tool can help you discover careers that match your profile!",
  
  "what skills are in demand": "In 2024-2025, these skills are highly valued: Tech - AI/ML, Cloud Computing, Cybersecurity, Full-Stack Development. Business - Data Analysis, Digital Marketing, Project Management. Soft Skills - Communication, Leadership, Adaptability. The best approach is to combine technical skills with strong communication!",
  
  "how to prepare for interviews": "Interview prep checklist: 1) Research the company thoroughly 2) Practice STAR method for behavioral questions 3) Prepare your own questions 4) Review your resume and be ready to discuss each point 5) Do mock interviews 6) Prepare professional attire. Check our Interview Preparation section for detailed guides!",
  
  "should i change my career": "Career change is a big decision! Consider: 1) Why do you want to change? (growth, passion, dissatisfaction) 2) Do you have transferable skills? 3) Financial implications 4) Required training/education 5) Job market in target field. It's okay to pivot - many successful people have changed careers multiple times!",
  
  "how to negotiate salary": "Salary negotiation tips: 1) Research market rates for your role and location 2) Know your worth (skills, experience, achievements) 3) Let them make first offer 4) Ask for 10-20% above their initial offer 5) Consider total compensation (benefits, WFH, growth) 6) Be confident but professional. In India, ₹3-5 LPA is typical for freshers, ₹8-15 LPA for 3-5 years experience.",
  
  "what certifications should i get": "Popular certifications by field: Tech - AWS/Azure/GCP, Google Data Analytics, Scrum Master. Business - PMP, Six Sigma, CFA, Digital Marketing. Design - Google UX, Adobe Certified. Choose based on your career goals and current skill gaps. Certifications boost credibility but practical experience matters more!",
  
  "default": "I'm here to help with your career questions! I can assist with: Career planning, Interview preparation, Skill development, Resume tips, Industry insights, Salary guidance. Feel free to ask me anything specific about your career journey!",
};

export function AIChat({ accessToken, userName, onBack }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${userName}! 👋 I'm your AI Career Coach. I'm here to help you with career guidance, interview prep, skill development, and any other career-related questions. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageText = question || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Track interaction
    try {
      await fetch(`${serverUrl}/track/interaction`, {
        method: "POST",
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify({
          action: "ai_chat_message",
          step: "chat",
          data: { question: messageText },
        }),
      });
    } catch (error) {
      console.error("Track error:", error);
    }

    // Simulate AI response (in production, call actual AI API)
    setTimeout(() => {
      const response = getAIResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(sampleResponses)) {
      if (key !== "default" && lowerQuestion.includes(key.replace(/how do i |what |how to |should i /g, ""))) {
        return response;
      }
    }

    // Career-specific responses
    if (lowerQuestion.includes("software") || lowerQuestion.includes("developer") || lowerQuestion.includes("programming")) {
      return "Software development is a great career! Key skills: Programming (Python, JavaScript, Java), Data Structures & Algorithms, System Design, Git, Problem-solving. Salary in India: ₹3-6 LPA (fresher), ₹8-20 LPA (3-5 years), ₹25+ LPA (senior). High demand, good work-life balance, remote opportunities. Start with online courses and build projects!";
    }

    if (lowerQuestion.includes("data scien") || lowerQuestion.includes("machine learning") || lowerQuestion.includes("ai")) {
      return "Data Science/AI is booming! Required skills: Python, Statistics, ML algorithms, SQL, Data visualization. Salary: ₹5-8 LPA (entry), ₹12-25 LPA (mid), ₹30+ LPA (senior). Growing field with high demand. Start with Python and statistics, then learn ML frameworks like TensorFlow or PyTorch. Build a portfolio of projects!";
    }

    if (lowerQuestion.includes("marketing") || lowerQuestion.includes("digital market")) {
      return "Digital Marketing is versatile! Skills needed: SEO, Social Media, Content Creation, Analytics, Email Marketing. Salary: ₹3-5 LPA (entry), ₹8-15 LPA (mid), ₹20+ LPA (senior). Great for creative people. Certifications help: Google Analytics, HubSpot, Facebook Blueprint. Build your personal brand!";
    }

    if (lowerQuestion.includes("resume") || lowerQuestion.includes("cv")) {
      return "Resume tips: 1) Keep it 1-2 pages 2) Start with strong summary 3) Quantify achievements (increased sales by 30%) 4) Use action verbs 5) Tailor for each job 6) Include relevant keywords 7) Clean formatting 8) No typos! Upload your resume to our Resume Analysis tool for AI-powered feedback!";
    }

    if (lowerQuestion.includes("fresher") || lowerQuestion.includes("graduate") || lowerQuestion.includes("just graduated")) {
      return "As a fresher, focus on: 1) Building foundational skills 2) Internships and projects 3) Networking (LinkedIn) 4) Certifications 5) Soft skills (communication, teamwork). Don't expect high salary initially - focus on learning. Typical fresher salary: ₹3-6 LPA depending on field. Your first job is about growth, not just money!";
    }

    return sampleResponses.default;
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-800 mb-2">🤖 AI Career Coach</h1>
              <p className="text-gray-600">Get instant answers to your career questions</p>
            </div>
            <Badge className="bg-green-500">Online 24/7</Badge>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🤖</span>
                        <span className="text-purple-600">AI Coach</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-purple-200" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🤖</span>
                      <span className="text-purple-600">AI Coach is typing</span>
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-gray-600 mb-3">💡 Quick Questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs hover:bg-purple-100"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about your career..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            <strong>💡 Tip:</strong> I can help with career planning, interview prep, skill development, salary guidance, and more. Ask away!
          </p>
        </div>
      </div>
    </div>
  );
}
