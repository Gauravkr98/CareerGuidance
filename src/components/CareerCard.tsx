import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Career } from "../lib/careerData";

interface CareerCardProps {
  career: Career;
  matchScore: number;
  onViewDetails: () => void;
}

export function CareerCard({ career, matchScore, onViewDetails }: CareerCardProps) {
  const formatSalary = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={career.imageUrl}
          alt={career.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge
            className={`${
              matchScore >= 80
                ? "bg-green-500"
                : matchScore >= 60
                ? "bg-blue-500"
                : "bg-gray-500"
            } text-white`}
          >
            {matchScore}% Match
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-gray-800">{career.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{career.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <span>💰</span>
            <span>
              {formatSalary(career.salaryRange.min)} - {formatSalary(career.salaryRange.max)} /year
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>🏆</span>
            <span>With experience: {formatSalary(career.salaryRange.experienced)} /year</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>📈</span>
            <span className="text-green-600">{career.growthRate}% growth rate</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {career.requiredSkills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
            {career.requiredSkills.length > 3 && (
              <Badge variant="outline">+{career.requiredSkills.length - 3} more</Badge>
            )}
          </div>
        </div>

        <Button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          📚 View Career Path
        </Button>
      </div>
    </Card>
  );
}
