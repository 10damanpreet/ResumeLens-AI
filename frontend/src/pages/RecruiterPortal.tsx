import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building, Sparkles, Search, Eye, FileSpreadsheet, X, Layers, BarChart3,
  Lock, ShieldCheck
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';

interface CandidateRow {
  rank: number;
  match_id: string;
  resume_id: string;
  candidate_name: string;
  candidate_email: string;
  filename: string;
  final_match_score: number;
  dense_score: number;
  skill_overlap_score: number;
  experience_score: number;
  status: 'review' | 'shortlisted' | 'interview' | 'rejected';
  evaluated_at?: string;
}

interface JobOption {
  id: string;
  title: string;
  company: string;
  raw_text: string;
}

const DEFAULT_SDE_JOBS: JobOption[] = [
  {
    id: 'google-sde-2',
    title: 'Software Development Engineer II (SDE II - Cloud Systems)',
    company: 'Google',
    raw_text: 'Distributed systems, high-concurrency microservices, Python, Go, Kubernetes, and gRPC.',
  },
  {
    id: 'msft-sde-2',
    title: 'Software Engineer II (Azure Cloud & Full-Stack Platform)',
    company: 'Microsoft',
    raw_text: 'TypeScript, React, C#/.NET or Python, Azure/AWS cloud services, Docker, Redis.',
  },
  {
    id: 'amzn-sde-1',
    title: 'Software Development Engineer (AWS Core Services)',
    company: 'Amazon (AWS)',
    raw_text: 'Java/Python, distributed computing, AWS services (S3, DynamoDB, Lambda, ECS), Kafka.',
  },
  {
    id: 'atlassian-sde',
    title: 'Full-Stack Software Engineer (Jira Platform & Enterprise Cloud)',
    company: 'Atlassian',
    raw_text: 'React, TypeScript, GraphQL, Node.js or Python backend services, micro-frontends.',
  },
  {
    id: 'uber-sde',
    title: 'Systems Software Engineer (Core Dispatch & Low-Latency Infra)',
    company: 'Uber',
    raw_text: 'Go/Python/C++, Kafka, Redis, low-latency API design, and real-time distributed systems.',
  },
];

