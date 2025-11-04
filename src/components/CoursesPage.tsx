import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CoursesPageProps {
  userSkills?: string[];
  onBack: () => void;
}

const coursePlatforms = {
  technology: {
    title: "Technology & Programming",
    icon: "💻",
    courses: [
      {
        name: "Complete Web Development Bootcamp",
        platform: "Udemy",
        link: "https://www.udemy.com/topic/web-development/",
        price: "₹499 - ₹3,999",
        duration: "40-60 hours",
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        level: "Beginner to Advanced",
      },
      {
        name: "Data Structures & Algorithms",
        platform: "Coursera",
        link: "https://www.coursera.org/specializations/data-structures-algorithms",
        price: "₹3,999/month",
        duration: "6 months",
        skills: ["DSA", "Problem Solving", "Programming"],
        level: "Intermediate",
      },
      {
        name: "Machine Learning Specialization",
        platform: "Coursera (Andrew Ng)",
        link: "https://www.coursera.org/specializations/machine-learning-introduction",
        price: "₹3,999/month",
        duration: "3 months",
        skills: ["Python", "ML", "AI", "Data Science"],
        level: "Intermediate",
      },
      {
        name: "Full Stack Development",
        platform: "Scaler Academy",
        link: "https://www.scaler.com/",
        price: "₹2,50,000+",
        duration: "12 months",
        skills: ["Full Stack", "System Design", "DSA"],
        level: "Intermediate to Advanced",
      },
    ],
  },
  business: {
    title: "Business & Management",
    icon: "📊",
    courses: [
      {
        name: "Digital Marketing Masterclass",
        platform: "Udemy",
        link: "https://www.udemy.com/topic/digital-marketing/",
        price: "₹499 - ₹2,999",
        duration: "20-30 hours",
        skills: ["SEO", "Social Media", "Content Marketing"],
        level: "Beginner to Intermediate",
      },
      {
        name: "MBA Essentials",
        platform: "Coursera",
        link: "https://www.coursera.org/browse/business",
        price: "₹3,999/month",
        duration: "6-12 months",
        skills: ["Strategy", "Finance", "Marketing", "Leadership"],
        level: "Intermediate",
      },
      {
        name: "Product Management",
        platform: "Product School",
        link: "https://productschool.com/",
        price: "₹50,000+",
        duration: "8 weeks",
        skills: ["Product Strategy", "Roadmapping", "Analytics"],
        level: "Intermediate to Advanced",
      },
      {
        name: "Financial Modeling & Analysis",
        platform: "Udemy",
        link: "https://www.udemy.com/topic/financial-modeling/",
        price: "₹499 - ₹3,999",
        duration: "15-25 hours",
        skills: ["Excel", "Financial Analysis", "Valuation"],
        level: "Intermediate",
      },
    ],
  },
  creative: {
    title: "Design & Creative",
    icon: "🎨",
    courses: [
      {
        name: "UI/UX Design Specialization",
        platform: "Coursera",
        link: "https://www.coursera.org/browse/arts-and-humanities/design",
        price: "₹3,999/month",
        duration: "4-6 months",
        skills: ["Figma", "User Research", "Prototyping"],
        level: "Beginner to Intermediate",
      },
      {
        name: "Graphic Design Masterclass",
        platform: "Udemy",
        link: "https://www.udemy.com/topic/graphic-design/",
        price: "₹499 - ₹2,999",
        duration: "20-40 hours",
        skills: ["Photoshop", "Illustrator", "Branding"],
        level: "Beginner",
      },
      {
        name: "Motion Graphics & Animation",
        platform: "Skillshare",
        link: "https://www.skillshare.com/browse/animation",
        price: "₹799/month",
        duration: "Varies",
        skills: ["After Effects", "Animation", "Video Editing"],
        level: "Intermediate",
      },
      {
        name: "Video Production & Editing",
        platform: "LinkedIn Learning",
        link: "https://www.linkedin.com/learning/topics/video-production",
        price: "₹1,650/month",
        duration: "10-20 hours",
        skills: ["Premiere Pro", "Final Cut", "Editing"],
        level: "Beginner to Intermediate",
      },
    ],
  },
  certification: {
    title: "Professional Certifications",
    icon: "🎓",
    courses: [
      {
        name: "Google Data Analytics Certificate",
        platform: "Coursera",
        link: "https://www.coursera.org/professional-certificates/google-data-analytics",
        price: "₹3,999/month",
        duration: "6 months",
        skills: ["Data Analysis", "SQL", "Tableau", "R"],
        level: "Beginner",
      },
      {
        name: "AWS Cloud Practitioner",
        platform: "AWS Training",
        link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        price: "Free training + ₹8,000 exam",
        duration: "3 months",
        skills: ["Cloud Computing", "AWS", "DevOps"],
        level: "Beginner",
      },
      {
        name: "PMP Certification Prep",
        platform: "Udemy",
        link: "https://www.udemy.com/topic/pmp/",
        price: "₹2,999 + ₹38,000 exam",
        duration: "35+ hours",
        skills: ["Project Management", "Leadership", "Planning"],
        level: "Advanced",
      },
      {
        name: "Google UX Design Certificate",
        platform: "Coursera",
        link: "https://www.coursera.org/professional-certificates/google-ux-design",
        price: "₹3,999/month",
        duration: "6 months",
        skills: ["UX Design", "Wireframing", "Prototyping"],
        level: "Beginner",
      },
    ],
  },
};

