import { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Leaf, Zap, TrendingDown, Trophy, RotateCcw, Fuel, Sun, Bus } from 'lucide-react';
import Button from '../components/ui/Button';

const BUILDING_TYPES = {
  solar: {
    name: 'Solar Plant',
    icon: Sun,
    cost: 50,
    emission: -10,
    sustainability: 5,
    good: true,
    description: 'Clean renewable energy'
  },
  coal: {
    name: 'Coal Plant',
    icon: Fuel,
    cost: 30,
    emission: 25,
    sustainability: -8,
    good: false,
    description: 'Polluting fossil fuel energy'
  },
  electric_bus: {
    name: 'Electric Bus',
    icon: Bus,
    cost: 40,
    emission: -5,
    sustainability: 3,
    good: true,
    description: 'Zero-emission public transport'
  },
  diesel_bus: {
    name: 'Diesel Bus',
    icon: Bus,
    cost: 20,
    emission: 8,
    sustainability: -3,
    good: false,
    description: 'Polluting public transport'
  }
};

export default function ClimateCityBuilder({ addXp, gamification = { xp: 0, level: 1 } }) {
  const [budget, setBudget] = useState(1000);
  const [buildings, setBuildings] = useState([]);
  const [totalEmission, setTotalEmission] = useState(0);
  const [sustainabilityScore, setSustainabilityScore] = useState(50);
  const [history, setHistory] = useState([{ emission: 0, score: 50, budget: 1000 }]);
  const [gameWon, setGameWon] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const addBuilding = useCallback((buildingType) => {
    const building = BUILDING_TYPES[buildingType];
    
    if (budget < building.cost) {
      alert('Not enough budget!');
      return;
    }

    const newBuilding = {
      id: Date.now(),
      type: buildingType,
      ...building
    };

    const newEmission = totalEmission + building.emission;
    const newScore = Math.max(0, Math.min(100, sustainabilityScore + building.sustainability));
    const newBudget = budget - building.cost;

    setBuildings(prev => [...prev, newBuilding]);
    setTotalEmission(newEmission);
    setSustainabilityScore(newScore);
    setBudget(newBudget);

    setHistory(prev => [...prev, {
      emission: newEmission,
      score: newScore,
      budget: newBudget,
      building: building.name
    }]);

    // Award XP for good choices
    if (building.good && addXp) {
      addXp(10);
    }

    // Check win condition
    if (newEmission <= -50 && newScore >= 80) {
      setGameWon(true);
      if (addXp) {
        addXp(100); // Bonus XP for winning
      }
    }
  }, [totalEmission, sustainabilityScore, budget, addXp]);

  const resetGame = useCallback(() => {
    setBudget(1000);
    setBuildings([]);
    setTotalEmission(0);
    setSustainabilityScore(50);
    setHistory([{ emission: 0, score: 50, budget: 1000 }]);
    setGameWon(false);
  }, []);

  const removeBuilding = useCallback((id) => {
    setBuildings(prevBuildings => {
      const building = prevBuildings.find(b => b.id === id);
      if (building) {
        const newEmission = totalEmission - building.emission;
        const newScore = sustainabilityScore - building.sustainability;
        const newBudget = budget + building.cost;

        setTotalEmission(newEmission);
        setSustainabilityScore(newScore);
        setBudget(newBudget);

        setHistory(prev => [...prev, {
          emission: newEmission,
          score: newScore,
          budget: newBudget,
          action: `Demolished ${building.name}`
        }]);

        return prevBuildings.filter(b => b.id !== id);
      }
      return prevBuildings;
    });
  }, [totalEmission, sustainabilityScore, budget]);

  const stats = useMemo(() => ({
    totalBuildings: buildings.length,
    goodChoices: buildings.filter(b => b.good).length,
    badChoices: buildings.filter(b => !b.good).length,
    emissionTarget: -50,
    scoreTarget: 80
  }), [buildings]);

  const chartData = useMemo(() => history.map((h, i) => ({
    step: i,
    emission: h.emission,
    score: h.score,
    budget: h.budget
  })), [history]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                🏙️ Climate City Builder
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Build a sustainable city while reducing CO₂ emissions
              </p>
            </div>
            <Button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-blue-500 text-white"
            >
              {showInfo ? 'Hide' : 'Show'} Info
            </Button>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">How to Play:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>✅ Choose buildings wisely to reduce CO₂ and increase your sustainability score</li>
                <li>❌ Avoid polluting buildings that increase emissions</li>
                <li>💰 Manage your budget - you start with 1000 credits</li>
                <li>🎯 Win by reaching -50 CO₂ reduction AND 80+ sustainability score</li>
                <li>⭐ Earn XP for every good choice and bonus XP for winning!</li>
              </ul>
            </div>
          )}
        </div>

        {/* Game Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Budget */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Budget</p>
                <p className={`text-2xl font-bold ${budget > 500 ? 'text-green-600' : budget > 200 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {budget}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          {/* Total Emission */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">CO₂ Reduction</p>
                <p className={`text-2xl font-bold ${totalEmission <= -50 ? 'text-green-600' : totalEmission < 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {totalEmission > 0 ? '+' : ''}{totalEmission}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: -50</p>
          </div>

          {/* Sustainability Score */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Sustainability</p>
                <p className={`text-2xl font-bold ${sustainabilityScore >= 80 ? 'text-green-600' : sustainabilityScore >= 50 ? 'text-blue-600' : 'text-red-600'}`}>
                  {sustainabilityScore}/100
                </p>
              </div>
              <Leaf className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: 80</p>
          </div>

          {/* Buildings Count */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Buildings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {buildings.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ✅ {stats.goodChoices} | ❌ {stats.badChoices}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Win State */}
        {gameWon && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-2">
                🎉 City Built Successfully!
              </h2>
              <p className="text-green-800 dark:text-green-300 mb-4">
                You've created a sustainable city with {totalEmission} CO₂ reduction and {sustainabilityScore} sustainability score!
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                +100 XP Bonus! Your Level: {gamification.level}
              </p>
              <Button
                onClick={resetGame}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Available Buildings */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Choose Buildings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(BUILDING_TYPES).map(([key, building]) => {
                  const Icon = building.icon;
                  const canAfford = budget >= building.cost;
                  
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        building.good
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700 hover:border-green-500'
                          : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700 hover:border-red-500'
                      } ${!canAfford ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-6 h-6 ${building.good ? 'text-green-600' : 'text-red-600'}`} />
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              {building.good ? '✅' : '❌'} {building.name}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {building.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 text-sm mb-3 text-slate-700 dark:text-slate-300">
                        <span>💰 Cost: {building.cost}</span>
                        <span className={building.emission < 0 ? 'text-green-600' : 'text-red-600'}>
                          CO₂: {building.emission > 0 ? '+' : ''}{building.emission}
                        </span>
                        <span className={building.sustainability > 0 ? 'text-green-600' : 'text-red-600'}>
                          Score: {building.sustainability > 0 ? '+' : ''}{building.sustainability}
                        </span>
                      </div>

                      <Button
                        onClick={() => addBuilding(key)}
                        disabled={!canAfford || gameWon}
                        className={`w-full text-sm ${
                          building.good
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {canAfford ? 'Build' : 'Not enough budget'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emission Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">CO₂ Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="step" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Line type="monotone" dataKey="emission" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Score Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Sustainability Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="step" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar - Built Buildings */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Built City</h2>

            {buildings.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">Start building your city by choosing buildings from the left</p>
            ) : (
              <div className="space-y-2">
                {buildings.map((building) => {
                  const Icon = building.icon;
                  return (
                    <div
                      key={building.id}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        building.good
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                          : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className={`w-4 h-4 ${building.good ? 'text-green-600' : 'text-red-600'}`} />
                        <div className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white">{building.name}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {building.emission > 0 ? '+' : ''}{building.emission} CO₂
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBuilding(building.id)}
                        disabled={gameWon}
                        className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <Button
                onClick={resetGame}
                className="w-full bg-slate-600 text-white hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
