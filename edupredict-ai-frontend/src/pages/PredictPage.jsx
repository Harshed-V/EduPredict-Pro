import { useEffect, useRef, useState } from 'react';
import DashboardShell from '../components/layouts/DashboardShell';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeMode } from '../hooks/useThemeMode';
import { predictStudentPerformance } from '../services/predictApi';

const sidebarItems = [
  {
    to: '/analytics',
    label: 'Dashboard',
    icon: 'dashboard',
    inactiveClassName: 'text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container-highest/50',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)]'
  },
  {
    to: '/predict',
    label: 'Predict Score',
    icon: 'auto_graph',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)]',
    inactiveClassName: 'text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container-highest/50'
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: 'insights',
    inactiveClassName: 'text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container-highest/50',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)]'
  },
  {
    to: '/model-performance',
    label: 'Dataset Overview',
    icon: 'database',
    inactiveClassName: 'text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-surface-container-highest/50',
    activeClassName: 'bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)]'
  }
];

const mobileItems = [
  {
    to: '/',
    label: 'Home',
    icon: 'home',
    inactiveClassName: 'text-on-surface-variant',
    activeClassName: 'text-primary bg-primary-container/30 rounded-full px-4 py-1'
  },
  {
    to: '/predict',
    label: 'Predict',
    icon: 'smart_toy',
    inactiveClassName: 'text-primary bg-primary-container/30 rounded-full px-4 py-1',
    activeClassName: 'text-primary bg-primary-container/30 rounded-full px-4 py-1'
  },
  {
    to: '/analytics',
    label: 'Stats',
    icon: 'bar_chart',
    inactiveClassName: 'text-on-surface-variant',
    activeClassName: 'text-on-surface-variant'
  },
  {
    to: '/model-performance',
    label: 'Data',
    icon: 'storage',
    inactiveClassName: 'text-on-surface-variant',
    activeClassName: 'text-on-surface-variant'
  }
];

const defaultValues = {
  studyHours: 6,
  attendance: 85,
  motivation: 'Medium',
  assignment: 92,
  courses: 3,
  stress: 4
};

function sliderBackground(value, min, max) {
  const percent = ((value - min) / (max - min)) * 100;
  return { background: `linear-gradient(to right, #4f46e5 ${percent}%, #d8e3fb ${percent}%)` };
}

