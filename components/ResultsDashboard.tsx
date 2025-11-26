import React from 'react';
import { AnalysisResult } from '../types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { Check, X, TrendingUp, Briefcase, Star, Target, Sparkles, ArrowRight } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  // Prepare data for charts
  const skillsData = result.skills.map(s => ({
    subject: s.name,
    A: s.relevance,
    fullMark: 100
  })).slice(0, 6); // Top 6 skills for radar

  const scoreData = [
    { name: 'Role Match', score: result.shortlist.score, color: '#4f46e5' },
    { name: 'Culture', score: result.culturalFit.score, color: '#0ea5e9' },
    { name: 'Experience', score: result.classification.confidence, color: '#8b5cf6' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Waitlisted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Top Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center space-x-2">
               <h2 className="text-2xl font-bold text-slate-800">{result.candidateName}</h2>
               <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(result.shortlist.status)}`}>
                 {result.shortlist.status}
               </span>
            </div>
            <div className="flex flex-wrap items-center text-slate-500 mt-2 space-x-4 text-sm">
              <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {result.classification.roleCategory}</span>
              <span className="flex items-center"><Star className="w-4 h-4 mr-1" /> {result.classification.experienceLevel}</span>
              <span className="flex items-center text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                <Target className="w-3.5 h-3.5 mr-1" /> Ideal Profile: {result.recommendedProfile}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-4xl font-bold text-indigo-600">{result.shortlist.score}<span className="text-lg text-slate-400 font-normal">/100</span></div>
            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Match Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Skills Radar */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Skill Profile</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Candidate"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Key Metrics Bar */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
             <h3 className="text-sm font-semibold text-slate-700 mb-2">Fit Metrics</h3>
             <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={scoreData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="score" barSize={20} radius={[0, 4, 4, 0]}>
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>

      {/* Resume Optimization Recommendations */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Resume Optimization: Get to 80+ Score
          </h3>
          <p className="text-indigo-100 text-sm mb-4">
            Our analysis suggests adding these high-impact keywords to bridge the gap between your profile and the job description:
          </p>
          <div className="flex flex-wrap gap-2">
            {result.keywordRecommendations.map((keyword, idx) => (
              <span key={idx} className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full text-sm font-medium flex items-center group hover:bg-white/30 transition-colors cursor-default">
                {keyword}
                <ArrowRight className="w-3 h-3 ml-1.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 -mr-12 -mb-12" />
        </div>
      </div>

      {/* Reasoning and Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pros & Cons */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
            Decision Analysis
          </h3>
          
          <div className="mb-4">
             <p className="text-sm text-slate-600 italic border-l-4 border-indigo-200 pl-3 py-1 bg-slate-50 rounded-r">
               "{result.shortlist.reasoning}"
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div>
              <h4 className="text-xs font-bold text-green-700 uppercase mb-2 tracking-wider">Strengths</h4>
              <ul className="space-y-2">
                {result.shortlist.pros.map((pro, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-700 uppercase mb-2 tracking-wider">Areas of Concern</h4>
              <ul className="space-y-2">
                {result.shortlist.cons.map((con, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Skill Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Extracted Skills</h3>
          <div className="flex flex-wrap gap-2">
            {result.skills.map((skill, index) => (
              <div 
                key={index}
                className={`flex flex-col px-3 py-2 rounded-lg border text-sm ${
                  skill.relevance > 80 ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">{skill.name}</span>
                  <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${
                    skill.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                    skill.category === 'Soft' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {skill.category.charAt(0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${
                      skill.relevance > 80 ? 'bg-indigo-500' : 
                      skill.relevance > 50 ? 'bg-indigo-400' : 'bg-slate-400'
                    }`} 
                    style={{ width: `${skill.relevance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
             <h4 className="text-sm font-semibold text-slate-700 mb-2">Cultural Fit Analysis</h4>
             <p className="text-sm text-slate-600 leading-relaxed">
               {result.culturalFit.analysis}
             </p>
             <div className="flex items-center mt-3">
               <span className="text-xs font-medium text-slate-500 mr-2">Fit Score:</span>
               <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[200px]">
                 <div 
                   className="bg-sky-500 h-2 rounded-full" 
                   style={{ width: `${result.culturalFit.score}%` }}
                 ></div>
               </div>
               <span className="text-xs font-bold text-sky-600 ml-2">{result.culturalFit.score}%</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;