const freePlatforms = [
  {
    name: "FreeCodeCamp",
    link: "https://www.freecodecamp.org/",
    description: "Learn to code for free - HTML, CSS, JavaScript, Python, and more",
    icon: "🔥",
  },
  {
    name: "Khan Academy",
    link: "https://www.khanacademy.org/",
    description: "Free courses in math, science, computer programming, and more",
    icon: "📚",
  },
  {
    name: "MIT OpenCourseWare",
    link: "https://ocw.mit.edu/",
    description: "Free course materials from MIT courses",
    icon: "🎓",
  },
  {
    name: "YouTube Tutorials",
    link: "https://www.youtube.com/",
    description: "Countless free tutorials on every topic imaginable",
    icon: "📺",
  },
  {
    name: "LinkedIn Learning (Trial)",
    link: "https://www.linkedin.com/learning/",
    description: "1 month free trial with thousands of courses",
    icon: "💼",
  },
];

export function CoursesPage({ userSkills = [], onBack }: CoursesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Home
          </Button>
          <h1 className="text-gray-800 mb-2">📚 Learning Resources</h1>
          <p className="text-gray-600">
            Explore courses to bridge skill gaps and accelerate your career growth
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="technology" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="certification">Certifications</TabsTrigger>
            <TabsTrigger value="free">Free Resources</TabsTrigger>
          </TabsList>

          {/* Course Categories */}
          {Object.entries(coursePlatforms).map(([key, category]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">{category.icon}</div>
                <h2 className="text-gray-800">{category.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {category.courses.map((course, index) => (
                  <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-gray-800 mb-2">{course.name}</h3>
                        <Badge className="bg-purple-100 text-purple-700 mb-2">
                          {course.platform}
                        </Badge>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {course.level}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>💰</span>
                        <span>{course.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>⏱️</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={
                              userSkills.includes(skill)
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : ""
                            }
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => window.open(course.link, "_blank")}
                    >
                      View Course
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}

          {/* Free Resources */}
          <TabsContent value="free" className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🎁</div>
              <h2 className="text-gray-800">Free Learning Resources</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freePlatforms.map((platform, index) => (
                <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4 text-center">{platform.icon}</div>
                  <h3 className="text-gray-800 mb-2 text-center">{platform.name}</h3>
                  <p className="text-gray-600 mb-4 text-center">{platform.description}</p>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => window.open(platform.link, "_blank")}
                  >
                    Visit Platform
                  </Button>
                </Card>
              ))}
            </div>

            {/* YouTube Channels */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
              <h3 className="text-gray-800 mb-4">📺 Recommended YouTube Channels</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-gray-700 mb-2">Programming</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Traversy Media</li>
                    <li>• freeCodeCamp.org</li>
                    <li>• The Net Ninja</li>
                    <li>• CodeWithHarry</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-gray-700 mb-2">Business</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Harvard Business Review</li>
                    <li>• Think School</li>
                    <li>• Ali Abdaal</li>
                    <li>• Gary Vaynerchuk</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-gray-700 mb-2">Design</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• DesignCourse</li>
                    <li>• The Futur</li>
                    <li>• Flux Academy</li>
                    <li>• CharliMarieTV</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-gray-800 mb-2">💡 Pro Tip</h3>
          <p className="text-gray-600">
            Start with free resources to explore topics, then invest in paid courses for structured learning and certifications. 
            Many platforms offer financial aid or student discounts!
          </p>
        </div>
      </div>
    </div>
  );
}
