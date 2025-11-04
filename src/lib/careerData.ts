import { images } from "../assets/images/config";

// Career database with Indian salary ranges and requirements
export interface Career {
  id: string;
  title: string;
  description: string;
  salaryRange: {
    min: number;
    max: number;
    experienced: number; // 5+ years experience
  };
  requiredAptitudes: string[];
  requiredSkills: string[];
  industries: string[];
  growthRate: number; // percentage
  futureOutlook: string;
  learningPath: string[];
  imageUrl: string;
}

export const careers: Career[] = [
  {
    id: "software_developer",
    title: "Software Developer",
    description:
      "Design, develop, and maintain software applications and systems using various programming languages and frameworks.",
    salaryRange: {
      min: 300000,
      max: 800000,
      experienced: 2000000,
    },
    requiredAptitudes: ["analytical", "technical", "creative"],
    requiredSkills: ["Programming", "Problem Solving", "Critical Thinking"],
    industries: ["technology"],
    growthRate: 22,
    futureOutlook: "Excellent - High demand with emerging technologies like AI, Cloud",
    learningPath: [
      "Learn programming fundamentals (Python/Java)",
      "Build projects and portfolio",
      "Master data structures & algorithms",
      "Learn web development or mobile development",
      "Contribute to open source",
    ],
    imageUrl: images.careers.technology,
  },
  {
    id: "data_scientist",
    title: "Data Scientist",
    description:
      "Analyze complex data sets to help organizations make better decisions using statistical analysis, machine learning, and data visualization.",
    salaryRange: {
      min: 400000,
      max: 1000000,
      experienced: 2500000,
    },
    requiredAptitudes: ["analytical", "technical"],
    requiredSkills: ["Data Analysis", "Programming", "Critical Thinking", "Research"],
    industries: ["technology", "finance", "business"],
    growthRate: 28,
    futureOutlook: "Excellent - Growing demand across all industries",
    learningPath: [
      "Learn Python and R programming",
      "Master statistics and mathematics",
      "Study machine learning algorithms",
      "Practice with real datasets",
      "Build data science projects",
    ],
    imageUrl: images.careers.technology,
  },
  {
    id: "digital_marketing",
    title: "Digital Marketing Manager",
    description:
      "Plan and execute digital marketing campaigns across various channels to promote products and services.",
    salaryRange: {
      min: 350000,
      max: 700000,
      experienced: 1500000,
    },
    requiredAptitudes: ["creative", "analytical", "interpersonal"],
    requiredSkills: ["Digital Marketing", "Communication", "Data Analysis", "Writing"],
    industries: ["marketing", "business", "technology"],
    growthRate: 18,
    futureOutlook: "Very Good - Digital transformation driving demand",
    learningPath: [
      "Learn SEO and SEM basics",
      "Master social media marketing",
      "Get Google Analytics certified",
      "Study content marketing",
      "Build portfolio of campaigns",
    ],
    imageUrl: images.careers.business,
  },
  {
    id: "ui_ux_designer",
    title: "UI/UX Designer",
    description:
      "Create intuitive and beautiful user interfaces and experiences for websites and mobile applications.",
    salaryRange: {
      min: 350000,
      max: 900000,
      experienced: 1800000,
    },
    requiredAptitudes: ["creative", "analytical", "technical"],
    requiredSkills: ["Design", "Problem Solving", "Communication", "Critical Thinking"],
    industries: ["creative", "technology"],
    growthRate: 20,
    futureOutlook: "Excellent - Every digital product needs great UX",
    learningPath: [
      "Learn design fundamentals",
      "Master Figma/Adobe XD",
      "Study user research methods",
      "Build design portfolio",
      "Learn prototyping tools",
    ],
    imageUrl: images.careers.creative,
  },
  {
    id: "business_analyst",
    title: "Business Analyst",
    description:
      "Bridge the gap between business needs and technology solutions by analyzing processes and requirements.",
    salaryRange: {
      min: 400000,
      max: 900000,
      experienced: 1800000,
    },
    requiredAptitudes: ["analytical", "interpersonal", "leadership"],
    requiredSkills: ["Data Analysis", "Communication", "Problem Solving", "Critical Thinking"],
    industries: ["business", "technology", "finance"],
    growthRate: 16,
    futureOutlook: "Very Good - Essential for digital transformation",
    learningPath: [
      "Learn business analysis fundamentals",
      "Master requirement gathering",
      "Get CBAP certification",
      "Learn data analysis tools",
      "Study process modeling",
    ],
    imageUrl: images.careers.professional,
  },
  {
    id: "content_writer",
    title: "Content Writer",
    description:
      "Create engaging written content for websites, blogs, social media, and marketing materials.",
    salaryRange: {
      min: 250000,
      max: 600000,
      experienced: 1200000,
    },
    requiredAptitudes: ["linguistic", "creative"],
    requiredSkills: ["Writing", "Communication", "Research", "Critical Thinking"],
    industries: ["marketing", "creative", "technology"],
    growthRate: 14,
    futureOutlook: "Good - Content marketing continues to grow",
    learningPath: [
      "Develop writing skills daily",
      "Learn SEO writing",
      "Build writing portfolio",
      "Study content strategy",
      "Master different content formats",
    ],
    imageUrl: images.careers.creative,
  },
  {
    id: "product_manager",
    title: "Product Manager",
    description:
      "Lead product development from ideation to launch, working with cross-functional teams to build successful products.",
    salaryRange: {
      min: 800000,
      max: 1500000,
      experienced: 3500000,
    },
    requiredAptitudes: ["leadership", "analytical", "interpersonal"],
    requiredSkills: ["Leadership", "Communication", "Project Management", "Problem Solving"],
    industries: ["technology", "business"],
    growthRate: 25,
    futureOutlook: "Excellent - Critical role in tech companies",
    learningPath: [
      "Gain technical understanding",
      "Learn product management frameworks",
      "Develop leadership skills",
      "Master user research",
      "Build product portfolio",
    ],
    imageUrl: images.careers.teamwork,
  },
  {
    id: "financial_analyst",
    title: "Financial Analyst",
    description:
      "Analyze financial data and provide insights to help businesses make informed investment and budgeting decisions.",
    salaryRange: {
      min: 400000,
      max: 900000,
      experienced: 2000000,
    },
    requiredAptitudes: ["analytical", "technical"],
    requiredSkills: ["Data Analysis", "Critical Thinking", "Communication", "Problem Solving"],
    industries: ["finance", "business"],
    growthRate: 12,
    futureOutlook: "Good - Always in demand in financial sector",
    learningPath: [
      "Learn financial modeling",
      "Master Excel and financial software",
      "Get CFA certification",
      "Study accounting principles",
      "Develop analytical skills",
    ],
    imageUrl: images.careers.business,
  },
  {
    id: "hr_manager",
    title: "HR Manager",
    description:
      "Manage recruitment, employee relations, training, and organizational development to build strong teams.",
    salaryRange: {
      min: 400000,
      max: 800000,
      experienced: 1600000,
    },
    requiredAptitudes: ["interpersonal", "leadership"],
    requiredSkills: ["Communication", "Leadership", "Problem Solving", "Teamwork"],
    industries: ["business"],
    growthRate: 10,
    futureOutlook: "Good - Essential for all organizations",
    learningPath: [
      "Study HR management principles",
      "Get SHRM certification",
      "Develop people skills",
      "Learn employment law",
      "Master HR software",
    ],
    imageUrl: images.careers.teamwork,
  },
  {
    id: "mechanical_engineer",
    title: "Mechanical Engineer",
    description:
      "Design, develop, and test mechanical devices and systems for various applications in manufacturing and industry.",
    salaryRange: {
      min: 350000,
      max: 700000,
      experienced: 1500000,
    },
    requiredAptitudes: ["technical", "analytical"],
    requiredSkills: ["Problem Solving", "Critical Thinking", "Teamwork"],
    industries: ["engineering"],
    growthRate: 8,
    futureOutlook: "Stable - Core engineering field with steady demand",
    learningPath: [
      "Complete engineering degree",
      "Learn CAD software",
      "Gain practical experience",
      "Study thermodynamics & mechanics",
      "Work on real projects",
    ],
    imageUrl: images.careers.professional,
  },
];

