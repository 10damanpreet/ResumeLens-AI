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
      final_match_score: 0.589,
      dense_score: 0.610,
      skill_overlap_score: 0.570,
      experience_score: 0.590,
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
      final_match_score: 0.908,
      dense_score: 0.920,
      skill_overlap_score: 0.895,
      experience_score: 0.910,
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
      final_match_score: 0.864,
      dense_score: 0.875,
      skill_overlap_score: 0.850,
      experience_score: 0.865,
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
      final_match_score: 0.825,
      dense_score: 0.840,
      skill_overlap_score: 0.810,
      experience_score: 0.825,
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
      resume_id: 'res-shreyas',
      candidate_name: 'Shreyas Singh',
      candidate_email: 'shreyas.singh@thapar.edu',
      filename: 'Shreyas_Singh_Data_Systems_ML.pdf',
      final_match_score: 0.735,
      dense_score: 0.750,
      skill_overlap_score: 0.720,
      experience_score: 0.735,
      status: 'review',
      evaluated_at: '2026-11-15T09:45:00Z',
    },
    {
      rank: 6,
      match_id: 'msft-c6',
      resume_id: 'res-aarav',
      candidate_name: 'Aarav Sharma',
      candidate_email: 'aarav.sharma@thapar.edu',
      filename: 'Aarav_Sharma_Python_Microservices.pdf',
      final_match_score: 0.702,
      dense_score: 0.715,
      skill_overlap_score: 0.690,
      experience_score: 0.700,
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
      final_match_score: 0.542,
      dense_score: 0.560,
      skill_overlap_score: 0.530,
      experience_score: 0.540,
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
      final_match_score: 0.915,
      dense_score: 0.930,
      skill_overlap_score: 0.900,
      experience_score: 0.915,
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
      final_match_score: 0.871,
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
      final_match_score: 0.814,
      dense_score: 0.830,
      skill_overlap_score: 0.800,
      experience_score: 0.810,
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
      final_match_score: 0.778,
      dense_score: 0.795,
      skill_overlap_score: 0.765,
      experience_score: 0.775,
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
      final_match_score: 0.751,
      dense_score: 0.765,
      skill_overlap_score: 0.740,
      experience_score: 0.750,
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
      final_match_score: 0.695,
      dense_score: 0.710,
      skill_overlap_score: 0.680,
      experience_score: 0.695,
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
      final_match_score: 0.573,
      dense_score: 0.590,
      skill_overlap_score: 0.560,
      experience_score: 0.570,
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
      final_match_score: 0.912,
      dense_score: 0.925,
      skill_overlap_score: 0.900,
      experience_score: 0.910,
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
      final_match_score: 0.884,
      dense_score: 0.895,
      skill_overlap_score: 0.875,
      experience_score: 0.880,
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
      final_match_score: 0.774,
      dense_score: 0.790,
      skill_overlap_score: 0.760,
      experience_score: 0.770,
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
      final_match_score: 0.748,
      dense_score: 0.760,
      skill_overlap_score: 0.735,
      experience_score: 0.750,
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
      final_match_score: 0.719,
      dense_score: 0.735,
      skill_overlap_score: 0.705,
      experience_score: 0.715,
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
      final_match_score: 0.564,
      dense_score: 0.580,
      skill_overlap_score: 0.550,
      experience_score: 0.560,
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
      final_match_score: 0.923,
      dense_score: 0.935,
      skill_overlap_score: 0.915,
      experience_score: 0.920,
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
      final_match_score: 0.868,
      dense_score: 0.880,
      skill_overlap_score: 0.855,
      experience_score: 0.870,
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
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-rose-600" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            Access Denied &bull; Recruiter Account Required
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Recruiter Portal Restricted
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed font-medium">
            You are currently signed in with a <strong className="text-indigo-600 font-bold">Student Account</strong> ({userEmail || 'student'}). Student accounts cannot access confidential applicant pipelines or candidate screening leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleLogoutAndSwitch}
              className="py-3 px-6 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all"
            >
              Log Out & Sign In as Recruiter
            </button>
            <Link
              to="/"
              className="py-3 px-6 text-xs sm:text-sm font-semibold rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Recruiter Talent Intelligence Suite
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
              Enterprise ATS Pipeline
            </span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
            Bulk applicant ingestion, tri-factor algorithmic ranking, and comparative talent screening
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Recruiter: {userEmail || 'recruiter@resumelens.ai'}
          </span>
          <button
            onClick={() => setShowGenerateJdModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            AI Draft Requisition
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleLogoutAndSwitch}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 shadow-sm flex items-center gap-1.5 transition-all"
            title="Log out of recruiter account"
          >
            <Lock className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Requisition Selector & Stats Banner */}
      <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Building className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Target Requisition
              </span>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={selectedJobId}
                  onChange={(e) => handleJobChange(e.target.value)}
                  className="bg-white text-slate-900 text-sm font-bold rounded-xl px-3.5 py-2 border border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-sm cursor-pointer max-w-full sm:max-w-md"
                >
                  {jobs.length === 0 ? (
                    <option value="default">🏢 Google &mdash; Software Development Engineer II</option>
                  ) : (
                    jobs.map((j) => (
                      <option key={j.id} value={j.id} className="bg-white text-slate-900 font-medium">
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
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Screened</span>
              <span className="text-lg font-black text-slate-900">{candidates.length}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center shadow-sm">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Top Matches (&gt;80%)</span>
              <span className="text-lg font-black text-emerald-700">
                {candidates.filter((c) => c.final_match_score >= 0.8).length}
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-center shadow-sm">
              <span className="text-[10px] text-indigo-700 uppercase font-bold block">Shortlisted</span>
              <span className="text-lg font-black text-indigo-700">
                {candidates.filter((c) => c.status === 'shortlisted' || c.status === 'interview').length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by candidate name, email, or resume file..."
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-3.5 py-2 pl-10 text-xs shadow-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'shortlisted', 'interview', 'review', 'rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === filter
                    ? 'bg-slate-900 text-white font-bold shadow-sm border border-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 font-semibold'
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
        <div className="mb-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-4 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-950">
              {selectedForComparison.length} candidate(s) selected for head-to-head comparison
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="py-1.5 px-3.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Compare Candidates
            </button>
          </div>
        </div>
      )}

      {/* Candidates Leaderboard Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
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
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      <span>Updating applicant leaderboard...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
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
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCompare(c.match_id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Rank */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-[11px] ${
                            c.rank === 1
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : c.rank === 2
                              ? 'bg-slate-200 text-slate-800 border border-slate-300'
                              : c.rank === 3
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'text-slate-500 font-bold'
                          }`}
                        >
                          #{c.rank}
                        </span>
                      </td>

                      {/* Candidate Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{c.candidate_name}</div>
                        <div className="text-xs text-slate-600 font-medium mt-0.5">{c.candidate_email}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[220px] font-mono mt-0.5">
                          {c.filename}
                        </div>
                      </td>

                      {/* Overall Score Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black inline-block border shadow-sm ${
                            isTop
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : isMed
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>

                      {/* Dense Score */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-xs">
                        {Math.round(c.dense_score * 100)}%
                      </td>

                      {/* Skill Overlap */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-xs">
                        {Math.round(c.skill_overlap_score * 100)}%
                      </td>

                      {/* Experience Fit */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-xs">
                        {Math.round(c.experience_score * 100)}%
                      </td>

                      {/* Pipeline Status Select */}
                      <td className="py-3.5 px-4">
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c.match_id, e.target.value as CandidateRow['status'])
                          }
                          className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none transition-all cursor-pointer shadow-sm ${
                            c.status === 'shortlisted'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : c.status === 'interview'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : c.status === 'rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="shortlisted" className="bg-white text-emerald-800 font-bold">
                            ✓ Shortlisted
                          </option>
                          <option value="interview" className="bg-white text-sky-800 font-bold">
                            📅 Interview Scheduled
                          </option>
                          <option value="review" className="bg-white text-amber-800 font-bold">
                            ⏳ Under Review
                          </option>
                          <option value="rejected" className="bg-white text-rose-800 font-bold">
                            ✕ Rejected
                          </option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/matches/${c.match_id}`}
                            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 bg-white transition-colors"
                            title="Inspect Match"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/matches/${c.match_id}/gaps`}
                            className="p-2 rounded-xl text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 border border-indigo-200 bg-indigo-50 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Head-to-Head Candidate Matrix</h3>
                  <p className="text-xs text-slate-500 font-medium">Comparative multi-axis applicant breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparedCandidates.map((c) => (
                <div key={c.match_id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4 shadow-sm">
                  <div className="text-center pb-4 border-b border-slate-200">
                    <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold inline-flex items-center justify-center mb-2">
                      #{c.rank}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{c.candidate_name}</h4>
                    <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{c.candidate_email}</p>
                    <div className="mt-3 text-3xl font-black text-emerald-600">
                      {Math.round(c.final_match_score * 100)}%
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Overall Match</span>
                  </div>

                  {/* Sub-Scores */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Dense Semantic Fit:</span>
                      <span className="font-mono font-bold text-slate-900">{Math.round(c.dense_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Skill Taxonomy Overlap:</span>
                      <span className="font-mono font-bold text-slate-900">{Math.round(c.skill_overlap_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Experience Alignment:</span>
                      <span className="font-mono font-bold text-slate-900">{Math.round(c.experience_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium pt-2 border-t border-slate-200">
                      <span>Pipeline Status:</span>
                      <span className="font-bold uppercase text-indigo-700">{c.status}</span>
                    </div>
                  </div>

                  <Link
                    to={`/matches/${c.match_id}`}
                    className="w-full py-2 text-xs font-bold text-center block mt-4 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">AI Requisition Generator</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Gemini will draft a comprehensive, inclusive corporate Job Description
            </p>

            <form onSubmit={handleGenerateJd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Role Title *</label>
                <input
                  type="text"
                  required
                  value={jdTitle}
                  onChange={(e) => setJdTitle(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Seniority Level</label>
                <select
                  value={jdLevel}
                  onChange={(e) => setJdLevel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-sm cursor-pointer"
                >
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 years)</option>
                  <option value="Senior">Senior (5-8 years)</option>
                  <option value="Lead / Principal">Lead / Principal (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jdSkills}
                  onChange={(e) => setJdSkills(e.target.value)}
                  placeholder="e.g. PyTorch, Kubernetes, Python, AWS, Docker"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateJdModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generatingJd}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
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
