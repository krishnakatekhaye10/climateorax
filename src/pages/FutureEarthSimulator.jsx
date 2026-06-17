import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import RangeInput from '../components/ui/RangeInput';

const baselineEmission = 5877; // Sample baseline estimate for a moderate lifestyle
const challengeTargetPercent = 20;

export default function FutureEarthSimulator() {
  const [transportKm, setTransportKm] = useState(150);
  const [electricity, setElectricity] = useState(300);
  const [foodFactor, setFoodFactor] = useState(1); // 1 = baseline, >1 more emissions
  const [wasteKg, setWasteKg] = useState(10);
  const [challengeScore, setChallengeScore] = useState(null);

  const baseEmission = useMemo(() => {
    const transport = transportKm * 0.21 * 52; // kg CO2 per km assumption converted weekly->yearly
    const elec = electricity * 12 * 0.233; // kWh/month -> kWh/year * kgCO2 per kWh
    const food = foodFactor * 800; // baseline food emissions per year
    const waste = wasteKg * 5 * 52; // weekly waste estimate to yearly
    return Math.round(transport + elec + food + waste);
  }, [transportKm, electricity, foodFactor, wasteKg]);

  const reductionPercent = useMemo(() => {
    const saved = Math.max(0, baselineEmission - baseEmission);
    return Number(((saved / baselineEmission) * 100).toFixed(1));
  }, [baseEmission]);

  const projection = useMemo(() => {
    const years = [2025, 2026, 2027, 2028, 2029, 2030];
    const trend = 1 - 0.02; // default 2% reduction per year if no action
    const improvements = Math.max(0, (300 - electricity) / 300) + Math.max(0, (150 - transportKm) / 150) * 0.5;
    const improvedTrend = 1 - Math.min(0.06, 0.02 + improvements * 0.02);

    let value = baseEmission;
    return years.map((y, idx) => {
      if (idx === 0) return { year: y, co2: Math.round(value) };
      value = value * (idx < 2 ? improvedTrend : trend);
      return { year: y, co2: Math.round(value) };
    });
  }, [baseEmission, transportKm, electricity]);

  const handleCheckChallenge = () => {
    setChallengeScore(reductionPercent);
  };

  const handleResetChallenge = () => {
    setTransportKm(150);
    setElectricity(300);
    setFoodFactor(1);
    setWasteKg(10);
    setChallengeScore(null);
  };

  const challengeCompleted = reductionPercent >= challengeTargetPercent;
  const challengeMessage = challengeCompleted
    ? `Mission complete! Your project cuts emissions by ${reductionPercent}% and beats the ${challengeTargetPercent}% climate challenge.`
    : `Keep going: reduce another ${(challengeTargetPercent - reductionPercent).toFixed(1)}% to achieve the challenge.`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 font-jakarta">
      <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Future Earth Simulator</h2>
        <p className="text-sm text-slate-500 mb-4">Enter your lifestyle inputs to see a simple projected CO₂ trajectory to 2030.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RangeInput
            id="sim-transport-km"
            label="Weekly car km"
            min={0}
            max={1000}
            value={transportKm}
            onChange={(e) => setTransportKm(Number(e.target.value))}
            description={`${transportKm} km/week`}
          />

          <RangeInput
            id="sim-electricity"
            label="Electricity (kWh/month)"
            min={50}
            max={1000}
            value={electricity}
            onChange={(e) => setElectricity(Number(e.target.value))}
            description={`${electricity} kWh/month`}
          />

          <RangeInput
            id="sim-diet-factor"
            label="Diet factor"
            min={0.6}
            max={1.8}
            step={0.01}
            value={foodFactor}
            onChange={(e) => setFoodFactor(Number(e.target.value))}
            description={`${foodFactor.toFixed(2)}× baseline`}
          />

          <RangeInput
            id="sim-waste-kg"
            label="Weekly waste (kg)"
            min={0}
            max={100}
            value={wasteKg}
            onChange={(e) => setWasteKg(Number(e.target.value))}
            description={`${wasteKg} kg/week`}
          />
        </div>

        <div className="mt-6">
          <div className="text-sm text-slate-500">Estimated current annual CO₂</div>
          <div className="text-2xl font-bold">{baseEmission.toLocaleString()} kg CO₂</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-3">Climate Action Challenge</h3>
        <p className="text-sm text-slate-500 mb-4">Can you reduce your annual emissions by at least {challengeTargetPercent}%? Adjust the controls, then check your plan.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/60">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Challenge target</div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{challengeTargetPercent}%</div>
            <div className="text-sm text-slate-500 mt-2">Your current reduction</div>
            <div className="text-xl font-semibold">{reductionPercent}%</div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/60">
            <div className="text-sm font-semibold">Challenge status</div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{challengeMessage}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="md" onClick={handleCheckChallenge}>
                Check my plan
              </Button>
              <Button variant="secondary" size="md" onClick={handleResetChallenge}>
                Reset sliders
              </Button>
            </div>
            {challengeScore !== null && (
              <div className={`rounded-2xl p-3 text-sm ${challengeCompleted ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'}`}>
                {challengeCompleted ? (
                  <span>🎉 Success! You met the challenge with a {challengeScore}% reduction.</span>
                ) : (
                  <span>⚠️ You are at {challengeScore}% reduction — try a cleaner commute, lower electricity, or less waste.</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-3">Projection to 2030</h3>
        <div style={{ height: 260, minHeight: 260 }}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={projection} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="md" className="flex items-center gap-2" aria-label="Export Future Earth Simulator report">
          Export Report
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
