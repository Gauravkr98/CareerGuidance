import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Helper function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-c1a0b791/auth/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Log signup interaction
    const userId = data.user.id;
    const timestamp = Date.now();
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "signup",
      email,
      name,
      timestamp: new Date().toISOString(),
    });

    return c.json({ 
      success: true, 
      user: { 
        id: userId, 
        email: data.user.email, 
        name 
      } 
    });
  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign in user
app.post("/make-server-c1a0b791/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Signin error:", error);
      return c.json({ error: error.message }, 400);
    }

    const userId = data.user.id;
    const sessionId = generateSessionId();
    const timestamp = Date.now();

    // Store session info
    await kv.set(`user_session:${userId}:${sessionId}`, {
      userId,
      email: data.user.email,
      name: data.user.user_metadata.name,
      sessionId,
      loginTime: new Date().toISOString(),
      status: "active",
    });

    // Log login interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "login",
      email: data.user.email,
      sessionId,
      timestamp: new Date().toISOString(),
    });

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: {
        id: userId,
        email: data.user.email,
        name: data.user.user_metadata.name,
      },
      sessionId,
    });
  } catch (error) {
    console.log("Signin error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign out user
app.post("/make-server-c1a0b791/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Get user from token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { sessionId } = await c.req.json();
    const userId = user.id;
    const timestamp = Date.now();

    // Update session status
    const sessionKey = `user_session:${userId}:${sessionId}`;
    const session = await kv.get(sessionKey);
    if (session) {
      await kv.set(sessionKey, {
        ...session,
        logoutTime: new Date().toISOString(),
        status: "inactive",
      });
    }

    // Log logout interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "logout",
      email: user.email,
      sessionId,
      timestamp: new Date().toISOString(),
    });

    // Sign out from Supabase
    await supabase.auth.admin.signOut(accessToken);

    return c.json({ success: true });
  } catch (error) {
    console.log("Signout error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== INTERACTION TRACKING ====================

// Track user interaction
app.post("/make-server-c1a0b791/track/interaction", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { action, step, data: interactionData } = await c.req.json();
    const userId = user.id;
    const timestamp = Date.now();

    // Store interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action,
      step,
      data: interactionData,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log("Track interaction error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ASSESSMENT DATA ====================

// Save assessment progress
app.post("/make-server-c1a0b791/assessment/save", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { profile, step } = await c.req.json();
    const userId = user.id;
    const timestamp = Date.now();

    // Save assessment data
    await kv.set(`user_assessment:${userId}`, {
      userId,
      email: user.email,
      profile,
      currentStep: step,
      lastUpdated: new Date().toISOString(),
    });

    // Track interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "assessment_progress",
      step,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log("Save assessment error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Save final results
app.post("/make-server-c1a0b791/assessment/results", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { profile, results } = await c.req.json();
    const userId = user.id;
    const timestamp = Date.now();

    // Save results
    await kv.set(`user_results:${userId}`, {
      userId,
      email: user.email,
      profile,
      results,
      completedAt: new Date().toISOString(),
    });

    // Track interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "assessment_completed",
      email: user.email,
      resultsCount: results.length,
      timestamp: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log("Save results error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user's assessment data
app.get("/make-server-c1a0b791/assessment/get", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const userId = user.id;

    const assessment = await kv.get(`user_assessment:${userId}`);
    const results = await kv.get(`user_results:${userId}`);

    return c.json({ 
      success: true, 
      assessment,
      results 
    });
  } catch (error) {
    console.log("Get assessment error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ADMIN ANALYTICS ====================

// Get all user interactions (for admin dashboard)
app.get("/make-server-c1a0b791/admin/interactions", async (c) => {
  try {
    // In production, you'd want to add admin authentication here
    const interactions = await kv.getByPrefix("user_interaction:");
    
    return c.json({ 
      success: true, 
      interactions,
      count: interactions.length 
    });
  } catch (error) {
    console.log("Get interactions error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all sessions (for admin dashboard)
app.get("/make-server-c1a0b791/admin/sessions", async (c) => {
  try {
    const sessions = await kv.getByPrefix("user_session:");
    
    return c.json({ 
      success: true, 
      sessions,
      count: sessions.length 
    });
  } catch (error) {
    console.log("Get sessions error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all assessments (for admin dashboard)
app.get("/make-server-c1a0b791/admin/assessments", async (c) => {
  try {
    const assessments = await kv.getByPrefix("user_assessment:");
    const results = await kv.getByPrefix("user_results:");
    
    return c.json({ 
      success: true, 
      assessments,
      results,
      totalUsers: assessments.length 
    });
  } catch (error) {
    console.log("Get assessments error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== RESUME ANALYSIS ====================

// Analyze resume
app.post("/make-server-c1a0b791/resume/analyze", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { resumeText, fileName } = await c.req.json();
    const userId = user.id;
    const timestamp = Date.now();

    // Simple text analysis (in production, use proper NLP/AI)
    const lowerText = resumeText.toLowerCase();
    
    // Check for bachelor's degree or higher
    const hasDegree = 
      lowerText.includes("bachelor") ||
      lowerText.includes("b.tech") ||
      lowerText.includes("b.e.") ||
      lowerText.includes("b.sc") ||
      lowerText.includes("b.a.") ||
      lowerText.includes("b.com") ||
      lowerText.includes("master") ||
      lowerText.includes("m.tech") ||
      lowerText.includes("mba") ||
      lowerText.includes("m.sc") ||
      lowerText.includes("phd") ||
      lowerText.includes("doctorate");

    if (!hasDegree) {
      return c.json({ 
        error: "Bachelor's degree or higher required", 
        degreeRequired: true 
      }, 400);
    }

    // Extract information
    const skills = extractSkills(resumeText);
    const education = extractEducation(resumeText);
    const experience = extractExperience(resumeText);

    const analysis = {
      education,
      experience,
      skills,
      fileName,
      analyzedAt: new Date().toISOString(),
    };

    // Save resume analysis
    await kv.set(`user_resume:${userId}`, {
      userId,
      email: user.email,
      analysis,
      uploadedAt: new Date().toISOString(),
    });

    // Track interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "resume_uploaded",
      email: user.email,
      fileName,
      timestamp: new Date().toISOString(),
    });

    return c.json({ success: true, analysis });
  } catch (error) {
    console.log("Resume analysis error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Generate recommendations from resume with ATS score
app.post("/make-server-c1a0b791/resume/recommendations", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { analysis } = await c.req.json();
    const userId = user.id;
    const timestamp = Date.now();

    // Calculate ATS score
    const atsScore = calculateATSScore(analysis);

    // Generate career recommendations based on skills
    const recommendations = generateCareerRecommendations(analysis);

    // Prepare complete results
    const results = {
      atsScore: atsScore.overallScore,
      formatScore: atsScore.formatScore,
      keywordScore: atsScore.keywordScore,
      contentScore: atsScore.contentScore,
      suggestions: atsScore.suggestions,
      recommendations,
    };

    // Save recommendations with ATS score
    await kv.set(`user_resume_recommendations:${userId}`, {
      userId,
      email: user.email,
      results,
      generatedAt: new Date().toISOString(),
    });

    // Track interaction
    await kv.set(`user_interaction:${userId}:${timestamp}`, {
      action: "resume_recommendations_generated",
      email: user.email,
      atsScore: atsScore.overallScore,
      recommendationsCount: recommendations.length,
      timestamp: new Date().toISOString(),
    });

    return c.json({ success: true, ...results });
  } catch (error) {
    console.log("Resume recommendations error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Helper function to calculate ATS score
function calculateATSScore(analysis: any): any {
  const skills = analysis.skills || [];
  const education = analysis.education || "";
  const experience = analysis.experience || "";

  // Format Score (out of 100)
  let formatScore = 0;
  formatScore += skills.length > 0 ? 40 : 0; // Has skills section
  formatScore += education ? 30 : 0; // Has education
  formatScore += experience ? 30 : 0; // Has experience

  // Keyword Score (based on number of relevant skills)
  let keywordScore = 0;
  if (skills.length >= 10) keywordScore = 100;
  else if (skills.length >= 7) keywordScore = 80;
  else if (skills.length >= 5) keywordScore = 60;
  else if (skills.length >= 3) keywordScore = 40;
  else keywordScore = 20;

  // Content Score (based on quality of information)
  let contentScore = 0;
  contentScore += education.toLowerCase().includes("bachelor") || education.toLowerCase().includes("master") || education.toLowerCase().includes("phd") ? 40 : 20;
  contentScore += experience.toLowerCase().includes("year") ? 30 : 10;
  contentScore += skills.length >= 5 ? 30 : 10;

  // Overall Score
  const overallScore = Math.round((formatScore + keywordScore + contentScore) / 3);

  // Suggestions based on score
  const suggestions: string[] = [];
  if (formatScore < 80) {
    suggestions.push("Add more structured sections (Education, Experience, Skills)");
  }
  if (keywordScore < 80) {
    suggestions.push("Include more relevant technical skills and keywords");
  }
  if (contentScore < 80) {
    suggestions.push("Provide more detailed work experience with specific achievements");
  }
  if (skills.length < 5) {
    suggestions.push("Add more skills relevant to your target role");
  }
  if (!experience.toLowerCase().includes("year")) {
    suggestions.push("Clearly mention years of experience in each role");
  }
  if (overallScore >= 80) {
    suggestions.push("Great job! Your resume is well-optimized for ATS systems");
  }

  return {
    overallScore,
    formatScore,
    keywordScore,
    contentScore,
    suggestions,
  };
}

// Helper function to extract skills
function extractSkills(text: string): string[] {
  const skillKeywords = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", "Angular", "Vue",
    "SQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "Docker", "Kubernetes",
    "Machine Learning", "Data Analysis", "Excel", "PowerBI", "Tableau",
    "Leadership", "Management", "Communication", "Problem Solving",
    "Marketing", "SEO", "Content Writing", "Photoshop", "Figma",
    "Project Management", "Agile", "Scrum", "Git", "HTML", "CSS"
  ];

  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

// Helper function to extract education
function extractEducation(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("phd") || lowerText.includes("doctorate")) {
    return "PhD / Doctorate";
  }
  if (lowerText.includes("master") || lowerText.includes("m.tech") || lowerText.includes("mba") || lowerText.includes("m.sc")) {
    return "Master's Degree";
  }
  if (lowerText.includes("bachelor") || lowerText.includes("b.tech") || lowerText.includes("b.e") || lowerText.includes("b.sc") || lowerText.includes("b.a") || lowerText.includes("b.com")) {
    return "Bachelor's Degree";
  }
  
  return "Degree detected";
}

// Helper function to extract experience
function extractExperience(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Look for year patterns
  if (lowerText.includes("5+ years") || lowerText.includes("5-")) {
    return "5+ years of experience";
  }
  if (lowerText.includes("3+ years") || lowerText.includes("3-4 years")) {
    return "3-4 years of experience";
  }
  if (lowerText.includes("1-2 years") || lowerText.includes("fresher")) {
    return "1-2 years of experience";
  }
  
  // Count occurrences of year ranges
  const yearMatches = text.match(/\d{4}\s*-\s*\d{4}/g);
  if (yearMatches && yearMatches.length > 2) {
    return "5+ years of experience";
  } else if (yearMatches && yearMatches.length > 0) {
    return "1-3 years of experience";
  }
  
  return "Experience detected";
}

// Helper function to generate career recommendations
function generateCareerRecommendations(analysis: any): any[] {
  const skills = analysis.skills || [];
  const recommendations = [];

  // Tech careers
  if (skills.some((s: string) => ["JavaScript", "React", "Node.js", "HTML", "CSS", "Angular", "Vue"].includes(s))) {
    recommendations.push({
      title: "Frontend Developer",
      matchScore: 85,
      reason: "Strong match based on web development skills",
      requiredSkills: ["JavaScript", "React", "HTML/CSS"],
      salary: "₹4-8 LPA (Entry), ₹10-20 LPA (Mid)",
    });
  }

  if (skills.some((s: string) => ["Python", "Machine Learning", "Data Analysis"].includes(s))) {
    recommendations.push({
      title: "Data Scientist",
      matchScore: 90,
      reason: "Excellent match for data science skills",
      requiredSkills: ["Python", "ML", "Statistics"],
      salary: "₹6-10 LPA (Entry), ₹15-30 LPA (Mid)",
    });
  }

  if (skills.some((s: string) => ["Java", "Python", "C++", "SQL"].includes(s))) {
    recommendations.push({
      title: "Software Developer",
      matchScore: 88,
      reason: "Strong programming foundation",
      requiredSkills: ["Programming", "DSA", "System Design"],
      salary: "₹5-9 LPA (Entry), ₹12-25 LPA (Mid)",
    });
  }

  if (skills.some((s: string) => ["AWS", "Azure", "Docker", "Kubernetes"].includes(s))) {
    recommendations.push({
      title: "DevOps Engineer",
      matchScore: 82,
      reason: "Cloud and DevOps skills detected",
      requiredSkills: ["Cloud", "CI/CD", "Containers"],
      salary: "₹6-12 LPA (Entry), ₹15-30 LPA (Mid)",
    });
  }

  // Business careers
  if (skills.some((s: string) => ["Marketing", "SEO", "Content Writing"].includes(s))) {
    recommendations.push({
      title: "Digital Marketing Specialist",
      matchScore: 80,
      reason: "Marketing skills alignment",
      requiredSkills: ["SEO", "Social Media", "Analytics"],
      salary: "₹3-6 LPA (Entry), ₹8-15 LPA (Mid)",
    });
  }

  if (skills.some((s: string) => ["Management", "Leadership", "Project Management", "Agile"].includes(s))) {
    recommendations.push({
      title: "Project Manager",
      matchScore: 85,
      reason: "Management and leadership capabilities",
      requiredSkills: ["Leadership", "Planning", "Communication"],
      salary: "₹8-15 LPA (Entry), ₹20-40 LPA (Mid)",
    });
  }

  // Design careers
  if (skills.some((s: string) => ["Figma", "Photoshop"].includes(s))) {
    recommendations.push({
      title: "UI/UX Designer",
      matchScore: 87,
      reason: "Design tool proficiency",
      requiredSkills: ["Figma", "User Research", "Prototyping"],
      salary: "₹4-7 LPA (Entry), ₹10-18 LPA (Mid)",
    });
  }

  // Default recommendations if no specific match
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Business Analyst",
      matchScore: 70,
      reason: "General analytical skills",
      requiredSkills: ["Analysis", "Communication", "Excel"],
      salary: "₹5-8 LPA (Entry), ₹12-20 LPA (Mid)",
    });
  }

  return recommendations.slice(0, 6); // Return top 6
}

// Health check
app.get("/make-server-c1a0b791/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
