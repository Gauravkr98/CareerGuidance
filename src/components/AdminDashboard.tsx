import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { serverUrl, getAuthHeaders } from "../lib/supabaseClient";

interface Session {
  userId: string;
  email: string;
  name: string;
  sessionId: string;
  loginTime: string;
  logoutTime?: string;
  status: string;
}

interface Interaction {
  action: string;
  email: string;
  timestamp: string;
  step?: string;
  data?: any;
}

export function AdminDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load sessions
      const sessionsRes = await fetch(`${serverUrl}/admin/sessions`, {
        headers: getAuthHeaders(),
      });
      const sessionsData = await sessionsRes.json();
      if (sessionsData.success) {
        setSessions(sessionsData.sessions);
      }

      // Load interactions
      const interactionsRes = await fetch(`${serverUrl}/admin/interactions`, {
        headers: getAuthHeaders(),
      });
      const interactionsData = await interactionsRes.json();
      if (interactionsData.success) {
        setInteractions(interactionsData.interactions);
      }

      // Load assessments
      const assessmentsRes = await fetch(`${serverUrl}/admin/assessments`, {
        headers: getAuthHeaders(),
      });
      const assessmentsData = await assessmentsRes.json();
      if (assessmentsData.success) {
        setAssessments(assessmentsData.assessments);
        setResults(assessmentsData.results);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-800 mb-2">📊 Admin Dashboard</h1>
            <p className="text-gray-600">Real-time user activity and analytics</p>
          </div>
          <Button onClick={loadData} variant="outline">
            🔄 Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4">Login/Logout Sessions ({sessions.length})</h2>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-gray-500">No sessions yet</p>
                ) : (
                  sessions.map((session, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-800">
                            {session.name || "Unknown"} ({session.email})
                          </p>
                          <p className="text-gray-600">
                            Login: {formatDate(session.loginTime)}
                          </p>
                          {session.logoutTime && (
                            <p className="text-gray-600">
                              Logout: {formatDate(session.logoutTime)}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={
                            session.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Interactions Tab */}
          <TabsContent value="interactions" className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4">User Interactions ({interactions.length})</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {interactions.length === 0 ? (
                  <p className="text-gray-500">No interactions yet</p>
                ) : (
                  interactions
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((interaction, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{interaction.action}</Badge>
                              {interaction.step && (
                                <Badge className="bg-purple-100 text-purple-700">
                                  {interaction.step}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700">{interaction.email}</p>
                            <p className="text-gray-500">
                              {formatDate(interaction.timestamp)}
                            </p>
                            {interaction.data && (
                              <details className="mt-2">
                                <summary className="text-gray-600 cursor-pointer">
                                  View data
                                </summary>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                                  {JSON.stringify(interaction.data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4">In-Progress Assessments ({assessments.length})</h2>
              <div className="space-y-3">
                {assessments.length === 0 ? (
                  <p className="text-gray-500">No assessments in progress</p>
                ) : (
                  assessments.map((assessment, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-gray-800 mb-2">{assessment.email}</p>
                      <Badge className="bg-blue-500 mb-2">{assessment.currentStep}</Badge>
                      <p className="text-gray-600">
                        Last updated: {formatDate(assessment.lastUpdated)}
                      </p>
                      <details className="mt-2">
                        <summary className="text-gray-600 cursor-pointer">
                          View profile data
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(assessment.profile, null, 2)}
                        </pre>
                      </details>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4">Completed Assessments ({results.length})</h2>
              <div className="space-y-3">
                {results.length === 0 ? (
                  <p className="text-gray-500">No completed assessments yet</p>
                ) : (
                  results.map((result, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-gray-800 mb-2">{result.email}</p>
                      <Badge className="bg-green-500 mb-2">Completed</Badge>
                      <p className="text-gray-600 mb-2">
                        Completed: {formatDate(result.completedAt)}
                      </p>
                      <p className="text-gray-700 mb-2">
                        Top Career Match:{" "}
                        {result.results[0]?.careerTitle} ({result.results[0]?.matchScore}%)
                      </p>
                      <details>
                        <summary className="text-gray-600 cursor-pointer">
                          View all results
                        </summary>
                        <div className="mt-2 space-y-1">
                          {result.results.slice(0, 5).map((r: any, i: number) => (
                            <p key={i} className="text-gray-600">
                              {i + 1}. {r.careerTitle} - {r.matchScore}% match
                            </p>
                          ))}
                        </div>
                      </details>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
