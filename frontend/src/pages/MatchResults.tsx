import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowRight, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MatchResults() {
  const { matchId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch the match by ID here. 
    // Mocking for the dashboard scaffold.
    setTimeout(() => {
      setData({
        final_match_score: 0.82,
        dense_score: 0.88,
        skill_overlap_score: 0.75,
        experience_score: 0.90
      });
      setLoading(false);
    }, 1000);
  }, [matchId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>;
  }

  const chartData = [
    { name: 'Semantic', score: data.dense_score * 100 },
    { name: 'Skills', score: data.skill_overlap_score * 100 },
    { name: 'Experience', score: data.experience_score * 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Evaluation Results</h2>
        <p className="text-gray-500 mb-8">AI-driven analysis of candidate fit.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-6 text-center border border-indigo-100">
            <div className="text-sm font-medium text-indigo-600 mb-1">Overall Match</div>
            <div className="text-5xl font-extrabold text-indigo-900">{(data.final_match_score * 100).toFixed(0)}%</div>
          </div>
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to={`/matches/${matchId}/gaps`} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Brain className="-ml-1 mr-2 h-5 w-5" />
            Generate LLM Skill Gap Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
