import { useEffect } from 'react';
import DashboardShell from '../components/layouts/DashboardShell';
import ConfusionMatrixGrid from '../charts/ConfusionMatrixGrid';
import FeatureImportanceChart from '../charts/FeatureImportanceChart';
import { useModelMetrics } from '../hooks/useModelMetrics';
import { useProfile } from '../context/ProfileContext';

const sidebarItems = [
  { to: '/analytics', label: 'Dashboard', icon: 'dashboard', inactiveClassName: 'flex items-center gap-3 p-3 text-on-surface-variant hover:text-primary dark:text-outline-variant hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 group', activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1' },
  { to: '/predict', label: 'Predict Score', icon: 'auto_graph', inactiveClassName: 'flex items-center gap-3 p-3 text-on-surface-variant hover:text-primary dark:text-outline-variant hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 group', activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1' },
  { to: '/analytics', label: 'Analytics', icon: 'insights', inactiveClassName: 'flex items-center gap-3 p-3 text-on-surface-variant hover:text-primary dark:text-outline-variant hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 group', activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1' },
  { to: '/model-performance', label: 'Dataset Overview', icon: 'database', inactiveClassName: 'flex items-center gap-3 p-3 text-on-surface-variant hover:text-primary dark:text-outline-variant hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 group', activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1' },
  { to: '/model-performance', label: 'Model Performance', icon: 'analytics', inactiveClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1', activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1' },
  { to: '/', label: 'About Project', icon: 'info', inactiveClassName: 'flex items-center gap-3 p-3 text-on-surface-variant hover:text-primary dark:text-outline-variant hover:bg-surface-container-highest/50 rounded-xl transition-all duration-200 group', activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-3 p-3 transition-all duration-200 translate-x-1' }
];

const mobileItems = [
  { to: '/', label: 'Home', icon: 'home', inactiveClassName: 'flex flex-col items-center justify-center text-on-surface-variant', activeClassName: 'flex flex-col items-center justify-center text-on-surface-variant' },
  { to: '/predict', label: 'Predict', icon: 'smart_toy', inactiveClassName: 'flex flex-col items-center justify-center text-on-surface-variant', activeClassName: 'flex flex-col items-center justify-center text-on-surface-variant' },
  { to: '/analytics', label: 'Stats', icon: 'bar_chart', inactiveClassName: 'flex flex-col items-center justify-center text-on-surface-variant', activeClassName: 'flex flex-col items-center justify-center text-on-surface-variant' },
  { to: '/model-performance', label: 'Models', icon: 'analytics', fill: true, inactiveClassName: 'flex flex-col items-center justify-center text-primary bg-primary-container/30 rounded-full px-4 py-1', activeClassName: 'flex flex-col items-center justify-center text-primary bg-primary-container/30 rounded-full px-4 py-1' },
  { to: '/model-performance', label: 'Data', icon: 'storage', inactiveClassName: 'flex flex-col items-center justify-center text-on-surface-variant', activeClassName: 'flex flex-col items-center justify-center text-on-surface-variant' }
];

function ToggleChatButton() {
  useEffect(() => {
    const header = document.querySelector('header');
    const onScroll = () => {
      if (!header) return;
      header.classList.toggle('shadow-md', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}

export default function ModelPerformancePage() {
  const { metrics } = useModelMetrics();
  const { username, role, clearProfile, setShowModal } = useProfile();

  useEffect(() => {
    document.querySelectorAll('.glass-card').forEach((card) => {
      const onMouseMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      };
      card.addEventListener('mousemove', onMouseMove);
      card.__onMouseMove = onMouseMove;
    });

    return () => {
      document.querySelectorAll('.glass-card').forEach((card) => {
        if (card.__onMouseMove) card.removeEventListener('mousemove', card.__onMouseMove);
      });
    };
  }, []);

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
              <p className="text-on-surface font-bold truncate">{username || 'Guest'}</p>
              <p className="text-on-surface-variant text-xs truncate">{role || 'User'}</p>
            </button>
            <button className="ml-auto text-on-surface-variant hover:text-primary shrink-0" onClick={clearProfile}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </>
        )
      }}
      topBarLeft={(
        <>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">EduPredict AI</span>
          </div>
          <div className="hidden md:block">
            <h2 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed font-bold tracking-tight">Model Performance</h2>
          </div>
        </>
      )}
      topBarRight={null}
    >
      <ToggleChatButton />
      <div className="flex-1 p-container-padding-mobile md:p-container-padding-desktop space-y-8 pb-24 md:pb-8 max-w-[1440px] mx-auto w-full">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <span className="text-on-surface-variant font-label-md">Accuracy Score</span>
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">verified</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">{metrics.accuracy.toFixed(1)}</span>
              <span className="text-primary font-bold">%</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-secondary font-semibold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+2.4% vs prev model</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary-container">
            <div className="flex justify-between items-start mb-4">
              <span className="text-on-surface-variant font-label-md">MAE</span>
              <div className="bg-secondary-container/10 p-2 rounded-lg text-secondary">
                <span className="material-symbols-outlined">analytics</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">{metrics.precision.toFixed(1)}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-error font-semibold">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span>Lower is better</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-tertiary">
            <div className="flex justify-between items-start mb-4">
              <span className="text-on-surface-variant font-label-md">RMSE</span>
              <div className="bg-tertiary/10 p-2 rounded-lg text-tertiary">
                <span className="material-symbols-outlined">troubleshoot</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">{metrics.recall.toFixed(1)}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-on-tertiary-fixed-variant font-semibold">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Optimal range</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300 border-l-4 border-l-on-secondary-fixed-variant">
            <div className="flex justify-between items-start mb-4">
              <span className="text-on-surface-variant font-label-md">R² Score</span>
              <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                <span className="material-symbols-outlined">data_exploration</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-stats-number text-stats-number text-on-surface">{metrics.f1_score.toFixed(1)}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-secondary font-semibold">
              <span className="material-symbols-outlined text-sm">star_half</span>
              <span>High prediction confidence</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 glass-card rounded-3xl p-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Model Convergence</h3>
                <p className="text-on-surface-variant text-sm">Loss reduction over 100 epochs</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-semibold">Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container" />
                  <span className="text-xs font-semibold">Validation</span>
                </div>
              </div>
            </div>
            <div className="h-64 w-full flex items-end justify-between gap-2 relative">
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q10,20 20,40 T40,20 T60,10 T80,5 T100,2" fill="none" stroke="#3525cd" strokeWidth="2" />
                  <path d="M0,80 Q10,20 20,40 T40,20 T60,10 T80,5 T100,2 L100,100 L0,100 Z" fill="url(#grad-primary)" fillOpacity="0.1" />
                  <path d="M0,90 Q15,40 30,50 T50,30 T70,25 T90,20 T100,18" fill="none" stroke="#57dffe" strokeDasharray="4" strokeWidth="2" />
                  <defs>
                    <linearGradient id="grad-primary" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3525cd" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                <span>Epoch 0</span>
                <span>Epoch 25</span>
                <span>Epoch 50</span>
                <span>Epoch 75</span>
                <span>Epoch 100</span>
              </div>
            </div>
            <div className="mt-12 flex items-center gap-2 text-primary font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>AI Suggestion: Increase regularization to prevent minor overfitting after epoch 80.</span>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col h-full">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Confusion Matrix</h3>
            <p className="text-on-surface-variant text-sm mb-6">Predicted vs Actual Classification</p>
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 relative">
              <div className="absolute -left-8 top-1/2 -rotate-90 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Actual</div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Predicted</div>
              <div className="matrix-cell rounded-2xl bg-primary text-on-primary flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-black">412</span>
                <span className="text-[10px] uppercase font-bold opacity-80">True Pos</span>
              </div>
              <div className="matrix-cell rounded-2xl bg-primary-container/30 text-primary flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-black">12</span>
                <span className="text-[10px] uppercase font-bold opacity-80">False Neg</span>
              </div>
              <div className="matrix-cell rounded-2xl bg-secondary-container/30 text-secondary flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-black">24</span>
                <span className="text-[10px] uppercase font-bold opacity-80">False Pos</span>
              </div>
              <div className="matrix-cell rounded-2xl bg-secondary-container text-on-secondary-container flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-black">385</span>
                <span className="text-[10px] uppercase font-bold opacity-80">True Neg</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Precision</span>
                <span className="text-sm font-black text-primary">94.5%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-[94.5%]" />
              </div>
              <div className="flex justify-between items-center mt-4 mb-2">
                <span className="text-sm font-semibold">Recall</span>
                <span className="text-sm font-black text-secondary">97.1%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary-container h-full w-[97.1%]" />
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Model Benchmarks</h3>
            <button className="px-4 py-2 bg-surface-container-high rounded-full text-primary font-bold text-sm flex items-center gap-2 hover:bg-primary-fixed-dim transition-colors">
              <span className="material-symbols-outlined text-lg">tune</span>
              <span>Hyperparameter Logs</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="glass-card rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">forest</span>
                  </div>
                  <span className="font-bold">Random Forest</span>
                </div>
                <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-black rounded uppercase">Legacy</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Accuracy</span>
                  <span className="font-bold">88.4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Train Time</span>
                  <span className="font-bold">12s</span>
                </div>
              </div>
            </div>
            <div className="gradient-border-ai animate-float shadow-2xl">
              <div className="glass-card rounded-2xl p-6 h-full border-none">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                    <span className="font-bold text-primary">XGBoost Optimized</span>
                  </div>
                  <span className="px-2 py-1 bg-primary text-on-primary text-[10px] font-black rounded uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    Active
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Accuracy</span>
                    <span className="font-bold text-primary">94.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Train Time</span>
                    <span className="font-bold">240s</span>
                  </div>
                  <div className="pt-4 flex justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-primary glow-cyan" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-primary">94%</span>
                        <span className="text-[8px] uppercase font-bold text-on-surface-variant">Confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary">hub</span>
                  </div>
                  <span className="font-bold">Neural Net</span>
                </div>
                <span className="px-2 py-1 bg-tertiary-container/20 text-tertiary text-[10px] font-black rounded uppercase">Experimental</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Accuracy</span>
                  <span className="font-bold">92.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Train Time</span>
                  <span className="font-bold">1.2h</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl overflow-hidden h-80 relative group">
          <img
            alt="Future of AI Education"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY3hu5pVu--2cLt9n-LL2BCXd2uwVIsZIFqzlH2DQKDoi8XUSLkBS65x8-m3NtCM_EZVRbjUViOHsDC_az2JVo7hre7ZVryopMQazURUwjzPhkjZuO0gKGY1rNkkck4VXZNiGt6bfraxXcGi2gftJV5WGkLvpJDuUqbgzcKCSY6uwBVLzIuBaaH0igrwdAzDYP62fOZ6KaHzgL2SzQVLrA2yWNBREziatTXPu-8FakfraC9mBGoj3NxXHOxlTnOS1oMA9VIVMPW78"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-12">
            <div className="max-w-lg text-white">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Pro Insight</span>
              <h2 className="font-display-lg text-[40px] leading-tight font-black mb-4">Mastering the Art of Predictive Pedagogy.</h2>
              <p className="text-white/80">Our model uses ensemble learning to identify students at risk with 94% accuracy, providing a two-week lead time for faculty intervention.</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
