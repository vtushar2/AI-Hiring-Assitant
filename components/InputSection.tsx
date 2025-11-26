import React, { useState } from 'react';
import { Upload, Briefcase, Clock, FileText } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (resumeText: string, experience: number, jobDescription: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [resumeText, setResumeText] = useState('');
  const [experience, setExperience] = useState<number>(0);
  const [jobDescription, setJobDescription] = useState('We are looking for a Senior Software Engineer with React and Python experience...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim() && jobDescription.trim()) {
      onAnalyze(resumeText, experience, jobDescription);
    }
  };

  // Pre-fill helper for demo purposes
  const loadDemoData = () => {
    setResumeText(`John Doe
Senior Software Developer

Summary:
Experienced developer with 6 years in full-stack web development. Proficient in React, Node.js, and Python. Strong background in cloud architecture (AWS) and CI/CD pipelines.

Experience:
- Senior Developer at TechCorp (2020-Present): Led a team of 5, optimized legacy API reducing latency by 40%.
- Developer at StartupInc (2017-2020): Built MVP for fintech product using Django and React.

Skills: JavaScript, TypeScript, Python, AWS, Docker, Git, Agile.`);
    setExperience(6);
    setJobDescription(`Job Title: Senior Full Stack Engineer
    
Requirements:
- 5+ years of experience in software development
- Strong proficiency in React.js and TypeScript
- Backend experience with Python/Django or Node.js
- Experience with cloud platforms (AWS/GCP)
- Excellent problem-solving skills and leadership ability.`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Job Description Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
          <Briefcase className="w-4 h-4 mr-1.5 text-indigo-500" />
          Target Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          placeholder="Paste the job description here..."
          required
        />
      </div>

      {/* Experience Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
          <Clock className="w-4 h-4 mr-1.5 text-indigo-500" />
          Years of Experience
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={experience}
          onChange={(e) => setExperience(Number(e.target.value))}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          required
        />
      </div>

      {/* Resume Input */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-slate-700 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-indigo-500" />
            Resume Text
          </label>
          <button 
            type="button" 
            onClick={loadDemoData}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Load Demo Data
          </button>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all font-mono"
          placeholder="Paste resume content here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium transition-all transform active:scale-[0.98] ${
          isLoading 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Models...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Screen Candidate
          </>
        )}
      </button>
    </form>
  );
};

export default InputSection;