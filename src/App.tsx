import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  radius: number; // km
  displayRadius: number; // px for display
  distanceFromSun: number; // million km
  displayDistance: number; // px for display
  orbitalPeriod: number; // Earth days
  color: string;
  ringColor?: string;
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 2439,
    displayRadius: 4,
    distanceFromSun: 57.9,
    displayDistance: 60,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    description: 'Самая маленькая планета и ближайшая к Солнцу. Поверхность покрыта кратерами.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 6052,
    displayRadius: 7,
    distanceFromSun: 108.2,
    displayDistance: 90,
    orbitalPeriod: 225,
    color: '#e8cda0',
    description: 'Самая горячая планета из-за парникового эффекта. Вращается в обратном направлении.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 6371,
    displayRadius: 8,
    distanceFromSun: 149.6,
    displayDistance: 120,
    orbitalPeriod: 365,
    color: '#4a90d9',
    description: 'Наш дом! Единственная известная планета с жизнью. Имеет один спутник — Луну.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 3390,
    displayRadius: 5,
    distanceFromSun: 227.9,
    displayDistance: 155,
    orbitalPeriod: 687,
    color: '#c1440e',
    description: 'Красная планета. Имеет самую высокую гору в Солнечной системе — Олимп.'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 69911,
    displayRadius: 18,
    distanceFromSun: 778.5,
    displayDistance: 200,
    orbitalPeriod: 4333,
    color: '#c88b3a',
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном — гигантским штормом.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 58232,
    displayRadius: 15,
    distanceFromSun: 1434,
    displayDistance: 250,
    orbitalPeriod: 10759,
    color: '#e8d5a3',
    ringColor: '#c4a96a',
    description: 'Знаменита своими кольцами из льда и камня. Плотность меньше воды!'
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 25362,
    displayRadius: 11,
    distanceFromSun: 2871,
    displayDistance: 295,
    orbitalPeriod: 30687,
    color: '#7ec8e3',
    description: 'Ледяной гигант, вращающийся «на боку». Имеет 27 известных спутников.'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 24622,
    displayRadius: 10,
    distanceFromSun: 4495,
    displayDistance: 335,
    orbitalPeriod: 60190,
    color: '#3f54ba',
    description: 'Самая далёкая планета. Ветры достигают 2100 км/ч — самые сильные в Солнечной системе.'
  }
];

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * 360));
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    setAngles(prev => prev.map((angle, i) => {
      // Speed factor: base speed is proportional to 1/orbitalPeriod for realism
      // but scaled up for visibility
      const baseSpeed = (360 / planets[i].orbitalPeriod) * 0.5;
      return (angle + baseSpeed * speed * (delta / 16)) % 360;
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const getPlanetPosition = (planet: PlanetData, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * planet.displayDistance;
    const y = Math.sin(rad) * planet.displayDistance;
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
          Солнечная Система
        </h1>
        <p className="text-sm text-gray-400 mt-1">Нажмите на планету для подробной информации</p>
      </div>

      {/* Solar System Visualization */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative" style={{ width: '700px', height: '700px' }}>
          {/* Sun */}
          <div
            className="absolute rounded-full z-10 cursor-pointer"
            style={{
              width: '50px',
              height: '50px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #fff7a0 0%, #ffd700 30%, #ff8c00 70%, #ff4500 100%)',
              boxShadow: '0 0 40px 15px rgba(255, 165, 0, 0.5), 0 0 80px 30px rgba(255, 100, 0, 0.3), 0 0 120px 50px rgba(255, 50, 0, 0.1)'
            }}
          />

          {/* Orbits */}
          {planets.map((planet, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute rounded-full border border-gray-700/40"
              style={{
                width: planet.displayDistance * 2 + 'px',
                height: planet.displayDistance * 2 + 'px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Planets */}
          {planets.map((planet, i) => {
            const pos = getPlanetPosition(planet, angles[i]);
            const isSelected = selectedPlanet?.name === planet.name;
            return (
              <div
                key={`planet-${i}`}
                className="absolute cursor-pointer transition-transform duration-200 hover:scale-150 z-20"
                style={{
                  width: planet.displayRadius * 2 + 'px',
                  height: planet.displayRadius * 2 + 'px',
                  top: `calc(50% + ${pos.y}px)`,
                  left: `calc(50% + ${pos.x}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                title={planet.nameRu}
              >
                {/* Planet body */}
                <div
                  className="w-full h-full rounded-full relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${planet.color}ee, ${planet.color}88, ${planet.color}44)`,
                    boxShadow: isSelected
                      ? `0 0 15px 5px ${planet.color}88, 0 0 30px 10px ${planet.color}44`
                      : `0 0 ${planet.displayRadius}px 2px ${planet.color}33`
                  }}
                >
                  {/* Saturn rings */}
                  {planet.ringColor && (
                    <div
                      className="absolute rounded-full border-2"
                      style={{
                        width: planet.displayRadius * 3.5 + 'px',
                        height: planet.displayRadius * 1.2 + 'px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotateX(75deg)',
                        borderColor: planet.ringColor,
                        opacity: 0.7
                      }}
                    />
                  )}
                </div>
                {/* Planet label */}
                <div
                  className="absolute text-xs text-center whitespace-nowrap pointer-events-none"
                  style={{
                    top: planet.displayRadius * 2 + 4 + 'px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: planet.color,
                    fontSize: '10px',
                    textShadow: '0 0 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {planet.nameRu}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 md:right-8 z-30 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-5 w-72 shadow-2xl">
          <button
            className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
            onClick={() => setSelectedPlanet(null)}
          >
            ×
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}ee, ${selectedPlanet.color}88)`,
                boxShadow: `0 0 15px 5px ${selectedPlanet.color}44`
              }}
            />
            <div>
              <h2 className="text-xl font-bold" style={{ color: selectedPlanet.color }}>
                {selectedPlanet.nameRu}
              </h2>
              <p className="text-xs text-gray-400">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-4">{selectedPlanet.description}</p>
          <div className="space-y-2">
            <InfoRow label="Радиус" value={`${selectedPlanet.radius.toLocaleString()} км`} />
            <InfoRow label="Расстояние от Солнца" value={`${selectedPlanet.distanceFromSun} млн км`} />
            <InfoRow label="Орбитальный период" value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-6 py-3 flex items-center gap-4">
        {/* Play/Pause */}
        <button
          className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-600"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Пауза' : 'Воспроизведение'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Скорость:</span>
          <div className="flex gap-1">
            {[0.25, 0.5, 1, 2, 5, 10].map(s => (
              <button
                key={s}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-600'
                }`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Planet Legend (bottom left) */}
      <div className="absolute bottom-20 left-4 z-20 hidden md:block">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Планеты</h3>
          <div className="space-y-1">
            {planets.map((planet, i) => (
              <button
                key={i}
                className="flex items-center gap-2 text-xs hover:text-white transition-colors w-full text-left"
                style={{ color: selectedPlanet?.name === planet.name ? planet.color : '#9ca3af' }}
                onClick={() => setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: planet.color }}
                />
                <span>{planet.nameRu}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-800">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-200">{value}</span>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} дней`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} лет (${days.toLocaleString()} дней)`;
}

export default App;
