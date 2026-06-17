import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle } from 'lucide-react';
import { Button, Card, Badge, Skeleton } from '../components/ui/ModernComponents';
import { wasteAnalysisService } from '../services/advancedServices';
import { componentClasses, animationVariants } from '../styles/utilities';

export default function AIWasteScannerPage({ addXp = () => {} }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result);
      analyzeWaste(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeWaste = async (imageUrl) => {
    setAnalyzing(true);
    try {
      const analysis = await wasteAnalysisService.analyzeWaste(imageUrl);
      setResult(analysis);
      addXp(25); // Small XP for analysis
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFeedback = (helpful) => {
    setUserFeedback(helpful);
    addXp(helpful ? 10 : 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className={componentClasses.container}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          {...animationVariants.slideDown}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🔍 AI Waste Scanner
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Take a photo of your waste and get instant disposal recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            className="lg:col-span-2"
            {...animationVariants.slideLeft}
          >
            <Card variant="premium">
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center gap-4 cursor-pointer py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">
                      Upload a waste photo
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Waste"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Upload Different Image
                  </Button>
                </div>
              )}
            </Card>

            {/* Results */}
            {analyzing && (
              <Card className="mt-6">
                <div className="space-y-4">
                  <Skeleton count={3} height={20} />
                </div>
              </Card>
            )}

            {result && !analyzing && (
              <motion.div
                className="mt-6"
                {...animationVariants.slideUp}
              >
                <Card variant="glass">
                  <h2 className="text-xl font-bold mb-4">Analysis Results</h2>

                  {/* Detected Items */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
                      Detected Items
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.detected.map((item) => {
                        const type = wasteAnalysisService.wasteTypes.find(
                          (w) => w.id === item
                        );
                        return type ? (
                          <Badge key={item} variant="primary">
                            {type.icon} {type.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
                      Disposal Recommendations
                    </p>
                    <ol className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-600">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 pt-0.5">
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Impact */}
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      ✨ {result.impact}
                    </p>
                  </div>

                  {/* Feedback */}
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm font-semibold mb-3">
                      Was this helpful?
                    </p>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant={userFeedback === true ? 'primary' : 'secondary'}
                        onClick={() => handleFeedback(true)}
                      >
                        👍 Yes
                      </Button>
                      <Button
                        size="sm"
                        variant={userFeedback === false ? 'primary' : 'secondary'}
                        onClick={() => handleFeedback(false)}
                      >
                        👎 No
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div {...animationVariants.slideRight}>
            <div className="space-y-4">
              {/* Stats */}
              <Card>
                <h3 className="font-bold mb-4">Your Impact</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Items Scanned
                    </span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      CO₂ Saved
                    </span>
                    <span className="font-bold">3.2 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Trees Protected
                    </span>
                    <span className="font-bold">0.16</span>
                  </div>
                </div>
              </Card>

              {/* Quick Tips */}
              <Card>
                <h3 className="font-bold mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li>✓ Clean containers before recycling</li>
                  <li>✓ Remove caps and lids</li>
                  <li>✓ Flatten cardboard boxes</li>
                  <li>✓ Keep items dry</li>
                  <li>✓ Don't mix waste types</li>
                </ul>
              </Card>

              {/* Info */}
              <Card className="border-blue-200/50 dark:border-blue-800/50">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                      Find Facilities
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Use our map to find recycling centers near you
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
