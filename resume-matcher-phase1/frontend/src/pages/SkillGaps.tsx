import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function SkillGaps() {
  const { matchId } = useParams();
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real fetch logic would call api.post(`/matches/${matchId}/gaps`)
    // Mock network request for scaffolding
    setTimeout(() => {
      setGaps([
        { id: '1', skill_name: 'Docker', severity: 'critical' },
        { id: '2', skill_name: 'AWS ECS', severity: 'moderate' },
        { id: '3', skill_name: 'GraphQL', severity: 'minor' }
      ]);
      setLoading(false);
    }, 1500);
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        <p className="text-gray-500 animate-pulse">Gemini is analyzing the skill gaps...</p>
      </div>
    );
  }

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Link to={`/matches/${matchId}`} className="text-indigo-600 hover:text-indigo-800 inline-flex items-center text-sm font-medium">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Match Results
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="h-8 w-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">LLM Skill Gap Analysis</h2>
        </div>
        
        <p className="text-gray-600 mb-8">
          Based on the semantic comparison of the candidate's resume and the job description, 
          Gemini has identified the following areas for improvement:
        </p>

        <div className="space-y-4">
          {gaps.map((gap) => (
            <div key={gap.id} className={`p-4 rounded-lg border ${getSeverityColor(gap.severity)} flex justify-between items-center`}>
              <div>
                <h4 className="font-bold text-lg">{gap.skill_name}</h4>
                <p className="text-sm opacity-80">Recommended area of study</p>
              </div>
              <span className="uppercase tracking-wider text-xs font-bold px-3 py-1 rounded-full bg-white bg-opacity-50">
                {gap.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
