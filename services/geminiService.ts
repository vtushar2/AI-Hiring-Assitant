import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set. Please provide a valid Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCandidate = async (
  resumeText: string,
  experienceYears: number,
  jobDescription: string
): Promise<AnalysisResult> => {
  const ai = getClient();

  const prompt = `
    You are an advanced AI Hiring Assistant pipeline consisting of five simulated machine learning models:
    1. A Resume Classifier (TF-IDF + Logistic Regression equivalent logic)
    2. A Skill Extractor (NER + Similarity logic)
    3. A Shortlisting Model (RandomForest classification logic)
    4. A Career Path Recommender (Classification)
    5. A Resume Optimizer (Keyword Gap Analysis)

    Input Data:
    - Candidate Resume Text: "${resumeText.slice(0, 5000)}" (truncated if too long)
    - Years of Experience: ${experienceYears}
    - Target Job Description: "${jobDescription.slice(0, 2000)}" (truncated if too long)

    Perform the following analysis and return ONLY valid JSON matching the schema:

    1. **Classification**: Categorize the resume into a job role and determine seniority.
    2. **Skill Extraction**: Extract key technical, soft, and domain skills with relevance scores.
    3. **Shortlisting**: Predict a 'match score' (0-100), status, and provide pros/cons.
    4. **Cultural Fit**: Estimate a cultural fit score based on tone.
    5. **Career Recommendation**: Based purely on the resume details (ignoring the target JD for a moment), what is the single best matching Job Profile Name this candidate should apply for? (e.g. "Senior DevOps Engineer" or "Product Manager").
    6. **Optimization**: Identify missing high-value keywords relative to the Target Job Description. List specific keywords the candidate must add to their resume to improve their match score to at least 80.
  `;

  // Define the schema for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      candidateName: { type: Type.STRING, description: "Inferred name from resume or 'Candidate'" },
      classification: {
        type: Type.OBJECT,
        properties: {
          roleCategory: { type: Type.STRING },
          experienceLevel: { type: Type.STRING },
          confidence: { type: Type.NUMBER, description: "0-100 confidence level" },
        },
        required: ["roleCategory", "experienceLevel", "confidence"]
      },
      skills: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Technical", "Soft", "Domain"] },
            relevance: { type: Type.NUMBER }
          },
          required: ["name", "category", "relevance"]
        }
      },
      shortlist: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          status: { type: Type.STRING, enum: ["Shortlisted", "Waitlisted", "Rejected"] },
          reasoning: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "status", "reasoning", "pros", "cons"]
      },
      culturalFit: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          analysis: { type: Type.STRING }
        },
        required: ["score", "analysis"]
      },
      recommendedProfile: { 
        type: Type.STRING, 
        description: "The ideal job profile name for this candidate based on their resume." 
      },
      keywordRecommendations: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of missing keywords to add to reach a match score of 80."
      }
    },
    required: ["candidateName", "classification", "skills", "shortlist", "culturalFit", "recommendedProfile", "keywordRecommendations"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for consistent, analytical results
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process candidate data. Please check your inputs and try again.");
  }
};