import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardShell from '../components/layouts/DashboardShell';
import { useProfile } from '../context/ProfileContext';

const sidebarItems = [
  {
    to: '/analytics',
    label: 'Dashboard',
    icon: 'dashboard',
    inactiveClassName: 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 hover:translate-x-1',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:translate-x-1'
  },
  {
    to: '/predict',
    label: 'Predict Score',
    icon: 'auto_graph',
    inactiveClassName: 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 hover:translate-x-1',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:translate-x-1'
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: 'insights',
    fill: true,
    inactiveClassName: 'text-primary bg-primary/5 rounded-xl font-bold transition-all duration-200 hover:translate-x-1',
    activeClassName: 'text-primary bg-primary/5 rounded-xl font-bold transition-all duration-200 hover:translate-x-1'
  },
  {
    to: '/model-performance',
    label: 'Dataset Overview',
    icon: 'database',
    inactiveClassName: 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 hover:translate-x-1',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:translate-x-1'
  },
  {
    to: '/model-performance',
    label: 'Model Performance',
    icon: 'analytics',
    inactiveClassName: 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 hover:translate-x-1',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:translate-x-1'
  },
  {
    to: '/',
    label: 'About Project',
    icon: 'info',
    inactiveClassName: 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 hover:translate-x-1',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:translate-x-1'
  }
];

const mobileItems = [
  { to: '/', label: 'Home', icon: 'home', inactiveClassName: 'text-on-surface-variant', activeClassName: 'text-on-surface-variant' },
  { to: '/predict', label: 'Predict', icon: 'smart_toy', inactiveClassName: 'text-on-surface-variant', activeClassName: 'text-on-surface-variant' },
  { to: '/analytics', label: 'Stats', icon: 'bar_chart', fill: true, inactiveClassName: 'text-primary bg-primary-container/30 rounded-full px-4 py-1', activeClassName: 'text-primary bg-primary-container/30 rounded-full px-4 py-1' },
  { to: '/model-performance', label: 'Data', icon: 'storage', inactiveClassName: 'text-on-surface-variant', activeClassName: 'text-on-surface-variant' },
  { to: '/model-performance', label: 'Models', icon: 'settings_suggest', inactiveClassName: 'text-on-surface-variant', activeClassName: 'text-on-surface-variant' }
];

const sampleRows = [
  {
    studentId: '#EDU-8821',
    major: 'Computer Science',
    predicted: '94.5',
    confidence: '98%',
    confidenceWidth: '98%',
    status: 'ELITE',
    statusClassName: 'bg-green-100 text-green-700'
  },
  {
    studentId: '#EDU-4492',
    major: 'Architecture',
    predicted: '78.2',
    confidence: '82%',
    confidenceWidth: '82%',
    status: 'STABLE',
    statusClassName: 'bg-blue-100 text-blue-700'
  },
  {
    studentId: '#EDU-2210',
    major: 'Medicine',
    predicted: '52.4',
    confidence: '65%',
    confidenceWidth: '65%',
    status: 'AT RISK',
    statusClassName: 'bg-error-container text-error'
  }
];

const majorByFinalGrade = {
  0: 'At Risk',
  1: 'Arts',
  2: 'Business',
  3: 'Computer Science',
  4: 'Engineering',
  5: 'Medicine'
};

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(',') || [];

  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.split(',');
      return headers.reduce((row, header, index) => {
        row[header] = values[index];
        return row;
      }, {});
    });
}

function buildStatus(finalGrade, examScore) {
  const score = Number(examScore);
  const grade = Number(finalGrade);

  if (score >= 80 || grade >= 4) {
    return { label: 'ELITE', className: 'bg-green-100 text-green-700', confidenceWidth: '98%' };
  }
  if (score >= 60 || grade >= 2) {
    return { label: 'STABLE', className: 'bg-blue-100 text-blue-700', confidenceWidth: '82%' };
  }
  return { label: 'AT RISK', className: 'bg-error-container text-error', confidenceWidth: '65%' };
}

