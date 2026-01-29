interface ConditionalIndicatorProps {
  condition?: string;
}

export function ConditionalIndicator({ condition }: ConditionalIndicatorProps) {
  if (!condition) return null;

  return (
    <div
      className="absolute top-1 right-1 z-10 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-mono"
      title={`Condition: ${condition}`}
    >
      if
    </div>
  );
}