export function calculateCareerMatch(
  career: Career,
  userProfile: {
    aptitudes: Record<string, number>;
    interests: string[];
    skills: string[];
  }
): number {
  let score = 0;
  let totalWeight = 0;

  // Aptitude match (40% weight)
  const aptitudeWeight = 40;
  const aptitudeScores = career.requiredAptitudes.map(
    (apt) => userProfile.aptitudes[apt] || 0
  );
  const avgAptitude = aptitudeScores.length
    ? aptitudeScores.reduce((a, b) => a + b, 0) / aptitudeScores.length
    : 0;
  score += (avgAptitude / 5) * aptitudeWeight;
  totalWeight += aptitudeWeight;

  // Interest match (35% weight)
  const interestWeight = 35;
  const hasMatchingInterest = career.industries.some((ind) =>
    userProfile.interests.includes(ind)
  );
  score += hasMatchingInterest ? interestWeight : 0;
  totalWeight += interestWeight;

  // Skills match (25% weight)
  const skillWeight = 25;
  const matchingSkills = career.requiredSkills.filter((skill) =>
    userProfile.skills.includes(skill)
  );
  const skillMatchRatio = career.requiredSkills.length
    ? matchingSkills.length / career.requiredSkills.length
    : 0;
  score += skillMatchRatio * skillWeight;
  totalWeight += skillWeight;

  return Math.round((score / totalWeight) * 100);
}

export function getSkillGaps(career: Career, userSkills: string[]): string[] {
  return career.requiredSkills.filter((skill) => !userSkills.includes(skill));
}
