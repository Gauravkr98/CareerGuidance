import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface InterviewPrepProps {
  onBack: () => void;
}

const interviewCategories = {
  general: {
    title: "General Interview Questions",
    icon: "💼",
    questions: [
      {
        q: "Tell me about yourself",
        a: "Focus on your professional journey, key achievements, and how they relate to the role. Keep it to 2-3 minutes. Structure: Present situation → Past experiences → Future goals.",
        tips: ["Be concise", "Highlight relevant experience", "End with enthusiasm for the role"],
      },
      {
        q: "What are your strengths and weaknesses?",
        a: "Choose strengths relevant to the job. For weaknesses, pick something you're actively working to improve and show self-awareness.",
        tips: ["Use specific examples", "Show growth mindset", "Align strengths with job requirements"],
      },
      {
        q: "Why do you want to work here?",
        a: "Research the company beforehand. Mention specific aspects like their culture, products, mission, or growth opportunities that align with your goals.",
        tips: ["Show genuine interest", "Reference company values", "Connect to your career goals"],
      },
      {
        q: "Where do you see yourself in 5 years?",
        a: "Show ambition while being realistic. Align your goals with potential growth in the company. Focus on skill development and contributions.",
        tips: ["Be ambitious yet grounded", "Show commitment", "Align with company growth"],
      },
    ],
  },
  behavioral: {
    title: "Behavioral Questions (STAR Method)",
    icon: "🎭",
    questions: [
      {
        q: "Describe a challenging situation you faced at work",
        a: "Use STAR method: Situation (context) → Task (challenge) → Action (what you did) → Result (outcome). Focus on your problem-solving skills.",
        tips: ["Be specific", "Show problem-solving", "Quantify results when possible"],
      },
      {
        q: "Tell me about a time you worked in a team",
        a: "Highlight collaboration, communication, and your specific contribution. Show how you handled conflicts or different opinions constructively.",
        tips: ["Emphasize teamwork", "Show your role clearly", "Mention positive outcomes"],
      },
      {
        q: "Describe a time you failed and what you learned",
        a: "Choose a real but not catastrophic failure. Focus on lessons learned and how you've improved. Shows self-awareness and growth.",
        tips: ["Be honest", "Focus on learning", "Show how you've changed"],
      },
      {
        q: "How do you handle pressure and deadlines?",
        a: "Give specific examples of managing multiple priorities. Mention organizational skills, time management, and staying calm under pressure.",
        tips: ["Use real examples", "Show stress management", "Demonstrate reliability"],
      },
    ],
  },
  technical: {
    title: "Technical & Problem-Solving",
    icon: "💻",
    questions: [
      {
        q: "Explain a complex project you've worked on",
        a: "Break down the project into: Problem → Your approach → Technologies used → Challenges overcome → Final outcome. Keep it understandable.",
        tips: ["Simplify complex concepts", "Show thought process", "Highlight your contributions"],
      },
      {
        q: "How do you stay updated in your field?",
        a: "Mention specific resources: courses, blogs, conferences, certifications. Show continuous learning mindset and curiosity.",
        tips: ["Be specific", "Show initiative", "Mention recent learnings"],
      },
      {
        q: "Walk me through your problem-solving process",
        a: "Describe your methodology: Understanding the problem → Researching solutions → Planning approach → Implementation → Testing/Validation.",
        tips: ["Be systematic", "Show analytical thinking", "Use examples"],
      },
      {
        q: "What tools/technologies are you proficient in?",
        a: "List relevant tools honestly. Rate your proficiency. Mention recent projects where you used them. Be ready to discuss in detail.",
        tips: ["Be honest", "Prioritize relevant skills", "Provide context"],
      },
    ],
  },
  situational: {
    title: "Situational Questions",
    icon: "🎯",
    questions: [
      {
        q: "How would you handle disagreement with your manager?",
        a: "Show respect and professionalism. Mention: Listen first → Present your perspective with data → Find common ground → Accept final decision gracefully.",
        tips: ["Show maturity", "Emphasize communication", "Respect hierarchy"],
      },
      {
        q: "What would you do if given an impossible deadline?",
        a: "Communicate early, assess priorities, propose realistic alternatives, ask for resources/help if needed. Show proactive problem-solving.",
        tips: ["Be realistic", "Show communication skills", "Demonstrate problem-solving"],
      },
      {
        q: "How would you handle a difficult colleague?",
        a: "Address issues professionally, focus on work not personality, seek to understand their perspective, involve management if necessary.",
        tips: ["Stay professional", "Show empathy", "Focus on solutions"],
      },
    ],
  },
};

