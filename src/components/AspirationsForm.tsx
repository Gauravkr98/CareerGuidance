import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

const interests = [
  { id: "technology", label: "Technology & Innovation", icon: "💻" },
  { id: "business", label: "Business & Entrepreneurship", icon: "💼" },
  { id: "creative", label: "Creative Arts & Design", icon: "🎨" },
  { id: "healthcare", label: "Healthcare & Medicine", icon: "🏥" },
  { id: "education", label: "Education & Teaching", icon: "📚" },
  { id: "science", label: "Science & Research", icon: "🔬" },
  { id: "social", label: "Social Work & NGO", icon: "🤝" },
  { id: "finance", label: "Finance & Banking", icon: "💰" },
  { id: "marketing", label: "Marketing & Sales", icon: "📊" },
  { id: "engineering", label: "Engineering & Manufacturing", icon: "⚙️" },
];

const workValues = [
  { id: "work_life_balance", label: "Work-Life Balance" },
  { id: "high_salary", label: "High Salary" },
  { id: "job_security", label: "Job Security" },
  { id: "growth_opportunities", label: "Growth Opportunities" },
  { id: "flexibility", label: "Flexibility & Remote Work" },
  { id: "impact", label: "Making an Impact" },
  { id: "recognition", label: "Recognition & Status" },
  { id: "innovation", label: "Innovation & Creativity" },
];

interface AspirationsFormProps {
  onComplete: (data: {
    interests: string[];
    values: string[];
    goals: string;
    timeframe: string;
  }) => void;
  onBack: () => void;
}

export function AspirationsForm({ onComplete, onBack }: AspirationsFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [timeframe, setTimeframe] = useState<string>("");

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleValue = (id: string) => {
    setSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onComplete({
      interests: selectedInterests,
      values: selectedValues,
      goals,
      timeframe,
    });
  };

  const isValid = selectedInterests.length > 0 && selectedValues.length > 0 && timeframe;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <h2 className="mb-2 text-gray-800">Your Career Aspirations</h2>
        <p className="text-gray-600 mb-8">
          Help us understand what you're looking for in your ideal career
        </p>

        {/* Interests */}
        <div className="mb-8">
          <h3 className="mb-4 text-gray-800">What areas interest you? (Select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interests.map((interest) => (
              <div
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedInterests.includes(interest.id)
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="text-gray-800">{interest.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Values */}
        <div className="mb-8">
          <h3 className="mb-4 text-gray-800">What do you value most in a career? (Select top 3)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workValues.map((value) => (
              <div
                key={value.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
              >
                <Checkbox
                  id={value.id}
                  checked={selectedValues.includes(value.id)}
                  onCheckedChange={() => toggleValue(value.id)}
                  disabled={
                    !selectedValues.includes(value.id) && selectedValues.length >= 3
                  }
                />
                <Label htmlFor={value.id} className="flex-1 cursor-pointer">
                  {value.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Career Goals */}
        <div className="mb-8">
          <h3 className="mb-4 text-gray-800">What are your career goals? (Optional)</h3>
          <Textarea
            placeholder="E.g., I want to become a tech leader, start my own business, or make a difference in healthcare..."
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Timeframe */}
        <div className="mb-8">
          <h3 className="mb-4 text-gray-800">When do you plan to start your career?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Immediately", "6 months", "1 year", "2+ years"].map((option) => (
              <Button
                key={option}
                variant={timeframe === option ? "default" : "outline"}
                onClick={() => setTimeframe(option)}
                className={
                  timeframe === option
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : ""
                }
              >
                {option}
              </Button>
            ))}
          </div>
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
            Continue to Next Step
          </Button>
        </div>
      </Card>
    </div>
  );
}
