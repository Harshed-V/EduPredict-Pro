import React from 'react';

// Map chip text prefixes → icon + colors
const CHIP_ICON_MAP = [
  { test: /predict|grade|marks|estimate|pass/i,    icon: 'query_stats',      colorClass: 'text-primary bg-primary/5 border-primary/20 hover:bg-primary/10' },
  { test: /improve|score|better|boost/i,           icon: 'trending_up',      colorClass: 'text-secondary bg-secondary/5 border-secondary/20 hover:bg-secondary/10' },
  { test: /attendance|attend/i,                    icon: 'event_available',  colorClass: 'text-tertiary bg-tertiary/5 border-tertiary/20 hover:bg-tertiary/10' },
  { test: /stress|relax|reduce/i,                  icon: 'self_improvement', colorClass: 'text-error bg-error/5 border-error/20 hover:bg-error/10' },
  { test: /study|hours|increase/i,                 icon: 'schedule',         colorClass: 'text-primary bg-primary/5 border-primary/20 hover:bg-primary/10' },
  { test: /faq|how does|which model|data safe|accuracy/i, icon: 'help_outline', colorClass: 'text-on-surface-variant bg-surface-container/40 border-outline-variant/20 hover:bg-surface-container/80' },
  { test: /what.?if|scenario|simulation/i,         icon: 'science',          colorClass: 'text-tertiary bg-tertiary/5 border-tertiary/20 hover:bg-tertiary/10' },
  { test: /why|reason|low/i,                       icon: 'info',             colorClass: 'text-error bg-error/5 border-error/20 hover:bg-error/10' },
  { test: /hello|hi|start/i,                       icon: 'waving_hand',      colorClass: 'text-primary bg-primary/5 border-primary/20 hover:bg-primary/10' },
];

function getChipMeta(label) {
  for (const entry of CHIP_ICON_MAP) {
    if (entry.test.test(label)) return entry;
  }
  return { icon: 'chat_bubble', colorClass: 'text-on-surface-variant bg-surface-container/40 border-outline-variant/20 hover:bg-surface-container/80' };
}

export default function SuggestionChips({ suggestions = [], onSend, onInsert, onClick, disabled = false }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="px-4 pb-3 pt-1">
      <div className="flex items-center gap-1 mb-2 px-1 text-on-surface-variant/60">
        <span className="material-symbols-outlined text-[10px] animate-pulse">sparkles</span>
        <p className="text-[9px] font-bold uppercase tracking-widest">
          Suggested actions
        </p>
      </div>
      <div className="flex flex-wrap gap-2 max-w-full">
        {suggestions.map((item, i) => {
          const { icon, colorClass } = getChipMeta(item);
          return (
            <div
              key={`${item}-${i}`}
              style={{ animationDelay: `${i * 40}ms` }}
              className="
                chip-enter
                inline-flex items-center
                rounded-full
                border
                shadow-sm
                transition-all duration-200 ease-out
                hover:shadow-md hover:scale-[1.03]
                disabled:opacity-40
                select-none
                overflow-hidden
                max-w-full
              "
            >
              {/* Send Button */}
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  if (onSend) onSend(item);
                  else if (onClick) onClick(item);
                }}
                className={`
                  inline-flex items-center gap-1.5
                  text-[10px] font-semibold
                  px-3 py-1.5
                  transition-all duration-200
                  disabled:cursor-not-allowed
                  ${colorClass}
                `}
                title="Send query instantly"
              >
                <span
                  className="material-symbols-outlined text-[11px] leading-none"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  {icon}
                </span>
                <span className="truncate max-w-[150px]">{item}</span>
              </button>

              {/* Separator Line */}
              <div className="w-px h-4 bg-outline-variant/30 self-center" />

              {/* Insert / Edit Button */}
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  if (onInsert) onInsert(item);
                  else if (onSend) onSend(item);
                  else if (onClick) onClick(item);
                }}
                className={`
                  inline-flex items-center justify-center
                  px-2 py-1.5
                  transition-all duration-200
                  text-on-surface-variant/50 hover:text-primary hover:bg-primary-container/20
                  disabled:cursor-not-allowed
                `}
                title="Insert and customize before sending"
              >
                <span className="material-symbols-outlined text-[11px] leading-none">
                  edit_note
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
