import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeMode } from '../hooks/useThemeMode';
import ThemeToggle from '../components/ThemeToggle';
import LandingChrome from '../components/layouts/LandingChrome';

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationId;
    let particles = [];

    if (!canvas || !ctx) return undefined;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(53, 37, 205, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = Array.from({ length: 50 }, () => new Particle());
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animateParticles);
    };

    resize();
    initParticles();
    animateParticles();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default function LandingPage() {
  const { theme, toggleTheme } = useThemeMode();
  const chartRef = useRef(null);

  useEffect(() => {
    const content = document.getElementById('hero-content');
    const viz = document.getElementById('hero-viz');
    const timer = window.setTimeout(() => {
      content?.classList.remove('opacity-0', 'translate-y-10');
      viz?.classList.remove('opacity-0', 'scale-95');
    }, 100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = chartRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const drawChart = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0,0,0,0.03)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 5; i += 1) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#3525cd';

      const points = [
        { x: 0, y: 0.8 },
        { x: 0.2, y: 0.7 },
        { x: 0.4, y: 0.85 },
        { x: 0.6, y: 0.65 },
        { x: 0.8, y: 0.4 },
        { x: 1.0, y: 0.15 }
      ];

      points.forEach((point, index) => {
        const px = point.x * canvas.width;
        const py = point.y * canvas.height;
        if (index === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(53, 37, 205, 0.2)');
      grad.addColorStop(1, 'rgba(53, 37, 205, 0)');
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const handleResize = () => drawChart();
    drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LandingChrome
      right={(
        <>
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            className="material-symbols-outlined text-primary dark:text-primary-fixed hover:bg-primary-container/20 p-2 rounded-full transition-all duration-300 active:scale-95"
          />
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold overflow-hidden border-2 border-primary/20">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg4TU1WQx6VUYFsAeZkNm7pxYLtMPpMZyt5dwdZ4Gq8vA2iDPTIvJ9MbLpeOpYcShtOJvK4AhXhSa9CcR7pDgWiOHZ5MBKXLtDmsJjJKExffP8GKqu3ZeoxvNo1_KDwZcV3w18NvCd6u6M7qVnLo7eKPQZg9o1MdgmH7KglrmmxDx-uKmzGDZIMYDGH8n7YW_6dnM3T6Z2N2Zu2_4Ma9W-fWkL-NwpTQ47WB5NuLwBgvk3rlg5jA0JhZVAyL7Taf-uKiOPlnexoqU"
            />
          </div>
        </>
      )}
    >
      <main className="relative min-h-screen overflow-hidden hero-gradient">
        <ParticleCanvas />
        <section className="relative z-10 pt-20 pb-32 px-container-padding-mobile md:px-container-padding-desktop max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            id="hero-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start gap-8 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse shadow-[0_0_8px_#57dffe]" />
              <span className="text-primary font-label-md text-label-md tracking-wider">AI PREDICTION ENGINE ACTIVE</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-background leading-tight">
              AI Powered Student <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container">
                Mark Prediction
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Unlock institutional clarity through data. Predict student academic performance using machine learning and behavioral analytics to transform complex outputs into actionable teaching insights.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                to="/predict"
                className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 active:scale-95"
              >
                Predict Marks
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
              </Link>
              <Link
                to="/analytics"
                className="bg-white/50 backdrop-blur-md border border-primary/20 text-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-white transition-all duration-300 active:scale-95"
              >
                View Insights
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white" alt="Student 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWoUHQoSPi_VvvxXy5DP88EEk-CYqUGLi0x6MAugRrR6cWH6gvtyLHkkCJesDVwljnhyS42Jar46oTu7epV2_0HiD-oP1qQO0_YIr1nrZvWLD1gulUjHebGMnXZbd-uwyYDjKVpSX_4kBez7A2jOHMDhe02wCUB0rWBneGYMTDkN8yi2TrMI3Zy5bMBDqkKZ68oJBixkF-0nRgMBWM636EIEIXDCLWclhqaK4iBZJi3fOSTtrrAA1PpHVm1vRex7y6FCljetRbH-w" />
                <img className="w-10 h-10 rounded-full border-2 border-white" alt="Student 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTBtxi-jGhv00PQ_m6ocI1qz7-T52O8xQdOqdlPwyaKYE-1RUwsveSCBfvejh-wIni8OdCuBn80aHMawZTGRCgZ4oKotpwYfgYgt-Oh1AZiw2txl_zRmqRLHNjV3XN0ysa27vupE3Ko9ZzIZkhIDFO3-tR74Zu5pXTCKfC4Td-GMtR6lBef7ACwqU-5CtoZ4pG5WBrC9f6xxO5nG8CNJKPuMPxlw4JyePjcrLaJLoRcZ8RACsWHBIhtW7_Yz9Wtj9eTDi1-C7r568" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-[12px] font-bold text-on-secondary-container">
                  2K+
                </div>
              </div>
              <p className="text-on-surface-variant font-label-md text-label-md">Trusted by 2,000+ Educators worldwide</p>
            </div>
          </motion.div>

          <motion.div
            id="hero-viz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative h-[500px] flex items-center justify-center opacity-0 scale-95 transition-all duration-1000 delay-300"
          >
            <div className="absolute top-0 right-0 glass-card p-6 rounded-2xl w-56 animate-float z-20" style={{ animationDelay: '0s' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">psychology</span>
                <span className="text-secondary font-bold font-stats-number text-[18px]">94.2%</span>
              </div>
              <p className="font-label-md text-on-surface-variant text-[12px] mb-1">Model Accuracy</p>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[94%]" />
              </div>
            </div>
            <div className="absolute bottom-12 -left-8 glass-card p-6 rounded-2xl w-64 animate-float z-20" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-[18px]">verified</span>
                </div>
                <p className="font-headline-md text-[16px] text-on-surface font-semibold">Predicted Grade</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-stats-number text-stats-number text-primary">A+</span>
                <span className="text-on-surface-variant font-label-md text-[12px]">Confidence: High</span>
              </div>
            </div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
              <div className="glass-card w-full h-[400px] rounded-[32px] overflow-hidden border-2 border-white/40 flex flex-col p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-headline-md text-on-surface font-bold">Predictive Analytics</h3>
                    <p className="text-on-surface-variant text-[14px]">Performance Trend Over Time</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                </div>
                <div className="flex-1 w-full relative">
                  <canvas ref={chartRef} className="w-full h-full" />
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-secondary-container/30 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary-container" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">AI Prediction Layer</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="max-w-[1440px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-32 grid grid-cols-1 md:grid-cols-3 gap-card-gap">
          <div className="glass-card p-8 rounded-3xl hover:border-primary/40 transition-all duration-300 group">
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">bar_chart</span>
            </div>
            <h4 className="font-headline-md text-on-surface font-bold mb-3">Behavioral Tracking</h4>
            <p className="text-on-surface-variant">Analyze participation, attendance, and social engagement metrics to see the full student picture.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl hover:border-primary/40 transition-all duration-300 group border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-primary/30 text-6xl">smart_toy</span>
            </div>
            <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-on-primary text-3xl">auto_graph</span>
            </div>
            <h4 className="font-headline-md text-on-surface font-bold mb-3">Early Intervention</h4>
            <p className="text-on-surface-variant">Identify students at risk weeks before exams occur. Proactive insights for better student outcomes.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl hover:border-primary/40 transition-all duration-300 group">
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">database</span>
            </div>
            <h4 className="font-headline-md text-on-surface font-bold mb-3">Data Security</h4>
            <p className="text-on-surface-variant">Enterprise-grade encryption for all sensitive academic records. Compliant with global privacy standards.</p>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 pb-safe bg-surface/80 dark:bg-surface-container-highest/90 backdrop-blur-lg border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden">
        <Link to="/" className="flex flex-col items-center justify-center text-primary dark:text-secondary-fixed bg-primary-container/30 rounded-full px-4 py-1 active:scale-90 duration-150">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-label-md-mobile">Home</span>
        </Link>
        <Link to="/predict" className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant active:scale-90 duration-150">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-label-md text-label-md-mobile">Predict</span>
        </Link>
        <Link to="/analytics" className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant active:scale-90 duration-150">
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="font-label-md text-label-md-mobile">Stats</span>
        </Link>
      </nav>
    </LandingChrome>
  );
}
