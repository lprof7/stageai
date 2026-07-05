interface MatchGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

function getColor(pct: number): string {
  if (pct >= 80) return '#8fae85';
  if (pct >= 50) return '#d4a843';
  return '#c77b4d';
}

function getLabel(pct: number): string {
  if (pct >= 80) return 'متطابق';
  if (pct >= 50) return 'متوسط';
  return 'ضعيف';
}

export function MatchGauge({ percentage, size = 88, strokeWidth = 10 }: MatchGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getColor(percentage);
  const center = size / 2;
  const innerRadius = radius - strokeWidth / 2;

  return (
    <div
      role="meter"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} style={{ position: 'absolute' }} role="img" aria-label={`${percentage}% ${getLabel(percentage)}`}>
        <defs>
          <filter id="inner-shadow">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="2" />
            <feComposite operator="out" in2="SourceGraphic" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-surface-container-high)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ filter: 'url(#inner-shadow)', transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: size * 0.22,
            lineHeight: 1.1,
            color,
          }}
        >
          {percentage}%
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--color-on-surface-variant)',
          marginTop: 2,
        }}>
          {getLabel(percentage)}
        </div>
      </div>
    </div>
  );
}
