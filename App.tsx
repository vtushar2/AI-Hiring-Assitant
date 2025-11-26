import React, { useState } from 'react';
import { LayoutDashboard, BrainCircuit, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeCandidate } from './services/geminiService';
import { AnalysisResult } from './types';
import InputSection from './components/InputSection';
import ResultsDashboard from './components/ResultsDashboard';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (resumeText: string, experience: number, jobDescription: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCandidate(resumeText, experience, jobDescription);
      setResult(data);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">AI Hiring Assistant</h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span className="flex items-center"><FileText className="w-4 h-4 mr-1" /> Resume Parser</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center"><LayoutDashboard className="w-4 h-4 mr-1" /> Candidate Scoring</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Candidate Input</h2>
                <p className="text-sm text-slate-500 mt-1">Upload resume data and requirements.</p>
              </div>
              <div className="p-6">
                <InputSection onAnalyze={handleAnalysis} isLoading={isLoading} />
              </div>
            </div>

            {/* System Status / Info */}
            <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-semibold text-indigo-100 mb-2">Pipeline Status</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Model 1: Classifier (Active)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Model 2: Skill Extractor (Active)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Model 3: Shortlister (Active)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Model 4: Career Path (Active)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Model 5: Resume Optimizer (Active)
                  </li>
                </ul>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <BrainCircuit className="w-32 h-32" />
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Analysis Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <LayoutDashboard className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready to screen candidates</p>
                <p className="text-sm max-w-md text-center mt-2">Enter candidate details and a job description to generate a comprehensive AI assessment report.</p>
              </div>
            )}

            {isLoading && (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
                 <div className="relative w-20 h-20 mb-6">
                   <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                 </div>
                 <h3 className="text-xl font-semibold text-slate-800 animate-pulse">Running AI Pipeline...</h3>
                 <div className="mt-4 space-y-2 text-sm text-slate-500 text-center">
                   <p>Model 1: Categorizing Resume...</p>
                   <p className="delay-75">Model 2: Extracting Skills...</p>
                   <p className="delay-150">Model 3: Calculating Fit Score...</p>
                   <p className="delay-200 text-indigo-600 font-medium">Model 4 & 5: Generating Career Insights...</p>
                 </div>
               </div>
            )}

            {result && !isLoading && (
              <ResultsDashboard result={result} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;