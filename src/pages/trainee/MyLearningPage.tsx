/**
 * Capacity Connect - Trainee My Learning Page
 * Route: /trainee/learning
 * Manage enrolled courses, monitor milestones, and resume lessons.
 */

import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { CourseDetailsModal } from './CourseDetailsModal';
import { Course } from '../../types';
import { getCourseImage, handleCourseImageError } from '../../utils/courseImageService';
import {
  GraduationCap,
  CheckCircle,
  Clock,
  Play,
  BookOpen,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
  FileCheck,
} from 'lucide-react';

interface MyLearningPageProps {
  onNavigate: (path: string) => void;
  onSelectCourse?: (courseId: string, lessonId?: string) => void;
}

export const MyLearningPage: React.FC<MyLearningPageProps> = ({
  onNavigate,
  onSelectCourse,
}) => {
  const {
    enrolledCourses,
    stats,
    courses,
    getAssessmentsForCourse,
    getAssessmentStatus,
    getLatestAttempt,
  } = useLearning();
  const [filterTab, setFilterTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const filteredEnrollments = enrolledCourses.filter((c) => {
    if (filterTab === 'in-progress') {
      return c.enrollment.status === 'in-progress' || c.enrollment.status === 'not-started';
    }
    if (filterTab === 'completed') {
      return c.enrollment.status === 'completed';
    }
    return true;
  });

  const handleStartLearning = (courseId: string, lessonId?: string) => {
    if (onSelectCourse) {
      onSelectCourse(courseId, lessonId);
    } else {
      onNavigate(`/trainee/learning?course=${courseId}${lessonId ? `&lesson=${lessonId}` : ''}`);
    }
  };

  const getTotalLessons = (course: Course) => {
    if (!course.modules) return course.lessonsCount || 0;
    return course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Learning"
        description="Track your active courses, continue where you left off, and review completed training."
        tag={
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Active Programs
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/trainee/courses')}
            icon={<BookOpen className="w-4 h-4 text-blue-700" />}
          >
            Explore Catalog
          </Button>
        }
      />

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled Courses"
          value={stats.enrolledCount}
          subtext={`${stats.inProgressCount} in-progress, ${stats.completedCount} completed`}
          icon={<GraduationCap className="w-5 h-5 text-blue-700" />}
          iconBgColor="bg-blue-50"
        />
        <StatCard
          label="Lessons Completed"
          value={stats.totalCompletedLessons}
          subtext="Across all enrolled curriculums"
          icon={<CheckCircle className="w-5 h-5 text-emerald-700" />}
          iconBgColor="bg-emerald-50"
        />
        <StatCard
          label="Average Progress"
          value={`${stats.avgProgress}%`}
          subtext="Cumulative completion score"
          trend={{ value: `${stats.avgProgress}%`, direction: stats.avgProgress > 0 ? 'up' : 'neutral' }}
          icon={<BookOpen className="w-5 h-5 text-indigo-700" />}
          iconBgColor="bg-indigo-50"
        />
        <StatCard
          label="Credentials Earned"
          value={stats.completedCount}
          subtext="100% course completions"
          icon={<Award className="w-5 h-5 text-amber-700" />}
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterTab === 'all'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Programs
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white border border-slate-200">
              {enrolledCourses.length}
            </span>
          </button>
          <button
            onClick={() => setFilterTab('in-progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterTab === 'in-progress'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            In Progress
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white border border-slate-200">
              {stats.inProgressCount}
            </span>
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterTab === 'completed'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Completed
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white border border-slate-200">
              {stats.completedCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredEnrollments.length}</span> programs
        </div>
      </div>

      {/* Enrolled Courses List */}
      {filteredEnrollments.length > 0 ? (
        <div className="space-y-4">
          {filteredEnrollments.map((course) => {
            const enr = course.enrollment;
            const totalLessons = getTotalLessons(course);
            const isCompleted = enr.status === 'completed' || enr.progressPercent === 100;

            // Find current/last accessed lesson title
            let currentLessonTitle = 'Module 1 — Lesson 1';
            if (enr.lastAccessedLessonId && course.modules) {
              for (const m of course.modules) {
                const found = m.lessons?.find((l) => l.id === enr.lastAccessedLessonId);
                if (found) {
                  currentLessonTitle = `${m.title} · ${found.title}`;
                  break;
                }
              }
            }

            const courseAssessments = getAssessmentsForCourse(course.id);
            const courseAssessment = courseAssessments[0];
            const asmStatus = courseAssessment ? getAssessmentStatus(courseAssessment.id) : null;
            const asmAttempt = courseAssessment ? getLatestAttempt(courseAssessment.id) : null;

            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-[#001034] shrink-0">
                    <img
                      src={getCourseImage(course)}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleCourseImageError(e, course)}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001034]/70 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                      {course.code}
                    </span>
                  </div>

                  {/* Course Metadata & Progress */}
                  <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600 font-medium">{course.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">Trainer: {course.trainerName}</span>
                    {isCompleted ? (
                      <span className="ml-auto sm:ml-0 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="ml-auto sm:ml-0 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => setActiveCourseModal(course)}
                    className="text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.tagline || course.description}
                  </p>

                  {/* Progress bar */}
                  <div className="pt-1 space-y-1.5 max-w-xl">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">Course Progress</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {enr.completedLessons.length} of {totalLessons} lessons ({enr.progressPercent}%)
                      </span>
                    </div>
                    <ProgressBar
                      value={enr.progressPercent}
                      size="md"
                      color={isCompleted ? 'emerald' : 'blue'}
                    />
                  </div>

                  {/* Course Assessment Evaluation Indicator */}
                  {courseAssessment && (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate text-[11px] sm:text-xs">
                          {courseAssessment.title}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] hidden md:inline">
                          ({courseAssessment.questionsCount || 5} MCQs · Pass: {courseAssessment.passingScorePercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {asmStatus === 'passed' ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Passed ({asmAttempt?.percentage}%)
                          </span>
                        ) : asmAttempt ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            Attempted ({asmAttempt.percentage}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                            Not Started
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onNavigate(`/trainee/assessments?id=${courseAssessment.id}`)}
                          className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline"
                        >
                          {asmStatus === 'passed' ? 'Review' : 'Take Evaluation'} →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom context row */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.durationHours} Hours Total</span>
                    </div>
                    <span className="text-slate-200">·</span>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.modules?.length || 4} Modules</span>
                    </div>
                    <span className="text-slate-200">·</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last accessed {new Date(enr.lastAccessedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

                {/* Right Action buttons */}
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[200px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 justify-center">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleStartLearning(course.id, enr.lastAccessedLessonId)}
                    icon={<Play className="w-4 h-4 fill-current" />}
                    className="w-full justify-center"
                  >
                    {isCompleted ? 'Review Lessons' : enr.progressPercent === 0 ? 'Start Course' : 'Resume Lesson'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveCourseModal(course)}
                    className="w-full justify-center text-xs"
                  >
                    View Syllabus & Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty tab state */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {filterTab === 'completed'
                ? 'No completed courses yet'
                : 'No active enrollments found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {filterTab === 'completed'
                ? 'Mark all lessons in a course as complete to earn your credential and view it here.'
                : 'Browse our catalog of professional courses and enroll to begin building capability.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/trainee/courses')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Explore Course Catalog
          </Button>
        </div>
      )}

      {/* Suggested next enrollment banner */}
      {courses.length > enrolledCourses.length && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Expand Your Competency Portfolio</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed max-w-xl">
              There are {courses.length - enrolledCourses.length} additional courses available in Earth & Climate, Geospatial Technology, and Management.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/trainee/courses')}
            className="shrink-0"
          >
            Browse Remaining Courses →
          </Button>
        </div>
      )}

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={activeCourseModal}
        isOpen={activeCourseModal !== null}
        onClose={() => setActiveCourseModal(null)}
        onStartLearning={handleStartLearning}
        onNavigate={onNavigate}
      />
    </div>
  );
};
