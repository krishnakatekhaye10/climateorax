import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  TrendingDown,
  Zap,
  Award,
  Camera,
  AlertCircle,
  Flame,
} from 'lucide-react';
import { Button, Card, Badge, ProgressRing } from '../components/ui/ModernComponents';
import { habitVerificationService } from '../services/advancedServices';
import { componentClasses, animationVariants } from '../styles/utilities';

export default function GreenHabitVerificationPage({ addXp = () => {} }) {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(null);
  const [streak, setStreak] = useState(7);

  const habits = habitVerificationService.habits;

  const handleImageUpload = async (e, habitId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      setUploadedImage(event.target?.result);
      setVerifying(true);
      setSelectedHabit(habitId);

      try {
        const result = await habitVerificationService.verifyHabit(habitId, event.target?.result);
        setVerified(result);
        addXp(50);

        if (streak < 100) {
          setStreak(streak + 1);
        }
      } catch (error) {
        console.error('Verification failed:', error);
      } finally {
        setVerifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const streakBonus = habitVerificationService.getStreakBonus(streak);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className={componentClasses.container}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          {...animationVariants.slideDown}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🌿 Green Habit Verification
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Prove your eco-friendly habits and build your streak
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Habits Grid */}
          <motion.div
            className="lg:col-span-2"
            {...animationVariants.slideLeft}
          >
            <h2 className="text-2xl font-bold mb-6">Select a Habit to Verify</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit, idx) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    variant={selectedHabit === habit.id ? 'premium' : 'default'}
                    className={`cursor-pointer transition-all ${
                      selectedHabit === habit.id
                        ? 'ring-2 ring-green-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{habit.icon}</div>
                      <Badge variant="primary">{habit.co2Saved} kg CO₂</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{habit.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      {habit.description}
                    </p>

                    <label className="inline-block w-full">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                        <Camera size={16} />
                        <span className="text-sm font-medium">Verify with Photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, habit.id)}
                        className="hidden"
                      />
                    </label>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Image Preview & Verification */}
            {uploadedImage && (
              <motion.div
                className="mt-8"
                {...animationVariants.slideUp}
              >
                <Card variant="glass">
                  <h3 className="text-xl font-bold mb-4">Verification in Progress</h3>

                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />

                  {verifying && (
                    <div className="text-center py-8">
                      <div className="inline-flex gap-1 mb-4">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-green-600 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.1,
                          }}
                          className="w-2 h-2 bg-green-600 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-2 h-2 bg-green-600 rounded-full"
                        />
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Analyzing your eco-action...
                      </p>
                    </div>
                  )}

                  {verified && !verifying && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-700 dark:text-green-300">
                            {verified.message}
                          </p>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Confidence: {(verified.confidence * 100).toFixed(0)}%
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                            CO₂ Saved
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            {verified.coSaved} kg
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                            Points Earned
                          </p>
                          <p className="text-xl font-bold text-purple-600">
                            +{verified.pointsEarned}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          setUploadedImage(null);
                          setVerified(null);
                          setSelectedHabit(null);
                        }}
                      >
                        Verify Another Habit
                      </Button>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Streak Sidebar */}
          <motion.div {...animationVariants.slideRight}>
            <div className="space-y-4">
              {/* Streak */}
              <Card variant="premium">
                <div className="text-center mb-6">
                  <Flame className="w-12 h-12 mx-auto text-orange-500 mb-3" />
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Current Streak
                  </p>
                  <p className="text-5xl font-bold text-orange-600">{streak}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                    days
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <div>
                    <p className="text-xs font-semibold mb-1">Streak Bonus</p>
                    <p className="text-lg font-bold text-orange-600">
                      {streakBonus.multiplier}x {streakBonus.badge}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <Card>
                <h3 className="font-bold mb-4">Your Impact</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Habits Verified
                    </span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Total CO₂ Saved
                    </span>
                    <span className="font-bold">58.3 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Total Points
                    </span>
                    <span className="font-bold">1,240</span>
                  </div>
                </div>
              </Card>

              {/* Tips */}
              <Card className="border-blue-200/50 dark:border-blue-800/50">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li>✓ Verify daily to build your streak</li>
                  <li>✓ Better photos = higher confidence</li>
                  <li>✓ Natural lighting helps verification</li>
                  <li>✓ Keep streaks for bigger rewards</li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Preview */}
        <motion.div
          className="mt-12"
          {...animationVariants.slideUp}
        >
          <h2 className="text-2xl font-bold mb-6">🏆 Weekly Leaderboard</h2>
          <Card>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Alex Green', streak: 47, avatar: '🌟' },
                { rank: 2, name: 'You', streak, avatar: '👤' },
                { rank: 3, name: 'Jordan Eco', streak: 32, avatar: '♻️' },
                { rank: 4, name: 'Morgan Nature', streak: 28, avatar: '🌱' },
                { rank: 5, name: 'Casey Planet', streak: 21, avatar: '🌍' },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.rank === 2
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-sm">
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.avatar}</p>
                    </div>
                  </div>
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold">{user.streak}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
