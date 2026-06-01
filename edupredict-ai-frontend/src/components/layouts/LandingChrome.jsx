import { NavLink } from 'react-router-dom';

export default function LandingChrome({ children, right }) {
  return (
    <>
      <header className="bg-surface/70 backdrop-blur-xl border-b border-white/20 shadow-sm w-full sticky top-0 z-40 flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
        <div className="flex items-center gap-3">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            EduPredict AI
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-bold font-label-md text-label-md transition-all duration-300' : 'text-on-surface-variant hover:text-primary transition-all duration-300 font-label-md text-label-md'}>
            Home
          </NavLink>
          <NavLink to="/predict" className={({ isActive }) => isActive ? 'text-primary font-bold font-label-md text-label-md transition-all duration-300' : 'text-on-surface-variant hover:text-primary transition-all duration-300 font-label-md text-label-md'}>
            Predict
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'text-primary font-bold font-label-md text-label-md transition-all duration-300' : 'text-on-surface-variant hover:text-primary transition-all duration-300 font-label-md text-label-md'}>
            Stats
          </NavLink>
          <NavLink to="/model-performance" className={({ isActive }) => isActive ? 'text-primary font-bold font-label-md text-label-md transition-all duration-300' : 'text-on-surface-variant hover:text-primary transition-all duration-300 font-label-md text-label-md'}>
            Data
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">{right}</div>
      </header>
      {children}
    </>
  );
}