export default function PredictPage() {
  const { theme, toggleTheme } = useThemeMode();
  const circleRef = useRef(null);
  const intervalRef = useRef(null);
  const [values, setValues] = useState(defaultValues);
  const [displayScore, setDisplayScore] = useState(0);
  const [predictionState, setPredictionState] = useState('idle');
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return undefined;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (displayScore / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    return undefined;
  }, [displayScore]);

  useEffect(() => {
    localStorage.setItem('edupredict_current_features', JSON.stringify(values));
  }, [values]);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    },
    []
  );

  const animateScore = (nextScore) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    setDisplayScore(0);
    setIsAnimating(true);

    let current = 0;
    intervalRef.current = window.setInterval(() => {
      if (current >= nextScore) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayScore(nextScore);
        setIsAnimating(false);
        return;
      }

      current += 1;
      setDisplayScore(current);
    }, 18);
  };

  const runPrediction = async () => {
    setPredictionState('loading');
    setErrorMessage('');
    setPredictionResult(null);
    setDisplayScore(0);

    try {
      const result = await predictStudentPerformance({
        studyHours: values.studyHours,
        attendance: values.attendance,
        motivation: values.motivation,
        assignment: values.assignment,
        courses: values.courses,
        stress: values.stress
      });

      setPredictionResult(result);
      setPredictionState('success');
      animateScore(result.predicted_score);
    } catch (error) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAnimating(false);
      setPredictionState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Prediction failed. Please try again.');
    }
  };

  const hasPrediction = predictionState === 'success' && Boolean(predictionResult);
  const isLoading = predictionState === 'loading';
  const confidenceText = hasPrediction ? `${predictionResult.confidence.toFixed(1)}%` : '94.2%';
  const peerPercentileText = hasPrediction ? predictionResult.peer_percentile : 'Top 12%';
  const recommendationText = hasPrediction
    ? predictionResult.recommendation
    : 'Fill in the parameters and click "Predict Result" to generate AI insights.';
  const badgeText = hasPrediction ? predictionResult.confidence_label : 'High Confidence';
  const categoryText = hasPrediction ? predictionResult.performance_category : 'CONSISTENT PERFORMANCE';
  const scoreLabelText = isLoading ? 'Calculating...' : categoryText;
  const lastPredictionText = hasPrediction ? `${predictionResult.predicted_score} / 100` : '88 / 100';
  const predictedImprovementText = hasPrediction
    ? `+${Math.max(0, predictionResult.predicted_score - 75).toFixed(1)}%`
    : '+14.2%';

  return (
    <DashboardShell
      sidebarItems={sidebarItems}
      mobileItems={mobileItems}
      footer={{
        content: (
          <>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface font-semibold text-sm">Prof. Henderson</span>
              <span className="text-on-surface-variant text-xs">Lead Administrator</span>
            </div>
          </>
        )
      }}
      mainClassName="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-20 md:pb-0 predict-mobile-shell"
      topBarLeft={(
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined md:hidden text-primary">menu</span>
          <h2 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Predict Score</h2>
        </div>
      )}
      topBarRight={(
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-surface-container-high rounded-full px-4 py-1.5 items-center gap-2 border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-secondary-container ai-pulse" />
            <span className="text-xs font-semibold text-on-surface-variant">AI ENGINE ONLINE</span>
          </div>
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            className="p-2 rounded-full hover:bg-primary-container/20 transition-all"
          />
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-primary-container/30">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGj4tO3pNas27kKtqkXpa1XePQu2y85W36NdbOkkmwEJ22zxzft1YwgUVQRRZ_68uT6eUt9Lhohz-m4DITP8iFY9pdGZMi8Skt1EAgSUN_i0NMHYuqCoHpKRhin67Fy62V33W8ReSjy2LEm0BEpAYASId9-yiYUl7VA7lHJDnsJ1NCTdH7hT0Ous_X7gi0wo60R9XkK7h1JSQO7V5CyCaK7j5OUsprwQcd-ASczcJUFyHkIDD_Q0X15_E-Jh97LLfWUER5Dn2GafA"
            />
          </div>
        </div>
      )}
    >
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-card-gap pb-24 md:pb-10">
        <div className="space-y-2">
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Academic Performance Predictor</h3>
          <p className="text-on-surface-variant max-w-2xl">
            Leverage our state-of-the-art machine learning model to forecast student performance based on behavioral metrics and historical data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
          <div className="lg:col-span-7 space-y-card-gap">
            <div className="predict-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-8xl">neurology</span>
              </div>
              <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-on-surface">Study Hours (Daily)</label>
                      <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold">
                        {values.studyHours}h
                      </span>
                    </div>
                    <input
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-thumb"
                      max="12"
                      min="0"
                      step="0.5"
                      type="range"
                      value={values.studyHours}
                      style={sliderBackground(values.studyHours, 0, 12)}
                      onChange={(e) => setValues((current) => ({ ...current, studyHours: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-on-surface">Attendance Rate</label>
                      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
                        {values.attendance}%
                      </span>
                    </div>
                    <input
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-thumb"
                      max="100"
                      min="0"
                      type="range"
                      value={values.attendance}
                      style={sliderBackground(values.attendance, 0, 100)}
                      onChange={(e) => setValues((current) => ({ ...current, attendance: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface">Motivation Level</label>
                    <select
                      className="w-full predict-input rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all outline-none"
                      value={values.motivation}
                      onChange={(e) => setValues((current) => ({ ...current, motivation: e.target.value }))}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface">Assignment Completion</label>
                    <div className="relative">
                      <input
                        className="w-full predict-input rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary-container outline-none"
                        placeholder="0-100"
                        type="number"
                        value={values.assignment}
                        onChange={(e) => setValues((current) => ({ ...current, assignment: Number(e.target.value) }))}
                      />
                      <span className="absolute right-4 top-3.5 text-outline">%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface">Online Courses Completed</label>
                    <input
                      className="w-full predict-input rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary-container outline-none"
                      placeholder="Quantity"
                      type="number"
                      value={values.courses}
                      onChange={(e) => setValues((current) => ({ ...current, courses: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-on-surface">Stress Level (1-10)</label>
                      <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold">
                        {values.stress}
                      </span>
                    </div>
                    <input
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer neon-thumb"
                      max="10"
                      min="1"
                      type="range"
                      value={values.stress}
                      style={sliderBackground(values.stress, 1, 10)}
                      onChange={(e) => setValues((current) => ({ ...current, stress: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    className="flex-1 bg-primary text-on-primary font-label-md py-4 rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={runPrediction}
                  >
                    <span className="material-symbols-outlined">smart_toy</span>
                    Predict Result
                  </button>
                  <button
                    type="reset"
                    className="px-8 py-4 border-2 border-outline-variant text-on-surface font-label-md rounded-2xl hover:bg-surface-variant/30 transition-all"
                    onClick={() => {
                      setValues(defaultValues);
                      setDisplayScore(0);
                      setPredictionState('idle');
                      setPredictionResult(null);
                      setErrorMessage('');
                      setIsAnimating(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-card-gap">
            {predictionState === 'idle' && (
              <div className="predict-panel rounded-[2rem] p-8 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-primary/20 min-h-[500px]">
                <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-outline animate-pulse">query_stats</span>
                </div>
                <h4 className="font-headline-md text-on-surface mb-2">Ready to Predict</h4>
                <p className="text-on-surface-variant max-w-[250px]">Fill in the parameters and click "Predict Result" to generate AI insights.</p>
              </div>
            )}

            {predictionState === 'loading' && (
              <div className="predict-panel rounded-[2rem] p-8 space-y-8 min-h-[500px] flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-md text-on-surface">Prediction Analysis</h4>
                    <p className="text-sm text-on-surface-variant">Processing your inputs now...</p>
                  </div>
                  <div className="px-3 py-1 bg-secondary-container/20 border border-secondary-container/50 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary-container ai-pulse" />
                    <span className="text-[10px] font-bold text-on-secondary-container uppercase tracking-wider">Working</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <svg height="200" width="200">
                      <circle
                        className="text-surface-container-highest"
                        cx="100"
                        cy="100"
                        fill="transparent"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                      />
                      <circle
                        ref={circleRef}
                        className="text-primary-container progress-ring__circle"
                        cx="100"
                        cy="100"
                        fill="transparent"
                        r="80"
                        stroke="currentColor"
                        strokeDasharray="502.65"
                        strokeDashoffset="502.65"
                        strokeLinecap="round"
                        strokeWidth="12"
                        style={{ filter: 'drop-shadow(0 0 8px #4f46e5)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-stats-number text-stats-number text-on-surface">{displayScore}</span>
                      <span className="text-xs font-bold text-on-surface-variant tracking-widest uppercase">Target Marks</span>
                    </div>
                  </div>
                  <div className="mt-4 px-6 py-2 bg-primary/10 rounded-full">
                    <span className="font-bold text-primary">Calculating...</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-white/50">
                    <p className="text-xs text-on-surface-variant mb-1">Confidence</p>
                    <p className="font-bold text-on-surface">Updating...</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-white/50">
                    <p className="text-xs text-on-surface-variant mb-1">Peer Percentile</p>
                    <p className="font-bold text-on-surface">Calculating...</p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary-container/5 rounded-3xl border border-secondary-container/20 relative overflow-hidden">
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        lightbulb
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-on-surface text-sm">AI Recommendation</p>
                      <p className="text-xs leading-relaxed text-on-surface-variant">The model is analyzing the learner profile and preparing a recommendation.</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 opacity-5">
                    <span className="material-symbols-outlined text-8xl">smart_toy</span>
                  </div>
                </div>
              </div>
            )}

            {predictionState === 'error' && (
              <div className="predict-panel rounded-[2rem] p-8 space-y-8 min-h-[500px] flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-md text-on-surface">Prediction Analysis</h4>
                    <p className="text-sm text-on-surface-variant">We could not complete this request.</p>
                  </div>
                  <div className="px-3 py-1 bg-error-container/30 border border-error/20 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    <span className="text-[10px] font-bold text-error uppercase tracking-wider">Error</span>
                  </div>
                </div>

                <div className="p-6 bg-error-container/30 rounded-3xl border border-error/20">
                  <p className="font-bold text-on-surface text-sm mb-1">Prediction failed</p>
                  <p className="text-sm text-on-surface-variant">{errorMessage}</p>
                </div>

                <button
                  type="button"
                  className="flex-1 bg-primary text-on-primary font-label-md py-4 rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  onClick={runPrediction}
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                  Try Again
                </button>
              </div>
            )}

            {predictionState === 'success' && predictionResult && (
              <div className="predict-panel rounded-[2rem] p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-md text-on-surface">Prediction Analysis</h4>
                    <p className="text-sm text-on-surface-variant">Analysis complete - Just now</p>
                  </div>
                  <div className="px-3 py-1 bg-secondary-container/20 border border-secondary-container/50 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary-container" />
                    <span className="text-[10px] font-bold text-on-secondary-container uppercase tracking-wider">{badgeText}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <svg height="200" width="200">
                      <circle
                        className="text-surface-container-highest"
                        cx="100"
                        cy="100"
                        fill="transparent"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                      />
                      <circle
                        ref={circleRef}
                        className="text-primary-container progress-ring__circle"
                        cx="100"
                        cy="100"
                        fill="transparent"
                        r="80"
                        stroke="currentColor"
                        strokeDasharray="502.65"
                        strokeDashoffset="502.65"
                        strokeLinecap="round"
                        strokeWidth="12"
                        style={{ filter: 'drop-shadow(0 0 8px #4f46e5)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-stats-number text-stats-number text-on-surface">{displayScore}</span>
                      <span className="text-xs font-bold text-on-surface-variant tracking-widest uppercase">Target Marks</span>
                    </div>
                  </div>
                  <div className="mt-4 px-6 py-2 bg-primary/10 rounded-full">
                    <span className="font-bold text-primary">{scoreLabelText}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-white/50">
                    <p className="text-xs text-on-surface-variant mb-1">Confidence</p>
                    <p className="font-bold text-on-surface">{confidenceText}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-white/50">
                    <p className="text-xs text-on-surface-variant mb-1">Peer Percentile</p>
                    <p className="font-bold text-on-surface">{peerPercentileText}</p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary-container/5 rounded-3xl border border-secondary-container/20 relative overflow-hidden">
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        lightbulb
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-on-surface text-sm">AI Recommendation</p>
                      <p className="text-xs leading-relaxed text-on-surface-variant">{recommendationText}</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 opacity-5">
                    <span className="material-symbols-outlined text-8xl">smart_toy</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap pt-10">
          <div className="glass-card p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 bg-surface-container-highest rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">history</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Last Prediction</p>
              <p className="font-bold text-on-surface">{lastPredictionText}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 bg-surface-container-highest rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Predicted Improvement</p>
              <p className="font-bold text-on-surface">{predictedImprovementText}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 bg-surface-container-highest rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">verified</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Model Accuracy</p>
              <p className="font-bold text-on-surface">{hasPrediction ? `${predictionResult.model_accuracy}%` : 'High Precision'}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
