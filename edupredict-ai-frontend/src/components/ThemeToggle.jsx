export default function ThemeToggle({ theme, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-primary dark:text-primary-fixed">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
