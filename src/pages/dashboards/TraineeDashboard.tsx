/**
 * Capacity Connect - Trainee Dashboard
 * Route: /trainee
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLearning } from '../../context/LearningContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { CourseCard } from '../../components/ui/CourseCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CourseDetailsModal } from '../trainee/CourseDetailsModal';
import {
  SEED_ASSESSMENTS,
  SEED_CERTIFICATES,
  SEED_SKILLS,
} from '../../data/seedData';
import { Course, Assessment } from '../../types';
import {
  BookOpen,
  GraduationCap,
  FileCheck,
  Award,
  Play,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface TraineeDashboardProps {
  onNavigate: (path: string) => void;
}

export const TraineeDashboard: React.FC<TraineeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showSuccess, showInfo } = useToast();
  const {
    courses,
    enrolledCourses,
    activeCourse,
    stats,
    isEnrolled,
    assessments,
    getAssessmentStatus,
    getLatestAttempt,
  } = useLearning();

  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  // Derive stats from real LearningContext
  const enrolledCoursesCount = stats.enrolledCount;
  const avgProgress = stats.avgProgress;
  const pendingAssessmentsCount = stats.pendingAssessmentsCount;
  const certificatesCount = stats.completedCount > 0 ? stats.completedCount : SEED_CERTIFICATES.length;

  const currentActiveCourse = activeCourse || enrolledCourses[0] || courses[0];
  const primaryEnrollment = currentActiveCourse?.enrollment;

  // Recommended courses: courses not yet enrolled in, or fallback to first 2
  const recommendedCourses = courses
    .filter((c) => !isEnrolled(c.id))
    .slice(0, 2);
  const displayRecommended = recommendedCourses.length > 0 ? recommendedCourses : courses.slice(0, 2);

  // Pending assessments list
  const pendingAssessments = assessments.filter(
    (a) => getAssessmentStatus(a.id) !== 'passed'
  );

  const handleStartAssessment = (asm: Assessment) => {
    onNavigate(`/trainee/assessments?id=${asm.id}`);
  };

  const handleDownloadCertificate = () => {
    showSuccess('Certificate Verification', 'Certificate #CC-2025-PM-0842 generated and validated.');
  };

  const handleResumeActiveLesson = () => {
    if (currentActiveCourse) {
      const lessonQuery = primaryEnrollment?.lastAccessedLessonId ? `&lesson=${primaryEnrollment.lastAccessedLessonId}` : '';
      onNavigate(`/trainee/learning?course=${currentActiveCourse.id}${lessonQuery}`);
    } else {
      onNavigate('/trainee/courses');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${user?.fullName || 'Trainee'}`}
        description={`${user?.department || 'Operations & Strategy Division'} · ${user?.organization || 'National Capacity Unit'}`}
        tag={
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Trainee Portal
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/trainee/courses')}
              icon={<BookOpen className="w-3.5 h-3.5 text-blue-700" />}
            >
              Browse Catalog
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleResumeActiveLesson}
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              Resume Learning
            </Button>
          </div>
        }
      />

      {/* Demo Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Trainee Environment:</strong> Seeded with active course enrollments, competency radar, and verified credentials.
          </span>
        </div>
        <button
          onClick={() => onNavigate('/trainee/competencies')}
          className="text-blue-700 font-semibold hover:underline hidden sm:inline"
        >
          View Full Competency Matrix →
        </button>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled Courses"
          value={enrolledCoursesCount}
          subtext="2 in-progress, 1 completed"
          icon={<GraduationCap className="w-5 h-5 text-blue-700" />}
          iconBgColor="bg-blue-50"
          onClick={() => onNavigate('/trainee/learning')}
        />
        <StatCard
          label="Average Progress"
          value={`${avgProgress}%`}
          subtext="+14% this fortnight"
          trend={{ value: '+14%', direction: 'up' }}
          icon={<BookOpen className="w-5 h-5 text-indigo-700" />}
          iconBgColor="bg-indigo-50"
        />
        <StatCard
          label="Pending Assessments"
          value={pendingAssessmentsCount}
          subtext="Next due: Oct 05, 2026"
          trend={{ value: 'Due soon', direction: 'neutral' }}
          icon={<FileCheck className="w-5 h-5 text-amber-700" />}
          iconBgColor="bg-amber-50"
          onClick={() => onNavigate('/trainee/assessments')}
        />
        <StatCard
          label="Certificates Earned"
          value={certificatesCount}
          subtext="1 verified digital credential"
          icon={<Award className="w-5 h-5 text-emerald-700" />}
          iconBgColor="bg-emerald-50"
          onClick={() => onNavigate('/trainee/certificates')}
        />
      </div>

      {/* Main Grid: Continue Learning + Skill Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Continue Learning */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Continue Learning</h3>
              <span className="text-xs font-mono text-slate-400">Last accessed 2 days ago</span>
            </div>

            {currentActiveCourse && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono text-slate-700 font-semibold">{currentActiveCourse.code}</span>
                      <span className="text-slate-300">·</span>
                      <span>{currentActiveCourse.category}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {currentActiveCourse.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-xl">
                      {currentActiveCourse.tagline || currentActiveCourse.description}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleResumeActiveLesson}
                    icon={<Play className="w-4 h-4 fill-current" />}
                    className="shrink-0"
                  >
                    Resume Lesson
                  </Button>
                </div>

                <div className="pt-2">
                  <ProgressBar
                    value={primaryEnrollment?.progressPercent || 0}
                    label="Program Completion"
                    size="md"
                    color="blue"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {primaryEnrollment?.completedLessons.length || 0} of {currentActiveCourse.lessonsCount || 12} lessons completed
                    </span>
                  </div>
                  <span className="text-slate-200">·</span>
                  <span>Trainer: {currentActiveCourse.trainerName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Learning */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recommended Learning</h3>
                <p className="text-xs text-slate-500">Based on your organizational competency gap analysis</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('/trainee/courses')}
                className="text-xs text-blue-700"
              >
                View Full Catalog →
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayRecommended.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  actionLabel="Course Details"
                  onAction={(c) => setActiveCourseModal(c)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skill Progress & Upcoming Assessments */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skill Progress */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Skill Proficiency</h3>
              <button
                onClick={() => onNavigate('/trainee/competencies')}
                className="text-xs text-blue-700 hover:underline font-medium"
              >
                Diagnostics →
              </button>
            </div>

            <div className="space-y-4">
              {SEED_SKILLS.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{skill.name}</span>
                    <span className="font-mono text-slate-500 font-medium">
                      {skill.proficiencyLevel}% / {skill.targetLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        skill.proficiencyLevel >= skill.targetLevel ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${skill.proficiencyLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assessments */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Assessments</h3>
              <button
                onClick={() => onNavigate('/trainee/assessments')}
                className="text-xs font-mono text-blue-700 hover:underline font-semibold"
              >
                {pendingAssessments.length} Pending →
              </button>
            </div>

            <div className="space-y-3">
              {pendingAssessments.length > 0 ? (
                pendingAssessments.slice(0, 3).map((asm) => (
                  <div
                    key={asm.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-mono text-blue-700 font-medium">{asm.courseTitle}</span>
                      <span>{asm.durationMinutes} Mins</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{asm.title}</h5>
                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 font-mono text-[11px]">Pass: {asm.passingScorePercent}%</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartAssessment(asm)}
                        className="text-xs py-1 px-2.5 h-7"
                      >
                        Start Test
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1 text-xs">
                  <p className="font-semibold text-slate-800">All Assessments Complete!</p>
                  <p className="text-slate-500">You have no pending examinations at this time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Verified Certificate Mini Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-blue-300 block mb-1">LATEST CREDENTIAL</span>
                <h4 className="text-sm font-bold">Modern Project Management</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">CC-2025-PM-0842</p>
              </div>
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Issued July 2025</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCertificate}
                icon={<Download className="w-3.5 h-3.5" />}
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 text-xs py-1 px-2.5 h-7"
              >
                Verify & View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      <CourseDetailsModal
        course={activeCourseModal}
        isOpen={activeCourseModal !== null}
        onClose={() => setActiveCourseModal(null)}
        onStartLearning={(courseId, lessonId) => {
          const query = lessonId ? `&lesson=${lessonId}` : '';
          onNavigate(`/trainee/learning?course=${courseId}${query}`);
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};
