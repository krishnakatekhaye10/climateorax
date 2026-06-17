import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  Calendar,
  Target,
  Zap,
  Award,
  ArrowDown,
} from 'lucide-react';
import { Button, Card, Badge, ProgressRing } from '../components/ui/ModernComponents';
import { carbonForecastService } from '../services/advancedServices';
import { componentClasses, animationVariants } from '../styles/utilities';

export default function CarbonReductionForecastPage() {
  const [timeframe, setTimeframe] = useState('1year');
  const [actionPlan, setActionPlan] = useState([]);
  const [currentEmissions] = useState(5200);

  const actions = [
    {
      name: 'Switch to Public Transit',
      impact: 1200,
      effort: 'Medium',
      icon: '🚌',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Reduce Meat Consumption',
      impact: 800,
      effort: 'Easy',
      icon: '🥗',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Switch to Renewable Energy',
      impact: 2400,
      effort: 'Hard',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      name: 'Reduce Air Travel',
      impact: 1500,
      effort: 'Hard',
      icon: '✈️',
      color: 'from-sky-500 to-blue-600',
    },
    {
      name: 'Improve Home Insulation',
      impact: 600,
      effort: 'Medium',
      icon: '🏠',
      color: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Buy Local & Seasonal',
      impact: 300,
      effort: 'Easy',
      icon: '🛒',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const toggleAction = (name) => {
    setActionPlan((prev) =>
      prev.includes(name)
        ? prev.filter((a) => a !== name)
        : [...prev, name]
    );
  };

  const totalReduction = actions
    .filter((a) => actionPlan.includes(a.name))
    .reduce((sum, a) => sum + a.impact, 0);

  const projections = carbonForecastService.calculateForecast(currentEmissions, []);
  const forecastData = projections[timeframe] || projections['1year'];

  const projectedEmissions = forecastData.emission - totalReduction;
  const reductionPercentage = Math.round((totalReduction / currentEmissions) * 100);

  const milestones = carbonForecastService.getMilestones(totalReduction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className={componentClasses.container}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          {...animationVariants.slideDown}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            📊 Carbon Reduction Forecast
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Plan your path to carbon neutrality with AI-powered forecasts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current & Projected */}
          <motion.div
            className="lg:col-span-2"
            {...animationVariants.slideLeft}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card variant="premium">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  Current Annual
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {currentEmissions} kg
                </p>
              </Card>

              <Card variant="premium">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  Projected (w/ actions)
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.max(0, projectedEmissions).toFixed(0)} kg
                </p>
              </Card>

              <Card variant="premium">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  Reduction
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {reductionPercentage}%
                </p>
              </Card>
            </div>

            {/* Action Selection */}
            <h2 className="text-2xl font-bold mb-4">Select Actions to Implement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {actions.map((action, idx) => {
                const isSelected = actionPlan.includes(action.name);
                return (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      variant={isSelected ? 'premium' : 'default'}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => toggleAction(action.name)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{action.icon}</div>
                        <div className="flex gap-1">
                          <Badge
                            variant={
                              action.effort === 'Easy'
                                ? 'primary'
                                : action.effort === 'Medium'
                                ? 'secondary'
                                : 'neutral'
                            }
                          >
                            {action.effort}
                          </Badge>
                          {isSelected && (
                            <Badge className="bg-green-600 text-white">✓</Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold mb-2">{action.name}</h3>
                      <p className="text-lg font-bold text-green-600">
                        {action.impact} kg CO₂
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeframe Selector */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Forecast Timeframe</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '30days', label: '30 Days' },
                  { id: '90days', label: '90 Days' },
                  { id: '1year', label: '1 Year' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTimeframe(id)}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      timeframe === id
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Chart */}
            <Card variant="glass">
              <h3 className="text-lg font-bold mb-6">Impact Projection</h3>
              <div className="space-y-6">
                {/* Current */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Current Emissions</span>
                    <span className="text-red-600 font-bold">
                      {currentEmissions} kg
                    </span>
                  </div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Projected */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">After Actions</span>
                    <span className="text-orange-600 font-bold">
                      {Math.max(0, projectedEmissions).toFixed(0)} kg
                    </span>
                  </div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-orange-500"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(projectedEmissions / currentEmissions) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Carbon Neutral */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Target (Zero)</span>
                    <span className="text-green-600 font-bold">0 kg</span>
                  </div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-0" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div {...animationVariants.slideRight}>
            <div className="space-y-4 sticky top-4">
              {/* Summary */}
              <Card variant="premium">
                <h3 className="font-bold text-lg mb-4">📈 Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Actions Selected</span>
                    <span className="font-bold">{actionPlan.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Reduction</span>
                    <span className="font-bold text-green-600">
                      {totalReduction} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reduction Rate</span>
                    <span className="font-bold text-green-600">
                      {reductionPercentage}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Carbon Neutral Target */}
              <Card className="border-green-200/50 dark:border-green-800/50">
                <div className="text-center mb-4">
                  <Award className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="font-bold">Carbon Neutral Target</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4 text-center mb-4">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Years to Zero
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {projectedEmissions <= 0 ? '✓' : Math.ceil(projectedEmissions / totalReduction) || '∞'}
                  </p>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  At your current reduction rate, you can achieve carbon
                  neutrality by taking these actions consistently.
                </p>
              </Card>

              {/* Tips */}
              <Card>
                <h3 className="font-bold mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li>✓ Start with easy actions</li>
                  <li>✓ Combine multiple actions</li>
                  <li>✓ Track progress monthly</li>
                  <li>✓ Upgrade to harder goals</li>
                </ul>
              </Card>

              {/* CTA */}
              <Button className="w-full" variant="primary" size="lg">
                Create Action Plan
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Milestones */}
        {actionPlan.length > 0 && (
          <motion.div
            className="mt-12"
            {...animationVariants.slideUp}
          >
            <h2 className="text-2xl font-bold mb-6">🎯 Key Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Month 1',
                  target: '15% reduction',
                  icon: '📅',
                },
                {
                  label: 'Month 3',
                  target: '30% reduction',
                  icon: '📈',
                },
                {
                  label: 'Month 6',
                  target: '50% reduction',
                  icon: '⭐',
                },
                {
                  label: 'Year 1',
                  target: '100% reduction',
                  icon: '🏆',
                },
              ].map((milestone, idx) => (
                <motion.div
                  key={milestone.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="text-center">
                    <p className="text-3xl mb-2">{milestone.icon}</p>
                    <p className="font-bold text-sm mb-1">{milestone.label}</p>
                    <p className="text-lg font-bold text-green-600">
                      {milestone.target}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
