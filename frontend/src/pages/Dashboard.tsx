import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Upload, FileText, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobText) {
      setError('Please provide both a resume and a job description.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('file', file);
      const resResp = await api.post('/resumes', formData);
      const resumeId = resResp.data.resume_id;

      // 2. Create Job
      const jobResp = await api.post('/jobs', {
        title: 'Target Role',
        company: 'Target Company',
        raw_text: jobText
      });
      const jobId = jobResp.data.id;

      // 3. Trigger Match
      // Note: In real life we'd poll the celery task here, but we'll mock the wait for now
      const matchResp = await api.post(`/matches?resume_id=${resumeId}&job_id=${jobId}`);
      
      // Navigate to results
      navigate(`/matches/${matchResp.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process match.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">New Match Evaluation</h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF/DOCX)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>{file ? file.name : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".pdf,.docx" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              rows={6}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
              placeholder="Paste the target job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> : <FileText className="-ml-1 mr-2 h-5 w-5" />}
              Generate Match Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
