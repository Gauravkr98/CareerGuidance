import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { CareerCard } from "./CareerCard";
import { careers, calculateCareerMatch, getSkillGaps, Career } from "../lib/careerData";

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

interface ResultsPageProps {
  userProfile: UserProfile;
  onRestart: () => void;
  accessToken?: string;
}

export function ResultsPage({ userProfile, onRestart, accessToken }: ResultsPageProps) {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate match scores for all careers
  const careerMatches = careers
    .map((career) => ({
      career,
      matchScore: calculateCareerMatch(career, {
        aptitudes: userProfile.aptitudes,
        interests: userProfile.interests,
        skills: userProfile.skills,
      }),
      skillGaps: getSkillGaps(career, userProfile.skills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const topMatches = careerMatches.slice(0, 6);

  // Save results when component mounts
  useEffect(() => {
    if (accessToken) {
      const saveResults = async () => {
        try {
          const { saveAssessmentResults, trackInteraction } = await import("../lib/supabaseClient");
          
          await saveAssessmentResults(
            accessToken,
            userProfile,
            careerMatches.map(cm => ({
              careerId: cm.career.id,
              careerTitle: cm.career.title,
              matchScore: cm.matchScore,
              skillGaps: cm.skillGaps,
            }))
          );

          await trackInteraction(accessToken, "viewed_results", "results", {
            topCareer: topMatches[0]?.career.title,
            topScore: topMatches[0]?.matchScore,
          });
        } catch (error) {
          console.error("Error saving results:", error);
        }
      };
      
      saveResults();
    }
  }, [accessToken]);

  const handleViewDetails = async (career: Career) => {
    setSelectedCareer(career);
    setShowDetails(true);
    
    // Track career view
    if (accessToken) {
      const { trackInteraction } = await import("../lib/supabaseClient");
      await trackInteraction(accessToken, "viewed_career_details", "results", {
        careerId: career.id,
        careerTitle: career.title,
      });
    }
  };

  const formatSalary = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const selectedMatch = careerMatches.find((cm) => cm.career.id === selectedCareer?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">✨</span>
            <h1 className="text-purple-600">Your Personalized Career Recommendations</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your aptitudes, interests, and experience, we've identified the best career
            paths for you.
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="p-6 mb-8">
          <h2 className="mb-4 text-gray-800">Your Profile Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="mb-3 text-gray-700">Top Strengths</h3>
              <div className="space-y-2">
                {Object.entries(userProfile.aptitudes)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([apt, score]) => (
                    <div key={apt}>
                      <div className="flex justify-between mb-1">
                        <span className="capitalize text-gray-700">{apt}</span>
                        <span className="text-gray-600">{score}/5</span>
                      </div>
                      <Progress value={(score / 5) * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-gray-700">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.slice(0, 6).map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-700">
                    {skill}
                  </Badge>
                ))}
                {userProfile.skills.length > 6 && (
                  <Badge variant="secondary">+{userProfile.skills.length - 6} more</Badge>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-gray-700">Background</h3>
              <div className="space-y-2 text-gray-600">
                <p>Education: {userProfile.education}</p>
                <p>Experience: {userProfile.experience}</p>
                <p>Timeline: {userProfile.timeframe}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Career Recommendations */}
        <div className="mb-8">
          <h2 className="mb-6 text-gray-800">Recommended Career Paths</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMatches.map(({ career, matchScore }) => (
              <CareerCard
                key={career.id}
                career={career}
                matchScore={matchScore}
                onViewDetails={() => handleViewDetails(career)}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={onRestart}
            variant="outline"
            size="lg"
          >
            Start New Assessment
          </Button>
        </div>
      </div>

      {/* Career Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCareer && selectedMatch && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCareer.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Match Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Career Match Score</span>
                    <span className="text-2xl text-purple-600">{selectedMatch.matchScore}%</span>
                  </div>
                  <Progress value={selectedMatch.matchScore} className="h-3" />
                </div>

                {/* Description */}
                <div>
                  <h3 className="mb-2 text-gray-800">About This Career</h3>
                  <p className="text-gray-600">{selectedCareer.description}</p>
                </div>

                {/* Salary Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="mb-3 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Salary Range (India)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <p className="text-gray-600">Entry Level</p>
                      <p className="text-xl">
                        {formatSalary(selectedCareer.salaryRange.min)} - {formatSalary(selectedCareer.salaryRange.max)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Experienced (5+ years)</p>
                      <p className="text-xl">{formatSalary(selectedCareer.salaryRange.experienced)}</p>
                    </div>
                  </div>
                </div>

                {/* Future Outlook */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="mb-2 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Future Outlook
                  </h3>
                  <p className="text-gray-700">{selectedCareer.futureOutlook}</p>
                  <p className="mt-2">
                    <Badge className="bg-green-500 text-white">
                      {selectedCareer.growthRate}% Expected Growth
                    </Badge>
                  </p>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="mb-3 text-gray-800">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.requiredSkills.map((skill) => {
                      const hasSkill = userProfile.skills.includes(skill);
                      return (
                        <Badge
                          key={skill}
                          variant={hasSkill ? "default" : "outline"}
                          className={hasSkill ? "bg-green-500 text-white" : ""}
                        >
                          {hasSkill ? "✓ " : ""}
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Skill Gaps */}
                {selectedMatch.skillGaps.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="mb-3 text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Skills to Develop
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatch.skillGaps.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-yellow-600 text-yellow-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Path */}
                <div>
                  <h3 className="mb-3 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Your Learning Path
                  </h3>
                  <ol className="space-y-3">
                    {selectedCareer.learningPath.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Ready to Start?
                  </h3>
                  <p>
                    With your {selectedMatch.matchScore}% match score, you have great potential in this field.
                    Focus on developing the highlighted skills and following the learning path to
                    kickstart your career!
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
