import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

const commonSkills = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Critical Thinking",
  "Programming",
  "Data Analysis",
  "Project Management",
  "Digital Marketing",
  "Design",
  "Sales",
  "Customer Service",
  "Research",
  "Writing",
];

interface SkillsExperienceFormProps {
  onComplete: (data: {
    education: string;
    experience: string;
    skills: string[];
    certifications: string;
  }) => void;
  onBack: () => void;
}

export function SkillsExperienceForm({ onComplete, onBack }: SkillsExperienceFormProps) {
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [certifications, setCertifications] = useState("");

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setCustomSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = () => {
    onComplete({
      education,
      experience,
      skills,
      certifications,
    });
  };

  const isValid = education && experience && skills.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <h2 className="mb-2 text-gray-800">Your Skills & Experience</h2>
        <p className="text-gray-600 mb-8">
          Tell us about your current abilities and background
        </p>

        {/* Education */}
        <div className="mb-6">
          <Label htmlFor="education" className="mb-2 block">
            Highest Education Level
          </Label>
          <Select value={education} onValueChange={setEducation}>
            <SelectTrigger id="education">
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10th">10th Standard</SelectItem>
              <SelectItem value="12th">12th Standard</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <Label htmlFor="experience" className="mb-2 block">
            Work Experience
          </Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger id="experience">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fresher">Fresher (No Experience)</SelectItem>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="2-5">2-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <Label className="mb-2 block">Your Skills</Label>
          <p className="text-gray-600 mb-3">
            Select from common skills or add your own
          </p>
          
          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Common Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {commonSkills
              .filter((s) => !skills.includes(s))
              .map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom skill..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(customSkill);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addSkill(customSkill)}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-8">
          <Label htmlFor="certifications" className="mb-2 block">
            Certifications (Optional)
          </Label>
          <Input
            id="certifications"
            placeholder="E.g., AWS Certified, Google Analytics, PMP..."
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            View Career Recommendations
          </Button>
        </div>
      </Card>
    </div>
  );
}