const interviewTips = [
  {
    category: "Before Interview",
    icon: "📋",
    tips: [
      "Research the company thoroughly - products, culture, recent news",
      "Prepare questions to ask the interviewer",
      "Review job description and align your experiences",
      "Practice answers to common questions",
      "Prepare examples using STAR method",
      "Plan your outfit (professional attire)",
      "Test technology if virtual interview",
    ],
  },
  {
    category: "During Interview",
    icon: "🎤",
    tips: [
      "Arrive 10-15 minutes early (or join virtual call 5 mins early)",
      "Maintain eye contact and positive body language",
      "Listen carefully before answering",
      "Take a moment to think before responding",
      "Use specific examples and quantify achievements",
      "Show enthusiasm and genuine interest",
      "Ask thoughtful questions",
    ],
  },
  {
    category: "After Interview",
    icon: "✉️",
    tips: [
      "Send thank-you email within 24 hours",
      "Reflect on what went well and areas to improve",
      "Follow up if you haven't heard back in the stated timeframe",
      "Continue job search until you have an offer",
    ],
  },
];

export function InterviewPrep({ onBack }: InterviewPrepProps) {
  const [selectedCategory, setSelectedCategory] = useState("general");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Home
          </Button>
          <h1 className="text-gray-800 mb-2">💼 Interview Preparation</h1>
          <p className="text-gray-600">
            Master common interview questions and ace your next interview
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="questions">Interview Questions</TabsTrigger>
            <TabsTrigger value="tips">Expert Tips</TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {/* Category Selection */}
            <div className="grid md:grid-cols-4 gap-4">
              {Object.entries(interviewCategories).map(([key, category]) => (
                <Card
                  key={key}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedCategory === key
                      ? "border-purple-500 border-2 bg-purple-50"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedCategory(key)}
                >
                  <div className="text-3xl mb-2 text-center">{category.icon}</div>
                  <h3 className="text-center text-gray-800">{category.title}</h3>
                </Card>
              ))}
            </div>

            {/* Questions List */}
            <Card className="p-6">
              <h2 className="text-gray-800 mb-6">
                {interviewCategories[selectedCategory as keyof typeof interviewCategories].icon}{" "}
                {interviewCategories[selectedCategory as keyof typeof interviewCategories].title}
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {interviewCategories[selectedCategory as keyof typeof interviewCategories].questions.map(
                  (item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-gray-800 hover:no-underline">
                        <div className="flex items-start gap-3 text-left">
                          <Badge className="bg-purple-100 text-purple-700 mt-1">
                            Q{index + 1}
                          </Badge>
                          <span>{item.q}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-gray-700 mb-2">💡 Sample Answer:</h4>
                            <p className="text-gray-600">{item.a}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="text-gray-700 mb-2">✅ Pro Tips:</h4>
                            <ul className="space-y-1">
                              {item.tips.map((tip, i) => (
                                <li key={i} className="text-gray-600 flex items-start gap-2">
                                  <span className="text-green-600">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </Card>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {interviewTips.map((section, index) => (
                <Card key={index} className="p-6">
                  <div className="text-4xl mb-4 text-center">{section.icon}</div>
                  <h3 className="text-gray-800 mb-4 text-center">{section.category}</h3>
                  <ul className="space-y-3">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-purple-600 mt-1">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            {/* STAR Method */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-gray-800 mb-4">⭐ The STAR Method</h2>
              <p className="text-gray-600 mb-6">
                Use this framework to answer behavioral questions effectively:
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-purple-600 mb-2">S - Situation</h3>
                  <p className="text-gray-600">Set the context and background</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-blue-600 mb-2">T - Task</h3>
                  <p className="text-gray-600">Describe the challenge or goal</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-green-600 mb-2">A - Action</h3>
                  <p className="text-gray-600">Explain what you did</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-orange-600 mb-2">R - Result</h3>
                  <p className="text-gray-600">Share the outcome and impact</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
