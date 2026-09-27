/**
 * Capacity Connect - Trainee Course Player & Lesson Learner
 * Interactive multi-module learning viewer with progress synchronization.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { useToast } from '../../context/ToastContext';
import { Course, Module, Lesson } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowLeft,
  CheckCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  BookOpen,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Sparkles,
  Layers,
  Check,
  RotateCcw,
  Share2,
  FileCheck,
} from 'lucide-react';

interface CoursePlayerPageProps {
  courseId: string;
  initialLessonId?: string;
  onNavigate: (path: string) => void;
}

export const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({
  courseId,
  initialLessonId,
  onNavigate,
}) => {
  const {
    getCourseById,
    getEnrollment,
    toggleLessonComplete,
    isLessonCompleted,
    setLastAccessedLesson,
    getAssessmentsForCourse,
    getAssessmentStatus,
    getLatestAttempt,
  } = useLearning();

  const { showSuccess, showInfo } = useToast();

  const course = getCourseById(courseId);
  const enrollment = getEnrollment(courseId);

  // Check for course-specific evaluation
  const courseAssessments = getAssessmentsForCourse(courseId);
  const primaryAssessment = courseAssessments[0];
  const assessmentStatus = primaryAssessment ? getAssessmentStatus(primaryAssessment.id) : null;
  const latestAttempt = primaryAssessment ? getLatestAttempt(primaryAssessment.id) : null;

  // Flatten all lessons with their module info for linear prev/next navigation
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    const list: { lesson: Lesson; module: Module; index: number }[] = [];
    let idx = 0;
    for (const mod of course.modules) {
      for (const les of mod.lessons || []) {
        list.push({ lesson: les, module: mod, index: idx++ });
      }
    }
    return list;
  }, [course]);

  // Determine active lesson
  const [currentLessonId, setCurrentLessonId] = useState<string>(() => {
    if (initialLessonId && allLessons.some((item) => item.lesson.id === initialLessonId)) {
      return initialLessonId;
    }
    if (enrollment?.lastAccessedLessonId && allLessons.some((item) => item.lesson.id === enrollment.lastAccessedLessonId)) {
      return enrollment.lastAccessedLessonId;
    }
    return allLessons[0]?.lesson.id || '';
  });

  // Track expanded modules in curriculum drawer
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Simulated video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoProgress, setVideoProgress] = useState<number>(25); // 25% preview
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Active lesson and module objects
  const activeItem = useMemo(() => {
    return allLessons.find((item) => item.lesson.id === currentLessonId) || allLessons[0];
  }, [allLessons, currentLessonId]);

  const currentLesson = activeItem?.lesson;
  const currentModule = activeItem?.module;
  const currentIndex = activeItem?.index ?? 0;

  // Auto-expand module containing the current lesson
  useEffect(() => {
    if (currentModule) {
      setExpandedModules((prev) => ({
        ...prev,
        [currentModule.id]: true,
      }));
      setLastAccessedLesson(courseId, currentLesson?.id || '');
    }
  }, [currentModule?.id, currentLesson?.id, courseId]);

  // Handle missing course
  if (!course) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto mt-8">
        <h3 className="text-lg font-bold text-slate-900">Course Not Found</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested course curriculum does not exist or has been archived.
        </p>
        <Button variant="primary" size="sm" onClick={() => onNavigate('/trainee/courses')}>
          Return to Course Catalog
        </Button>
      </div>
    );
  }

  const isCurrentLessonDone = currentLesson ? isLessonCompleted(course.id, currentLesson.id) : false;
  const totalLessonsCount = allLessons.length;
  const completedLessonsCount = enrollment?.completedLessons?.length || 0;
  const currentProgressPercent = enrollment?.progressPercent || 0;

  // Handle toggle completion
  const handleToggleComplete = () => {
    if (!currentLesson) return;
    const { newProgress, isCompleted } = toggleLessonComplete(course.id, currentLesson.id);

    if (isCompleted) {
      if (newProgress === 100) {
        setCompletionModalOpen(true);
        showSuccess('Course 100% Completed!', `Congratulations! You have completed all lessons in "${course.title}".`);
      } else {
        showSuccess('Lesson Completed!', `"${currentLesson.title}" marked as complete (${newProgress}% course progress).`);
      }
    } else {
      showInfo('Status Updated', `"${currentLesson.title}" marked as incomplete.`);
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      setCurrentLessonId(next.lesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Reached the end of course
      if (currentProgressPercent === 100) {
        setCompletionModalOpen(true);
      } else {
        showInfo('Curriculum Complete', 'You have viewed all lessons in this syllabus.');
      }
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      const prev = allLessons[currentIndex - 1];
      setCurrentLessonId(prev.lesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownloadResource = (resTitle: string) => {
    showSuccess('Resource Downloaded', `Simulating download: ${resTitle}`);
  };

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Top Learning Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Back & Course Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('/trainee/learning')}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
              title="Back to My Learning"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono text-slate-700 font-semibold">{course.code}</span>
                <span className="text-slate-300">·</span>
                <span className="truncate">{course.category}</span>
                <span className="text-slate-300 hidden sm:inline">·</span>
                <span className="hidden sm:inline">Trainer: {course.trainerName}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {course.title}
              </h2>
            </div>
          </div>

          {/* Right: Progress Indicator & Mobile Curriculum Drawer Toggle */}
          <div className="flex items-center gap-4 shrink-0 justify-between lg:justify-end">
            <div className="min-w-[160px] sm:min-w-[200px] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Completion</span>
                <span className="font-mono font-semibold text-slate-800">
                  {completedLessonsCount}/{totalLessonsCount} ({currentProgressPercent}%)
                </span>
              </div>
              <ProgressBar
                value={currentProgressPercent}
                size="sm"
                color={currentProgressPercent === 100 ? 'emerald' : 'blue'}
              />
            </div>

            {primaryAssessment && (
              <Button
                variant={assessmentStatus === 'passed' ? 'outline' : 'primary'}
                size="sm"
                onClick={() => onNavigate(`/trainee/assessments?id=${primaryAssessment.id}`)}
                icon={<FileCheck className="w-3.5 h-3.5" />}
                className="hidden md:inline-flex shrink-0"
              >
                {assessmentStatus === 'passed'
                  ? `Assessment: Passed (${latestAttempt?.percentage}%)`
                  : 'Course Assessment'}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
              icon={<Layers className="w-3.5 h-3.5 text-blue-700" />}
              className="lg:hidden"
            >
              Curriculum
            </Button>
          </div>
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Curriculum Drawer / Accordion */}
        <div
          className={`lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden ${
            sidebarOpenMobile ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Curriculum Header */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Course Syllabus
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {course.modules?.length || 0} Modules
            </span>
          </div>

          {/* Module List */}
          <div className="divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
            {course.modules?.map((mod, modIdx) => {
              const isModExpanded = expandedModules[mod.id] ?? (modIdx === 0);
              const modLessons = mod.lessons || [];
              const modCompletedCount = modLessons.filter((l) =>
                isLessonCompleted(course.id, l.id)
              ).length;
              const isModAllCompleted = modCompletedCount === modLessons.length && modLessons.length > 0;

              return (
                <div key={mod.id} className="bg-white">
                  {/* Module Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleModuleAccordion(mod.id)}
                    className="w-full px-4 py-3 text-left flex items-start justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[11px] font-mono font-bold mt-0.5 ${
                          isModAllCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isModAllCompleted ? <Check className="w-3 h-3 text-emerald-700" /> : modIdx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {modCompletedCount} of {modLessons.length} completed
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400 mt-1">
                      {isModExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {/* Lessons list inside Module */}
                  {isModExpanded && (
                    <div className="bg-slate-50/50 border-t border-slate-100 divide-y divide-slate-100/80">
                      {modLessons.map((les) => {
                        const isSelected = les.id === currentLessonId;
                        const isDone = isLessonCompleted(course.id, les.id);

                        return (
                          <button
                            key={les.id}
                            type="button"
                            onClick={() => {
                              setCurrentLessonId(les.id);
                              setSidebarOpenMobile(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors ${
                              isSelected
                                ? 'bg-blue-50/90 border-l-4 border-blue-600 text-blue-900 font-semibold pl-3'
                                : 'hover:bg-slate-100/70 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Completion indicator */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLessonComplete(course.id, les.id);
                                }}
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-slate-300 hover:border-blue-500 bg-white'
                                }`}
                                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                              >
                                {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>

                              {/* Lesson Type Icon */}
                              {les.type === 'video' ? (
                                <Play className="w-3 h-3 text-blue-600 shrink-0" />
                              ) : (
                                <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                              )}

                              <span className={`text-xs truncate ${isDone ? 'text-slate-500 line-through' : ''}`}>
                                {les.title}
                              </span>
                            </div>

                            <span className="text-[11px] font-mono text-slate-400 shrink-0">
                              {les.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Integrated Course Assessment Evaluation Module */}
          {primaryAssessment && (
            <div className="p-4 bg-slate-50/90 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                  Course Assessment
                </span>
                {assessmentStatus === 'passed' ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Passed ({latestAttempt?.percentage}%)
                  </span>
                ) : latestAttempt ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                    Retake ({latestAttempt.percentage}%)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                    Ready
                  </span>
                )}
              </div>

              <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {primaryAssessment.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{primaryAssessment.questionsCount || 5} Questions</span>
                  <span>{primaryAssessment.durationMinutes}m</span>
                  <span>Pass: {primaryAssessment.passingScorePercent}%</span>
                </div>
                <Button
                  variant={assessmentStatus === 'passed' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => onNavigate(`/trainee/assessments?id=${primaryAssessment.id}`)}
                  className="w-full text-xs justify-center h-8"
                  icon={<FileCheck className="w-3.5 h-3.5" />}
                >
                  {assessmentStatus === 'passed' ? 'Review / Retake Evaluation' : 'Launch Assessment'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Lesson Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {currentLesson ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              {/* Lesson Top Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-blue-700">{currentModule?.title}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">Lesson {currentIndex + 1} of {allLessons.length}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    {currentLesson.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentLesson.durationMinutes} mins</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                    {currentLesson.type} format
                  </span>
                </div>
              </div>

              {/* Simulated Interactive Video Player (if video type) */}
              {currentLesson.type === 'video' && (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 text-white flex flex-col justify-between p-4 shadow-inner">
                    {/* Top video bar */}
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-medium tracking-wide">Interactive Video Lesson</span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                        1080p Full HD
                      </span>
                    </div>

                    {/* Central Play/Pause trigger */}
                    <div className="flex items-center justify-center my-auto">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                        title={isPlaying ? 'Pause' : 'Play Video'}
                      >
                        {isPlaying ? (
                          <Pause className="w-7 h-7 fill-current" />
                        ) : (
                          <Play className="w-7 h-7 fill-current ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Bottom Video Controls */}
                    <div className="space-y-2 pt-2 bg-gradient-to-t from-slate-950/80 to-transparent -mx-4 -mb-4 px-4 pb-3">
                      {/* Scrub bar */}
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                        <div
                          className="bg-blue-500 h-full transition-all"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:text-blue-400"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white hover:text-blue-400"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <span className="font-mono text-[11px] text-slate-300">
                            05:14 / {currentLesson.durationMinutes}:00
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const speeds = [1, 1.25, 1.5, 2];
                              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                              setPlaybackSpeed(speeds[nextIdx]);
                            }}
                            className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono hover:bg-white/20"
                            title="Playback Speed"
                          >
                            {playbackSpeed}x
                          </button>
                          <button
                            onClick={() => showInfo('Fullscreen Mode', 'Press ESC to exit fullscreen player.')}
                            className="text-white hover:text-blue-400"
                            title="Fullscreen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Reading Content */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
                {currentLesson.content ? (
                  <div className="space-y-4">
                    {currentLesson.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} className="text-base sm:text-lg font-bold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('#### ')) {
                        return (
                          <h4 key={pIdx} className="text-sm sm:text-base font-bold text-slate-800 pt-1">
                            {paragraph.replace('#### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').filter(Boolean);
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-slate-700">
                            {items.map((it, itIdx) => (
                              <li key={itIdx}>{it.replace(/^- /, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (/^\d+\.\s/.test(paragraph)) {
                        const items = paragraph.split('\n').filter(Boolean);
                        return (
                          <ol key={pIdx} className="list-decimal pl-5 space-y-1.5 text-slate-700">
                            {items.map((it, itIdx) => (
                              <li key={itIdx}>{it.replace(/^\d+\.\s/, '')}</li>
                            ))}
                          </ol>
                        );
                      }
                      return (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-600">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              {/* Key Takeaways Box */}
              {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200/90 text-blue-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Key Takeaways & Core Concepts
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-blue-900/90 pl-6 list-disc">
                    {currentLesson.keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="leading-relaxed">
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Downloadable Reference Materials */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Lesson Reference Resources
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.resources.map((res, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {res.title}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              {res.type} · {res.size}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadResource(res.title)}
                          icon={<Download className="w-3.5 h-3.5 text-blue-700" />}
                          className="h-8 px-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Bar: Prev, Mark Complete, Next */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={currentIndex === 0}
                  icon={<ChevronLeft className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Previous Lesson
                </Button>

                {/* Mark as Complete Primary Action */}
                <div className="w-full sm:w-auto flex justify-center">
                  <Button
                    variant={isCurrentLessonDone ? 'outline' : 'primary'}
                    size="md"
                    onClick={handleToggleComplete}
                    icon={
                      isCurrentLessonDone ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )
                    }
                    className={`w-full sm:w-auto min-w-[200px] justify-center ${
                      isCurrentLessonDone
                        ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/60'
                        : ''
                    }`}
                  >
                    {isCurrentLessonDone ? 'Completed (Click to Undo)' : 'Mark Lesson Complete'}
                  </Button>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextLesson}
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full sm:w-auto"
                >
                  {currentIndex === allLessons.length - 1 ? 'Finish Course' : 'Next Lesson'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
              <p className="text-xs text-slate-500">Please select a lesson from the curriculum menu.</p>
            </div>
          )}
        </div>
      </div>

      {/* Course Completion Congratulatory Modal */}
      <Modal
        isOpen={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        title="Curriculum Milestone Achieved"
        maxWidth="md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Course Completion
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Congratulations!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              You have completed all {totalLessonsCount} lessons in <strong className="text-slate-800">"{course.title}"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Lead Trainer:</span>
              <span className="font-semibold text-slate-800">{course.trainerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Verified Competencies:</span>
              <span className="font-semibold text-slate-800">{course.skillsCovered.length} skills added</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Official Record Status:</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Logged to Profile
              </span>
            </div>
          </div>

          {/* Assessment Prompt inside completion modal */}
          {primaryAssessment && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-700" />
                  Official Course Evaluation
                </span>
                <span className="text-[11px] font-mono text-blue-700 font-semibold">
                  {primaryAssessment.questionsCount || 5} MCQs · {primaryAssessment.durationMinutes} mins
                </span>
              </div>
              <p className="text-blue-950/80 leading-relaxed">
                Take the official evaluation to verify your competency and finalize your certification record.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCompletionModalOpen(false);
                  onNavigate(`/trainee/assessments?id=${primaryAssessment.id}`);
                }}
                className="w-full justify-center"
                icon={<FileCheck className="w-4 h-4" />}
              >
                {assessmentStatus === 'passed'
                  ? 'Review Evaluation Results'
                  : 'Start Course Assessment Now'}
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCompletionModalOpen(false);
                onNavigate('/trainee/courses');
              }}
              className="w-full sm:w-1/2 justify-center"
            >
              Explore Next Course
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCompletionModalOpen(false);
                onNavigate('/trainee/learning');
              }}
              className="w-full sm:w-1/2 justify-center"
            >
              Return to My Learning
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
