import { projectId, publicAnonKey } from "../utils/supabase/info";

// Server URL for API calls
export const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c1a0b791`;

// Helper function to get auth headers
export function getAuthHeaders(accessToken?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    headers["Authorization"] = `Bearer ${publicAnonKey}`;
  }
  
  return headers;
}

// Track user interaction
export async function trackInteraction(
  accessToken: string,
  action: string,
  step?: string,
  data?: any
) {
  try {
    const response = await fetch(`${serverUrl}/track/interaction`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ action, step, data }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Track interaction error:", error);
    }
  } catch (error) {
    console.error("Track interaction error:", error);
  }
}

// Save assessment progress
export async function saveAssessmentProgress(
  accessToken: string,
  profile: any,
  step: string
) {
  try {
    const response = await fetch(`${serverUrl}/assessment/save`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ profile, step }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error("Save assessment error:", data);
    }
    return data;
  } catch (error) {
    console.error("Save assessment error:", error);
    return { error: String(error) };
  }
}

// Save final results
export async function saveAssessmentResults(
  accessToken: string,
  profile: any,
  results: any[]
) {
  try {
    const response = await fetch(`${serverUrl}/assessment/results`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ profile, results }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error("Save results error:", data);
    }
    return data;
  } catch (error) {
    console.error("Save results error:", error);
    return { error: String(error) };
  }
}
