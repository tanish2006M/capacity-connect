/**
 * Capacity Connect - Trainee Assessments Hub Page
 * Browse available evaluations, track attempt transcripts, and launch timed MCQ examinations.
 */

import React, { useState } from 'react';
import { useLearning } from '../../../context/LearningContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Button } from '../../../components/ui/Button';
import { StatCard } from '../../../components/ui/StatCard';
import { AssessmentRunnerPage } from './AssessmentRunnerPage';
import {
  FileCheck,
  CheckCircle,
  Clock,
  Award,
  AlertTriangle,
  Play,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface TraineeAssessmentsPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const TraineeAssessmentsPage: React.FC<TraineeAssessmentsPageProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { assessments, attempts, getAssessmentStatus, getLatestAttempt, getCourseById } = useLearning();

  // Check if an assessment is selected via query param e.g. /trainee/assessments?id=asm_weather_01
  const queryParams = new URLSearchParams(currentPath.split('?')[1] || '');
  const activeAssessmentId = queryParams.get('id');

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If a specific assessment is selected, render the full runner
  if (activeAssessmentId) {
    return (
      <AssessmentRunnerPage
        assessmentId={activeAssessmentId}
        onNavigate={onNavigate}
        onBack={() => onNavigate('/trainee/assessments')}
      />
    );
  }

  // Calculate statistics
  const totalAssessments = assessments.length;
  const passedAssessmentsCount = assessments.filter(
    (a) => getAssessmentStatus(a.id) === 'passed'
  ).length;
  const pendingAssessmentsCount = assessments.filter(
    (a) => getAssessmentStatus(a.id) !== 'passed'
  ).length;

  const validAttemptsWithScores = attempts.filter((att) => att.percentage !== undefined);
  const avgScore =
    validAttemptsWithScores.length > 0
      ? Math.round(
          validAttemptsWithScores.reduce((sum, att) => sum + att.percentage, 0) /
            validAttemptsWithScores.length
        )
      : 0;

  // Filter assessments
  const filteredAssessments = assessments.filter((asm) => {
    const status = getAssessmentStatus(asm.id);
    if (activeTab === 'pending' && status === 'passed') return false;
    if (activeTab === 'completed' && status !== 'passed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = asm.title.toLowerCase().includes(q);
      const matchCourse = asm.courseTitle.toLowerCase().includes(q);
      if (!matchTitle && !matchCourse) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Assessments & Evaluation Engine"
        description="Take scheduled examinations, monitor official scores, and achieve certified competency benchmarks across your courses."
        tag={
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Official Evaluations
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/trainee/learning')}
            icon={<BookOpen className="w-3.5 h-3.5 text-blue-700" />}
          >
            My Learning
          </Button>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Assessments"
          value={totalAssessments}
          subtext="Course evaluation modules"
          icon={<FileCheck className="w-5 h-5 text-blue-700" />}
          iconBgColor="bg-blue-50"
        />
        <StatCard
          label="Passed & Credited"
          value={passedAssessmentsCount}
          subtext="Certified passing benchmark"
          icon={<CheckCircle className="w-5 h-5 text-emerald-700" />}
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          label="Pending Evaluations"
          value={pendingAssessmentsCount}
          subtext="Available to take now"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          iconBgColor="bg-amber-50"
        />
        <StatCard
          label="Average Score"
          value={avgScore > 0 ? `${avgScore}%` : '—'}
          subtext="Across all evaluated attempts"
          icon={<Award className="w-5 h-5 text-purple-700" />}
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Assessments ({assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingAssessmentsCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({passedAssessmentsCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAssessments.map((asm) => {
          const status = getAssessmentStatus(asm.id);
          const latest = getLatestAttempt(asm.id);
          const course = getCourseById(asm.courseId);

          return (
            <div
              key={asm.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-blue-700 font-semibold truncate">
                    {asm.courseTitle}
                  </span>

                  {status === 'passed' ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Passed ({latest?.percentage}%)
                    </span>
                  ) : latest ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Needs Retake ({latest.percentage}%)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium shrink-0">
                      Ready to Start
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                  {asm.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {asm.description ||
                    'Comprehensive evaluation covering key competencies and practical problem solving.'}
                </p>
              </div>

              {/* Assessment Meta Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asm.questionsCount || asm.questions?.length || 5} Questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asm.durationMinutes} mins</span>
                  </div>
                  <div>
                    <span>Passing: {asm.passingScorePercent}%</span>
                  </div>
                </div>

                <Button
                  variant={status === 'passed' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => onNavigate(`/trainee/assessments?id=${asm.id}`)}
                  icon={
                    status === 'passed' ? (
                      <RotateCcw className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )
                  }
                >
                  {status === 'passed' ? 'Review & Retake' : 'Start Assessment'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No assessments found</h3>
          <p className="text-xs text-slate-500">
            No evaluations matched your current filter criteria.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setActiveTab('all'); setSearchQuery(''); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Official Historical Attempts Record */}
      {attempts.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official Attempt History & Transcript Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Archived score records and diagnostic attempt logs.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">{attempts.length} Total Attempts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/70 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Assessment Title</th>
                  <th className="py-2.5 px-3">Attempt #</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {attempts.map((att) => {
                  const asm = assessments.find((a) => a.id === att.assessmentId);
                  return (
                    <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(att.attemptDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {asm?.title || att.assessmentId}
                        <span className="block text-[11px] font-normal text-slate-400 font-mono">
                          {asm?.courseTitle}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        Attempt #{att.attemptNumber || 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {att.percentage}% ({att.score}/{att.maxScore} pts)
                      </td>
                      <td className="py-3 px-3">
                        {att.passed ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                            PASSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                            NOT MET
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate(`/trainee/assessments?id=${att.assessmentId}`)}
                          className="text-[11px] h-7 px-2.5"
                        >
                          View Explanations
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