function getDisplayRows(entries, showAllEntries) {
  if (!showAllEntries) {
    return sampleRows;
  }

  return entries.slice(0, 1240).map((entry, index) => {
    const status = buildStatus(entry.FinalGrade, entry.ExamScore);

    return {
      studentId: `#EDU-${String(index + 1).padStart(4, '0')}`,
      major: majorByFinalGrade[Number(entry.FinalGrade)] || 'General Studies',
      predicted: Number(entry.ExamScore).toFixed(1),
      confidence: status.confidenceWidth,
      confidenceWidth: status.confidenceWidth,
      status: status.label,
      statusClassName: status.className
    };
  });
}

function matchesSearch(row, query) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return [row.studentId, row.major, row.predicted, row.confidence, row.status]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

function matchesFilter(row, activeFilter) {
  if (activeFilter === 'All') return true;
  if (activeFilter === 'At Risk') return row.status === 'AT RISK';
  return row.status === activeFilter.toUpperCase();
}

export default function AnalyticsDashboardPage() {
  const { username, role, clearProfile, setShowModal } = useProfile();
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);
  const [datasetEntries, setDatasetEntries] = useState([]);
  const [datasetLoaded, setDatasetLoaded] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [datasetError, setDatasetError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const filterMenuRef = useRef(null);

  const previewRows = useMemo(() => getDisplayRows(datasetEntries, false), [datasetEntries]);
  const reviewRows = useMemo(() => getDisplayRows(datasetEntries, datasetLoaded), [datasetEntries, datasetLoaded]);
  const filteredPreviewRows = useMemo(
    () => previewRows.filter((row) => matchesSearch(row, searchQuery) && matchesFilter(row, activeFilter)),
    [previewRows, searchQuery, activeFilter]
  );
  const filteredReviewRows = useMemo(
    () => reviewRows.filter((row) => matchesSearch(row, searchQuery) && matchesFilter(row, activeFilter)),
    [reviewRows, searchQuery, activeFilter]
  );
  const reviewRowCount = datasetLoaded ? filteredReviewRows.length : filteredPreviewRows.length;

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!filterMenuRef.current) return;
      if (!filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleDownloadDataset = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/dataset/download`);
      if (!response.ok) {
        throw new Error('Failed to download dataset');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_performance.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download dataset');
    }
  };

  const loadDataset = async ({ showDrawer = false, refresh = false } = {}) => {
    setDatasetError('');

    if (!datasetLoaded || refresh) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setDatasetLoading(true);
      }

      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${baseUrl}/api/dataset/download`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load dataset entries');
        }

        const csvText = await response.text();
        setDatasetEntries(parseCsv(csvText));
        setDatasetLoaded(true);
      } catch (error) {
        setDatasetError(error instanceof Error ? error.message : 'Failed to load dataset entries');
        setDatasetLoading(false);
        setIsRefreshing(false);
        return;
      } finally {
        setDatasetLoading(false);
        setIsRefreshing(false);
      }
    }

    if (showDrawer) {
      setShowReviewDrawer(true);
    }
  };

  const handleViewAllEntries = async () => {
    await loadDataset({ showDrawer: true });
  };

  const handleUpdateData = async () => {
    await loadDataset({ refresh: true });
  };

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      mobileItems={mobileItems}
      footer={{
        content: (
          <>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <button
              type="button"
              className="overflow-hidden text-left min-w-0"
              onClick={() => setShowModal(true)}
              aria-label="Edit profile details"
            >
              <p className="font-label-md text-label-md truncate">{username || 'Guest'}</p>
              <p className="text-xs text-on-surface-variant truncate">{role || 'User'}</p>
            </button>
            <button className="ml-auto text-on-surface-variant hover:text-primary shrink-0" onClick={clearProfile}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </>
        )
      }}
      topBarLeft={(
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-on-surface">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">EduPredict AI</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-surface-container/50 px-3 py-1.5 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md w-64 placeholder:text-outline-variant"
              placeholder="Search analytics..."
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <span className="text-[10px] text-outline-variant bg-surface-variant/50 px-1.5 py-0.5 rounded border border-outline-variant/30">⌘K</span>
          </div>
        </div>
      )}
      topBarRight={(
        <div className="flex items-center gap-4">
          <button className="hover:bg-primary-container/20 p-2 rounded-full transition-all duration-300 active:scale-95">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </button>
        </div>
      )}
      mainClassName="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-20 md:pb-0"
    >
      <div className="p-container-padding-mobile md:p-container-padding-desktop flex flex-col gap-card-gap">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Predictive Insights Overview</h2>
            <p className="text-body-lg text-on-surface-variant">Real-time analysis of model performance and student distribution.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative" ref={filterMenuRef}>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-primary font-semibold hover:bg-surface-container-highest transition-colors"
                onClick={() => setShowFilterMenu((value) => !value)}
              >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filters
              </button>
              {showFilterMenu ? (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-outline-variant/20 bg-surface shadow-xl overflow-hidden z-20">
                  {['All', 'Elite', 'Stable', 'At Risk'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/5 ${activeFilter === item ? 'text-primary font-semibold bg-primary/5' : 'text-on-surface-variant'}`}
                      onClick={() => {
                        setActiveFilter(item);
                        setShowFilterMenu(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleUpdateData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-70"
              disabled={datasetLoading || isRefreshing}
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              {isRefreshing ? 'Refreshing...' : 'Update Data'}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap">
          <div className="glass-card p-6 rounded-[24px] shadow-sm flex flex-col gap-2 group hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">school</span>
              </div>
              <span className="text-green-600 font-bold text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                +4.2% <span className="material-symbols-outlined text-xs">trending_up</span>
              </span>
            </div>
            <p className="text-on-surface-variant font-label-md mt-2">Average Predicted Score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">78.4</span>
              <span className="text-on-surface-variant text-sm font-medium">/100</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[24px] shadow-sm flex flex-col gap-2 group hover:border-secondary-container/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-secondary-container/20 rounded-lg text-secondary">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <span className="text-on-surface-variant font-bold text-xs bg-surface-variant/50 px-2 py-1 rounded-full">Stable</span>
            </div>
            <p className="text-on-surface-variant font-label-md mt-2">Highest Score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">96.8</span>
              <span className="text-on-surface-variant text-sm font-medium">peak</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[24px] shadow-sm flex flex-col gap-2 group hover:border-error/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-error-container/40 rounded-lg text-error">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <span className="text-error font-bold text-xs flex items-center gap-1 bg-error-container/20 px-2 py-1 rounded-full">
                -1.2% <span className="material-symbols-outlined text-xs">trending_down</span>
              </span>
            </div>
            <p className="text-on-surface-variant font-label-md mt-2">Lowest Score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">42.1</span>
              <span className="text-on-surface-variant text-sm font-medium">risk</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[24px] shadow-sm flex flex-col gap-2 group hover:border-tertiary/30 transition-all duration-300 bg-gradient-to-br from-white/70 to-tertiary-fixed/10">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
                <span className="material-symbols-outlined">dataset</span>
              </div>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-primary" />
                <div className="w-6 h-6 rounded-full border-2 border-white bg-secondary" />
                <div className="w-6 h-6 rounded-full border-2 border-white bg-tertiary" />
              </div>
            </div>
            <p className="text-on-surface-variant font-label-md mt-2">Total Predictions</p>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">12,482</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
          <div className="lg:col-span-8 glass-card p-8 rounded-[32px] shadow-sm flex flex-col gap-6 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Performance Trends</h3>
                <p className="text-sm text-on-surface-variant">Model prediction accuracy over time</p>
              </div>
              <select className="bg-surface-container text-on-surface-variant text-xs font-bold rounded-lg border-none focus:ring-primary">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="w-full h-[300px] mt-4 relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
                <defs>
                  <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3525cd" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line stroke="#c7c4d8" strokeDasharray="4" strokeOpacity="0.3" x1="0" x2="800" y1="50" y2="50" />
                <line stroke="#c7c4d8" strokeDasharray="4" strokeOpacity="0.3" x1="0" x2="800" y1="150" y2="150" />
                <line stroke="#c7c4d8" strokeDasharray="4" strokeOpacity="0.3" x1="0" x2="800" y1="250" y2="250" />
                <path fill="url(#lineGradient)" d="M0,220 C100,210 150,260 250,240 C350,220 450,120 550,140 C650,160 750,80 800,90 L800,300 L0,300 Z" />
                <path d="M0,220 C100,210 150,260 250,240 C350,220 450,120 550,140 C650,160 750,80 800,90" fill="none" stroke="#3525cd" strokeWidth="3" />
                <circle cx="250" cy="240" fill="#3525cd" r="4" />
                <circle cx="550" cy="140" fill="#3525cd" r="4" />
                <circle cx="800" cy="90" fill="#3525cd" r="4" />
              </svg>
              <div className="absolute top-16 left-1/2 -translate-x-1/2 glass-card p-3 rounded-xl shadow-xl border-primary/20 pointer-events-none opacity-0 transition-opacity group-hover:opacity-100 flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">October 14</span>
                <span className="text-sm font-bold text-primary">Accuracy: 94.2%</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-bold px-2">
              <span>SEP 01</span>
              <span>SEP 10</span>
              <span>SEP 20</span>
              <span>OCT 01</span>
              <span>OCT 10</span>
              <span>OCT 20</span>
            </div>
          </div>

          <div className="lg:col-span-4 glass-card p-8 rounded-[32px] shadow-sm flex flex-col gap-6">
            <h3 className="font-headline-md text-headline-md text-on-surface">Student Categories</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" fill="transparent" r="80" stroke="#e7eeff" strokeWidth="24" />
                  <circle cx="96" cy="96" fill="transparent" r="80" stroke="#3525cd" strokeDasharray="502" strokeDashoffset="150" strokeWidth="24" />
                  <circle cx="96" cy="96" fill="transparent" r="80" stroke="#57dffe" strokeDasharray="502" strokeDashoffset="400" strokeWidth="24" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-stats-number text-3xl">3</span>
                  <span className="text-xs font-bold text-on-surface-variant">Core Tiers</span>
                </div>
              </div>
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm font-medium">High Achievers</span>
                  </div>
                  <span className="text-sm font-bold">64%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary-container" />
                    <span className="text-sm font-medium">On-Track</span>
                  </div>
                  <span className="text-sm font-bold">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-surface-variant" />
                    <span className="text-sm font-medium">At-Risk</span>
                  </div>
                  <span className="text-sm font-bold">8%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
          <div className="lg:col-span-5 glass-card p-8 rounded-[32px] shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-on-surface">Feature Importance</h3>
              <span className="flex items-center gap-1 bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> AI RANKED
              </span>
            </div>
            <div className="flex flex-col gap-6 mt-2">
              {[
                ['Previous GPA', '0.88', '88%'],
                ['Attendance Rate', '0.72', '72%'],
                ['Study Hours', '0.54', '54%'],
                ['Extracurricular', '0.31', '31%']
              ].map(([label, value, width], index) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-on-surface-variant">{value}</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className={`bg-primary h-full rounded-full ${index === 1 ? 'opacity-80' : index === 2 ? 'opacity-60' : index === 3 ? 'opacity-40' : ''}`} style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 glass-card rounded-[32px] shadow-sm flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Dataset Overview</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-on-surface-variant font-medium">99.8% Data Integrity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    <span className="text-xs text-on-surface-variant font-medium">12 Missing Values</span>
                  </div>
                </div>
              </div>
              <button onClick={handleDownloadDataset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-on-background text-background font-bold hover:bg-on-background/90 transition-all shadow-md">
                <span className="material-symbols-outlined text-sm">download</span>
                Download Dataset
              </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-surface-container/50 text-[10px] uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="px-8 py-4 font-bold">Student ID</th>
                    <th className="px-6 py-4 font-bold">Major</th>
                    <th className="px-6 py-4 font-bold">Predicted</th>
                    <th className="px-6 py-4 font-bold">Confidence</th>
                    <th className="px-8 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPreviewRows.map((row) => (
                    <tr key={`${row.studentId}-${row.major}`} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                      <td className="px-8 py-4 font-medium">{row.studentId}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{row.major}</td>
                      <td className="px-6 py-4 font-bold text-primary">{row.predicted}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-surface-container rounded-full h-1">
                            <div className="bg-primary h-full rounded-full" style={{ width: row.confidenceWidth }} />
                          </div>
                          <span className="text-xs font-bold">{row.confidence}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`${row.statusClassName} px-3 py-1 rounded-full text-[10px] font-bold`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container/30 flex justify-center">
              <button
                type="button"
                className="text-primary font-bold text-sm hover:underline disabled:opacity-60"
                onClick={handleViewAllEntries}
                disabled={datasetLoading}
              >
                {datasetLoading ? 'Loading 1,240 Entries...' : 'View All 1,240 Entries'}
              </button>
            </div>
            {datasetError ? (
              <div className="px-8 pb-6 text-sm text-error">{datasetError}</div>
            ) : null}
          </div>
        </section>
      </div>

      {showReviewDrawer ? (
        <div
          className="fixed inset-0 z-[80] bg-[#111c2d]/20"
          onClick={() => setShowReviewDrawer(false)}
          role="presentation"
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-[920px] bg-surface shadow-2xl border-l border-outline-variant/20 flex flex-col"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Dataset review drawer"
          >
            <button
              type="button"
              className="absolute -left-5 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white shadow-lg shadow-primary/30 border-4 border-surface hover:scale-105 transition-transform"
              onClick={() => setShowReviewDrawer(false)}
              aria-label="Close dataset review"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b border-outline-variant/20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Dataset Preview</p>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">Review All Entries</h3>
                <p className="text-sm text-on-surface-variant mt-1">Close this preview whenever you want to return to the compact overview.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors shrink-0"
                onClick={() => setShowReviewDrawer(false)}
                aria-label="Close dataset review"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
              {datasetLoading ? (
                <div className="h-full flex items-center justify-center p-8 text-on-surface-variant">
                  Loading dataset...
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-outline-variant/20 text-[10px] uppercase tracking-wider text-on-surface-variant">
                    <tr>
                      <th className="px-8 py-4 font-bold">Student ID</th>
                      <th className="px-6 py-4 font-bold">Major</th>
                      <th className="px-6 py-4 font-bold">Predicted</th>
                      <th className="px-6 py-4 font-bold">Confidence</th>
                      <th className="px-8 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredReviewRows.map((row) => (
                      <tr key={`review-${row.studentId}-${row.major}`} className="hover:bg-primary/5 transition-colors cursor-pointer group bg-surface">
                        <td className="px-8 py-4 font-medium">{row.studentId}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{row.major}</td>
                        <td className="px-6 py-4 font-bold text-primary">{row.predicted}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-surface-container rounded-full h-1">
                              <div className="bg-primary h-full rounded-full" style={{ width: row.confidenceWidth }} />
                            </div>
                            <span className="text-xs font-bold">{row.confidence}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`${row.statusClassName} px-3 py-1 rounded-full text-[10px] font-bold`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-outline-variant/20 bg-surface/90 flex items-center justify-between gap-4">
              <div className="text-xs text-on-surface-variant">
                Showing {reviewRowCount.toLocaleString()} entries
              </div>
              <button
                type="button"
                onClick={() => setShowReviewDrawer(false)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
