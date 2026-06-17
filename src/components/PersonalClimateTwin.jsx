import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Leaf, Recycle, Heart } from 'lucide-react';

// ScoreCard component - defined outside to avoid recreation on each render
const ScoreCard = ({ label, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4"
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-slate-400 text-sm font-semibold">{label}</p>
      <Icon className="w-5 h-5 text-emerald-400" />
    </div>
    <div className="mb-3">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500">/ 100</div>
    </div>
    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: delay + 0.2 }}
        className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
      />
    </div>
  </motion.div>
);

export default function PersonalClimateTwin({ calculatorData = {} }) {
  // Calculate individual scores based on calculator data
  const scores = useMemo(() => {
    const transport = calculatorData.transport || {};
    const diet = calculatorData.diet || {};
    const energy = calculatorData.energy || {};
    const lifestyle = calculatorData.lifestyle || {};

    // Transport score (0-100)
    const carKm = (transport.carKm || 0) / 150; // normalized
    const publicKm = (transport.publicKm || 0) / 50;
    const transportScore = Math.max(0, Math.min(100, 70 - carKm * 30 + publicKm * 10));

    // Energy score (0-100)
    const elecUsage = (energy.electricity || 300) / 300;
    const heatingFactor = (energy.heatingSource === 'gas' ? 1 : 0.5);
    const energyScore = Math.max(0, Math.min(100, 70 - elecUsage * 30 * heatingFactor));

    // Food score (0-100)
    const dietValues = { highMeat: 30, mediumMeat: 60, lowMeat: 85, vegan: 100 };
    const foodScore = dietValues[diet.dietType] || 60;

    // Waste score (0-100)
    const wasteScore = (lifestyle.recycling ? 75 : 40) + (lifestyle.newPurchases ? 0 : 15);

    // Overall score
    const overallScore = (transportScore + energyScore + foodScore + wasteScore) / 4;

    return {
      transport: Math.round(transportScore),
      energy: Math.round(energyScore),
      food: Math.round(foodScore),
      waste: Math.round(wasteScore),
      overall: Math.round(overallScore)
    };
  }, [calculatorData]);

  // Determine level based on overall score
  const getLevelInfo = (score) => {
    if (score >= 85) return { level: 'Climate Hero', emoji: '🌍', color: 'from-purple-500 to-pink-500', desc: 'Planetary Champion' };
    if (score >= 70) return { level: 'Eco Warrior', emoji: '⚔️', color: 'from-green-500 to-emerald-500', desc: 'Environmental Champion' };
    if (score >= 50) return { level: 'Eco Explorer', emoji: '🔍', color: 'from-blue-500 to-cyan-500', desc: 'Sustainability Seeker' };
    return { level: 'Beginner', emoji: '🌱', color: 'from-slate-500 to-gray-500', desc: 'Starting Your Journey' };
  };

  const levelInfo = getLevelInfo(scores.overall);

  return (
    <div className="space-y-6">
      {/* Main Avatar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br ${levelInfo.color} backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center`}
      >
        <div className="text-6xl mb-4">{levelInfo.emoji}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{levelInfo.level}</h2>
        <p className="text-white/80 text-lg mb-6">{levelInfo.desc}</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block">
          <div className="text-5xl font-bold text-white">{scores.overall}</div>
          <p className="text-white/70 text-sm">Overall Sustainability Score</p>
        </div>
      </motion.div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreCard label="🚗 Transport" value={scores.transport} icon={TrendingUp} delay={0.1} />
        <ScoreCard label="⚡ Energy" value={scores.energy} icon={Zap} delay={0.2} />
        <ScoreCard label="🥗 Food" value={scores.food} icon={Leaf} delay={0.3} />
        <ScoreCard label="♻️ Waste" value={scores.waste} icon={Recycle} delay={0.4} />
      </div>

      {/* Progress & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-md border border-indigo-500/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-indigo-200">Personalized Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {scores.transport < 70 && (
            <div className="flex gap-3">
              <div className="text-2xl">🚴</div>
              <div>
                <p className="font-semibold text-white">Reduce Transport Emissions</p>
                <p className="text-slate-400 text-sm">Switch to public transport or cycling 2-3 times per week</p>
              </div>
            </div>
          )}
          {scores.energy < 70 && (
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-semibold text-white">Optimize Energy Usage</p>
                <p className="text-slate-400 text-sm">Consider renewable energy or upgrade to energy-efficient appliances</p>
              </div>
            </div>
          )}
          {scores.food < 70 && (
            <div className="flex gap-3">
              <div className="text-2xl">🥬</div>
              <div>
                <p className="font-semibold text-white">Shift to Plant-Based Diet</p>
                <p className="text-slate-400 text-sm">Reducing meat consumption significantly lowers your carbon footprint</p>
              </div>
            </div>
          )}
          {scores.waste < 70 && (
            <div className="flex gap-3">
              <div className="text-2xl">♻️</div>
              <div>
                <p className="font-semibold text-white">Improve Waste Management</p>
                <p className="text-slate-400 text-sm">Start recycling and reduce new purchases through circular consumption</p>
              </div>
            </div>
          )}
          {scores.overall >= 70 && (
            <div className="flex gap-3">
              <div className="text-2xl">🌟</div>
              <div>
                <p className="font-semibold text-green-400">You're Doing Great!</p>
                <p className="text-slate-400 text-sm">You're on track to reduce emissions. Keep up the sustainable lifestyle!</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Level Timeline */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <p className="text-slate-400 font-semibold mb-4">Sustainability Levels</p>
        <div className="space-y-3">
          {[
            { emoji: '🌱', level: 'Beginner', range: '0-50', active: scores.overall < 50 },
            { emoji: '🔍', level: 'Eco Explorer', range: '50-70', active: scores.overall >= 50 && scores.overall < 70 },
            { emoji: '⚔️', level: 'Eco Warrior', range: '70-85', active: scores.overall >= 70 && scores.overall < 85 },
            { emoji: '🌍', level: 'Climate Hero', range: '85-100', active: scores.overall >= 85 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-emerald-500/20 border border-emerald-500/50'
                  : 'bg-slate-700/20 border border-slate-700/30'
              }`}
            >
              <div className="text-2xl">{item.emoji}</div>
              <div className="flex-1">
                <p className={item.active ? 'font-bold text-emerald-300' : 'text-slate-400'}>{item.level}</p>
                <p className="text-xs text-slate-500">{item.range}</p>
              </div>
              {item.active && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
