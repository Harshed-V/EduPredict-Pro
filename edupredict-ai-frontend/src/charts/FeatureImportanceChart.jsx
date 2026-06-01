export default function FeatureImportanceChart({ featureImportance }) {
  const entries = Object.entries(featureImportance || {});

  return (
    <div className="flex flex-col gap-6 mt-2">
      {entries.map(([feature, value], index) => (
        <div key={feature} className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{feature}</span>
            <span className="text-on-surface-variant">{Number(value).toFixed(2)}</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${Math.max(8, Math.round(Number(value) * 100))}%`,
                opacity: Math.max(0.35, 1 - index * 0.12)
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

