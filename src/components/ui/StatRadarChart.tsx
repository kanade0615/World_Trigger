import React from 'react';

interface StatRadarChartProps {
  stats: {
    trion: number;
    speed: number;
    range: number;
    attack: number;
    defenseSupport: number;
    special: number;
    technique: number;
  };
}

const StatRadarChart: React.FC<StatRadarChartProps> = ({ stats }) => {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 5;

  const statLabels = [
    { key: 'attack', label: '攻撃', angle: 0 },
    { key: 'speed', label: '速度', angle: 51.4 },
    { key: 'range', label: '射程', angle: 102.8 },
    { key: 'attack', label: '攻撃', angle: 154.2 },
    { key: 'defenseSupport', label: '防御援護', angle: 205.6 },
    { key: 'special', label: '特殊戦闘', angle: 257 },
    { key: 'technique', label: '技術', angle: 308.4 }
  ];

  const getMaxValue = () => {
    const values = Object.values(stats);
    return Math.max(...values, 10); // Minimum scale of 10
  };

  const maxValue = getMaxValue();

  const polarToCartesian = (angle: number, radius: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians)
    };
  };

  const getStatPoints = () => {
    return statLabels.map(({ key, angle }) => {
      const value = stats[key as keyof typeof stats];
      const radius = (value / maxValue) * maxRadius;
      return polarToCartesian(angle, radius);
    });
  };

  const statPoints = getStatPoints();
  const pathData = statPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="flex justify-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circles */}
          {Array.from({ length: levels }, (_, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(maxRadius / levels) * (i + 1)}
              fill="none"
              stroke="rgba(34, 197, 94, 0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {statLabels.map(({ angle }) => {
            const end = polarToCartesian(angle, maxRadius);
            return (
              <line
                key={angle}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data area */}
          <path
            d={pathData}
            fill="rgba(34, 197, 94, 0.2)"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {statPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(34, 197, 94)"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Labels */}
        {statLabels.map(({ key, label, angle }) => {
          const labelRadius = maxRadius + 20;
          const labelPos = polarToCartesian(angle, labelRadius);
          const value = stats[key as keyof typeof stats];
          
          return (
            <div
              key={key}
              className="absolute text-xs text-center transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: labelPos.x,
                top: labelPos.y,
                transform: 'translate(-50%, -50%) rotate(90deg)'
              }}
            >
              <div className="text-gray-300 font-medium">{label}</div>
              <div className="text-green-400 font-bold">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatRadarChart;