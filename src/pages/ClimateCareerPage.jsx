import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui/ModernComponents';
import { careerRecommenderService } from '../services/advancedServices';
import { componentClasses, animationVariants } from '../styles/utilities';

export default function ClimateCareerRecommenderPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const recommendations = careerRecommenderService.getRecommendations({});

  const tabs = [
    { id: 'jobs', label: 'Green Jobs', icon: Briefcase },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'courses', label: 'Courses', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className={componentClasses.container}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          {...animationVariants.slideDown}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🌱 Climate Career Paths
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Launch a rewarding career in sustainability and green technology
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                activeTab === id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            {...animationVariants.fadeIn}
          >
            {recommendations.matchedJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card variant="premium" className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {job.description}
                      </p>
                    </div>
                    <Badge variant="primary">{job.demand}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        Salary Range
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {job.salary}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        Growth Rate
                      </p>
                      <p className="text-lg font-bold text-emerald-600">
                        {job.growth}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                      Key Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="mt-auto" variant="primary">
                    Learn More <ArrowRight size={16} />
                  </Button>
                </Card>
              </motion.div>
            ))}

            {/* View All Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Showing 2 of {careerRecommenderService.greenJobs.length} jobs
                </p>
                <Button variant="outline">
                  View All Green Jobs
                  <ArrowRight size={16} />
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <motion.div
            className="space-y-4"
            {...animationVariants.fadeIn}
          >
            {recommendations.suggestedCertifications.map((cert, idx) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="flex items-start justify-between p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      {cert.description}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        ⏱️ {cert.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        💰 ${cert.cost}
                      </span>
                      <span className="flex items-center gap-1">
                        🏫 {cert.provider}
                      </span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" className="ml-4">
                    Start Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            {...animationVariants.fadeIn}
          >
            {recommendations.recommendedCourses.map((course, idx) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card variant="glass" className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="primary">{course.level}</Badge>
                    <Badge variant="secondary">
                      {course.cost === 'Free' ? '✨' : '💵'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-1">
                    {course.platform}
                  </p>

                  <div className="flex justify-between items-center text-sm mb-4">
                    <span>⏱️ {course.duration}</span>
                    <span className="font-bold text-green-600">
                      {course.cost}
                    </span>
                  </div>

                  <Button variant="outline" className="w-full">
                    Enroll <ArrowRight size={14} />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/50"
          {...animationVariants.slideUp}
        >
          <h2 className="text-2xl font-bold mb-4">🚀 Your Path Forward</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {recommendations.nextSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
