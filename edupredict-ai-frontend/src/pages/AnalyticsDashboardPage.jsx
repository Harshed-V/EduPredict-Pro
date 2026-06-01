import DashboardShell from '../components/layouts/DashboardShell';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeMode } from '../hooks/useThemeMode';

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

export default function AnalyticsDashboardPage() {
  const { theme, toggleTheme } = useThemeMode();

  const handleDownloadDataset = async () => {
    try {
      const response = await fetch('/api/dataset/download');
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

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      mobileItems={mobileItems}
      footer={{
        content: (
          <>
            <img
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBet6dsvJR_vn8gHmJSQq9c7rtMe81_cihLYk_MmiE9tfiXg34DB6rnCesUp6MA9jX-fd8jUaYfEFz_Nv1f_LLcaTXepQjhzM4JDsmq9yrAn9NnyGi76kCwIipfZmRsrTWnserJprBXkVyWOD-hVHWBXBBkDDb4BHklD3JIGIJBTmEKtepAWc7TVnjUvHBX82RC7KyVWwcLsGrjXz5ag-iOEfRHM_lNCYbF2i7dMch9xUko5NL70dKHrEjqQHYjBTOkbkk3gNsttFY"
            />
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md truncate">Dr. Aris Thorne</p>
              <p className="text-xs text-on-surface-variant truncate">Lead Researcher</p>
            </div>
            <button className="ml-auto text-on-surface-variant hover:text-primary">
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
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            className="hover:bg-primary-container/20 p-2 rounded-full transition-all duration-300 active:scale-95"
          />
          <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-sm">person</span>
          </div>
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
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-primary font-semibold hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-sm">refresh</span>
              Update Data
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
                  <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                    <td className="px-8 py-4 font-medium">#EDU-8821</td>
                    <td className="px-6 py-4 text-on-surface-variant">Computer Science</td>
                    <td className="px-6 py-4 font-bold text-primary">94.5</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-surface-container rounded-full h-1">
                          <div className="bg-primary h-full rounded-full" style={{ width: '98%' }} />
                        </div>
                        <span className="text-xs font-bold">98%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold">ELITE</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-8 py-4 font-medium">#EDU-4492</td>
                    <td className="px-6 py-4 text-on-surface-variant">Architecture</td>
                    <td className="px-6 py-4 font-bold text-primary">78.2</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-surface-container rounded-full h-1">
                          <div className="bg-primary h-full rounded-full" style={{ width: '82%' }} />
                        </div>
                        <span className="text-xs font-bold">82%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold">STABLE</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-8 py-4 font-medium">#EDU-2210</td>
                    <td className="px-6 py-4 text-on-surface-variant">Medicine</td>
                    <td className="px-6 py-4 font-bold text-primary">52.4</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-surface-container rounded-full h-1">
                          <div className="bg-error h-full rounded-full" style={{ width: '65%' }} />
                        </div>
                        <span className="text-xs font-bold">65%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="bg-error-container text-error px-3 py-1 rounded-full text-[10px] font-bold">AT RISK</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container/30 flex justify-center">
              <button className="text-primary font-bold text-sm hover:underline">View All 1,240 Entries</button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
