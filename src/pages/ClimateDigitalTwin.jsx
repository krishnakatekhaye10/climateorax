import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Heart, Map, Sparkles, Settings } from 'lucide-react';
import Earth3D from '../components/Earth3D';
import PlanetHealthEngine from '../components/PlanetHealthEngine';
import PersonalClimateTwin from '../components/PersonalClimateTwin';
import Button from '../components/ui/Button';

export default function ClimateDigitalTwin({ calculatorData = {}, gamification = {}, addXp = () => {} }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLayers, setSelectedLayers] = useState({ aqi: true, weather: true, carbon: false });
  const [futureYear, setFutureYear] = useState(2050);

  // Mock environmental data by region
  const environmentalData = useMemo(() => {
    return {
      regions: [
        { name: 'Europe', aqi: 45, temp: 18, emissions: 6.5 },
        { name: 'Asia', aqi: 85, temp: 28, emissions: 12.3 },
        { name: 'North America', aqi: 55, temp: 15, emissions: 8.7 },
        { name: 'South America', aqi: 35, temp: 24, emissions: 4.2 },
        { name: 'Africa', aqi: 65, temp: 32, emissions: 3.1 },
      ],
      globalStats: {
        avgTemp: 16.5,
        avgAQI: 62,
        totalEmissions: 34.8,
        treesCut: 15000000000,
      }
    };
  }, []);

  // Calculate future projections
  const projections = useMemo(() => {
    const yearFactor = (futureYear - 2025) / 25;
    const sustainabilityBonus = gamification.level ? gamification.level * 0.05 : 0;
    
    return {
      tempIncrease: 1.8 + (yearFactor * 1.2) - sustainabilityBonus,
      emissions: 37 + (yearFactor * 8) - (sustainabilityBonus * 20),
      greenArea: 30 - (yearFactor * 5) + (sustainabilityBonus * 10),
      renewable: 12 + (yearFactor * 35) + (sustainabilityBonus * 15),
    };
  }, [futureYear, gamification.level]);

  const handleSimulate = () => {
    addXp(50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Climate Digital Twin
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Real-time climate intelligence platform. Visualize Earth, track impact, and simulate futures.
          </p>
        </motion.div>

        {/* Main Tabs */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            {[
              { icon: Globe, label: '3D Earth', idx: 0 },
              { icon: Heart, label: 'Planet Health', idx: 1 },
              { icon: Sparkles, label: 'Your Twin', idx: 2 },
              { icon: Map, label: 'Discovery Map', idx: 3 },
              { icon: Zap, label: 'Future Sim', idx: 4 },
            ].map(({ icon: Icon, label, idx }) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                <Icon size={18} />
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab 0: 3D Earth */}
            {activeTab === 0 && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden" style={{ height: '500px' }}>
                  <Earth3D showAtmosphere={true} dayNightCycle={true} />
                </div>

                {/* Layer Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6"
                >
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Settings size={20} />
                    Environmental Layers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries({
                      aqi: 'Air Quality Index',
                      weather: 'Weather Systems',
                      carbon: 'Carbon Emissions'
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedLayers(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedLayers[key]
                            ? 'bg-emerald-500/20 border-emerald-500/50'
                            : 'bg-slate-700/20 border-slate-700/30 hover:border-slate-600/50'
                        }`}
                      >
                        <div className="font-semibold text-white">{label}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {selectedLayers[key] ? '✓ Active' : 'Inactive'}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Regional Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {environmentalData.regions.map((region, idx) => (
                    <motion.div
                      key={region.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-lg p-3"
                    >
                      <p className="font-semibold text-white text-sm mb-2">{region.name}</p>
                      <div className="space-y-1 text-xs text-slate-300">
                        <p>AQI: <span className={region.aqi > 100 ? 'text-red-400' : 'text-yellow-400'}>{region.aqi}</span></p>
                        <p>Temp: <span className="text-orange-400">{region.temp}°C</span></p>
                        <p>CO₂: <span className="text-red-400">{region.emissions}t</span></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 1: Planet Health */}
            {activeTab === 1 && (
              <PlanetHealthEngine
                userFootprint={(calculatorData.transport?.carKm || 150) / 100}
                targetEmissions={2.0}
              />
            )}

            {/* Tab 2: Your Twin */}
            {activeTab === 2 && <PersonalClimateTwin calculatorData={calculatorData} />}

            {/* Tab 3: Discovery Map */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8"
                >
                  <div className="text-center mb-8">
                    <Map className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white mb-2">Climate Discovery Map</h2>
                    <p className="text-slate-400">Nearby environmental initiatives and green infrastructure</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { emoji: '♻️', name: 'Recycling Centers', count: 12, distance: '2-8 km' },
                      { emoji: '🔌', name: 'EV Charging Stations', count: 8, distance: '1-5 km' },
                      { emoji: '🌳', name: 'Tree Plantation Projects', count: 5, distance: '3-15 km' },
                      { emoji: '☀️', name: 'Solar Installations', count: 3, distance: '5-20 km' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:border-emerald-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-3xl">{item.emoji}</div>
                          <div className="bg-emerald-500/20 border border-emerald-500/50 px-2 py-1 rounded text-xs font-bold text-emerald-400">
                            {item.count}
                          </div>
                        </div>
                        <p className="font-semibold text-white mb-1">{item.name}</p>
                        <p className="text-slate-400 text-sm">📍 {item.distance}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Tab 4: Future Simulator */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Future Earth Simulator</h2>

                  {/* Timeline Selector */}
                  <div className="mb-8">
                    <p className="text-slate-400 font-semibold mb-4">Project to Year: <span className="text-white text-2xl">{futureYear}</span></p>
                    <div className="flex gap-2 mb-4">
                      {[2025, 2030, 2040, 2050].map(year => (
                        <motion.button
                          key={year}
                          onClick={() => setFutureYear(year)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            futureYear === year
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                          }`}
                        >
                          {year}
                        </motion.button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="2025"
                      max="2050"
                      step="5"
                      value={futureYear}
                      onChange={(e) => setFutureYear(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Projections Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { label: 'Temperature Increase', value: projections.tempIncrease.toFixed(2), unit: '°C', color: 'text-red-400', icon: '🌡️' },
                      { label: 'Global Emissions', value: projections.emissions.toFixed(0), unit: 'Gt CO₂', color: 'text-orange-400', icon: '💨' },
                      { label: 'Green Area Coverage', value: projections.greenArea.toFixed(0), unit: '%', color: 'text-green-400', icon: '🌱' },
                      { label: 'Renewable Energy', value: projections.renewable.toFixed(0), unit: '%', color: 'text-yellow-400', icon: '⚡' },
                    ].map((proj, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-slate-400 font-semibold">{proj.label}</p>
                          <span className="text-2xl">{proj.icon}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-bold ${proj.color}`}>{proj.value}</span>
                          <span className="text-slate-500">{proj.unit}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Scenario Description */}
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 mb-6">
                    <p className="text-slate-300">
                      {futureYear <= 2030 && '🔮 Early intervention period. Actions taken now will significantly impact future outcomes.'}
                      {futureYear > 2030 && futureYear <= 2040 && '⚠️ Critical decade. Global warming effects become increasingly visible. Rapid decarbonization is essential.'}
                      {futureYear > 2040 && '🌍 Late 21st century outlook. Our choices today determine if Earth remains habitable.'}
                    </p>
                  </div>

                  <Button
                    onClick={handleSimulate}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
                  >
                    🎯 Simulate Your Impact
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Global Temp Rise', value: '1.5°C', icon: '🌡️' },
            { label: 'Atmospheric CO₂', value: '420 ppm', icon: '💨' },
            { label: 'Ice Loss Rate', value: '-500 Gt/yr', icon: '🧊' },
            { label: 'Species Loss', value: '68% loss', icon: '🦁' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
