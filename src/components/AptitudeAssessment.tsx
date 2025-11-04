import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

interface Question {
  id: string;
  question: string;
  category: string;
  options: { value: string; label: string; score: number }[];
}

const questions: Question[] = [
  {
    id: "q1",
    question: "I enjoy solving complex mathematical problems and puzzles",
    category: "analytical",
    options: [
      { value: "strongly_agree", label: "Strongly Agree", score: 5 },
      { value: "agree", label: "Agree", score: 4 },
      { value: "neutral", label: "Neutral", score: 3 },
      { value: "disagree", label: "Disagree", score: 2 },
      { value: "strongly_disagree", label: "Strongly Disagree", score: 1 },
    ],
  },
  {
    id: "q2",
    question: "I prefer working with people rather than working alone",
    category: "interpersonal",
    options: [
      { value: "strongly_agree", label: "Strongly Agree", score: 5 },
      { value: "agree", label: "Agree", score: 4 },
      { value: "neutral", label: "Neutral", score: 3 },
      { value: "disagree", label: "Disagree", score: 2 },
      { value: "strongly_disagree", label: "Strongly Disagree", score: 1 },
    ],
  },
  {
    id: "q3",
    question: "I am good at creating visual designs and aesthetics",
    category: "creative",
    options: [
      { value: "strongly_agree", label: "Strongly Agree", score: 5 },
      { value: "agree", label: "Agree", score: 4 },
      { value: "neutral", label: "Neutral", score: 3 },
      { value: "disagree", label: "Disagree", score: 2 },
      { value: "strongly_disagree", label: "Strongly Disagree", score: 1 },
    ],
  },
  {
    id: "q4",
    question: "I enjoy building or fixing things with my hands",
    category: "technical",
    options: [
      { value: "strongly_agree", label: "Strongly Agree", score: 5 },
      { value: "agree", label: "Agree", score: 4 },
      { value: "neutral", label: "Neutral", score: 3 },
      { value: "disagree", label: "Disagree", score: 2 },
      { value: "strongly_disagree", label: "Strongly Disagree", score: 1 },
    ],
  },
  {
    id: "q5",
    question: "I can easily express my thoughts through writing",
    category: "linguistic",
    options: [
      { value: "strongly_agree", label: "Strongly Agree", score: 5 },
      { value: "agree", label: "Agree", score: 4 },
      { value: "neutral", label: "Neutral", score: 3 },
      { value: "disagree", label: "Disagree", score: 2 },
      { value: "strongly_disagree", label: "Strongly Disagree", score: 1 },
    ],
  },
  {
    id: "q6",
    question: "I enjoy leading teams and taking charge of projects",
    category: "leadership",
    options: [
      { value: "strongly_agree", label: "Strongly Agree", score: 5 },
      { value: "agree", label: "Agree", score: 4 },
      { value: "neutral", label: "Neutral", score: 3 },
      { value: "disagree", label: "Disagree", score: 2 },
      { value: "strongly_disagree", label: "Strongly Disagree", score: 1 },
    ],
  },
];

interface AptitudeAssessmentProps {
  onComplete: (aptitudes: Record<string, number>) => void;
  onBack: () => void;
}

export function AptitudeAssessment({ onComplete, onBack }: AptitudeAssessmentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate aptitude scores by category
    const aptitudeScores: Record<string, number> = {};
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find((o) => o.value === answer);
        if (option) {
          aptitudeScores[q.category] = (aptitudeScores[q.category] || 0) + option.score;
        }
      }
    });
    onComplete(aptitudeScores);
  };

  const question = questions[currentQuestion];
  const isAnswered = !!answers[question.id];
  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-gray-800">Aptitude Assessment</h2>
            <span className="text-gray-600">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h3 className="mb-6 text-gray-800">{question.question}</h3>
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={currentQuestion === 0 ? onBack : handlePrevious}
          >
            {currentQuestion === 0 ? "Back to Home" : "Previous"}
          </Button>
          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Continue to Next Step
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Next Question
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