const COMPANY_DEMO_POOLS: Record<string, CandidateRow[]> = {
  'Google': [
    {
      rank: 1,
      match_id: 'google-c1',
      resume_id: 'res-damanpreet',
      candidate_name: 'Damanpreet Singh',
      candidate_email: 'damanpreet.singh@thapar.edu',
      filename: 'Damanpreet_Singh_Backend_SDE.pdf',
      final_match_score: 0.894,
      dense_score: 0.912,
      skill_overlap_score: 0.880,
      experience_score: 0.890,
      status: 'shortlisted',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 2,
      match_id: 'google-c2',
      resume_id: 'res-dhruv',
      candidate_name: 'Dhruv Mittal',
      candidate_email: 'dhruv.mittal@thapar.edu',
      filename: 'Dhruv_Mittal_FullStack_React_Python.pdf',
      final_match_score: 0.852,
      dense_score: 0.865,
      skill_overlap_score: 0.840,
      experience_score: 0.850,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 3,
      match_id: 'google-c3',
      resume_id: 'res-praneet',
      candidate_name: 'Praneet Singh',
      candidate_email: 'praneet.singh@thapar.edu',
      filename: 'Praneet_Singh_Cloud_AWS_DevOps.pdf',
      final_match_score: 0.821,
      dense_score: 0.835,
      skill_overlap_score: 0.810,
      experience_score: 0.820,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 4,
      match_id: 'google-c4',
      resume_id: 'res-shreyas',
      candidate_name: 'Shreyas Singh',
      candidate_email: 'shreyas.singh@thapar.edu',
      filename: 'Shreyas_Singh_Data_Systems_ML.pdf',
      final_match_score: 0.785,
      dense_score: 0.800,
      skill_overlap_score: 0.770,
      experience_score: 0.780,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 5,
      match_id: 'google-c5',
      resume_id: 'res-aarav',
      candidate_name: 'Aarav Sharma',
      candidate_email: 'aarav.sharma@thapar.edu',
      filename: 'Aarav_Sharma_Python_Microservices.pdf',
      final_match_score: 0.740,
      dense_score: 0.755,
      skill_overlap_score: 0.730,
      experience_score: 0.740,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 6,
      match_id: 'google-c6',
      resume_id: 'res-ananya',
      candidate_name: 'Ananya Verma',
      candidate_email: 'ananya.verma@thapar.edu',
      filename: 'Ananya_Verma_Frontend_React_Lead.pdf',
      final_match_score: 0.712,
      dense_score: 0.725,
      skill_overlap_score: 0.700,
      experience_score: 0.710,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 7,
      match_id: 'google-c7',
      resume_id: 'res-rohan',
      candidate_name: 'Rohan Gupta',
      candidate_email: 'rohan.gupta@thapar.edu',
      filename: 'Rohan_Gupta_Junior_Backend_Dev.pdf',
      final_match_score: 0.580,
      dense_score: 0.595,
      skill_overlap_score: 0.570,
      experience_score: 0.580,
      status: 'rejected',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
  ],
  'Microsoft': [
    {
      rank: 1,
      match_id: 'msft-c1',
      resume_id: 'res-dhruv',
      candidate_name: 'Dhruv Mittal',
      candidate_email: 'dhruv.mittal@thapar.edu',
      filename: 'Dhruv_Mittal_FullStack_React_Python.pdf',
      final_match_score: 0.885,
      dense_score: 0.895,
      skill_overlap_score: 0.880,
      experience_score: 0.880,
      status: 'shortlisted',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 2,
      match_id: 'msft-c2',
      resume_id: 'res-damanpreet',
      candidate_name: 'Damanpreet Singh',
      candidate_email: 'damanpreet.singh@thapar.edu',
      filename: 'Damanpreet_Singh_Backend_SDE.pdf',
      final_match_score: 0.861,
      dense_score: 0.875,
      skill_overlap_score: 0.850,
      experience_score: 0.860,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 3,
      match_id: 'msft-c3',
      resume_id: 'res-ananya',
      candidate_name: 'Ananya Verma',
      candidate_email: 'ananya.verma@thapar.edu',
      filename: 'Ananya_Verma_Frontend_React_Lead.pdf',
      final_match_score: 0.834,
      dense_score: 0.845,
      skill_overlap_score: 0.820,
      experience_score: 0.840,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 4,
      match_id: 'msft-c4',
      resume_id: 'res-praneet',
      candidate_name: 'Praneet Singh',
      candidate_email: 'praneet.singh@thapar.edu',
      filename: 'Praneet_Singh_Cloud_AWS_DevOps.pdf',
      final_match_score: 0.792,
      dense_score: 0.805,
      skill_overlap_score: 0.780,
      experience_score: 0.790,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 5,
      match_id: 'msft-c5',
      resume_id: 'res-aarav',
      candidate_name: 'Aarav Sharma',
      candidate_email: 'aarav.sharma@thapar.edu',
      filename: 'Aarav_Sharma_Python_Microservices.pdf',
      final_match_score: 0.758,
      dense_score: 0.770,
      skill_overlap_score: 0.750,
      experience_score: 0.760,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 6,
      match_id: 'msft-c6',
      resume_id: 'res-shreyas',
      candidate_name: 'Shreyas Singh',
      candidate_email: 'shreyas.singh@thapar.edu',
      filename: 'Shreyas_Singh_Data_Systems_ML.pdf',
      final_match_score: 0.721,
      dense_score: 0.735,
      skill_overlap_score: 0.710,
      experience_score: 0.720,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 7,
      match_id: 'msft-c7',
      resume_id: 'res-rohan',
      candidate_name: 'Rohan Gupta',
      candidate_email: 'rohan.gupta@thapar.edu',
      filename: 'Rohan_Gupta_Junior_Backend_Dev.pdf',
      final_match_score: 0.554,
      dense_score: 0.570,
      skill_overlap_score: 0.540,
      experience_score: 0.550,
      status: 'rejected',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
  ],
  'Amazon (AWS)': [
    {
      rank: 1,
      match_id: 'amzn-c1',
      resume_id: 'res-praneet',
      candidate_name: 'Praneet Singh',
      candidate_email: 'praneet.singh@thapar.edu',
      filename: 'Praneet_Singh_Cloud_AWS_DevOps.pdf',
      final_match_score: 0.891,
      dense_score: 0.905,
      skill_overlap_score: 0.880,
      experience_score: 0.890,
      status: 'shortlisted',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 2,
      match_id: 'amzn-c2',
      resume_id: 'res-damanpreet',
      candidate_name: 'Damanpreet Singh',
      candidate_email: 'damanpreet.singh@thapar.edu',
      filename: 'Damanpreet_Singh_Backend_SDE.pdf',
      final_match_score: 0.873,
      dense_score: 0.885,
      skill_overlap_score: 0.860,
      experience_score: 0.870,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 3,
      match_id: 'amzn-c3',
      resume_id: 'res-aarav',
      candidate_name: 'Aarav Sharma',
      candidate_email: 'aarav.sharma@thapar.edu',
      filename: 'Aarav_Sharma_Python_Microservices.pdf',
      final_match_score: 0.840,
      dense_score: 0.855,
      skill_overlap_score: 0.830,
      experience_score: 0.840,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 4,
      match_id: 'amzn-c4',
      resume_id: 'res-dhruv',
      candidate_name: 'Dhruv Mittal',
      candidate_email: 'dhruv.mittal@thapar.edu',
      filename: 'Dhruv_Mittal_FullStack_React_Python.pdf',
      final_match_score: 0.816,
      dense_score: 0.830,
      skill_overlap_score: 0.810,
      experience_score: 0.810,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 5,
      match_id: 'amzn-c5',
      resume_id: 'res-shreyas',
      candidate_name: 'Shreyas Singh',
      candidate_email: 'shreyas.singh@thapar.edu',
      filename: 'Shreyas_Singh_Data_Systems_ML.pdf',
      final_match_score: 0.764,
      dense_score: 0.780,
      skill_overlap_score: 0.750,
      experience_score: 0.760,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 6,
      match_id: 'amzn-c6',
      resume_id: 'res-ananya',
      candidate_name: 'Ananya Verma',
      candidate_email: 'ananya.verma@thapar.edu',
      filename: 'Ananya_Verma_Frontend_React_Lead.pdf',
      final_match_score: 0.698,
      dense_score: 0.715,
      skill_overlap_score: 0.680,
      experience_score: 0.700,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 7,
      match_id: 'amzn-c7',
      resume_id: 'res-rohan',
      candidate_name: 'Rohan Gupta',
      candidate_email: 'rohan.gupta@thapar.edu',
      filename: 'Rohan_Gupta_Junior_Backend_Dev.pdf',
      final_match_score: 0.542,
      dense_score: 0.560,
      skill_overlap_score: 0.530,
      experience_score: 0.540,
      status: 'rejected',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
  ],
  'Atlassian': [
    {
      rank: 1,
      match_id: 'atlassian-c1',
      resume_id: 'res-ananya',
      candidate_name: 'Ananya Verma',
      candidate_email: 'ananya.verma@thapar.edu',
      filename: 'Ananya_Verma_Frontend_React_Lead.pdf',
      final_match_score: 0.902,
      dense_score: 0.915,
      skill_overlap_score: 0.890,
      experience_score: 0.900,
      status: 'shortlisted',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 2,
      match_id: 'atlassian-c2',
      resume_id: 'res-dhruv',
      candidate_name: 'Dhruv Mittal',
      candidate_email: 'dhruv.mittal@thapar.edu',
      filename: 'Dhruv_Mittal_FullStack_React_Python.pdf',
      final_match_score: 0.868,
      dense_score: 0.880,
      skill_overlap_score: 0.860,
      experience_score: 0.865,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 3,
      match_id: 'atlassian-c3',
      resume_id: 'res-damanpreet',
      candidate_name: 'Damanpreet Singh',
      candidate_email: 'damanpreet.singh@thapar.edu',
      filename: 'Damanpreet_Singh_Backend_SDE.pdf',
      final_match_score: 0.835,
      dense_score: 0.850,
      skill_overlap_score: 0.825,
      experience_score: 0.830,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 4,
      match_id: 'atlassian-c4',
      resume_id: 'res-aarav',
      candidate_name: 'Aarav Sharma',
      candidate_email: 'aarav.sharma@thapar.edu',
      filename: 'Aarav_Sharma_Python_Microservices.pdf',
      final_match_score: 0.779,
      dense_score: 0.795,
      skill_overlap_score: 0.765,
      experience_score: 0.780,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 5,
      match_id: 'atlassian-c5',
      resume_id: 'res-praneet',
      candidate_name: 'Praneet Singh',
      candidate_email: 'praneet.singh@thapar.edu',
      filename: 'Praneet_Singh_Cloud_AWS_DevOps.pdf',
      final_match_score: 0.743,
      dense_score: 0.760,
      skill_overlap_score: 0.730,
      experience_score: 0.740,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 6,
      match_id: 'atlassian-c6',
      resume_id: 'res-shreyas',
      candidate_name: 'Shreyas Singh',
      candidate_email: 'shreyas.singh@thapar.edu',
      filename: 'Shreyas_Singh_Data_Systems_ML.pdf',
      final_match_score: 0.705,
      dense_score: 0.720,
      skill_overlap_score: 0.695,
      experience_score: 0.700,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 7,
      match_id: 'atlassian-c7',
      resume_id: 'res-rohan',
      candidate_name: 'Rohan Gupta',
      candidate_email: 'rohan.gupta@thapar.edu',
      filename: 'Rohan_Gupta_Junior_Backend_Dev.pdf',
      final_match_score: 0.528,
      dense_score: 0.545,
      skill_overlap_score: 0.515,
      experience_score: 0.525,
      status: 'rejected',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
  ],
  'Uber': [
    {
      rank: 1,
      match_id: 'uber-c1',
      resume_id: 'res-damanpreet',
      candidate_name: 'Damanpreet Singh',
      candidate_email: 'damanpreet.singh@thapar.edu',
      filename: 'Damanpreet_Singh_Backend_SDE.pdf',
      final_match_score: 0.915,
      dense_score: 0.925,
      skill_overlap_score: 0.910,
      experience_score: 0.910,
      status: 'shortlisted',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 2,
      match_id: 'uber-c2',
      resume_id: 'res-praneet',
      candidate_name: 'Praneet Singh',
      candidate_email: 'praneet.singh@thapar.edu',
      filename: 'Praneet_Singh_Cloud_AWS_DevOps.pdf',
      final_match_score: 0.867,
      dense_score: 0.880,
      skill_overlap_score: 0.860,
      experience_score: 0.865,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 3,
      match_id: 'uber-c3',
      resume_id: 'res-shreyas',
      candidate_name: 'Shreyas Singh',
      candidate_email: 'shreyas.singh@thapar.edu',
      filename: 'Shreyas_Singh_Data_Systems_ML.pdf',
      final_match_score: 0.841,
      dense_score: 0.855,
      skill_overlap_score: 0.830,
      experience_score: 0.840,
      status: 'interview',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 4,
      match_id: 'uber-c4',
      resume_id: 'res-dhruv',
      candidate_name: 'Dhruv Mittal',
      candidate_email: 'dhruv.mittal@thapar.edu',
      filename: 'Dhruv_Mittal_FullStack_React_Python.pdf',
      final_match_score: 0.804,
      dense_score: 0.820,
      skill_overlap_score: 0.795,
      experience_score: 0.800,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 5,
      match_id: 'uber-c5',
      resume_id: 'res-aarav',
      candidate_name: 'Aarav Sharma',
      candidate_email: 'aarav.sharma@thapar.edu',
      filename: 'Aarav_Sharma_Python_Microservices.pdf',
      final_match_score: 0.762,
      dense_score: 0.775,
      skill_overlap_score: 0.755,
      experience_score: 0.760,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 6,
      match_id: 'uber-c6',
      resume_id: 'res-ananya',
      candidate_name: 'Ananya Verma',
      candidate_email: 'ananya.verma@thapar.edu',
      filename: 'Ananya_Verma_Frontend_React_Lead.pdf',
      final_match_score: 0.685,
      dense_score: 0.700,
      skill_overlap_score: 0.675,
      experience_score: 0.680,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 7,
      match_id: 'uber-c7',
      resume_id: 'res-rohan',
      candidate_name: 'Rohan Gupta',
      candidate_email: 'rohan.gupta@thapar.edu',
      filename: 'Rohan_Gupta_Junior_Backend_Dev.pdf',
      final_match_score: 0.561,
      dense_score: 0.580,
      skill_overlap_score: 0.550,
      experience_score: 0.555,
      status: 'rejected',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
  ],
};

function getCompanyDemoPool(company: string): CandidateRow[] {
  for (const key of Object.keys(COMPANY_DEMO_POOLS)) {
    if (company.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(company.toLowerCase())) {
      return COMPANY_DEMO_POOLS[key];
    }
  }
  return COMPANY_DEMO_POOLS['Google'];
}

const SAMPLE_APPLICANT_POOL: CandidateRow[] = COMPANY_DEMO_POOLS['Google'];

export default function RecruiterPortal() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userRole = localStorage.getItem('user_role') || 'user';
  const userEmail = localStorage.getItem('user_email') || '';
  const isRecruiter = userRole === 'recruiter' || userRole === 'admin';

  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [candidates, setCandidates] = useState<CandidateRow[]>(SAMPLE_APPLICANT_POOL);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'shortlisted' | 'interview' | 'review' | 'rejected'>('all');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showGenerateJdModal, setShowGenerateJdModal] = useState(false);

  // AI JD Generator State
  const [jdTitle, setJdTitle] = useState('');
  const [jdLevel, setJdLevel] = useState('Senior');
  const [jdSkills, setJdSkills] = useState('');
  const [generatingJd, setGeneratingJd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (isRecruiter) {
      loadJobs();
    }
  }, [isRecruiter, navigate]);

  const handleLogoutAndSwitch = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('recruiter_access_verified');
    showToast('Signed out of recruiter session.', 'info');
    navigate('/login');
  };

  const loadJobs = async () => {
    try {
      const resp = await api.get('/jobs');
      if (resp.data && resp.data.length > 0) {
        setJobs(resp.data);
        setSelectedJobId(resp.data[0].id);
        fetchLeaderboard(resp.data[0].id, resp.data);
      } else {
        setJobs(DEFAULT_SDE_JOBS);
        setSelectedJobId(DEFAULT_SDE_JOBS[0].id);
        setCandidates(COMPANY_DEMO_POOLS['Google']);
      }
    } catch {
      setJobs(DEFAULT_SDE_JOBS);
      setSelectedJobId(DEFAULT_SDE_JOBS[0].id);
      setCandidates(COMPANY_DEMO_POOLS['Google']);
    }
  };

  const fetchLeaderboard = async (jobId: string, currentJobs?: JobOption[]) => {
    setLoading(true);
    const jobList = currentJobs && currentJobs.length > 0 ? currentJobs : jobs;
    const targetJob = jobList.find((j) => j.id === jobId);

    try {
      const resp = await api.get(`/matches/leaderboard/${jobId}`);
      if (resp.data && resp.data.length >= 2) {
        setCandidates(resp.data);
      } else {
        const pool = getCompanyDemoPool(targetJob?.company || 'Google');
        setCandidates(pool);
      }
    } catch {
      const pool = getCompanyDemoPool(targetJob?.company || 'Google');
      setCandidates(pool);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    fetchLeaderboard(jobId, jobs);
  };

  const handleStatusChange = async (matchId: string, newStatus: CandidateRow['status']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.match_id === matchId ? { ...c, status: newStatus } : c))
    );
    showToast(`Updated candidate status to ${newStatus}`, 'success');

    // Sync to backend if not a sample match
    if (!matchId.startsWith('sample-')) {
      await api.patch(`/matches/${matchId}/status`, { status: newStatus }).catch(() => null);
    }
  };

  const toggleCompare = (matchId: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(matchId)) {
        return prev.filter((id) => id !== matchId);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 candidates simultaneously.', 'info');
        return prev;
      }
      return [...prev, matchId];
    });
  };

  const exportToCSV = () => {
    const headers = ['Rank', 'Candidate Name', 'Email', 'Resume File', 'Overall Match %', 'Dense Vector Score', 'Skill Overlap Score', 'Experience Fit', 'Status'];
    const rows = candidates.map((c) => [
      c.rank,
      `"${c.candidate_name}"`,
      `"${c.candidate_email}"`,
      `"${c.filename}"`,
      `${(c.final_match_score * 100).toFixed(1)}%`,
      `${(c.dense_score * 100).toFixed(1)}%`,
      `${(c.skill_overlap_score * 100).toFixed(1)}%`,
      `${(c.experience_score * 100).toFixed(1)}%`,
      c.status.toUpperCase(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `ResumeLens_Screening_Leaderboard_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Screening leaderboard exported to CSV!', 'success');
  };

  const handleGenerateJd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdTitle) return;
    setGeneratingJd(true);

    try {
      const resp = await api.post('/jobs/generate', {
        title: jdTitle,
        seniority: jdLevel,
        skills: jdSkills,
      });

      // Save as active job
      const created = await api.post('/jobs', {
        title: resp.data.title,
        company: resp.data.company,
        raw_text: resp.data.raw_text,
      });

      setJobs((prev) => [created.data, ...prev]);
      setSelectedJobId(created.data.id);
      setShowGenerateJdModal(false);
      showToast('AI Job Requisition created successfully!', 'success');
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setGeneratingJd(false);
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidate_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.filename.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const comparedCandidates = candidates.filter((c) => selectedForComparison.includes(c.match_id));

  if (!isRecruiter) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-red-500/30 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            Access Denied &bull; Recruiter Account Required
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Recruiter Portal Restricted
          </h2>
          <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            You are currently signed in with a <strong className="text-violet-300">Student Account</strong> ({userEmail || 'student'}). Student accounts cannot access confidential applicant pipelines or candidate screening leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleLogoutAndSwitch}
              className="btn-primary py-3 px-6 text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
            >
              Log Out & Sign In as Recruiter
            </button>
            <Link to="/" className="btn-secondary py-3 px-6 text-xs sm:text-sm">
              &larr; Return to Student Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruiter Talent Intelligence Suite
            </h1>
            <span className="badge-glow bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-xs">
              Enterprise ATS Pipeline
            </span>
          </div>
          <p className="text-white/40 text-xs sm:text-sm mt-0.5">
            Bulk applicant ingestion, tri-factor algorithmic ranking, and comparative talent screening
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Recruiter: {userEmail || 'recruiter@resumelens.ai'}
          </span>
          <button
            onClick={() => setShowGenerateJdModal(true)}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            AI Draft Requisition
          </button>
          <button
            onClick={exportToCSV}
            className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleLogoutAndSwitch}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 text-white/60 hover:text-red-300 hover:bg-red-500/10"
            title="Log out of recruiter account"
          >
            <Lock className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Requisition Selector & Stats Banner */}
      <div className="glass-card rounded-3xl p-6 mb-8 border border-white/10 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Building className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Target Requisition
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedJobId}
                  onChange={(e) => handleJobChange(e.target.value)}
                  className="bg-white/10 text-white text-sm font-bold rounded-xl px-3 py-1.5 border border-white/15 focus:outline-none focus:border-indigo-400"
                >
                  {jobs.length === 0 ? (
                    <option value="default">🏢 Google &mdash; Software Development Engineer II</option>
                  ) : (
                    jobs.map((j) => (
                      <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                        🏢 {j.company} &mdash; {j.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-white/40 uppercase block">Total Screened</span>
              <span className="text-base font-black text-white">{candidates.length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-400 uppercase block">Top Matches (&gt;80%)</span>
              <span className="text-base font-black text-emerald-300">
                {candidates.filter((c) => c.final_match_score >= 0.8).length}
              </span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-[10px] text-indigo-400 uppercase block">Shortlisted</span>
              <span className="text-base font-black text-indigo-300">
                {candidates.filter((c) => c.status === 'shortlisted' || c.status === 'interview').length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by candidate name, email, or resume file..."
              className="input-field text-xs pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'shortlisted', 'interview', 'review', 'rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === filter
                    ? 'bg-white/20 text-white border border-white/20 shadow-inner'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Drawer Action */}
      {selectedForComparison.length > 0 && (
        <div className="mb-4 p-3.5 rounded-2xl glass border border-violet-500/30 flex items-center justify-between gap-4 animate-fade-in bg-violet-950/40">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-white">
              {selectedForComparison.length} candidate(s) selected for head-to-head comparison
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs text-white/50 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Compare Candidates
            </button>
          </div>
        </div>
      )}

      {/* Candidates Leaderboard Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-10">Compare</th>
                <th className="py-3.5 px-3 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Candidate Profile</th>
                <th className="py-3.5 px-4 text-center">Overall Match</th>
                <th className="py-3.5 px-4 text-center">Dense Semantic</th>
                <th className="py-3.5 px-4 text-center">Skill Overlap</th>
                <th className="py-3.5 px-4 text-center">Experience Fit</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-white/40">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                      <span>Updating applicant leaderboard...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-white/40">
                    No applicants matching current search query.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  const pct = Math.round(c.final_match_score * 100);
                  const isTop = pct >= 80;
                  const isMed = pct >= 65 && pct < 80;
                  const isChecked = selectedForComparison.includes(c.match_id);

                  return (
                    <tr
                      key={c.match_id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isChecked ? 'bg-violet-500/[0.05]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCompare(c.match_id)}
                          className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Rank */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-[11px] ${
                            c.rank === 1
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : c.rank === 2
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                              : c.rank === 3
                              ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                              : 'text-white/40'
                          }`}
                        >
                          #{c.rank}
                        </span>
                      </td>

                      {/* Candidate Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{c.candidate_name}</div>
                        <div className="text-[11px] text-white/40">{c.candidate_email}</div>
                        <div className="text-[10px] text-white/30 truncate max-w-[200px]">
                          {c.filename}
                        </div>
                      </td>

                      {/* Overall Score Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black inline-block border ${
                            isTop
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : isMed
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>

                      {/* Dense Score */}
                      <td className="py-3.5 px-4 text-center font-mono text-white/70">
                        {Math.round(c.dense_score * 100)}%
                      </td>

                      {/* Skill Overlap */}
                      <td className="py-3.5 px-4 text-center font-mono text-white/70">
                        {Math.round(c.skill_overlap_score * 100)}%
                      </td>

                      {/* Experience Fit */}
                      <td className="py-3.5 px-4 text-center font-mono text-white/70">
                        {Math.round(c.experience_score * 100)}%
                      </td>

                      {/* Pipeline Status Select */}
                      <td className="py-3.5 px-4">
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c.match_id, e.target.value as CandidateRow['status'])
                          }
                          className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none transition-all cursor-pointer ${
                            c.status === 'shortlisted'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : c.status === 'interview'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : c.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          <option value="shortlisted" className="bg-slate-900 text-emerald-300 font-bold">
                            ✓ Shortlisted
                          </option>
                          <option value="interview" className="bg-slate-900 text-sky-300 font-bold">
                            📅 Interview Scheduled
                          </option>
                          <option value="review" className="bg-slate-900 text-amber-300 font-bold">
                            ⏳ Under Review
                          </option>
                          <option value="rejected" className="bg-slate-900 text-rose-300 font-bold">
                            ✕ Rejected
                          </option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/matches/${c.match_id}`}
                            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            title="Inspect Match"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/matches/${c.match_id}/gaps`}
                            className="p-1.5 rounded-lg text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors"
                            title="View Gaps & Advisory"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Head-to-Head Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl bg-slate-950/95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Head-to-Head Candidate Matrix</h3>
                  <p className="text-xs text-white/40">Comparative multi-axis applicant breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparedCandidates.map((c) => (
                <div key={c.match_id} className="p-5 rounded-2xl glass border border-white/10 space-y-4">
                  <div className="text-center pb-4 border-b border-white/10">
                    <span className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold inline-flex items-center justify-center mb-2">
                      #{c.rank}
                    </span>
                    <h4 className="font-bold text-white text-base">{c.candidate_name}</h4>
                    <p className="text-xs text-white/40 truncate">{c.candidate_email}</p>
                    <div className="mt-3 text-3xl font-black text-emerald-400">
                      {Math.round(c.final_match_score * 100)}%
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Overall Match</span>
                  </div>

                  {/* Sub-Scores */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Dense Semantic Fit:</span>
                      <span className="font-mono font-bold text-white">{Math.round(c.dense_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Skill Taxonomy Overlap:</span>
                      <span className="font-mono font-bold text-white">{Math.round(c.skill_overlap_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Experience Alignment:</span>
                      <span className="font-mono font-bold text-white">{Math.round(c.experience_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-white/70 pt-2 border-t border-white/5">
                      <span>Pipeline Status:</span>
                      <span className="font-semibold uppercase text-violet-300">{c.status}</span>
                    </div>
                  </div>

                  <Link
                    to={`/matches/${c.match_id}`}
                    className="btn-secondary w-full py-2 text-xs text-center block mt-4"
                  >
                    Open Deep Analysis
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Generate JD Modal */}
      {showGenerateJdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl bg-slate-950">
            <h3 className="text-xl font-bold text-white mb-1">AI Requisition Generator</h3>
            <p className="text-xs text-white/40 mb-6">
              Gemini will draft a comprehensive, inclusive corporate Job Description
            </p>

            <form onSubmit={handleGenerateJd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/60 block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={jdTitle}
                  onChange={(e) => setJdTitle(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer"
                  className="input-field text-sm w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60 block mb-1">Seniority Level</label>
                <select
                  value={jdLevel}
                  onChange={(e) => setJdLevel(e.target.value)}
                  className="input-field text-sm w-full bg-slate-900"
                >
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 years)</option>
                  <option value="Senior">Senior (5-8 years)</option>
                  <option value="Lead / Principal">Lead / Principal (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60 block mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jdSkills}
                  onChange={(e) => setJdSkills(e.target.value)}
                  placeholder="e.g. PyTorch, Kubernetes, Python, AWS, Docker"
                  className="input-field text-sm w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowGenerateJdModal(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generatingJd}
                  className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-1.5"
                >
                  {generatingJd ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Drafting with Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Create Requisition
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
