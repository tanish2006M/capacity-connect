/**
 * Capacity Connect - Course Details Modal
 * Detailed syllabus inspection and enrollment workflow for trainees.
 */

import React, { useState } from 'react';
import { Course } from '../../types';
import { getCourseImage, handleCourseImageError } from '../../utils/courseImageService';
import { useLearning } from '../../context/LearningContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  BookOpen,
  Clock,
  Star,
  User,
  CheckCircle,
  Play,
  FileText,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onStartLearning: (courseId: string, lessonId?: string) => void;
  onNavigate?: (path: string) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onStartLearning,
  onNavigate,
}) => {
  const {
    isEnrolled,
    getEnrollment,
    enrollCourse,
    isLessonCompleted,
    getAssessmentsForCourse,
    getAssessmentStatus,
    getLatestAttempt,
  } = useLearning();
  const { showSuccess, showInfo } = useToast();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    // Expand first module by default
    '0': true,
  });

  if (!course) return null;

  const enrolled = isEnrolled(course.id);
  const enrollment = getEnrollment(course.id);
  const progress = enrollment?.progressPercent ?? 0;

  // Course Assessment details if available
  const courseAssessments = getAssessmentsForCourse(course.id);
  const primaryAssessment = courseAssessments[0];
  const assessmentStatus = primaryAssessment ? getAssessmentStatus(primaryAssessment.id) : null;
  const latestAttempt = primaryAssessment ? getLatestAttempt(primaryAssessment.id) : null;

  const toggleModule = (modId: string, idx: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleEnroll = () => {
    const success = enrollCourse(course.id);
    if (success) {
      showSuccess(
        'Enrollment Confirmed!',
        `You have successfully enrolled in "${course.title}". Start with Module 1 now.`
      );
    } else {
      showInfo('Already Enrolled', `You are already enrolled in "${course.title}".`);
    }
  };

  const getLevelBadge = (level: Course['level']) => {
    switch (level) {
      case 'Foundational':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      subtitle={`${course.code} · ${course.category}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Course Visual Hero Banner */}
        <div className="relative h-40 sm:h-48 w-full rounded-xl overflow-hidden bg-[#001034] shadow-sm">
          <img
            src={getCourseImage(course)}
            alt={course.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleCourseImageError(e, course)}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001034]/95 via-[#001034]/40 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-semibold text-xs shadow-xs">
              {course.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs border border-white/10">
              {course.level}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-300 font-semibold uppercase tracking-wider">{course.code}</span>
              <h3 className="text-base sm:text-lg font-bold leading-snug truncate">{course.title}</h3>
            </div>
            {enrolled && (
              <span className="px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-bold shrink-0 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {progress}% Complete
              </span>
            )}
          </div>
        </div>

        {/* Banner with course summary and enrollment state */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded font-medium border ${getLevelBadge(course.level)}`}>
                {course.level}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">{course.category}</span>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.durationHours} Hours</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{course.rating}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {course.tagline || course.description}
            </p>
          </div>

          {/* Action button in banner */}
          <div className="shrink-0 flex flex-col gap-2 min-w-[180px]">
            {enrolled ? (
              <div className="space-y-2">
                <div className="text-xs flex items-center justify-between font-medium text-slate-700">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Enrolled
                  </span>
                  <span className="font-mono">{progress}% Complete</span>
                </div>
                <ProgressBar value={progress} size="sm" color="blue" />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    onClose();
                    onStartLearning(course.id, enrollment?.lastAccessedLessonId);
                  }}
                  icon={<Play className="w-4 h-4 fill-current" />}
                  className="w-full justify-center"
                >
                  {progress === 0 ? 'Start Course' : 'Continue Learning'}
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleEnroll}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  Enroll in Course
                </Button>
                <p className="text-[11px] text-center text-slate-500">
                  Instant demo enrollment (Free)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructor & Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Overview & Learning Objectives */}
          <div className="md:col-span-8 space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                About this Course
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            {course.objectives && course.objectives.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Learning Objectives
                </h4>
                <div className="space-y-2">
                  {course.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills acquired */}
            {course.skillsCovered && course.skillsCovered.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Competencies Covered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {course.skillsCovered.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Instructor & Credential Card */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lead Trainer
              </h4>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                  {course.trainerName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{course.trainerName}</h5>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {course.trainerDesignation || 'Senior Faculty & Domain Lead'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/40 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                <h5 className="text-xs font-bold">Verified Credential</h5>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Completing 100% of curriculum lessons validates competency progression in your institutional profile.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Curriculum Syllabus */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900">
                Course Curriculum ({course.modules?.length || 0} Modules · {course.lessonsCount} Lessons)
              </h4>
            </div>
            <span className="text-xs text-slate-500">
              Estimated Total: {course.durationHours} Hours
            </span>
          </div>

          <div className="space-y-2.5">
            {course.modules?.map((mod, modIdx) => {
              const isExpanded = expandedModules[modIdx] ?? false;
              const moduleLessons = mod.lessons || [];
              const completedCountInModule = moduleLessons.filter((l) =>
                isLessonCompleted(course.id, l.id)
              ).length;

              return (
                <div
                  key={mod.id}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleModule(mod.id, modIdx)}
                    className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center">
                        {modIdx + 1}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{mod.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {enrolled && (
                        <span className="font-mono text-[11px]">
                          {completedCountInModule}/{moduleLessons.length} Done
                        </span>
                      )}
                      <span>{moduleLessons.length} lessons</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-slate-100 border-t border-slate-100 px-4 py-1">
                      {moduleLessons.map((lesson) => {
                        const isDone = isLessonCompleted(course.id, lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className="py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 -mx-4 px-4 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isDone ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : lesson.type === 'video' ? (
                                <Play className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className={`font-medium truncate ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-400 shrink-0">
                              <span className="font-mono text-[11px]">
                                {lesson.durationMinutes}m
                              </span>
                              {enrolled && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    onClose();
                                    onStartLearning(course.id, lesson.id);
                                  }}
                                  className="text-[11px] h-7 px-2 text-blue-700"
                                >
                                  Open
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Official Course Assessment & Evaluation Module */}
            {primaryAssessment && (
              <div className="rounded-xl border border-blue-200/90 bg-blue-50/40 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
                      <FileCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-800 font-bold block">
                        Official Course Evaluation
                      </span>
                      <h5 className="text-xs font-bold text-slate-900">{primaryAssessment.title}</h5>
                    </div>
                  </div>

                  {enrolled && assessmentStatus === 'passed' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Passed ({latestAttempt?.percentage}%)
                    </span>
                  ) : enrolled && latestAttempt ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Needs Retake ({latestAttempt.percentage}%)
                    </span>
                  ) : enrolled ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                      Ready to Take
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Included with Course
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-slate-600 border-t border-blue-100 font-mono">
                  <span>{primaryAssessment.questionsCount || 5} Questions · Multiple Choice</span>
                  <span>Duration: {primaryAssessment.durationMinutes} mins</span>
                  <span>Passing Score: {primaryAssessment.passingScorePercent}%</span>
                </div>

                {enrolled && (
                  <div className="pt-1 flex justify-end">
                    <Button
                      variant={assessmentStatus === 'passed' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => {
                        onClose();
                        if (onNavigate) {
                          onNavigate(`/trainee/assessments?id=${primaryAssessment.id}`);
                        } else {
                          window.history.pushState({}, '', `/trainee/assessments?id=${primaryAssessment.id}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }
                      }}
                      icon={<FileCheck className="w-3.5 h-3.5" />}
                      className="text-xs h-8"
                    >
                      {assessmentStatus === 'passed' ? 'Review Evaluation Record' : 'Launch Assessment Now'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          {enrolled ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onStartLearning(course.id, enrollment?.lastAccessedLessonId);
              }}
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Continue to Lesson
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleEnroll}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Enroll & Start Learning
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
