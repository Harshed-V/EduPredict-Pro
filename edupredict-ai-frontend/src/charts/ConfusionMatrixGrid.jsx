const LABELS = ['True Pos', 'False Neg', 'False Pos', 'True Neg'];

export default function ConfusionMatrixGrid({ matrix = [] }) {
  const flattened = [matrix?.[0]?.[0], matrix?.[0]?.[1], matrix?.[1]?.[0], matrix?.[1]?.[1]].map((value) => Number(value || 0));
  const [tp, fn, fp, tn] = flattened;

  return (
    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 relative">
      <div className="absolute -left-8 top-1/2 -rotate-90 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Actual</div>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Predicted</div>
      {[
        { value: tp, className: 'bg-primary text-on-primary' },
        { value: fn, className: 'bg-primary-container/30 text-primary' },
        { value: fp, className: 'bg-secondary-container/30 text-secondary' },
        { value: tn, className: 'bg-secondary-container text-on-secondary-container' }
      ].map((cell, index) => (
        <div key={LABELS[index]} className={`matrix-cell rounded-2xl flex flex-col items-center justify-center p-4 ${cell.className}`}>
          <span className="text-3xl font-black">{cell.value}</span>
          <span className="text-[10px] uppercase font-bold opacity-80">{LABELS[index]}</span>
        </div>
      ))}
    </div>
  );
}
