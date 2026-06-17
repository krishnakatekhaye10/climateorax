import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Target, AlertCircle } from 'lucide-react';

export default function PlanetHealthEngine({ userFootprint = 5.2, targetEmissions = 2.0 }) {
  const [timelineYear, setTimelineYear] = useState(2025);

  // Calculate planet health score
  const calculateHealthScore = (year) => {
    const yearProgress = (year - 2025) / 25; // 0 to 1 by 2050
    // Base health starts at 65, can go up to 100 or down to 20
    const baseHealth = 65;
    
    // Better if emissions are lower
    const emissionsFactor = ((5 - userFootprint) / 5) * 20; // -20 to +20
    // Future projection factor
    const futureImprovement = yearProgress * 15; // 0 to 15 by 2050
    
    const health = Math.min(100, Math.max(20, baseHealth + emissionsFactor + futureImprovement));
    return Math.round(health);
  };

  const currentHealth = useMemo(() => calculateHealthScore(timelineYear), [timelineYear, userFootprint]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const yearFactor = (timelineYear - 2025) / 25;
    
    return {
      globalTemp: 1.5 + (userFootprint * 0.3 * (1 - yearFactor * 0.4)),
      co2ppm: 420 + (userFootprint * 15 * (1 - yearFactor * 0.3)),
      forestedArea: 40 - (userFootprint * 5 * (1 - yearFactor * 0.5)),
      oceanHealth: 65 - (userFootprint * 10 * (1 - yearFactor * 0.4)),
      iceVolume: 30 - (userFootprint * 8 * (1 - yearFactor * 0.6)),
      renewablePercent: 12 + (yearFactor * 50)
    };
  }, [timelineYear, userFootprint]);

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500 from-green-500/20 to-emerald-500/10';
    if (score >= 60) return 'text-yellow-500 from-yellow-500/20 to-orange-500/10';
    if (score >= 40) return 'text-orange-500 from-orange-500/20 to-red-500/10';
    return 'text-red-500 from-red-500/20 to-red-600/10';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Thriving 🌱';
    if (score >= 60) return 'Stable ⚖️';
    if (score >= 40) return 'At Risk ⚠️';
    return 'Critical 🚨';
  };

  return (
    <div className="space-y-6">
      {/* Main Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${getHealthColor(currentHealth)} backdrop-blur-md border border-slate-700/50 rounded-2xl p-8`}
      >
        <div className="text-center">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Planet Health Score
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(currentHealth / 100) * 340} 340`}
                  initial={{ strokeDasharray: '0 340' }}
                  animate={{ strokeDasharray: `${(currentHealth / 100) * 340} 340` }}
                  transition={{ duration: 1 }}
                  className={getHealthColor(currentHealth)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{currentHealth}</div>
                  <div className="text-xs text-slate-400">/100</div>
                </div>
              </div>
            </div>
            <div className="text-left">
              <div className={`text-3xl font-bold mb-2 ${getHealthColor(currentHealth)}`}>
                {getHealthLabel(currentHealth)}
              </div>
              <p className="text-slate-400 text-sm">
                {currentHealth >= 80 && 'Earth is recovering. Keep reducing emissions!'}
                {currentHealth < 80 && currentHealth >= 60 && 'Current trajectory is stabilizing.'}
                {currentHealth < 60 && currentHealth >= 40 && 'Urgent action needed to prevent crisis.'}
                {currentHealth < 40 && 'Critical planetary emergency.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Selector */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
        <p className="text-slate-400 text-sm font-semibold mb-4">Project to Year:</p>
        <div className="flex gap-2">
          {[2025, 2030, 2040, 2050].map(year => (
            <motion.button
              key={year}
              onClick={() => setTimelineYear(year)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timelineYear === year
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Global Temp Rise', value: metrics.globalTemp.toFixed(1), unit: '°C', icon: TrendingUp, color: 'text-red-500' },
          { label: 'CO₂ Concentration', value: Math.round(metrics.co2ppm), unit: 'ppm', icon: AlertCircle, color: 'text-orange-500' },
          { label: 'Forested Area', value: metrics.forestedArea.toFixed(0), unit: '%', icon: TrendingDown, color: 'text-green-500' },
          { label: 'Ocean Health', value: metrics.oceanHealth.toFixed(0), unit: '%', icon: TrendingDown, color: 'text-blue-500' },
          { label: 'Ice Volume Index', value: metrics.iceVolume.toFixed(0), unit: 'Gt', icon: TrendingDown, color: 'text-cyan-500' },
          { label: 'Renewable Energy', value: metrics.renewablePercent.toFixed(0), unit: '%', icon: TrendingUp, color: 'text-green-400' },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-semibold">{metric.label}</p>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
              <span className="text-slate-500 text-sm">{metric.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Your Impact */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 backdrop-blur-md border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-emerald-200">Your Climate Impact</h3>
        </div>
        <div className="space-y-3">
          <p className="text-slate-300">
            Current Footprint: <span className="font-bold text-red-400">{userFootprint.toFixed(1)} tons CO₂/year</span>
          </p>
          <p className="text-slate-300">
            Target: <span className="font-bold text-green-400">{targetEmissions.toFixed(1)} tons CO₂/year</span>
          </p>
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((userFootprint - targetEmissions) / userFootprint) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-red-500 to-orange-500"
            />
          </div>
          <p className="text-slate-400 text-sm">
            Reduction needed: {Math.round(((userFootprint - targetEmissions) / userFootprint) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
