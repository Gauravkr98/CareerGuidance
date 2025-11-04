import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { serverUrl, getAuthHeaders } from "../lib/supabaseClient";

interface ResumeAnalysisProps {
  accessToken: string;
  onBack: () => void;
  onViewResults: (results: any) => void;
}

export function ResumeAnalysis({
  accessToken,
  onBack,
  onViewResults,
}: ResumeAnalysisProps) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [atsResults, setAtsResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [degreeError, setDegreeError] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    setUploading(true);
    setError("");
    setDegreeError(false);
    setShowResults(false);

    try {
      // Read file as text (simplified - in production use proper PDF parser)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        
        // Send to backend for analysis
        const response = await fetch(`${serverUrl}/resume/analyze`, {
          method: "POST",
          headers: getAuthHeaders(accessToken),
          body: JSON.stringify({ resumeText: text, fileName: file.name }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          if (data.degreeRequired) {
            setDegreeError(true);
            setError("Resume analysis is only available for candidates with a Bachelor's degree or higher.");
          } else {
            setError(data.error || "Failed to analyze resume");
          }
          setUploading(false);
          return;
        }

        setExtractedData(data.analysis);
        setUploading(false);
        setAnalyzing(true);

        // Auto-generate ATS score and recommendations after 2 seconds
        setTimeout(() => {
          generateResults(data.analysis);
        }, 2000);
      };

      reader.readAsText(file);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload resume");
      setUploading(false);
    }
  };

  const generateResults = async (analysis: any) => {
    try {
      const response = await fetch(`${serverUrl}/resume/recommendations`, {
        method: "POST",
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify({ analysis }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalyzing(false);
        setAtsResults(data);
        setShowResults(true);
      } else {
        setError(data.error || "Failed to generate results");
        setAnalyzing(false);
      }
    } catch (err) {
      console.error("Results error:", err);
      setError("Failed to generate results");
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Home
          </Button>
          <h1 className="text-gray-800 mb-2">📄 AI Resume Analysis</h1>
          <p className="text-gray-600">
            Upload your resume for ATS score and personalized career recommendations
          </p>
        </div>

        {/* Upload Section */}
        {!extractedData && !analyzing && !showResults && (
          <Card className="p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">📤</div>
                <h2 className="text-gray-800 mb-2">Upload Your Resume</h2>
                <p className="text-gray-600">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </div>

              <div className="mb-6">
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    size="lg"
                    disabled={uploading}
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                  >
                    {uploading ? "Uploading..." : "Choose File"}
                  </Button>
                </label>
              </div>

              {error && (
                <Alert className={`mb-6 ${degreeError ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}>
                  <AlertDescription className={degreeError ? "text-yellow-700" : "text-red-700"}>
                    {error}
                    {degreeError && (
                      <div className="mt-2">
                        <p className="mb-2">This feature requires:</p>
                        <ul className="list-disc list-inside text-sm">
                          <li>Bachelor's degree (B.Tech, B.Sc, BA, etc.)</li>
                          <li>Master's degree (M.Tech, MBA, etc.)</li>
                          <li>PhD or higher</li>
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <Card className="p-4 bg-purple-50">
                  <div className="text-3xl mb-2">🤖</div>
                  <h3 className="text-gray-800 mb-1">AI Analysis</h3>
                  <p className="text-gray-600">Advanced AI extracts key information</p>
                </Card>
                <Card className="p-4 bg-blue-50">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="text-gray-800 mb-1">ATS Score</h3>
                  <p className="text-gray-600">Get your resume's ATS compatibility score</p>
                </Card>
                <Card className="p-4 bg-green-50">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="text-gray-800 mb-1">Career Match</h3>
                  <p className="text-gray-600">Personalized career recommendations</p>
                </Card>
              </div>
            </div>
          </Card>
        )}

        {/* Analyzing State */}
        {analyzing && (
          <Card className="p-8">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">🤖</div>
              <h2 className="text-gray-800 mb-2">Analyzing Your Resume...</h2>
              <p className="text-gray-600 mb-6">
                Our AI is processing your information
              </p>
              <Progress value={65} className="mb-4" />
              <div className="space-y-2 text-gray-600">
                <p>✓ Extracting education and experience</p>
                <p>✓ Analyzing skills and competencies</p>
                <p>✓ Calculating ATS score</p>
                <p className="animate-pulse">⟳ Generating career recommendations...</p>
              </div>
            </div>
          </Card>
        )}

        {/* Results Section */}
        {showResults && atsResults && (
          <div className="space-y-6">
            {/* ATS Score Card */}
            <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="text-center mb-6">
                <h2 className="text-gray-800 mb-4">📊 ATS Compatibility Score</h2>
                <div className={`inline-block p-8 rounded-full ${getScoreBgColor(atsResults.atsScore)}`}>
                  <div className={`text-6xl ${getScoreColor(atsResults.atsScore)}`}>
                    {atsResults.atsScore}%
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  {atsResults.atsScore >= 80 && "Excellent! Your resume is highly ATS-friendly"}
                  {atsResults.atsScore >= 60 && atsResults.atsScore < 80 && "Good! Some improvements recommended"}
                  {atsResults.atsScore < 60 && "Needs improvement to pass ATS systems"}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">📝 Format</span>
                    <Badge className={getScoreBgColor(atsResults.formatScore)}>
                      {atsResults.formatScore}%
                    </Badge>
                  </div>
                  <Progress value={atsResults.formatScore} className="h-2" />
                </Card>

                <Card className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">🔑 Keywords</span>
                    <Badge className={getScoreBgColor(atsResults.keywordScore)}>
                      {atsResults.keywordScore}%
                    </Badge>
                  </div>
                  <Progress value={atsResults.keywordScore} className="h-2" />
                </Card>

                <Card className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">📄 Content</span>
                    <Badge className={getScoreBgColor(atsResults.contentScore)}>
                      {atsResults.contentScore}%
                    </Badge>
                  </div>
                  <Progress value={atsResults.contentScore} className="h-2" />
                </Card>
              </div>
            </Card>

            {/* Resume Details */}
            <Card className="p-6">
              <h3 className="text-gray-800 mb-4">📋 Resume Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-700 mb-2">🎓 Education</h4>
                  <p className="text-gray-600">{extractedData?.education || "Not detected"}</p>
                </div>

                <div>
                  <h4 className="text-gray-700 mb-2">💼 Experience</h4>
                  <p className="text-gray-600">{extractedData?.experience || "Not detected"}</p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-gray-700 mb-2">🔧 Skills Detected ({extractedData?.skills?.length || 0})</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedData?.skills?.map((skill: string, index: number) => (
                      <Badge key={index} className="bg-blue-100 text-blue-700">
                        {skill}
                      </Badge>
                    )) || <span className="text-gray-500">No skills detected</span>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Suggestions for Improvement */}
            {atsResults.suggestions && atsResults.suggestions.length > 0 && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h3 className="text-gray-800 mb-4">💡 Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {atsResults.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-yellow-600 mt-1">▸</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Career Recommendations */}
            <Card className="p-6">
              <h3 className="text-gray-800 mb-4">🎯 Career Recommendations Based on Your Resume</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {atsResults.recommendations?.map((career: any, index: number) => (
                  <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-gray-800">{career.title}</h4>
                      <Badge className="bg-green-100 text-green-700">
                        {career.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{career.reason}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>💰</span>
                        <span>{career.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {career.requiredSkills?.map((skill: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowResults(false);
                  setExtractedData(null);
                  setAtsResults(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Analyze Another Resume
              </Button>
              <Button
                onClick={onBack}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            <strong>📌 Note:</strong> Resume analysis is available for candidates with a Bachelor's degree or higher education. ATS score helps you understand how well your resume will perform in Applicant Tracking Systems.
          </p>
        </div>
      </div>
    </div>
  );
}
